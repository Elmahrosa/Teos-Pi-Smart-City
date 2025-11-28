-- Restore correct emoji icons for badge definitions
UPDATE badge_definitions
SET icon = '🌿'
WHERE badge_type = 'City Health Guardian';

UPDATE badge_definitions
SET icon = '🔊'
WHERE badge_type = 'Noise Violation';
