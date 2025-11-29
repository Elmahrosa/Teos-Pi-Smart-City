"""Periodic script to evaluate badge definitions and award badges.

Simple algorithm:
- Load enabled badge_definitions
- For each badge, find devices/users that match rule within duration
- Insert into earned_badges for the owning user (placeholder: first admin)

This script is intentionally simple; adapt `get_device_owner` to your devices table.
"""
import os, json
import psycopg2
from psycopg2.extras import RealDictCursor
from lib import time as _time

DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    raise RuntimeError('DATABASE_URL must be set')

def get_conn():
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)

def get_badges(conn):
    cur = conn.cursor()
    cur.execute("SELECT * FROM badge_definitions WHERE enabled = true")
    return cur.fetchall()

def get_active_devices(conn, minutes=60):
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT device_id FROM telemetry WHERE ts > NOW() - INTERVAL %s", (f'{minutes} minutes',))
    return [r['device_id'] for r in cur.fetchall()]

def evaluate_rule(conn, device_id, rule):
    # rule is JSON: {metric, operator, threshold, duration_minutes}
    metric = rule.get('metric')
    operator = rule.get('operator', '>')
    threshold = rule.get('threshold')
    duration = rule.get('duration_minutes', 60)
    cur = conn.cursor()
    cur.execute(
        "SELECT value FROM telemetry WHERE device_id=%s AND metric=%s AND ts > NOW() - INTERVAL %s",
        (device_id, metric, f"{duration} minutes")
    )
    rows = cur.fetchall()
    if not rows:
        return False
    for r in rows:
        val = r['value']
        if operator == '>' and val > threshold:
            return True
        if operator == '>=' and val >= threshold:
            return True
        if operator == '<' and val < threshold:
            return True
        if operator == '<=' and val <= threshold:
            return True
        if operator == '==' and val == threshold:
            return True
        if operator == '!=' and val != threshold:
            return True
    return False

def get_device_owner(conn, device_id):
    # TODO: implement device registry mapping device -> user
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE role='admin' LIMIT 1")
    r = cur.fetchone()
    return r['id'] if r else None

def grant_badge(conn, user_id, badge_id, device_id):
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO earned_badges (user_id, badge_id, device_id) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING",
            (user_id, badge_id, device_id)
        )
        conn.commit()
        print('Granted badge', badge_id, 'to', user_id)
    except Exception as e:
        print('Failed to grant badge', e)
        conn.rollback()

def main():
    conn = get_conn()
    badges = get_badges(conn)
    devices = get_active_devices(conn, minutes=60)
    for b in badges:
        rule = b['rule'] if isinstance(b['rule'], dict) else json.loads(b['rule'])
        for d in devices:
            if evaluate_rule(conn, d, rule):
                user_id = get_device_owner(conn, d)
                if user_id:
                    grant_badge(conn, user_id, b['id'], d)
    conn.close()

if __name__ == '__main__':
    main()
