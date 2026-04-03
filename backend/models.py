from pydantic import BaseModel, Field
from typing import Optional, List

class ActivityLog(BaseModel):
    ip: str = Field(..., description="IP address of the client")
    session_id: str = Field(..., description="Unique session identifier")
    location: Optional[str] = Field(None, description="Simulated geo-location")
    is_login_failed: Optional[bool] = Field(False, description="Did this request result in a failed login?")
    
    # Behavioral Biometrics (simulated)
    typing_speed: Optional[float] = Field(0.0, description="Keystrokes per second (0 if bot or none)")
    mouse_movement_speed: Optional[float] = Field(0.0, description="Pixels per second (0 if bot or none)")
    click_frequency: Optional[float] = Field(0.0, description="Clicks per second")
    
    # Honeypot tracking
    target_endpoint: Optional[str] = Field(None, description="The endpoint being accessed (to track honeypots)")

class DetectionResult(BaseModel):
    type: str = Field(..., description="'human' or 'bot'")
    status: str = Field(..., description="'normal', 'suspicious', 'high risk', or 'attack'")
    risk_score: float = Field(..., description="0 to 100")
    reason: List[str] = Field(..., description="List of reasons for this classification")
