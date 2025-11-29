"""Exporter: takes a JSON payload and writes to Postgres telemetry table."""
import os, json
from urllib.parse import urlparse
import psycopg2
import psycopg2.extras

DATABASE_URL = os.environ.get('DATABASE_URL')

def get_conn():
    if not DATABASE_URL:
        raise RuntimeError('DATABASE_URL not set')
    return psycopg2.connect(DATABASE_URL)

def export_telemetry(payload):
    # payload expected: {device_id, ts, metrics: {...}, location: {lat,lng}, raw: {...}}
    device_id = payload.get('device_id')
    ts = payload.get('ts')  # epoch or ISO
    metrics = payload.get('metrics', {})
    location = payload.get('location')
    raw = payload

    conn = get_conn()
    cur = conn.cursor()
    # insert one row per metric
    for metric, value in metrics.items():
        cur.execute(
            "INSERT INTO telemetry (ts, device_id, metric, value, location, raw) VALUES (to_timestamp(%s), %s, %s, %s, %s, %s)",
            (ts, device_id, metric, value, json.dumps(location), json.dumps(raw))
        )
    conn.commit()
    cur.close()
    conn.close()
    print(f"Exported telemetry for {device_id}: {len(metrics)} metrics")
