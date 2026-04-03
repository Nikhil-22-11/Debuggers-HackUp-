"""
data_store.py — In-memory storage for logs, alerts, blocked IPs, and session tracking.
"""

import time
from typing import Dict, List, Any
from collections import defaultdict

# ─── Raw activity logs (all requests) ────────────────────────────────────────
activity_logs: List[Dict[str, Any]] = []

# ─── Per-IP aggregated state ──────────────────────────────────────────────────
ip_state: Dict[str, Dict[str, Any]] = defaultdict(lambda: {
    "request_count": 0,
    "failed_logins": 0,
    "last_seen": 0.0,
    "cumulative_risk": 0.0,      # low-and-slow accumulator
    "locations": [],
    "honeypot_hits": 0,
    "logs": [],
})

# ─── Per-session aggregated state ────────────────────────────────────────────
session_state: Dict[str, Dict[str, Any]] = defaultdict(lambda: {
    "request_count": 0,
    "failed_logins": 0,
    "last_seen": 0.0,
    "cumulative_risk": 0.0,
    "ips_used": set(),
    "logs": [],
})

# ─── Blocked IPs ─────────────────────────────────────────────────────────────
blocked_ips: Dict[str, Dict[str, Any]] = {}   # ip -> {reason, blocked_at}

# ─── Alerts (suspicious / attack events) ─────────────────────────────────────
alerts: List[Dict[str, Any]] = []

# ─── Global counters ──────────────────────────────────────────────────────────
stats = {
    "total_requests": 0,
    "total_failed_logins": 0,
    "alerts_count": 0,
    "bot_count": 0,
    "human_count": 0,
    "captcha_triggers": 0,
    "blocks_count": 0,
}


def get_active_user_count() -> int:
    """IPs seen within the last 60 seconds."""
    now = time.time()
    return sum(1 for s in ip_state.values() if now - s["last_seen"] < 60)
