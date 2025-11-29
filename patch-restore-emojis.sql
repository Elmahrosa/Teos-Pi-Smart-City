-- Re-seed emojis safely (use psql with UTF8)
BEGIN;

UPDATE badges SET emoji = '🌿' WHERE code = 'green-thumb';
UPDATE badges SET emoji = '🔊' WHERE code = 'noise-watcher';

COMMIT;
