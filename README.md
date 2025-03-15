# Intelligent Traceroute: Identifying Latency & IP Anomalies
![Logo](https://github.com/sarthakpriyadarshi/Traceroute-Based-Network-Mapping-and-Visualization/blob/main/images/banner.png?raw=true)

## 📌 Overview
This project implements a traceroute-based anomaly detection system that identifies suspicious IP addresses and latency spikes in network paths. It utilizes:

- FastAPI for a high-performance backend.
- Traceroute (Linux/macOS) / Tracert (Windows) to map network hops.
- Machine Learning (Isolation Forest) for anomaly detection.
- Scikit-learn & NumPy for data processing.
- CORS Middleware for secure API communication.

## Deployed on
Traceroute (Vercel) - https://traceroute.cyberol.codes/

## 🔍 Features
- Performs traceroute/tracert based on user input.
- Uses AI to detect abnormal network behavior (high latency, unexpected IPs).
- Returns results in structured JSON format for easy integration.
- Supports cross-platform execution (Linux, Windows, macOS).

## Getting Started

**Clone the repository**
```shell
git clone git@github.com:sarthakpriyadarshi/Traceroute-Based-Network-Mapping-and-Visualization.git
```

## Setup
1. **Backend**:
   - Change Directory: `cd backend`
   - Install dependencies: `pip install -r requirements.txt`
   - Change directory `cd app`
   - Run: `python3 main.py`

2. **Frontend**:
   - Install: `npm install`
   - Run: `npm run build`


### Local Deployment

1. Start the backend (`http://localhost:8000`).
2. Start the frontend (`http://localhost:3000`).
3. Enter a URL (e.g., `https://example.com`) and click "Go".

