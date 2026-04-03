import time
from typing import List

from models import ActivityLog, DetectionResult
from data_store import ip_state, session_state, blocked_ips, alerts, stats
from ml_model import ml_detector

HONEYPOT_ENDPOINTS = ["/api/hidden/v1/debug_config", "/admin/metrics_dump"]

# Action priority for deduplication: higher index = more severe
ACTION_SEVERITY = {"Alert Only": 0, "MFA/CAPTCHA Triggered": 1, "Blocked": 2}

def process_activity(log: ActivityLog) -> DetectionResult:
    """
    Core engine: processes each log entry, updates cumulative state,
    and returns a classification with reasons.
    """
    now = time.time()

    # ─── Load State ────────────────────────────────────────────────────────
    s_state = session_state[log.session_id]
    i_state = ip_state[log.ip]

    # Update counters
    s_state["request_count"] += 1
    i_state["request_count"] += 1
    stats["total_requests"] += 1

    if log.is_login_failed:
        s_state["failed_logins"] += 1
        i_state["failed_logins"] += 1
        stats["total_failed_logins"] += 1

    s_state["ips_used"].add(log.ip)

    if log.location and log.location not in i_state["locations"]:
        i_state["locations"].append(log.location)

    # Time calculations
    last_seen_session = s_state["last_seen"] if s_state["last_seen"] > 0 else now
    time_gap_ms = (now - last_seen_session) * 1000.0
    if time_gap_ms == 0:
        time_gap_ms = 100.0

    # RPM calculation: count requests in the last 60 seconds for this session
    s_state["logs"].append(now)
    s_state["logs"] = [t for t in s_state["logs"] if now - t < 60]
    rpm = len(s_state["logs"])

    # Update timestamps
    s_state["last_seen"] = now
    i_state["last_seen"] = now

    # ─── Begin Detection ───────────────────────────────────────────────────
    risk_score = 0.0
    reasons: List[str] = []

    # 1. Honeypot — instant 100 score
    if log.target_endpoint in HONEYPOT_ENDPOINTS:
        risk_score += 100
        reasons.append(f"Accessed hidden honeypot endpoint: {log.target_endpoint}")
        i_state["honeypot_hits"] += 1

    # 2. Session uses multiple IPs (proxy rotation / session hijack)
    if len(s_state["ips_used"]) > 3:
        risk_score += 30
        reasons.append("Session hijacking/proxy rotation: Used more than 3 IP addresses.")

    # 3. Rate limiting
    if rpm > 40:
        risk_score += 45
        reasons.append(f"High request frequency: {rpm} requests per minute.")
    elif rpm > 20:
        risk_score += 20
        reasons.append(f"Elevated request frequency: {rpm} requests per minute.")

    # 4. Failed logins
    if s_state["failed_logins"] > 5:
        risk_score += 40
        reasons.append("Brute-force indicator: Multiple failed logins.")
    elif s_state["failed_logins"] > 2:
        risk_score += 15
        reasons.append("Repeated login failures detected.")

    # 5. Biometric anomalies
    if log.typing_speed is not None and log.typing_speed > 20.0:
        risk_score += 35
        reasons.append(f"Inhuman typing speed: {log.typing_speed:.1f} keystrokes/sec.")
    if (log.typing_speed == 0.0 and log.mouse_movement_speed == 0.0
            and log.target_endpoint is not None
            and "login" in str(log.target_endpoint).lower()):
        risk_score += 25
        reasons.append("Zero biometric interaction (no mouse/keyboard) on critical path.")

    # 6. ML anomaly detection
    ml_features = [
        rpm,
        s_state["failed_logins"],
        time_gap_ms,
        log.typing_speed or 0.0,
        log.mouse_movement_speed or 0.0,
    ]
    is_anomaly = ml_detector.predict_anomaly(ml_features)
    if is_anomaly:
        risk_score += 25
        reasons.append("ML Engine: IsolationForest detected anomalous multivariate footprint.")

    # 7. Cumulative risk memory (low-and-slow attacks accumulate over time)
    risk_score += (s_state["cumulative_risk"] * 0.2)

    # Cap
    risk_score = min(round(risk_score, 1), 100.0)

    # Update cumulative state
    s_state["cumulative_risk"] = max(risk_score, s_state["cumulative_risk"])
    i_state["cumulative_risk"] = max(risk_score, i_state["cumulative_risk"])

    # ─── Classification & Mitigation ────────────────────────────────────────
    # Thresholds:  0-30 Normal | 31-65 Suspicious | 66-85 MFA | 86-100 Block
    if risk_score <= 30:
        c_status = "normal"
        c_type = "human"
        stats["human_count"] += 1
        if not reasons:
            reasons.append("Traffic appears normal.")
        # Normal traffic is NOT added to alerts — it's not a threat
    elif risk_score <= 65:
        c_status = "suspicious"
        c_type = "bot"
        stats["bot_count"] += 1
        _trigger_alert(log.ip, log.session_id, risk_score, reasons, "Alert Only")
    elif risk_score <= 85:
        c_status = "high risk"
        c_type = "bot"
        stats["bot_count"] += 1
        stats["captcha_triggers"] += 1
        _trigger_alert(log.ip, log.session_id, risk_score, reasons, "MFA/CAPTCHA Triggered")
    else:
        c_status = "attack"
        c_type = "bot"
        stats["bot_count"] += 1
        _block_ip(log.ip, reasons, i_state["request_count"])
        _trigger_alert(log.ip, log.session_id, risk_score, reasons, "Blocked")

    return DetectionResult(
        type=c_type,
        status=c_status,
        risk_score=risk_score,
        reason=reasons
    )


def _trigger_alert(ip: str, session_id: str, score: float, reasons: List[str], action: str):
    stats["alerts_count"] += 1
    now = time.time()

    # Find the most recent alert for this exact IP
    recent = [a for a in alerts if a["ip"] == ip and (now - a["timestamp_ts"]) < 3.0]

    if recent:
        existing_severity = ACTION_SEVERITY.get(recent[0]["action_taken"], 0)
        new_severity = ACTION_SEVERITY.get(action, 0)

        if new_severity <= existing_severity:
            # Same or less severe — skip to avoid spam
            return
        else:
            # More severe (e.g. escalating from Alert Only → Blocked)
            # Update the existing record in-place instead of inserting duplicate
            recent[0]["action_taken"] = action
            recent[0]["risk_score"] = score
            recent[0]["reasons"] = reasons
            recent[0]["timestamp_ts"] = now
            recent[0]["timestamp"] = time.strftime("%H:%M:%S", time.localtime(now))
            # Move it to the front
            alerts.remove(recent[0])
            alerts.insert(0, recent[0])
            return

    # New alert for this IP — insert at front
    alerts.insert(0, {
        "ip": ip,
        "session_id": session_id,
        "risk_score": score,
        "action_taken": action,
        "reasons": reasons,
        "timestamp_ts": now,
        "timestamp": time.strftime("%H:%M:%S", time.localtime(now))
    })

    # Keep max 100 alerts
    if len(alerts) > 100:
        alerts.pop()


def _block_ip(ip: str, reasons: List[str], request_count: int = 0):
    if ip not in blocked_ips:
        blocked_ips[ip] = {
            "reasons": reasons,
            "blocked_at": time.time(),
            "request_count": request_count,
        }
        stats["blocks_count"] += 1
