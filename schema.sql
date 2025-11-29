-- Schema for Teos Pi Smart City (IoT + Badge Automation)
-- Ensure the database encoding is UTF8 to support emoji badges.

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users (simple)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','viewer')) DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Telemetry (time-series)
CREATE TABLE IF NOT EXISTS telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  device_id TEXT NOT NULL,
  metric TEXT NOT NULL,
  value DOUBLE PRECISION,
  location JSONB,
  raw JSONB
);
SELECT create_hypertable('telemetry', 'ts', if_not_exists => true);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  metric TEXT NOT NULL,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Badge definitions (emoji-safe text)
CREATE TABLE IF NOT EXISTS badge_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL, -- emoji or small string
  rule JSONB NOT NULL, -- {metric, operator, threshold, duration_minutes}
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- Earned badges
CREATE TABLE IF NOT EXISTS earned_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badge_definitions(id) ON DELETE CASCADE,
  device_id TEXT,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS telemetry_device_idx ON telemetry(device_id);
CREATE INDEX IF NOT EXISTS telemetry_metric_idx ON telemetry(metric);
CREATE INDEX IF NOT EXISTS alerts_device_idx ON alerts(device_id);
