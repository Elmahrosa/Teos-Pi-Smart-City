"""Alerting helpers — convert classifier output to DB alerts via exporter/db."""
import os
import psycopg2
import json
from ai.classifier import classify

DATABASE_URL = os.environ.get('DATABASE_URL')

def get_conn():
    return psycopg2.connect(DATABASE_URL)

def create_alert(device_id, metric, severity, message):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO alerts (device_id, metric, severity, message) VALUES (%s, %s, %s, %s)",
        (device_id, metric, severity, message)
    )
    conn.commit()
    cur.close()
    conn.close()
    print('Created alert', device_id, metric, severity)

def process_payload(payload):
    res = classify(payload)
    for a in res['alerts']:
        msg = f"{a['metric']} at {a['value']} exceeded {a['level']}"
        create_alert(payload.get('device_id'), a['metric'], a['level'], msg)
    return res
