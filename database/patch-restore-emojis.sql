-- Patch file to restore emoji icons if corrupted during deployment
-- UTF-8 safe restoration script

UPDATE badge_definitions SET icon = '🌿' WHERE name = 'Clean Air Advocate';
UPDATE badge_definitions SET icon = '🔊' WHERE name = 'Noise Guardian';
UPDATE badge_definitions SET icon = '🚦' WHERE name = 'Traffic Champion';
UPDATE badge_definitions SET icon = '🏅' WHERE name = 'Pioneer Contributor';
UPDATE badge_definitions SET icon = '⚡' WHERE name = 'Energy Saver';
UPDATE badge_definitions SET icon = '🏥' WHERE name = 'Healthcare Hero';
UPDATE badge_definitions SET icon = '🌟' WHERE name = 'Civic Pioneer';
