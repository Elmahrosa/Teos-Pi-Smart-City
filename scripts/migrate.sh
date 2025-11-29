#!/bin/bash
# Migration script for Teos-Pi Smart City IoT database
# Founder: Ayman Seif | TEOS Egypt

set -e

echo "🏛️ Teos-Pi Smart City - Database Migration"
echo "Founder: Ayman Seif | TEOS Egypt"
echo ""

# Check for database URL
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable not set"
  exit 1
fi

echo "📊 Step 1: Creating schema..."
psql "$DATABASE_URL" -f schema.sql

echo "🎨 Step 2: Restoring emoji icons..."
psql "$DATABASE_URL" -f patch-restore-emojis.sql

echo "🏅 Step 3: Seeding badge definitions..."
psql "$DATABASE_URL" -f scripts/seed_badges.sql

echo ""
echo "✅ Migration complete!"
echo "🌐 Pi AI IoT system ready for telemetry ingestion"
echo ""
echo "Next steps:"
echo "  1. Configure Pi AI service in lib/pi-ai-service.ts"
echo "  2. Deploy API routes for sensor telemetry"
echo "  3. Test badge evaluation logic"
echo ""
