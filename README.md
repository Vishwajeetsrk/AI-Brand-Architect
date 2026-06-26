# NEXORA — AI Brand Architect

> **Enterprise AI-powered brand management platform** — pnpm monorepo with Vite React frontend, NestJS backend, Electron desktop app, and shared packages.
>
> Part of the **Learnify AI** ecosystem (see `PLAN/` for the complete 12-book specification).

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  Vite React   │  │ Electron     │  │  Mobile (Future)      │  │
│  │  (apps/web)   │  │ (apps/desktop)│  │  (React Native)       │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬────────────┘  │
└─────────┼─────────────────┼──────────────────────┼──────────────┘
          │        HTTP     │       WebSocket      │
          ▼                  ▼                      ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Reverse Proxy (nginx)                       │
└─────────────────────────────┬────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Backend (apps/server)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐ │
│  │ REST API │  │ GraphQL  │  │WebSocket │  │  Auth / RBAC    │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐ │
│  │ AI Engine│  │  Agent   │  │Analytics │  │  Billing        │ │
│  │ (packages│  │ Runtime  │  │ Engine   │  │  (Stripe)       │ │
│  │ /ai-eng) │  │          │  │          │  │                 │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────┘ │
└─────────────────────────────┬────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌────────────────────────┐
│   PostgreSQL    │ │      Redis      │ │    Object Storage      │
│  + pgvector     │ │  Cache / Queue  │ │  (R2 / S3-compatible) │
│  + Prisma ORM   │ │  + Bull Queue   │ │  Brand assets, media  │
└─────────────────┘ └─────────────────┘ └────────────────────────┘
```

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | >= 22 | JavaScript runtime |
| pnpm | >= 10 | Package manager |
| Docker | >= 27 | Containerised services |
| Docker Compose | >= 2.30 | Local orchestration |

---

## Quick Start

```bash
# 1. Clone and enter the project
cd NEXORA

# 2. Set up environment
cp .env.example .env

# 3. Start infrastructure (PostgreSQL + Redis)
docker compose up -d

# 4. Install dependencies
pnpm install

# 5. Push database schema
pnpm --filter @nexora/database db:push

# 6. Start development
pnpm dev
```

---

## Environment Setup

```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `postgresql://nexora:nexora_dev@localhost:5432/nexora` | PostgreSQL connection |
| `REDIS_URL` | Yes | `redis://localhost:6379` | Redis connection |
| `JWT_SECRET` | Yes | — | JWT signing secret |
| `OPENAI_API_KEY` | Conditional | — | OpenAI provider key |
| `ANTHROPIC_API_KEY` | Conditional | — | Anthropic provider key |
| `GOOGLE_AI_API_KEY` | Conditional | — | Google AI provider key |
| `DEEPSEEK_API_KEY` | Conditional | — | DeepSeek provider key |
| `PORT` | No | `3001` | Backend API port |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Allowed CORS origin |

---

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all packages in parallel |
| `pnpm dev:web` | Vite frontend dev server (port 5173) |
| `pnpm dev:server` | NestJS backend dev server (port 3001) |
| `pnpm dev:desktop` | Electron desktop app (loads web dev server) |
| `pnpm build` | Build all packages for production |
| `pnpm build:web` | Build frontend to `apps/web/dist/` |
| `pnpm build:server` | Build backend to `apps/server/dist/` |
| `pnpm lint` | Lint all packages |
| `pnpm test` | Run all tests |
| `pnpm --filter <package> <script>` | Run script in specific package |

### Database Commands

| Command | Description |
|---------|-------------|
| `pnpm --filter @nexora/database db:push` | Push Prisma schema to database |
| `pnpm --filter @nexora/database db:migrate` | Run Prisma migrations |
| `pnpm --filter @nexora/database db:studio` | Open Prisma Studio |
| `pnpm --filter @nexora/database db:seed` | Seed demo data |

### Makefile Shortcuts

| Command | Description |
|---------|-------------|
| `make dev` | `pnpm dev` |
| `make install` | `pnpm install` |
| `make build` | `pnpm build` |
| `make db-setup` | Push schema to database |
| `make db-migrate` | Run Prisma migrations |
| `make db-studio` | Open Prisma Studio |
| `make docker-up` | `docker compose up -d` |
| `make docker-down` | `docker compose down` |
| `make clean` | Remove all `dist/` and `node_modules` |

---

## Desktop App (Electron)

```bash
# Build the web app first
pnpm build:web

# Start Electron in development mode
cd apps/desktop
NODE_ENV=development pnpm dev

# Package for distribution
pnpm dist
```

The desktop app (`apps/desktop/`) wraps the Vite frontend in an Electron shell with native menus, auto-updater, and platform-specific installers (NSIS for Windows, DMG for macOS, AppImage for Linux).

---

## Docker Setup

### Local Development

```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

The `docker-compose.yml` spins up:
- **PostgreSQL 16** with pgvector extension (port 5432)
- **Redis 7** (port 6379)
- **NestJS API** (port 3001) — production build

### Production Build

```bash
docker compose build
docker compose up -d
```

---

## Project Structure

```
NEXORA/
├── apps/
│   ├── web/                    # Vite React frontend (port 5173)
│   │   ├── src/                # App source, screens, components
│   │   ├── public/             # Static assets, logo
│   │   ├── dist/               # Production build output
│   │   └── vite.config.ts
│   ├── server/                 # NestJS backend (port 3001)
│   │   ├── src/                # API modules, services
│   │   └── Dockerfile
│   └── desktop/                # Electron desktop wrapper
│       ├── electron/           # Main process + preload
│       └── electron-builder.yml
├── packages/
│   ├── shared/                 # Shared types, constants, utils
│   ├── database/               # Prisma schema + client
│   │   ├── prisma/schema.prisma
│   │   └── src/
│   ├── ai-engine/              # LLM gateway, RAG, prompts, memory
│   │   └── src/
│   │       ├── agent/          # Multi-agent runtime + skills
│   │       ├── llm/            # Provider factory (OpenAI, Anthropic, Google, DeepSeek)
│   │       ├── rag/            # RAG pipeline
│   │       ├── prompt/         # Prompt engine
│   │       └── memory/         # Memory store
│   ├── analytics/              # Analytics engine + seeding
│   ├── automation/             # Workflow automation engine
│   ├── collaboration/          # Real-time collaboration engine
│   ├── marketplace/            # Brand marketplace module
│   ├── knowledge/              # Knowledge base + seeding
│   └── security/               # Security engine, RBAC, IAM
├── design-system/              # Design tokens, themes, guidelines
├── docker-compose.yml
├── Makefile
├── package.json                # Workspace root
├── pnpm-workspace.yaml
├── tsconfig.json
├── DEPLOYMENT.md               # Full deployment guide
└── README.md
```

---

## Modules & Status

| Module | Package | Status | Description |
|--------|---------|--------|-------------|
| Frontend | `@nexora/web` | ✅ Active | Vite React SPA |
| Backend | `@nexora/server` | 🚧 In Progress | NestJS API |
| Desktop | `@nexora/desktop` | 🆕 Added | Electron wrapper |
| Shared | `@nexora/shared` | ✅ Active | Types & utilities |
| Database | `@nexora/database` | ✅ Active | Prisma schema |
| AI Engine | `@nexora/ai-engine` | 🚧 In Progress | LLM gateway, RAG, agent runtime |
| Analytics | `@nexora/analytics` | 🆕 Added | Analytics engine |
| Automation | `@nexora/automation` | 🆕 Added | Workflow engine |
| Collaboration | `@nexora/collaboration` | 🆕 Added | Real-time collab |
| Marketplace | `@nexora/marketplace` | 🆕 Added | Brand marketplace |
| Knowledge Base | `@nexora/knowledge` | 🆕 Added | Knowledge management |
| Security | `@nexora/security` | 🆕 Added | RBAC, IAM engine |

---

## PLAN Specification (12 Books)

| Book | Status | Focus |
|------|--------|-------|
| Book 1 | ✅ Completed | Product Vision & Design (Vol 1-15) |
| Book 2 | ✅ Completed | Engineering Architecture (Vol 16-25) |
| Book 3 | ✅ Completed | AI & MCP Architecture |
| Book 4 | ✅ Completed | Development Specifications (Vol 31-35) |
| Book 5 | ✅ Completed | Platform Modules & Applications (Vol 36-50) |
| Book 6 | ✅ Completed | Technical Architecture & Blueprint |
| Book 7 | ✅ Completed | Enterprise Implementation & Operations |
| Book 8 | ✅ Completed | Intelligence, Knowledge & Autonomous Enterprise |
| Book 9 | ➡️ In Progress | Engineering Specifications |
| Book 10 | ➡️ In Progress | UI & UX Specifications |
| Book 11 | ➡️ In Progress | Production Implementation Library (Vol 101-120) |
| Book 12 | ➡️ In Progress | Enterprise Source Code & Dev Library (Vol 121-128) |

See `PLAN/` for the full specification.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 6, TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui |
| Backend | NestJS 11 |
| Database | PostgreSQL 16 + pgvector + Prisma |
| Cache | Redis 7 |
| Desktop | Electron 34 |
| Charts | Recharts |
| Icons | Lucide React, MUI Icons v7 |
| Routing | React Router 7 |
| Animation | motion (Framer Motion) |
| Auth | JWT, RBAC |
| AI | OpenAI, Anthropic, Google AI, DeepSeek |

---

## API Documentation

Once the backend is running, API docs are available at:

- **Swagger UI**: `http://localhost:3001/api/docs`
- **OpenAPI JSON**: `http://localhost:3001/api/docs-json`

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-06-26 | 0.2.0 | Code-split 45 screens, shared components, layout refactor |
| 2026-06-26 | 0.1.1 | Electron desktop config (V114), DEPLOYMENT.md (V120) |
| 2026-06-25 | 0.1.0 | Initial UI prototype from Figma design |
