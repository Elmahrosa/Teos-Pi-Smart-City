-- Re-encode/rescue emoji fields in badge_definitions if needed.
-- Run this if emoji characters appear garbled after a migration.

ALTER TABLE badge_definitions ALTER COLUMN icon TYPE TEXT COLLATE "C";
-- If you need to reseed icons, example:
UPDATE badge_definitions SET icon = '🌿' WHERE name ILIKE '%green%';
UPDATE badge_definitions SET icon = '🔊' WHERE name ILIKE '%noise%';
