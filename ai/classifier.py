"""Simple rule-based classifier with pluggable ML hook.

Functions:
- classify(payload) -> { alerts: [...], scores: {...} }

Replace or extend with a trained model (scikit-learn, tensorflow, etc.)
"""
import json
import os
from typing import Dict
THRESHOLDS_PATH = os.path.join(os.path.dirname(__file__), 'thresholds.json')

def load_thresholds():
    try:
        with open(THRESHOLDS_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {
            'pm25': { 'critical': 150, 'warning': 75 },
            'noise_db': { 'critical': 95, 'warning': 75 }
        }

TH = load_thresholds()

def classify(payload: Dict):
    metrics = payload.get('metrics', {})
    alerts = []
    scores = {}
    for m, v in metrics.items():
        th = TH.get(m)
        if not th:
            continue
        if v >= th.get('critical', 1e9):
            alerts.append({'metric': m, 'level': 'critical', 'value': v})
        elif v >= th.get('warning', 1e9):
            alerts.append({'metric': m, 'level': 'warning', 'value': v})
        scores[m] = v
    return {'alerts': alerts, 'scores': scores}

# Example usage:
if __name__ == '__main__':
    sample = {'metrics': {'pm25': 180, 'noise_db': 60}}
    print(classify(sample))
