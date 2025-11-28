Teos-Pi-Smart-City/
├── lib/
│   ├── auth.ts                          # NextAuth config with role-based JWT
│   └── iot/
│       ├── types.ts                     # TypeScript interfaces
│       ├── governance.ts                # Badge grant & alert trigger logic
│       ├── rules.ts                     # Dynamic rule evaluator
│       └── worker.ts                    # Background governance worker
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts             # NextAuth API handler
│   │   └── iot/
│   │       ├── metrics/
│   │       │   └── route.ts             # GET metrics summary (public)
│   │       ├── telemetry/
│   │       │   └── route.ts             # GET 24h telemetry (public)
│   │       ├── alerts/
│   │       │   └── stream/
│   │       │       └── route.ts         # SSE alerts + badge events
│   │       ├── badges/
│   │       │   ├── route.ts             # GET earned badges (auth'd)
│   │       │   └── check/
│   │       │       └── route.ts         # POST manual badge check
│   │       └── badges/definitions/
│   │           ├── route.ts             # GET all, POST new (admin only)
│   │           └── [id]/
│   │               └── route.ts         # PUT update, DELETE (admin only)
│   ├── components/
│   │   ├── AuthProvider.tsx             # Session provider wrapper
│   │   ├── Header.tsx                   # Role-aware header + login/logout
│   │   ├── Login.tsx                    # Reusable login form
│   │   ├── AdminGuard.tsx               # Client-side admin guard
│   │   └── iot/
│   │       ├── IoTOverviewCard.tsx      # Metrics summary card
│   │       ├── AlertStream.tsx          # SSE-powered alert feed
│   │       ├── SensorDetailTable.tsx    # Telemetry table
│   │       ├── CityHeatmap.tsx          # Leaflet map
│   │       ├── BadgeGallery.tsx         # Earned badges + confetti
│   │       ├── BadgeDefinitions.tsx     # Civic rules list
│   │       ├── BadgeAdminPanel.tsx      # Admin CRUD panel
│   │       └── BadgeForm.tsx            # Create/edit badge form
│   ├── login/
│   │   └── page.tsx                     # Login page
│   ├── 403/
│   │   └── page.tsx                     # Forbidden page
│   └── iot-overview/
│       ├── page.tsx                     # Public dashboard
│       └── admin/
│           └── page.tsx                 # Admin dashboard (guarded)
├── middleware.ts                        # Route-level guards
├── package.json                         # Add dependencies
└── .env.local                           # Secrets (never commit!)
