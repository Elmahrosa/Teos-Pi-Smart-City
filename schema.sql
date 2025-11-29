-- UTF-8 safe schema for badges and telemetry
-- Ensure your database uses UTF8 encoding:
-- createdb -E UTF8 teosdb

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    device_id TEXT UNIQUE NOT NULL,
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS telemetry (
    id BIGSERIAL PRIMARY KEY,
    device_id TEXT NOT NULL,
    metric TEXT NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    ts TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    emoji TEXT -- store emoji as unicode (UTF-8)
);

CREATE TABLE IF NOT EXISTS earned_badges (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    metadata JSONB
);

-- Seed a few emoji badges (UTF-8 safe)
INSERT INTO badges (code, name, description, emoji) VALUES
('green-thumb','Green Thumb','Sustained low emissions / green actions','🌿')
ON CONFLICT (code) DO UPDATE SET name=EXCLUDED.name;

INSERT INTO badges (code, name, description, emoji) VALUES
('noise-watcher','Noise Watcher','Reported/mitigated high noise events','🔊')
ON CONFLICT (code) DO UPDATE SET name=EXCLUDED.name;
