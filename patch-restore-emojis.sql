-- Patch to restore UTF-8 emoji icons in badge_definitions
-- Run this after schema.sql to ensure proper emoji rendering
-- Founder: Ayman Seif | TEOS Egypt

-- Update badge icons with UTF-8 emojis
UPDATE badge_definitions SET icon = '🌿' WHERE name = 'Eco Guardian';
UPDATE badge_definitions SET icon = '🔊' WHERE name = 'Quiet Keeper';
UPDATE badge_definitions SET icon = '🚗' WHERE name = 'Traffic Monitor';
UPDATE badge_definitions SET icon = '🏛️' WHERE name = 'Civic Pioneer';
UPDATE badge_definitions SET icon = '⚡' WHERE name = 'Energy Saver';
UPDATE badge_definitions SET icon = '💧' WHERE name = 'Water Guardian';

-- Verify emoji restoration
SELECT name, icon, description FROM badge_definitions ORDER BY name;
