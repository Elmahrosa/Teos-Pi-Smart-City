-- Seed badge definitions for Teos-Pi Smart City
-- Run after schema.sql and patch-restore-emojis.sql
-- Founder: Ayman Seif | TEOS Egypt

INSERT INTO badge_definitions (name, icon, description, category, threshold_type, threshold_value) VALUES
('Eco Guardian', '🌿', 'Maintain PM2.5 < 35 μg/m³ for 30 days (720 hours)', 'environmental', 'duration', 720),
('Quiet Keeper', '🔊', 'Keep noise < 65 dB for 7 days (168 hours)', 'environmental', 'duration', 168),
('Traffic Monitor', '🚗', 'Report 100 traffic readings', 'civic', 'count', 100),
('Civic Pioneer', '🏛️', 'Join governance with 5 Pi petition fee', 'governance', 'count', 1),
('Energy Saver', '⚡', 'Reduce energy consumption by 20% for 30 days', 'environmental', 'duration', 720),
('Water Guardian', '💧', 'Maintain water quality standards for 14 days', 'environmental', 'duration', 336)
ON CONFLICT (name) DO NOTHING;

-- Verify seeding
SELECT * FROM badge_definitions ORDER BY category, name;
