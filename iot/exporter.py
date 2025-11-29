"""Simple exporter that writes telemetry rows into Postgres using psycopg2."""
import os
import json
import psycopg2
import psycopg2.extras

DB_HOST = os.environ.get('PGHOST', 'postgres')
DB_PORT = int(os.environ.get('PGPORT', 5432))
DB_NAME = os.environ.get('PGDATABASE', 'teosdb')
DB_USER = os.environ.get('PGUSER', 'teos')
DB_PASS = os.environ.get('PGPASSWORD', 'teos')

def get_conn():
    return psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASS)

def write_telemetry(payload):
    # payload: {device_id, metrics: {k:v}, ts}
    conn = get_conn()
    with conn:
        with conn.cursor() as cur:
            for metric, value in payload.get('metrics', {}).items():
                cur.execute(
                    """INSERT INTO telemetry (device_id, metric, value, ts)
                       VALUES (%s,%s,%s,to_timestamp(%s))""",
                    (payload.get('device_id'), metric, float(value), payload.get('ts'))
                )
    conn.close()
