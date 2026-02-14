# Dragon Sovereign Homestead Dashboard

## Vision

Integrated self-sufficiency monitoring & control platform for a solarpunk homestead.
Six interconnected domains — nothing is wasted, everything cycles.
See `dragon_sovereign_homestead.html` for the full systems blueprint (source of truth for project vision).

## Tech Stack

- **Frontend:** React 19 + Vite + MUI 7 + Redux Toolkit (RTK Query) + Nivo charts
- **Backend:** Node.js + Express 5 + Prisma ORM
- **Database:** PostgreSQL on Neon.tech
- **IoT Layer (future):** ESP32 sensors → MQTT → Raspberry Pi gateway → REST API
- **Structure:** `client/` (React SPA) and `server/` (Express API) as separate packages

## Architecture Decisions

- Separate frontend/backend (not Next.js) — IoT needs standalone backend for MQTT, WebSockets, background jobs
- Prisma over Sequelize — schema-first design, readable ERD, auto-generated migrations
- RTK Query for data fetching with polling for real-time sensor data
- Feature-based folder structure in `client/src/features/` — one folder per domain
- MVC on backend: routes → controllers → Prisma client → PostgreSQL
- Vertical slices over horizontal layers — each slice delivers a complete capability across the full stack

## Development Commands

```bash
# Frontend (from client/)
npm run dev        # Vite dev server on port 3000

# Backend (from server/)
npm run dev        # Nodemon on port 3001

# Database
npx prisma migrate dev    # Run migrations
npx prisma studio         # Visual DB browser
npx prisma generate       # Regenerate client after schema changes
```

## Domains

Six domains, each producing data consumed by others:

1. **Energy** — Solar, battery, biogas, micro-wind. Powers all other systems.
2. **Food** — Aquaponics, food forest, chicken coop, vertical gardens, mushrooms.
3. **Water** — Rainwater harvesting, greywater recycling, biosand filtration, atmospheric generation.
4. **Comms/AI** — LoRa mesh network, local AI server, encrypted comms, offline knowledge library.
5. **Defense** — Sensor mesh, deterrence systems, autonomous patrol, hardened core, aerial recon.
6. **Workshop** — 3D printing, CNC, electronics lab, welding, fabrication.

Key principle: Systems feed each other (solar → battery → pumps → aquaponics → food → restaurant → revenue → more infrastructure).

## Current Status

- **Completed:** Full Prisma schema (34 models across 7 sections) — the ERD is the schema
- **Completed:** Sequelize → Prisma migration — all controllers ported, Sequelize fully removed
- **Completed:** Server restructured to domain-based layout (`server/src/domains/`, `server/src/shared/`)
- **Working:** Aquaponics water level monitoring (ingest → store → display) — now using unified `sensor_readings` table
- **Phase:** Foundation complete — ready for vertical slice development per domain

## Server Structure

```
server/
  prisma/
    schema.prisma          # Full ERD — 34 models, source of truth
    migrations/            # Auto-generated migration SQL
  src/
    domains/
      energy/              # Solar, battery, biogas, wind
      food/                # Aquaponics, food forest, chickens, etc.
        controller.js      # Aquaponics water level endpoints (ported from Sequelize)
        routes.js           # /api/aquaponics/* routes
      water/               # Rainwater, greywater, biosand, atmospheric
      comms/               # LoRa mesh, AI inference
      defense/             # Security events, patrol, deterrents
      workshop/            # Equipment, inventory, maintenance
    shared/
      prismaClient.js      # Prisma client singleton
      auth/                # (future) Auth routes/controller/middleware
      ingestion/
        controller.js      # POST /api/ingest/reading — unified sensor pipeline
        routes.js
      alerts/              # (future) Alert engine
    middleware/
    utils/
  server.js                # Express entry point, Prisma init
```

## Development Approach

- **Schema-first** — define entities and relationships in Prisma before writing application code
- **Domain blueprints** — document each domain's entities, data flows, and connections to other domains
- **Vertical slices** — deliver complete capabilities (sensor → API → dashboard) rather than building layers horizontally
- Priority: shared infrastructure first (auth, sensor pipeline, alert engine), then domain features

## Conventions

- ES Modules (`import/export`) — no CommonJS
- React functional components with hooks only
- MUI `styled()` for component styling, MUI theme for design tokens
- API routes: `GET/POST /api/{domain}/{resource}`
- Sensor data ingestion: `POST /api/ingest/reading`
- Dark theme default (solarpunk aesthetic — dark bg, gold/green accents)
