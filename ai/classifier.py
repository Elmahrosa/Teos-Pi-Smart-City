"""
Pi AI Classifier for Teos-Pi Smart City IoT
Real-time sensor data classification with AI-evaluated thresholds
Founder: Ayman Seif | TEOS Egypt
"""

import json
from typing import Dict, Tuple
from datetime import datetime

# Load Egyptian environmental standards
with open('ai/thresholds.json', 'r', encoding='utf-8') as f:
    THRESHOLDS = json.load(f)

def classify_pm25(value: float) -> Tuple[str, float]:
    """
    Classify PM2.5 levels based on Egyptian environmental standards
    Returns: (classification, confidence_score)
    """
    thresholds = THRESHOLDS['pm25']
    
    if value <= thresholds['excellent']:
        return ('excellent', 0.95)
    elif value <= thresholds['good']:
        return ('good', 0.90)
    elif value <= thresholds['moderate']:
        return ('moderate', 0.85)
    elif value <= thresholds['poor']:
        return ('poor', 0.80)
    else:
        return ('hazardous', 0.75)

def classify_noise(value: float) -> Tuple[str, float]:
    """
    Classify noise levels in decibels (dB)
    Egyptian urban standard: 65 dB daytime, 55 dB nighttime
    """
    thresholds = THRESHOLDS['noise']
    
    if value <= thresholds['quiet']:
        return ('quiet', 0.95)
    elif value <= thresholds['acceptable']:
        return ('acceptable', 0.90)
    elif value <= thresholds['elevated']:
        return ('elevated', 0.85)
    else:
        return ('excessive', 0.80)

def classify_traffic(value: float) -> Tuple[str, float]:
    """
    Classify traffic flow (vehicles per hour)
    """
    thresholds = THRESHOLDS['traffic']
    
    if value <= thresholds['light']:
        return ('light', 0.95)
    elif value <= thresholds['moderate']:
        return ('moderate', 0.90)
    elif value <= thresholds['heavy']:
        return ('heavy', 0.85)
    else:
        return ('congested', 0.80)

def detect_anomaly(sensor_type: str, value: float, historical_avg: float, std_dev: float) -> bool:
    """
    Detect anomalies using 3-sigma rule
    """
    z_score = abs((value - historical_avg) / std_dev) if std_dev > 0 else 0
    return z_score > 3

def classify_sensor_reading(sensor_type: str, value: float) -> Dict:
    """
    Main classification function for all sensor types
    Returns complete AI evaluation with confidence score
    """
    classifiers = {
        'pm25': classify_pm25,
        'noise': classify_noise,
        'traffic': classify_traffic
    }
    
    if sensor_type not in classifiers:
        return {
            'classification': 'unknown',
            'confidence': 0.0,
            'timestamp': datetime.utcnow().isoformat()
        }
    
    classification, confidence = classifiers[sensor_type](value)
    
    return {
        'classification': classification,
        'confidence': confidence,
        'sensor_type': sensor_type,
        'value': value,
        'timestamp': datetime.utcnow().isoformat(),
        'thresholds': THRESHOLDS[sensor_type]
    }
