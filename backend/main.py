import time
import random
import asyncio
from fastapi import FastAPI, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models import ActivityLog, DetectionResult
from detection_engine import process_activity
from data_store import stats, alerts, blocked_ips, get_active_user_count, activity_logs

app = FastAPI(title="FinTech Security Dashboard API")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── CORE ENDPOINTS ─────────────────────────────────────────────────────────

@app.post("/log_activity", response_model=DetectionResult)
async def log_activity(log: ActivityLog):
    """
    Main ingestion endpoint.
    Takes user activity, runs detection engine, updates risk, classifies human/bot,
    and handles immediate mitigation logic.
    """
    # 1. Reject immediately if IP is already strictly blocked
    if log.ip in blocked_ips:
        return DetectionResult(
            type="bot",
            status="attack",
            risk_score=100.0,
            reason=["IP is currently blocked from previous attacks."]
        )
        
    # 2. Add raw log to historical timeline
    raw_entry = log.model_dump()
    raw_entry["timestamp"] = time.time()
    activity_logs.append(raw_entry)
    
    # Keep only last 1000 raw logs in memory
    if len(activity_logs) > 1000:
        activity_logs.pop(0)
        
    # 3. Process via Engine
    result = process_activity(log)
    
    return result

@app.post("/api/hidden/v1/debug_config")
async def hidden_honeypot(request: Request):
    """
    Simulated DECEPTION LAYER / HONEYPOT.
    Normal users never call this. Scraping bots will.
    We capture IP and pipe to the detection engine immediately.
    """
    client_ip = request.client.host if request.client else "127.0.0.1"
    
    # We construct a fake log to process through the pipeline with honeypot tag
    log = ActivityLog(
        ip=client_ip,
        session_id=f"bot-{client_ip}",
        target_endpoint="/api/hidden/v1/debug_config"
    )
    result = process_activity(log)
    return {"message": "Access Denied", "status": "blocked", "risk": result.risk_score}


# ─── DASHBOARD ENDPOINTS ────────────────────────────────────────────────────

@app.get("/dashboard_data")
async def get_dashboard_data():
    """
    Power the Next.js UI KPIs and Charts.
    """
    return {
        "kpis": {
            "total_requests": stats["total_requests"],
            "active_users": get_active_user_count(),
            "failed_logins": stats["total_failed_logins"],
            "bots_flagged": stats["bot_count"],
            "humans_allowed": stats["human_count"],
            "blocks_count": stats["blocks_count"],
            "captcha_triggers": stats["captcha_triggers"],
            "alerts_count": stats["alerts_count"],
        }
    }

@app.get("/alerts")
async def get_alerts():
    return alerts

@app.get("/blocked_ips")
async def get_blocked_ips():
    # Convert dict to array of objects for easier frontend consumption
    return [{"ip": ip, **data} for ip, data in blocked_ips.items()]


# ─── SIMULATION ENDPOINTS ───────────────────────────────────────────────────

class SimulationConfig(BaseModel):
    attack_type: str  # "bruteforce", "low_and_slow", "biometric_bot"
    duration_sec: int = 5

async def run_simulation(config: SimulationConfig):
    locations = ["RU", "CN", "BR", "KP", "UA", "VN"]
    
    # Generate a fixed pool of randomized IPs for THIS simulation run, so they repeat 
    # enough to accumulate risk score and get blocked. (If it's infinitely random, no IP gets blocked).
    pool_size = random.randint(3, 12)
    ips_pool = [
        f"{random.randint(11, 200)}.{random.randint(10, 250)}.{random.randint(10, 250)}.{random.randint(10, 250)}"
        for _ in range(pool_size)
    ]

    start_time = time.time()

    while time.time() - start_time < config.duration_sec:
        ip = random.choice(ips_pool)
        # IMPORTANT: session_id must be stable per IP so cumulative risk builds up
        # across requests until the threshold is hit and the IP gets blocked.
        session_id = f"sim_{config.attack_type}_{ip}"
        location = random.choice(locations)

        if config.attack_type == "bruteforce":
            log = ActivityLog(
                ip=ip,
                session_id=session_id,  # stable session = cumulative risk
                location=location,
                is_login_failed=True,
                target_endpoint="/login",
                typing_speed=random.choice([0.0, 45.0, 60.0]),
                mouse_movement_speed=0.0,
                click_frequency=random.uniform(5.0, 15.0),
            )
            process_activity(log)
            await asyncio.sleep(0.08)

        elif config.attack_type == "low_and_slow":
            log = ActivityLog(
                ip=ip,
                session_id=session_id,  # stable session = cumulative risk
                location=random.choice(locations),
                is_login_failed=random.random() < 0.4,
                target_endpoint=random.choice(["/login", "/transfer", "/api/account"]),
                typing_speed=random.uniform(0.5, 3.0),
                mouse_movement_speed=random.uniform(0.0, 30.0),
                click_frequency=random.uniform(0.1, 0.8),
            )
            process_activity(log)
            await asyncio.sleep(random.uniform(0.8, 2.0))

        elif config.attack_type == "biometric_bot":
            log = ActivityLog(
                ip=ip,
                session_id=session_id,  # stable session = cumulative risk
                location=location,
                is_login_failed=random.random() < 0.6,
                target_endpoint=random.choice(["/login", "/register", "/reset-password"]),
                typing_speed=random.choice([0.0, 0.0, 52.0, 0.0]),
                mouse_movement_speed=0.0,
                click_frequency=0.0,
            )
            process_activity(log)
            await asyncio.sleep(0.3)

        else:
            sub_type = random.choice(["bruteforce", "low_and_slow", "biometric_bot"])
            sub_config = SimulationConfig(attack_type=sub_type, duration_sec=1)
            await run_simulation(sub_config)
            break

@app.post("/simulate_attack")
async def simulate_attack(config: SimulationConfig, background_tasks: BackgroundTasks):
    """
    Triggers an asynchronous worker that pumps malicious logs into the system
    to light up the dashboard.
    """
    background_tasks.add_task(run_simulation, config)
    return {"message": f"Simulation '{config.attack_type}' started for {config.duration_sec}s"}

if __name__ == "__main__":
    import uvicorn
    # Make sure to run from backend directory or ensure module paths are correct
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
