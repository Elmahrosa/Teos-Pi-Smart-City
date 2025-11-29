-- Teos&Pi Smart City - IoT & Badge Governance Schema
-- UTF-8 safe with emoji icons 🌿 🔊 🚦 🏥 ⚡
-- Pi AI enhanced telemetry and badge automation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with RBAC
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pi_user_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  kyc_verified BOOLEAN DEFAULT FALSE,
  role VARCHAR(50) DEFAULT 'citizen', -- citizen, merchant, auditor, officer, contributor
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badge definitions with AI thresholds
CREATE TABLE badge_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(10) NOT NULL, -- emoji icon
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- environmental, civic, contributor, pioneer
  ai_threshold_type VARCHAR(50), -- noise_level, pm25, traffic_flow, contribution_count
  ai_threshold_value NUMERIC(10,2),
  ai_duration_hours INTEGER DEFAULT 24, -- duration for threshold evaluation
  auto_award BOOLEAN DEFAULT FALSE, -- automatically award via AI
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default badge definitions
INSERT INTO badge_definitions (name, icon, description, category, ai_threshold_type, ai_threshold_value, ai_duration_hours, auto_award) VALUES
('Clean Air Advocate', '🌿', 'Maintained PM2.5 levels below 25 μg/m³ for 7 consecutive days', 'environmental', 'pm25', 25.00, 168, TRUE),
('Noise Guardian', '🔊', 'Kept noise levels below 60 dB in residential zones for 48 hours', 'environmental', 'noise_level', 60.00, 48, TRUE),
('Traffic Champion', '🚦', 'Contributed to smooth traffic flow (< 10 min avg delay) for 24 hours', 'environmental', 'traffic_flow', 10.00, 24, TRUE),
('Pioneer Contributor', '🏅', 'Submitted 10+ civic petitions with community support', 'contributor', 'contribution_count', 10.00, NULL, FALSE),
('Energy Saver', '⚡', 'Reduced energy consumption by 20% over 30 days', 'environmental', 'energy_reduction', 20.00, 720, TRUE),
('Healthcare Hero', '🏥', 'Participated in 5+ community health initiatives', 'civic', 'health_participation', 5.00, NULL, FALSE),
('Civic Pioneer', '🌟', 'Signed 5 Pi petition and contributed 1,000 Pi civic shares', 'pioneer', 'civic_share', 1000.00, NULL, FALSE);

-- Earned badges with AI evaluation
CREATE TABLE earned_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badge_definitions(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ai_evaluated BOOLEAN DEFAULT FALSE,
  ai_score NUMERIC(5,2), -- AI confidence score 0-100
  telemetry_snapshot JSONB, -- snapshot of sensor data that triggered award
  UNIQUE(user_id, badge_id)
);

-- IoT sensor telemetry
CREATE TABLE sensor_telemetry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sensor_id VARCHAR(100) NOT NULL,
  sensor_type VARCHAR(50) NOT NULL, -- noise, pm25, traffic, energy, temperature
  location_lat NUMERIC(10,7),
  location_lng NUMERIC(10,7),
  location_name VARCHAR(255),
  value NUMERIC(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL, -- dB, μg/m³, vehicles/min, kWh, °C
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ai_classification VARCHAR(50), -- excellent, good, moderate, poor, hazardous
  ai_anomaly_detected BOOLEAN DEFAULT FALSE,
  metadata JSONB
);

-- Create index for fast time-series queries
CREATE INDEX idx_telemetry_sensor_time ON sensor_telemetry(sensor_id, timestamp DESC);
CREATE INDEX idx_telemetry_type_time ON sensor_telemetry(sensor_type, timestamp DESC);
CREATE INDEX idx_telemetry_location ON sensor_telemetry(location_lat, location_lng);

-- AI analysis results
CREATE TABLE ai_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_type VARCHAR(50) NOT NULL, -- badge_evaluation, anomaly_detection, prediction
  sensor_type VARCHAR(50),
  time_window_start TIMESTAMP NOT NULL,
  time_window_end TIMESTAMP NOT NULL,
  result JSONB NOT NULL, -- AI classification results, predictions, recommendations
  confidence_score NUMERIC(5,2), -- 0-100
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Civic petitions
CREATE TABLE petitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'open', -- open, closed, approved, rejected
  support_count INTEGER DEFAULT 0,
  oppose_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP
);

-- Petition votes
CREATE TABLE petition_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  petition_id UUID NOT NULL REFERENCES petitions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL, -- support, oppose
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(petition_id, user_id)
);

-- Treasury ledger
CREATE TABLE treasury_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  transaction_type VARCHAR(50) NOT NULL, -- contribution, settlement, petition_fee, civic_share
  amount_pi NUMERIC(15,2) NOT NULL,
  memo TEXT,
  pi_payment_id VARCHAR(255), -- Pi Network payment ID
  receipt_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create views for dashboard queries
CREATE VIEW dashboard_badge_stats AS
SELECT 
  bd.name,
  bd.icon,
  bd.category,
  COUNT(eb.id) as total_earned,
  AVG(eb.ai_score) as avg_ai_score
FROM badge_definitions bd
LEFT JOIN earned_badges eb ON bd.id = eb.badge_id
GROUP BY bd.id, bd.name, bd.icon, bd.category;

CREATE VIEW dashboard_sensor_latest AS
SELECT DISTINCT ON (sensor_id, sensor_type)
  sensor_id,
  sensor_type,
  location_name,
  value,
  unit,
  ai_classification,
  timestamp
FROM sensor_telemetry
ORDER BY sensor_id, sensor_type, timestamp DESC;

-- Functions for automated badge evaluation
CREATE OR REPLACE FUNCTION check_badge_eligibility(
  p_user_id UUID,
  p_badge_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_badge badge_definitions%ROWTYPE;
  v_eligible BOOLEAN := FALSE;
  v_avg_value NUMERIC;
  v_start_time TIMESTAMP;
BEGIN
  SELECT * INTO v_badge FROM badge_definitions WHERE id = p_badge_id;
  
  IF v_badge.auto_award = FALSE THEN
    RETURN FALSE;
  END IF;
  
  -- Calculate time window
  v_start_time := CURRENT_TIMESTAMP - INTERVAL '1 hour' * v_badge.ai_duration_hours;
  
  -- Check threshold based on type
  IF v_badge.ai_threshold_type IN ('noise_level', 'pm25', 'traffic_flow') THEN
    SELECT AVG(value) INTO v_avg_value
    FROM sensor_telemetry
    WHERE sensor_type = v_badge.ai_threshold_type
      AND timestamp >= v_start_time
      AND timestamp <= CURRENT_TIMESTAMP;
    
    -- For these metrics, lower is better
    IF v_avg_value <= v_badge.ai_threshold_value THEN
      v_eligible := TRUE;
    END IF;
  END IF;
  
  RETURN v_eligible;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
