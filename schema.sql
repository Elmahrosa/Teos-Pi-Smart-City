-- Teos-Pi Smart City IoT Schema with UTF-8 Safe Emoji Badges
-- Civic-first governance with role-based access control (RBAC)
-- Founder: Ayman Seif | TEOS Egypt | Pi Network Integration

-- Users table with badge-gated access
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pi_user_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'citizen', -- citizen, merchant, auditor, officer, contributor
  kyc_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Badge definitions with emoji icons (UTF-8 safe)
CREATE TABLE IF NOT EXISTS badge_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(10) NOT NULL, -- emoji: 🌿 🔊 🚗
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- environmental, civic, governance
  threshold_type VARCHAR(50) NOT NULL, -- duration, count, value
  threshold_value NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Earned badges with AI evaluation
CREATE TABLE IF NOT EXISTS earned_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badge_definitions(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  ai_confidence NUMERIC(5,2), -- AI classification confidence score
  evaluation_data JSONB, -- raw AI evaluation details
  UNIQUE(user_id, badge_id)
);

-- IoT sensor registry
CREATE TABLE IF NOT EXISTS iot_sensors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id VARCHAR(100) UNIQUE NOT NULL,
  sensor_type VARCHAR(50) NOT NULL, -- pm25, noise, traffic
  location_lat NUMERIC(10,8),
  location_lng NUMERIC(11,8),
  location_name VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active', -- active, maintenance, offline
  installed_by UUID REFERENCES users(id),
  installed_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

-- Sensor telemetry readings
CREATE TABLE IF NOT EXISTS sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id UUID NOT NULL REFERENCES iot_sensors(id) ON DELETE CASCADE,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  value NUMERIC NOT NULL,
  unit VARCHAR(20) NOT NULL, -- μg/m³, dB, vehicles/hour
  ai_classification VARCHAR(50), -- excellent, good, moderate, poor, hazardous
  ai_confidence NUMERIC(5,2),
  anomaly_detected BOOLEAN DEFAULT false,
  alert_triggered BOOLEAN DEFAULT false,
  raw_data JSONB
);

-- Predictive alerts
CREATE TABLE IF NOT EXISTS iot_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id UUID NOT NULL REFERENCES iot_sensors(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL, -- threshold_exceeded, anomaly, prediction
  severity VARCHAR(20) NOT NULL, -- info, warning, critical
  message TEXT NOT NULL,
  triggered_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  resolved_by UUID REFERENCES users(id),
  metadata JSONB
);

-- Audit log for civic transparency
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL, -- user, badge, sensor, reading, alert
  entity_id UUID NOT NULL,
  performed_by UUID REFERENCES users(id),
  timestamp TIMESTAMP DEFAULT NOW(),
  details JSONB
);

-- Indexes for performance
CREATE INDEX idx_earned_badges_user ON earned_badges(user_id);
CREATE INDEX idx_earned_badges_badge ON earned_badges(badge_id);
CREATE INDEX idx_sensor_readings_sensor ON sensor_readings(sensor_id);
CREATE INDEX idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);
CREATE INDEX idx_iot_alerts_sensor ON iot_alerts(sensor_id);
CREATE INDEX idx_iot_alerts_severity ON iot_alerts(severity);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
