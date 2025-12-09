# Teos-Pi-Smart-City — IoT + Pi AI Integration (Fix/Scaffold)
“Part of the TEOS Egypt Blockchain Ecosystem — a unified civil, financial, and smart-city infrastructure powering digital banking, civic governance, DeFi, Pi integration, and national blockchain services.”

## 🛑 PROPRIETARY & CONFIDENTIAL — TEOS EGYPT
[![Strictly Proprietary](https://img.shields.io/badge/Strictly%20Proprietary-TEOS%20Sovereign%20License-ff0000?style=for-the-badge)](https://github.com/Elmahrosa/Teos-Pharaoh-Portal/blob/main/TESL.md)

> Copyright © 2025 Elmahrosa International. All Rights Reserved.  
> This material is NOT open source and is protected by the TEOS Egypt Sovereign License (TESL).  
> For the full license text, see [TEOS Egypt Sovereign License (TESL)](https://github.com/Elmahrosa/Teos-Pharaoh-Portal/blob/main/TESL.md).
> 
> **Initial Author:** Elmahrosa International  
> **Governing law and venue:** Cairo, Arab Republic of Egypt.

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
