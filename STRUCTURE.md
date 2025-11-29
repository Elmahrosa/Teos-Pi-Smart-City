# Repository Structure — IoT + Pi AI Microservices (Python sidecar)

This folder contains standalone Python services designed to run alongside the Next.js app.
They handle real-world device ingestion, basic Pi-AI classification, and badge automation.

Top-level:
- schema.sql — SQL schema to create the required tables
- patch-restore-emojis.sql — helpers to fix emoji encoding if necessary
- README.md — quick start
- STRUCTURE.md — this file

Directories:
- iot/
  - sensors.py         # Lightweight sensor simulator (for local testing)
  - mqtt_listener.py   # MQTT consumer (paho-mqtt) to ingest device messages
  - exporter.py        # Writes received telemetry into Postgres
- ai/
  - classifier.py      # Rule-based + pluggable classifier for telemetry (placeholder for models)
  - thresholds.json    # Thresholds and badge rule examples
  - alerts.py          # Predictive alert logic (uses classifier)
- scripts/
  - earned_badges.py   # Periodic runner that evaluates badge rules and inserts earned_badges
  - migrate.sh         # Applies schema.sql to a database

Run patterns:
- Run mqtt_listener.py as a long-running service (systemd / docker-compose)
- exporter.py is used by mqtt_listener (imported)
- classifier.py and alerts.py can be imported by exporter or run as a task
- earned_badges.py can be invoked by cron or a scheduler every minute

Security:
- Use environment variables for DB credentials (see README.md)
- Services communicate only with DB and optionally a message queue (MQTT)
