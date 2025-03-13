from pydantic import BaseModel, Field

class DestinationRequest(BaseModel):
    destination: str  

class TracerouteResponse(BaseModel):
    IP_Address: str = Field(..., alias="IP Address")
    Time: float
    Anomaly: bool
