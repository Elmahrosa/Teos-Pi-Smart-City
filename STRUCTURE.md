# Teos-Pi Smart City - Repository Structure & Contributor Guide

**Founder:** Ayman Seif | TEOS Egypt  
**Pi Network Integration:** 100% Pi SDK  
**Mission:** Egypt's First Civic-First Smart City with AI-Enhanced IoT Governance

---

## 📁 Directory Layout

\`\`\`
Teos-Pi-Smart-City/
│
├── schema.sql                # UTF-8 safe PostgreSQL schema with emoji badges 🌿🔊🚗
├── patch-restore-emojis.sql  # One-shot patch to restore emoji icons
├── STRUCTURE.md              # This file - contributor onboarding guide
├── README.md                 # Project overview and quick start
│
├── ai/                       # Pi AI integration layer
│   ├── classifier.py         # Sensor data classification (PM2.5, noise, traffic)
│   ├── thresholds.json       # AI-evaluated badge thresholds (Egyptian standards)
│   └── alerts.py             # Predictive alert generation logic
│
├── scripts/                  # Automation & database scripts
│   ├── seed_badges.sql       # Initial badge seeding with emoji icons
│   ├── migrate.sh            # Migration + patch runner (chmod +x)
│   └── generate_dashboard.py # Nightly governance dashboard updates
│
├── app/                      # Next.js frontend (Pi SDK integrated)
│   ├── page.tsx              # Homepage with civic dashboard
│   ├── petition/             # Petition system (5 Pi fee)
│   ├── api/                  # API routes
│   │   ├── iot/              # IoT telemetry endpoints
│   │   └── treasury/         # Treasury & badge management
│   └── [...other pages]
│
├── lib/                      # Core business logic
│   ├── pi-auth.ts            # Pi Browser authentication
│   ├── pi-payments.ts        # Pi payment integration (5 Pi petition, 1000 Pi shares)
│   ├── iot-database.ts       # IoT database helpers
│   └── pi-ai-service.ts      # Pi AI telemetry classification
│
├── database/                 # Database files (legacy structure)
│   ├── schema.sql            # [Deprecated - use root schema.sql]
│   └── patch-restore-emojis.sql
│
├── docs/                     # Documentation (MkDocs)
│   ├── dashboard.md          # Live governance dashboard
│   ├── CIVIC_PETITION.md     # Formal petition text
│   ├── FINANCIAL_FRAMEWORK.md # $2.2B+ land valuation details
│   └── [...other docs]
│
└── infrastructure/           # Access control & routes
    ├── access-control.json   # Role-based access (citizen, merchant, auditor, etc.)
    ├── routes.json           # API route definitions
    └── threat-model.md       # Security threat model
\`\`\`

---

## 🚀 Quick Start for Contributors

### 1. Clone & Setup

\`\`\`bash
git clone https://github.com/Elmahrosa/Teos-Pi-Smart-City.git
cd Teos-Pi-Smart-City

# Frontend
npm install
npm run dev

# Python AI services
pip install -r requirements.txt
\`\`\`

### 2. Database Migration

\`\`\`bash
export DATABASE_URL="postgresql://user:pass@host:5432/teospi"
chmod +x scripts/migrate.sh
./scripts/migrate.sh
\`\`\`

### 3. Test Pi AI Classifier

\`\`\`python
from ai.classifier import classify_sensor_reading

# Test PM2.5 classification
result = classify_sensor_reading('pm25', 45.2)
print(result)
# {'classification': 'moderate', 'confidence': 0.85, ...}
\`\`\`

### 4. Test Badge Evaluation

\`\`\`bash
curl -X POST http://localhost:3000/api/iot/badges/evaluate \
  -H "Content-Type: application/json" \
  -d '{"userId": "uuid", "sensorType": "pm25"}'
\`\`\`

---

## 🏅 Badge System Architecture

### Badge Definitions (with Emojis)

| Badge | Icon | Threshold | Description |
|-------|------|-----------|-------------|
| Eco Guardian | 🌿 | 720 hours | Maintain PM2.5 < 35 μg/m³ for 30 days |
| Quiet Keeper | 🔊 | 168 hours | Keep noise < 65 dB for 7 days |
| Traffic Monitor | 🚗 | 100 readings | Report 100 traffic sensor readings |
| Civic Pioneer | 🏛️ | 1 contribution | Join governance with 5 Pi petition fee |
| Energy Saver | ⚡ | 720 hours | Reduce energy by 20% for 30 days |
| Water Guardian | 💧 | 336 hours | Maintain water quality for 14 days |

### Automated Badge Evaluation

Badges are automatically evaluated when:
1. Sensor telemetry is submitted via `/api/iot/telemetry`
2. Pi AI classifier processes the reading
3. Badge thresholds are checked against historical data
4. `earned_badges` table is updated with AI confidence score

---

## 🤖 Pi AI Integration Details

### Classification Pipeline

\`\`\`
Sensor Reading → Pi AI Classifier → Classification + Confidence → Badge Check → Alert Generation
\`\`\`

### Egyptian Environmental Standards

- **PM2.5**: Egyptian Environmental Affairs Agency (EEAA)
- **Noise**: Egyptian Law 4/1994 Article 47
- **Traffic**: Alexandria Traffic Authority

### AI Confidence Scoring

- **Excellent/Quiet/Light**: 95% confidence
- **Good/Acceptable/Moderate**: 90% confidence
- **Moderate/Elevated/Heavy**: 85% confidence
- **Poor/Excessive/Congested**: 80% confidence
- **Hazardous**: 75% confidence

---

## 🔐 Role-Based Access Control (RBAC)

### User Roles

- **Citizen**: View dashboards, contribute sensors, earn badges
- **Merchant**: Civic accounts, invoice Pi payments
- **Auditor**: Read-only treasury & petition access
- **Officer**: Security module write access
- **Student**: School module access
- **Contributor**: Repository read/write with petition approval

### Badge-Gated Repository Access

1. Sign NDA (`docs/NDA_TEMPLATE.md`)
2. Pay 5 Pi petition fee
3. Receive "Civic Pioneer" badge
4. Gain read access to private repo
5. Earn "Contributor" badge after first PR merge

---

## 📊 Database Schema Highlights

### UTF-8 Safe Emoji Storage

\`\`\`sql
-- Badge icons use VARCHAR(10) to store UTF-8 emoji
icon VARCHAR(10) NOT NULL, -- 🌿 🔊 🚗
\`\`\`

### UUID Primary Keys

All tables use `UUID` for primary keys to ensure:
- No sequential ID exposure
- Distributed system compatibility
- Merge-safe across multiple environments

### JSONB Metadata

\`\`\`sql
evaluation_data JSONB, -- AI classifier raw output
raw_data JSONB,        -- Original sensor payload
metadata JSONB         -- Extensible sensor properties
\`\`\`

---

## 🛠 API Endpoints

### IoT Telemetry

\`\`\`bash
POST /api/iot/telemetry
{
  "sensorId": "uuid",
  "value": 42.5,
  "timestamp": "2025-11-28T13:45:00Z"
}
\`\`\`

### Badge Evaluation

\`\`\`bash
POST /api/iot/badges/evaluate
{
  "userId": "uuid",
  "sensorType": "pm25"
}
\`\`\`

### Sensor Registration

\`\`\`bash
POST /api/iot/sensors
{
  "sensorId": "ALEX-PM25-001",
  "sensorType": "pm25",
  "locationLat": 31.2001,
  "locationLng": 29.9187,
  "locationName": "Alexandria Downtown"
}
\`\`\`

---

## 🧪 Testing Checklist

### Local Development

- [ ] Frontend runs at `http://localhost:3000`
- [ ] Database schema created with `./scripts/migrate.sh`
- [ ] Emoji icons render correctly in `badge_definitions`
- [ ] Pi AI classifier returns valid JSON
- [ ] Alert generation triggers correctly

### Integration Testing

- [ ] Sensor telemetry POST returns 201
- [ ] Badge evaluation awards correct badges
- [ ] Audit log records all actions
- [ ] Pi Browser authentication works in sandbox
- [ ] 5 Pi petition payment processes correctly

### Production Deployment

- [ ] Environment variables configured in Vercel
- [ ] PostgreSQL database provisioned (Neon/Supabase)
- [ ] GitHub Actions workflow runs nightly
- [ ] MkDocs documentation site published
- [ ] Repository set to private with badge-gated access

---

## 📝 Contribution Guidelines

1. **Fork & Branch**: Create feature branch from `main`
2. **Sign Petition**: Pay 5 Pi fee to join governance
3. **Code Standards**: Follow TypeScript + Python best practices
4. **Test Coverage**: Add tests for new Pi AI features
5. **Pull Request**: Include petition approval signature
6. **Audit Review**: Wait for auditor sign-off
7. **Founder Signature**: Final approval by Ayman Seif

---

## 📩 Contact & Support

**Founder:** Ayman Seif  
**Email:** ayman@teosegypt.com  
**Telegram:** @ElmahrosaPi  
**Twitter:** @King_Teos  
**GitHub:** Elmahrosa

**Official Site:** https://teosegypt.com  
**Live App:** https://teos-pi-smart-city.vercel.app/  
**Documentation:** https://teospismartcitye8281.pinet.com

---

**From Egypt to the World — Building the First Pi-Powered Nation.**
