CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','viewer')),
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO users (email, password_hash, role)
VALUES
  ('admin@example.com', crypt('admin123', gen_salt('bf')), 'admin'),
  ('viewer@example.com', crypt('user123', gen_salt('bf')), 'viewer')
ON CONFLICT (email) DO NOTHING;

CREATE TABLE IF NOT EXISTS telemetry (
  time TIMESTAMPTZ NOT NULL,
  device_id TEXT NOT NULL,
  sensor TEXT NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  site TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  site VARCHAR(50) NOT NULL,
  badge_type VARCHAR(100) NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site, badge_type, DATE(granted_at))
);

CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  site VARCHAR(50) NOT NULL,
  sensor VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  time TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS badge_definitions (
  id SERIAL PRIMARY KEY,
  badge_type VARCHAR(100) UNIQUE NOT NULL,
  sensor VARCHAR(50) NOT NULL,
  comparator VARCHAR(2) CHECK (comparator IN ('gt','lt')),
  threshold DOUBLE PRECISION NOT NULL,
  duration_sec INT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🏆'
);

INSERT INTO badge_definitions (badge_type, sensor, comparator, threshold, duration_sec, description, icon)
VALUES
  ('City Health Guardian', 'pm25', 'lt', 35, 21600, 'Awarded when PM2.5 < 35 µg/m³ for 6h', '🌿'),
  ('Noise Violation', 'noise', 'gt', 70, 7200, 'Alert when noise > 70 dBA for 2h', '🔊')
ON CONFLICT (badge_type) DO NOTHING;
