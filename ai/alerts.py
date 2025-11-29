"""
Predictive Alert System for Teos-Pi Smart City IoT
Real-time alerts based on AI classification and anomaly detection
Founder: Ayman Seif | TEOS Egypt
"""

from typing import Dict, List
from datetime import datetime, timedelta
import json

class AlertGenerator:
    def __init__(self):
        with open('ai/thresholds.json', 'r', encoding='utf-8') as f:
            self.thresholds = json.load(f)
    
    def generate_threshold_alert(self, sensor_type: str, value: float, classification: str) -> Dict:
        """
        Generate alert when sensor exceeds threshold
        """
        severity_map = {
            'excellent': None,
            'good': None,
            'quiet': None,
            'acceptable': None,
            'light': None,
            'moderate': 'info',
            'elevated': 'warning',
            'poor': 'warning',
            'heavy': 'warning',
            'hazardous': 'critical',
            'excessive': 'critical',
            'congested': 'critical'
        }
        
        severity = severity_map.get(classification)
        if not severity:
            return None
        
        messages = {
            'pm25': {
                'moderate': f'PM2.5 at {value} μg/m³ - Air quality moderate',
                'poor': f'PM2.5 at {value} μg/m³ - Air quality poor, reduce outdoor activities',
                'hazardous': f'PM2.5 at {value} μg/m³ - HAZARDOUS AIR QUALITY - Stay indoors'
            },
            'noise': {
                'elevated': f'Noise at {value} dB - Above comfort level',
                'excessive': f'Noise at {value} dB - EXCESSIVE NOISE - Health risk'
            },
            'traffic': {
                'heavy': f'Traffic at {value} vehicles/hour - Heavy congestion',
                'congested': f'Traffic at {value} vehicles/hour - SEVERE CONGESTION'
            }
        }
        
        return {
            'alert_type': 'threshold_exceeded',
            'severity': severity,
            'message': messages.get(sensor_type, {}).get(classification, 'Threshold exceeded'),
            'triggered_at': datetime.utcnow().isoformat(),
            'metadata': {
                'sensor_type': sensor_type,
                'value': value,
                'classification': classification
            }
        }
    
    def generate_anomaly_alert(self, sensor_type: str, value: float, expected_value: float) -> Dict:
        """
        Generate alert for detected anomalies
        """
        deviation = abs(value - expected_value) / expected_value * 100
        
        return {
            'alert_type': 'anomaly',
            'severity': 'warning',
            'message': f'Anomaly detected in {sensor_type} sensor: {value} (expected {expected_value:.1f}, deviation {deviation:.1f}%)',
            'triggered_at': datetime.utcnow().isoformat(),
            'metadata': {
                'sensor_type': sensor_type,
                'actual_value': value,
                'expected_value': expected_value,
                'deviation_percent': deviation
            }
        }
    
    def generate_prediction_alert(self, sensor_type: str, predicted_classification: str, hours_ahead: int) -> Dict:
        """
        Generate predictive alert based on trend analysis
        """
        if predicted_classification in ['hazardous', 'excessive', 'congested']:
            return {
                'alert_type': 'prediction',
                'severity': 'info',
                'message': f'Predicted {predicted_classification} {sensor_type} conditions in {hours_ahead} hours',
                'triggered_at': datetime.utcnow().isoformat(),
                'metadata': {
                    'sensor_type': sensor_type,
                    'predicted_classification': predicted_classification,
                    'prediction_horizon': hours_ahead
                }
            }
        return None
