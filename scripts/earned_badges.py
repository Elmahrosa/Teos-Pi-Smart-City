"""Periodic badge evaluator: maps device -> owner and awards badges based on classifier scores."""
import os, json
import psycopg2
from psycopg2.extras import RealDictCursor

DB_PARAMS = dict(
    host=os.environ.get('PGHOST','postgres'),
    port=int(os.environ.get('PGPORT',5432)),
    dbname=os.environ.get('PGDATABASE','teosdb'),
    user=os.environ.get('PGUSER','teos'),
    password=os.environ.get('PGPASSWORD','teos'),
)

def get_device_owner(device_id, cur):
    cur.execute('SELECT owner_id FROM devices WHERE device_id=%s', (device_id,))
    r = cur.fetchone()
    return r['owner_id'] if r else None

def award_badge(user_id, badge_code, cur):
    cur.execute('SELECT id FROM badges WHERE code=%s', (badge_code,))
    b = cur.fetchone()
    if not b:
        return
    badge_id = b['id']
    cur.execute('SELECT 1 FROM earned_badges WHERE user_id=%s AND badge_id=%s', (user_id, badge_id))
    if cur.fetchone():
        return
    cur.execute('INSERT INTO earned_badges (user_id, badge_id, metadata) VALUES (%s,%s,%s)', (user_id, badge_id, json.dumps({})))
    print('awarded', badge_code, 'to', user_id)

def run():
    conn = psycopg2.connect(**DB_PARAMS)
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        # simple heuristic: devices with >=3 'good' readings in classifier
        cur.execute("""SELECT device_id, count(*) as cnt
                      FROM telemetry
                      WHERE metric IN ('pm2_5','noise_db')
                      GROUP BY device_id
                      HAVING avg(value) < 50 -- placeholder rule
                   """)
        rows = cur.fetchall()
        for r in rows:
            device = r['device_id']
            owner = get_device_owner(device, cur)
            if owner:
                award_badge(owner, 'green-thumb', cur)
    conn.commit()
    conn.close()

if __name__ == '__main__':
    run()
