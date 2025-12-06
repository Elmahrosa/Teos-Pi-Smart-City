# Teos-Pi-Smart-City — IoT + Pi AI Integration (Fix/Scaffold)
“Part of the TEOS Egypt Blockchain Ecosystem — a unified civil, financial, and smart-city infrastructure powering digital banking, civic governance, DeFi, Pi integration, and national blockchain services.”


This commit adds missing scaffolding to enable:
 - IoT ingestion layer (MQTT → Postgres)
 - Pi AI microservices (basic classifier + alerts)
 - Badge automation (earned_badges.py)
 - UTF-8 safe SQL schema and emoji-safe restore script
 - Docker compose for local reproduction

Files added:
- /iot: sensors.py, mqtt_listener.py, exporter.py
- /ai: classifier.py, alerts.py, thresholds.json
- /scripts: earned_badges.py
- schema.sql, patch-restore-emojis.sql
- Dockerfiles and docker-compose.yml

See STRUCTURE.md for details and quick start.
