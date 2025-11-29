"""Alerts generator: simple placeholder to push civic alerts to a table or external system."""
import json, os
import psycopg2

DB_PARAMS = dict(
    host=os.environ.get('PGHOST','postgres'),
    port=int(os.environ.get('PGPORT',5432)),
    dbname=os.environ.get('PGDATABASE','teosdb'),
    user=os.environ.get('PGUSER','teos'),
    password=os.environ.get('PGPASSWORD','teos'),
)

def create_alert(title, body, metadata=None):
    conn = psycopg2.connect(**DB_PARAMS)
    with conn:
        with conn.cursor() as cur:
            cur.execute("""CREATE TABLE IF NOT EXISTS civic_alerts (
                id SERIAL PRIMARY KEY,
                title TEXT,
                body TEXT,
                metadata JSONB,
                ts TIMESTAMP WITH TIME ZONE DEFAULT now()
            )""")
            cur.execute(
                "INSERT INTO civic_alerts (title, body, metadata) VALUES (%s,%s,%s)",
                (title, body, json.dumps(metadata or {}))
            )
    conn.close()
