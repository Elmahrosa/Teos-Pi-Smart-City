# Repository Structure (Teos-Pi-Smart-City)

This file explains the layout added to integrate IoT ingestion, Pi AI microservices, badge automation, and UTF-8-safe schema patches.

Top-level additions:
- /iot - Python sidecar services that simulate and ingest sensor telemetry.
- /ai  - Lightweight microservices for classification, thresholds and alerts.
- /scripts - Automation scripts (badge evaluation, maintenance tasks).
- docker-compose.yml - reproducible local stack (Postgres + Mosquitto + services).
- Dockerfile.* - container images for iot and ai services.
- schema.sql and patch-restore-emojis.sql - UTF-8 safe schema and reseed script for emoji badges.

Quick start (local):
1. Install Docker & docker-compose.
2. From repo root: docker-compose up --build
3. Services:
   - MQTT broker: mosquitto:1883
   - Postgres: postgres:5432 (user: teos / password: teos)
   - iot service: publishes/subscribes to /teos/sensors
   - ai service: polls DB or subscribes to MQTT for classification
   - scripts/earned_badges.py: can be run manually or as a cron job

Notes:
- All SQL files are UTF-8 encoded. Use psql client with UTF-8 locale.
- These are scaffold files with safe defaults — adapt thresholds, DB connection strings, and secrets for production.
