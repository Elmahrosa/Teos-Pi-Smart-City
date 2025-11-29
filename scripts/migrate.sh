#!/usr/bin/env bash
set -e
if [ -z "$DATABASE_URL" ]; then
  echo "Please export DATABASE_URL"
  exit 1
fi
psql "$DATABASE_URL" -f "$(dirname "$0")/../schema.sql"
echo "Schema applied."
