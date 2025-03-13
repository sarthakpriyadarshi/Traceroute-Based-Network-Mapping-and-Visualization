from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from traceroute import perform_traceroute
from anomaly_detection import detect_anomalies
from models import DestinationRequest, TracerouteResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/traceroute", response_model=list[TracerouteResponse])
def traceroute(request: DestinationRequest):
    try:
        hops = perform_traceroute(request.destination)
        hops_with_anomalies = detect_anomalies(hops)
        return hops_with_anomalies
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
