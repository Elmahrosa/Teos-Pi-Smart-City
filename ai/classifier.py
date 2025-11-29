"""Lightweight classifier that reads recent telemetry and decides badge candidates."""
import os, time, json
import psycopg2
from psycopg2.extras import RealDictCursor

DB_PARAMS = dict(
    host=os.environ.get('PGHOST','postgres'),
    port=int(os.environ.get('PGPORT',5432)),
    dbname=os.environ.get('PGDATABASE','teosdb'),
    user=os.environ.get('PGUSER','teos'),
    password=os.environ.get('PGPASSWORD','teos'),
)

def fetch_recent(limit=100):
    conn = psycopg2.connect(**DB_PARAMS)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""SELECT device_id, metric, value, ts FROM telemetry ORDER BY ts DESC LIMIT %s""", (limit,))
        rows = cur.fetchall()
    conn.close()
    return rows

def classify(rows):
    # Simple rule-based classification using thresholds.json
    with open('thresholds.json') as f:
        thresholds = json.load(f)
    scores = {}
    for r in rows:
        metric = r['metric']
        val = r['value']
        device = r['device_id']
        thr = thresholds.get(metric)
        if thr is None:
            continue
        # lower is better for pm2_5 and noise_db
        if metric in ('pm2_5','noise_db'):
            if val <= thr.get('good', float('inf')):
                scores.setdefault(device, 0)
                scores[device] += 1
        else:
            # default behavior
            pass
    return scores

if __name__ == '__main__':
    rows = fetch_recent(200)
    print('rows', len(rows))
    print('classification scores', classify(rows))
