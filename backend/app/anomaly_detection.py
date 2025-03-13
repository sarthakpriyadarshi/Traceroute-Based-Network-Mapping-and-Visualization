import pandas as pd
from sklearn.ensemble import IsolationForest
import numpy as np
import ipaddress

# Load dataset
df = pd.read_csv("app/datasets.csv")

def ip_to_int(ip):
    return int(ipaddress.ip_address(ip))

X_train = np.array([[ip_to_int(ip), time] for ip, time in zip(df["IP Address"], df["Time (ms)"])])

anomaly_detector = IsolationForest(contamination=0.1)
anomaly_detector.fit(X_train)

def detect_anomalies(hops):
    X = np.array([[ip_to_int(hop["IP Address"]), hop["Time"]] for hop in hops])
    predictions = anomaly_detector.predict(X)
    for hop, prediction in zip(hops, predictions):
        hop["Anomaly"] = prediction == -1
    return hops
