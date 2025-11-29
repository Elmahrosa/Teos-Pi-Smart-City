# Teos Pi Smart City — Pages Router version (ZIP-ready)

This bundle contains a pages-router (Next.js) compatible scaffold for the Teos Pi Smart City
security & IoT governance system. Files are corrected for common runtime issues and adapted
from the app-router draft.

## What's included
- NextAuth configuration (lib/auth.ts) — fixed exports.
- NextAuth API route: pages/api/auth/[...nextauth].ts
- IoT governance: lib/iot/{types,governance,rules,worker}.ts with safer SQL usage.
- API routes under pages/api/iot/...
- React components moved to `components/`
- Pages under `pages/` (login, 403, iot-overview)
- middleware.ts adapted for pages-router token checks
- package.json and .env.local.example

## How to use
1. Copy these files into your repository root.
2. Create `.env.local` from `.env.local.example` and fill secrets.
3. Run DB SQL (see SQL in docs) to create tables.
4. Install & run:
   ```bash
   npm install
   npm run dev
   npm run worker
   ```
