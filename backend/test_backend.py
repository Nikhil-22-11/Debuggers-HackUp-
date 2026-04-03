import requests
import time

print("=== VALIDATING BACKEND FIXES ===")

# 1. Trigger bruteforce simulation
print("\n[1] Triggering bruteforce simulation for 5 seconds...")
r = requests.post("http://localhost:8000/simulate_attack", json={"attack_type": "bruteforce", "duration_sec": 5})
print("  Started:", r.json())

print("  Waiting 6 seconds for simulation to complete...")
time.sleep(6)

# 2. Check alerts - key test: are statuses diverse?
print("\n[2] Checking /alerts endpoint...")
alerts = requests.get("http://localhost:8000/alerts").json()
print(f"  Total alerts in feed: {len(alerts)}")
statuses = {}
for a in alerts[:10]:
    action = a["action_taken"]
    statuses[action] = statuses.get(action, 0) + 1
    print(f"  IP={a['ip']} | status={action} | score={a['risk_score']}")

print(f"\n  Status breakdown: {statuses}")

# 3. Check blocked IPs
print("\n[3] Checking /blocked_ips endpoint...")
blocked = requests.get("http://localhost:8000/blocked_ips").json()
print(f"  Total blocked IPs: {len(blocked)}")
for b in blocked[:3]:
    print(f"  IP={b['ip']} | attempts={b.get('request_count', '?')}")

# 4. Dashboard KPIs
print("\n[4] Checking /dashboard_data...")
dash = requests.get("http://localhost:8000/dashboard_data").json()
kpis = dash["kpis"]
print(f"  Traffic={kpis['total_requests']} | Bots={kpis['bots_flagged']} | Blocked={kpis['blocks_count']}")

# 5. Summary
print("\n=== SUMMARY ===")
if len(blocked) > 0:
    print("PASS: IPs are being blocked correctly")
else:
    print("FAIL: No IPs were blocked - check detection thresholds")

if len(statuses) > 1:
    print(f"PASS: Multiple alert statuses present: {list(statuses.keys())}")
elif "Blocked" in statuses or "MFA/CAPTCHA Triggered" in statuses:
    print("PASS: High-risk statuses present in feed")
else:
    print(f"FAIL: Only low-severity alerts found: {statuses}")
