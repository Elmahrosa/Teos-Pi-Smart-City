# Teos Pi Smart City — IoT + Pi AI Microservices (Python)

This sidecar contains Python services for ingestion, AI classification, and badge automation.

## Quick start (local)
1. Create a Python virtualenv and install packages:
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Create `.env` file with:
```
DATABASE_URL=postgres://teos:password@localhost:5432/teos_iot
MQTT_BROKER=localhost
MQTT_PORT=1883
MQTT_TOPIC=teos/sensors/#
```

3. Initialize DB:
```bash
psql $DATABASE_URL -f schema.sql
```

4. Run the MQTT listener (or use `sensors.py` to simulate):
```bash
python iot/mqtt_listener.py
```

5. Start badge automation (periodic):
```bash
python scripts/earned_badges.py
```

## Notes
- The classifier is rule-based by default in `ai/classifier.py`. Replace with ML model as needed.
- `exporter.py` writes telemetry into Postgres and accepts JSON payloads from MQTT.
- This scaffold is intentionally dependency-light to help bootstrapping.
