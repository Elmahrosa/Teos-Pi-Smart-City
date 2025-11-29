# Teos&Pi Smart City - IoT & Pi AI Integration Structure

## Overview
This document outlines the IoT telemetry system integrated with Pi AI for automated badge governance and civic transparency.

## Database Schema

### Tables
- **users** - Pioneer accounts with RBAC (citizen, merchant, auditor, officer, contributor)
- **badge_definitions** - Badge templates with AI thresholds and auto-award logic
- **earned_badges** - User badge achievements with AI evaluation scores
- **sensor_telemetry** - Real-time IoT data (noise, PM2.5, traffic, energy, temperature)
- **ai_analysis** - Pi AI classification results and predictions
- **petitions** - Civic petitions with voting
- **petition_votes** - Pioneer voting records
- **treasury_ledger** - Pi-only financial transactions

### Badge Definitions (with Emoji Icons)
- 🌿 **Clean Air Advocate** - PM2.5 < 25 μg/m³ for 7 days (auto-award)
- 🔊 **Noise Guardian** - Noise < 60 dB for 48 hours (auto-award)
- 🚦 **Traffic Champion** - Avg delay < 10 min for 24 hours (auto-award)
- 🏅 **Pioneer Contributor** - 10+ civic petitions (manual review)
- ⚡ **Energy Saver** - 20% energy reduction over 30 days (auto-award)
- 🏥 **Healthcare Hero** - 5+ health initiatives (manual review)
- 🌟 **Civic Pioneer** - 5 Pi petition + 1,000 Pi civic share (automatic on payment)

## Pi AI Service

### Core Functions
1. **classifySensorReading()** - Real-time classification (excellent/good/moderate/poor/hazardous)
2. **evaluateBadgeEligibility()** - Check if pioneer meets badge thresholds
3. **generatePredictiveAlerts()** - Trend analysis for preventive action

### Classification Thresholds

#### PM2.5 (Air Quality)
- Excellent: ≤ 12 μg/m³
- Good: 13-35 μg/m³
- Moderate: 36-55 μg/m³
- Poor: 56-150 μg/m³
- Hazardous: > 150 μg/m³

#### Noise Level
- Excellent: ≤ 50 dB
- Good: 51-60 dB
- Moderate: 61-70 dB
- Poor: 71-85 dB
- Hazardous: > 85 dB

#### Traffic Flow (Average Delay)
- Excellent: ≤ 5 min
- Good: 6-10 min
- Moderate: 11-20 min
- Poor: 21-40 min
- Hazardous: > 40 min

## API Endpoints

### POST /api/iot/telemetry
Submit sensor reading with automatic AI classification.

Request body:
\`\`\`json
{
  "sensorId": "sensor-001",
  "sensorType": "pm25",
  "value": 22.5,
  "unit": "μg/m³",
  "locationName": "Alexandria Downtown",
  "locationLat": 31.2001,
  "locationLng": 29.9187
}
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "telemetry": {
    "id": "uuid",
    "ai_classification": "good",
    "ai_anomaly_detected": false
  }
}
\`\`\`

### POST /api/iot/badges/evaluate
Evaluate pioneer badge eligibility and auto-award.

Request body:
\`\`\`json
{
  "userId": "user-uuid"
}
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "awardedBadges": [
    {
      "badge_id": "badge-uuid",
      "ai_score": 87,
      "earned_at": "2025-11-28T13:45:00Z"
    }
  ],
  "count": 1
}
\`\`\`

## Deployment

### 1. Database Setup
\`\`\`bash
psql -U postgres -d teos_smart_city -f database/schema.sql
\`\`\`

### 2. Restore Emoji Icons (if needed)
\`\`\`bash
psql -U postgres -d teos_smart_city -f database/patch-restore-emojis.sql
\`\`\`

### 3. Environment Variables
\`\`\`env
DATABASE_URL=postgresql://user:pass@localhost:5432/teos_smart_city
NEXT_PUBLIC_PI_APP_ID=teospi-smart-city-elmahrosa
PI_API_KEY=your_pi_api_key
\`\`\`

### 4. Run Development Server
\`\`\`bash
npm install
npm run dev
\`\`\`

## Contributor Onboarding

### Prerequisites
- PostgreSQL 14+ with UUID extension
- Node.js 18+
- Pi Browser for authentication testing

### Testing Badge Automation
\`\`\`typescript
// Simulate sensor readings
await fetch('/api/iot/telemetry', {
  method: 'POST',
  body: JSON.stringify({
    sensorId: 'test-001',
    sensorType: 'pm25',
    value: 20,
    unit: 'μg/m³'
  })
})

// Evaluate badges for user
await fetch('/api/iot/badges/evaluate', {
  method: 'POST',
  body: JSON.stringify({ userId: 'test-user-id' })
})
\`\`\`

## Civic Transparency

All telemetry data and badge awards are audit-ready with:
- UUID-based RBAC
- AI confidence scores
- Telemetry snapshots
- Immutable timestamp records

Public dashboards display:
- Real-time air quality, noise, and traffic metrics
- Badge leaderboards by category
- AI classification trends
- Predictive alerts

## Future Enhancements
- LoRaWAN gateway integration (5,000+ sensors across Alexandria)
- AR civic dashboard for heritage preservation
- Multi-city replication toolkit
- Advanced ML models for seasonal prediction

---

**Founder Declaration**
Ayman Seif  
TEOS Egypt / Elmahrosa International  
Alexandria, Egypt

Built with Pi AI • Governed by Pioneers • Anchored in Transparency
