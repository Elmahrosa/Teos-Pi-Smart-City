-- schema.sql (UTF-8 safe)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Telemetry table
CREATE TABLE IF NOT EXISTS telemetry (
  id SERIAL PRIMARY KEY,
  site VARCHAR(50) NOT NULL,
  sensor VARCHAR(50) NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  site VARCHAR(50) NOT NULL,
  alert_type VARCHAR(100) NOT NULL,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  details TEXT
);

-- Badge definitions table
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

-- Seed badge definitions
INSERT INTO badge_definitions (badge_type, sensor, comparator, threshold, duration_sec, description, icon)
VALUES
  ('City Health Guardian', 'pm25', 'lt', 35, 21600, 'Awarded when PM2.5 < 35 ug/m3 for 6h', '🌿'),
  ('Noise Violation', 'noise', 'gt', 70, 7200, 'Alert when noise > 70 dBA for 2h', '🔊')
ON CONFLICT (badge_type) DO NOTHING;

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  site VARCHAR(50) NOT NULL,
  badge_type VARCHAR(100) NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique index on badges (site, badge_type, granted_at)
CREATE UNIQUE INDEX IF NOT EXISTS badges_site_type_date_idx
ON badges (site, badge_type, granted_at);
