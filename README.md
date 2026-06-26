# NEXORA — AI Brand Architect

> **Enterprise AI-powered brand management platform** — pnpm monorepo with Vite React frontend, NestJS backend, Electron desktop app, and shared packages.
>
> Part of the **Learnify AI** ecosystem (see `PLAN/` for the complete 12-book specification).

---

## Quick Start (5 Minutes)

```bash
# 1. Clone and enter the project
git clone https://github.com/nexora/nexora.git
cd nexora

# 2. Set up environment
cp .env.example .env

# 3. Start infrastructure (PostgreSQL + Redis)
docker compose up -d

# 4. Install dependencies
pnpm install

# 5. Push database schema
pnpm --filter @nexora/database db:push

# 6. Seed demo data (optional - creates test user)
pnpm --filter @nexora/database db:seed

# 7. Start development servers
pnpm dev
```

### Access the Application

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:5173 | Main UI (React) |
| **API Docs** | http://localhost:3001/api/docs | Swagger documentation |
| **Prisma Studio** | http://localhost:5555 | Database UI explorer |

---

## Test Credentials

### Demo User (Pre-seeded from `db:seed`)

| Field | Value |
|-------|-------|
| **Email** | `demo@nexora.ai` |
| **Password** | `password123` |
| **Role** | ADMIN |
| **Organization** | Acme Corp |
| **Pre-created Resources** | 1 Brand, 1 Project, 1 Prompt Template |

### How to Login & Test

1. Go to http://localhost:5173
2. Enter credentials above (or register a new account)
3. Explore the dashboard:
   - **Brands**: View the seeded "ACME Brand Identity"
   - **Projects**: View the seeded "Website Redesign" project
   - **AI Agents**: Execute brand analysis workflows
   - **Knowledge Base**: Search indexed documents
   - **Analytics**: View brand health metrics

### Create Additional Test Users

**Option 1: Via UI**
- Click "Register" on login page
- Fill in email, name, password
- New user created automatically

**Option 2: Via API**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "name": "New User",
    "password": "password123"
  }'

# Response: JWT token + user object
```

**Option 3: Direct Database (Prisma Studio)**
```bash
# Open Prisma Studio
pnpm --filter @nexora/database db:studio

# Navigate to "User" table → "Add record"
# Fill fields:
# - email: test2@example.com
# - name: Test User 2
# - passwordHash: $2b$10$... (bcrypt hash of "password123")
# - role: USER
```

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  Vite React   │  │ Electron     │  │  Mobile (Future)      │  │
│  │  (apps/web)   │  │ (apps/desktop)│  │  (React Native)       │  │
│  │ port 5173    │  │              │  │                       │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬────────────┘  │
└─────────┼─────────────────┼──────────────────────┼──────────────┘
          │        HTTP     │       WebSocket      │
          │      /api/*     │                      │
          ▼                  ▼                      ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Reverse Proxy (nginx)                       │
└─────────────────────────────┬────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│              Backend (NestJS) — port 3001                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐ │
│  │ REST API │  │ GraphQL  │  │WebSocket │  │  Auth / RBAC    │ │
│  │ /api/*   │  │ /graphql │  │ /ws      │  │  JWT + RBAC     │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐ │
│  │ AI Engine│  │  Agent   │  │Analytics │  │  Commerce       │ │
│  │ (LLM GW) │  │ Runtime  │  │ Engine   │  │  (Stripe)       │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────┘ │
└─────────────────────────────┬────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌────────────────────────┐
│   PostgreSQL    │ │      Redis      │ │    Object Storage      │
│  + pgvector     │ │  Cache / Queue  │ │  (R2 / S3-compatible) │
│  + Prisma ORM   │ │  (port 6379)    │ │  Brand assets, media  │
│  (port 5432)    │ │  + Bull Queue   │ │                       │
└─────────────────┘ └─────────────────┘ └────────────────────────┘
```

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | >= 22 | JavaScript runtime |
| pnpm | >= 10 | Package manager (monorepo) |
| Docker | >= 27 | Container runtime |
| Docker Compose | >= 2.30 | Service orchestration |
| Git | Latest | Version control |

**Check installed versions:**
```bash
node --version
pnpm --version
docker --version
docker compose --version
```

---

## Environment Setup

```bash
# Copy example environment
cp .env.example .env

# Edit .env with your configuration
# Minimum required:
# - DATABASE_URL
# - REDIS_URL
# - JWT_SECRET
# - At least one AI_API_KEY (OPENAI, ANTHROPIC, GOOGLE, or DEEPSEEK)
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `postgresql://nexora:[REDACTED]@localhost:5432/nexora` | PostgreSQL connection |
| `REDIS_URL` | Yes | `redis://localhost:6379` | Redis connection |
| `JWT_SECRET` | Yes | — | JWT signing secret (min 32 chars) |
| `OPENAI_API_KEY` | Conditional | — | OpenAI LLM provider |
| `ANTHROPIC_API_KEY` | Conditional | — | Anthropic LLM provider |
| `GOOGLE_AI_API_KEY` | Conditional | — | Google AI LLM provider |
| `DEEPSEEK_API_KEY` | Conditional | — | DeepSeek LLM provider |
| `PORT` | No | `3001` | Backend API port |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Allowed CORS origins |
| `NODE_ENV` | No | `development` | Environment (development, staging, production) |

---

## Development Commands

### Core Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all dev servers (frontend + backend) |
| `pnpm dev:web` | Start Vite frontend only (port 5173) |
| `pnpm dev:server` | Start NestJS backend only (port 3001) |
| `pnpm dev:desktop` | Start Electron app (uses dev servers) |
| `pnpm build` | Build all packages for production |
| `pnpm build:web` | Build frontend to `apps/web/dist/` |
| `pnpm build:server` | Build backend to `apps/server/dist/` |
| `pnpm lint` | Lint all packages (ESLint + TypeScript) |
| `pnpm format` | Format code with Prettier |
| `pnpm test` | Run all tests (Jest) |
| `pnpm --filter <package> <script>` | Run script in specific package |

### Database Commands

| Command | Description |
|---------|-------------|
| `pnpm --filter @nexora/database db:push` | Push Prisma schema to database |
| `pnpm --filter @nexora/database db:migrate` | Create and run migrations |
| `pnpm --filter @nexora/database db:studio` | Open Prisma Studio (GUI at localhost:5555) |
| `pnpm --filter @nexora/database db:seed` | Seed database with demo data |
| `pnpm --filter @nexora/database db:generate` | Generate Prisma client |

### Docker Commands

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start services (PostgreSQL, Redis) |
| `docker compose down` | Stop all services |
| `docker compose logs -f` | View live logs |
| `docker compose ps` | Show running containers |
| `docker compose build` | Rebuild images |

### Makefile Shortcuts (Optional)

```bash
make dev              # pnpm dev
make build            # pnpm build
make test             # pnpm test
make lint             # pnpm lint
make db-push          # pnpm --filter @nexora/database db:push
make db-studio        # pnpm --filter @nexora/database db:studio
make docker-up        # docker compose up -d
make docker-down      # docker compose down
make docker-logs      # docker compose logs -f
make clean            # rm -rf dist/ node_modules/
```

---

## Project Structure

```
NEXORA/
├── apps/
│   ├── web/                       # Vite React SPA (port 5173)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── screens/       # 45 pages
│   │   │   │   ├── components/    # 200+ reusable components
│   │   │   │   ├── layout.tsx     # Root layout
│   │   │   │   └── page.tsx       # Homepage
│   │   │   ├── hooks/             # React hooks
│   │   │   ├── styles/            # Global CSS + Tailwind
│   │   │   └── utils/             # Helper functions
│   │   ├── public/                # Static assets, logo
│   │   └── vite.config.ts
│   │
│   ├── server/                    # NestJS API (port 3001)
│   │   ├── src/
│   │   │   ├── app.module.ts      # Root module
│   │   │   ├── main.ts            # Entry point
│   │   │   └── modules/
│   │   │       ├── auth/          # Authentication
│   │   │       ├── brands/        # Brand CRUD + AI
│   │   │       ├── projects/      # Project management
│   │   │       ├── agents/        # AI agent orchestration
│   │   │       ├── ai/            # AI generation endpoints
│   │   │       ├── knowledge/     # Knowledge base
│   │   │       ├── security/      # Audit logs, compliance
│   │   │       ├── automation/    # Workflow automation
│   │   │       ├── collaboration/ # Chat, calendar
│   │   │       ├── analytics/     # Metrics & dashboards
│   │   │       ├── commerce/      # Billing, subscriptions
│   │   │       └── marketplace/   # Agent marketplace
│   │   └── Dockerfile
│   │
│   └── desktop/                   # Electron wrapper
│       ├── electron/              # Main & preload processes
│       ├── src/                   # Shared with web app
│       └── package.json           # electron-builder config
│
├── packages/
│   ├── shared/                    # Shared types & utils
│   ├── database/                  # Prisma ORM + schema
│   │   ├── prisma/
│   │   │   ├── schema.prisma      # 30+ tables
│   │   │   └── seed.ts            # Demo data
│   │   └── src/index.ts           # Exports prisma client
│   ├── ai-engine/                 # Multi-agent AI system
│   │   └── src/
│   │       ├── llm/               # 4 LLM providers
│   │       ├── agent/             # Agent runtime + skills
│   │       ├── rag/               # RAG pipeline
│   │       ├── prompt/            # Prompt engine
│   │       └── memory/            # Memory store
│   └── [analytics, automation, collaboration, etc.]
│
├── design-system/                 # Design tokens & components
├── docker-compose.yml             # Dev infrastructure
├── .env.example                   # Environment template
├── pnpm-workspace.yaml            # Monorepo config
├── tsconfig.json
├── package.json
├── Makefile                       # Development shortcuts
├── MASTER.md                      # Complete guide
├── DESIGN.md                      # Brand & UI/UX
├── GUIDELINES.md                  # Brand usage
├── DEPLOYMENT.md                  # Production deployment
├── MAINTENANCE.md                 # Operational procedures
├── SECURITY_POLICY.md             # Security practices
├── CONTRIBUTING.md                # Contribution guidelines
└── PLAN/                          # 12-book specification
```

---

## Modules & Status

| Module | Package | Status | Description |
|--------|---------|--------|-------------|
| Frontend | `@nexora/web` | ✅ Live | Vite React, 45 screens, 200+ components |
| Backend | `@nexora/server` | ✅ Live | NestJS API, Swagger docs, JWT auth |
| Database | `@nexora/database` | ✅ Live | Prisma ORM, PostgreSQL, 30+ tables |
| AI Engine | `@nexora/ai-engine` | 🚧 Testing | 4 LLM providers, multi-agent, RAG |
| Desktop | `@nexora/desktop` | 🆕 Beta | Electron wrapper, auto-updater |
| Analytics | `@nexora/analytics` | ✅ Live | Metrics engine, dashboards |
| Automation | `@nexora/automation` | ✅ Live | Workflow engine, templates |
| Collaboration | `@nexora/collaboration` | 🚧 Testing | Chat, calendar, real-time sync |
| Knowledge Base | `@nexora/knowledge` | 🚧 Testing | Document search, semantic indexing |
| Security | `@nexora/security` | ✅ Live | RBAC, audit logs, compliance |
| Marketplace | `@nexora/marketplace` | 🚧 Planning | Agent marketplace |
| Commerce | `@nexora/commerce` | 🚧 Planning | Stripe integration, subscriptions |

---

## API Documentation

Once backend is running, browse:

- **Swagger UI**: http://localhost:3001/api/docs
- **OpenAPI Spec**: http://localhost:3001/api/docs-json
- **GraphQL Playground**: http://localhost:3001/graphql (future)

### Example API Calls

```bash
# Register new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@nexora.ai","password":"password123"}'
# Response: { "accessToken": "eyJ...", "user": {...} }

# Get brands (requires JWT token)
curl -X GET http://localhost:3001/api/brands \
  -H "Authorization: Bearer eyJ..."

# Create brand
curl -X POST http://localhost:3001/api/brands \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{"name":"My Brand","industry":"Tech","targetAudience":"Startups"}'
```

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 18.x |
| | Vite | 6.x |
| | Tailwind CSS | 4.x |
| | TypeScript | 5.x |
| **Backend** | NestJS | 11.x |
| | Express | 4.x |
| | TypeScript | 5.x |
| **Database** | PostgreSQL | 16 |
| | Prisma ORM | 6.x |
| | pgvector | Latest |
| **Cache/Queue** | Redis | 7.x |
| | Bull | 5.x |
| **Desktop** | Electron | 34.x |
| **AI/ML** | OpenAI | Latest |
| | Anthropic | Latest |
| | Google AI | Latest |
| | DeepSeek | Latest |
| **UI Components** | shadcn/ui | Latest |
| | Material-UI | v7 |
| **Charts** | Recharts | 2.x |
| **Animation** | Framer Motion | Latest |
| **Testing** | Jest | 29.x |
| **Build Tools** | pnpm | 10.x |
| **Container** | Docker | 27.x |

---

## PLAN Specification (12 Books)

This project is built on a comprehensive 12-book design specification:

| Book | Status | Volumes | Focus |
|------|--------|---------|-------|
| 1 | ✅ | 1-15 | Product Vision & Design |
| 2 | ✅ | 16-25 | Engineering Architecture |
| 3 | ✅ | 26-30 | AI & MCP Architecture |
| 4 | ✅ | 31-35 | Development Specifications |
| 5 | ✅ | 36-50 | Platform Modules & Apps |
| 6 | ✅ | 51-60 | Technical Architecture |
| 7 | ✅ | 61-70 | Enterprise Implementation |
| 8 | ✅ | 71-80 | Intelligence & Autonomous |
| 9 | 🚧 | 81-90 | Engineering Specs (CQRS, Events) |
| 10 | 🚧 | 91-100 | UI/UX Specs (3D, Accessibility) |
| 11 | 🚧 | 101-120 | Production Implementation |
| 12 | 🚧 | 121-128 | Enterprise Source Code |

See `PLAN/` directory for full specifications.

---

## Documentation Files

- **[MASTER.md](./MASTER.md)** — Complete implementation guide
- **[DESIGN.md](./DESIGN.md)** — Brand identity & UI/UX design system
- **[GUIDELINES.md](./GUIDELINES.md)** — Brand usage guidelines
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** — Production deployment guide
- **[MAINTENANCE.md](./MAINTENANCE.md)** — Operational procedures
- **[SECURITY_POLICY.md](./SECURITY_POLICY.md)** — Security & compliance
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — How to contribute

---

## Troubleshooting

### Port Already in Use

```bash
# Find process on port
lsof -i :5173   # Frontend
lsof -i :3001   # Backend
lsof -i :5432   # PostgreSQL
lsof -i :6379   # Redis

# Kill process
kill -9 <PID>
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# If not, start it
docker compose up -d postgres

# Check connection string in .env
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT version();"
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Regenerate Prisma client
pnpm --filter @nexora/database db:generate

# Rebuild all packages
pnpm build
```

### Seed Failed

```bash
# Reset database completely
docker compose down -v
docker compose up -d

# Re-run migrations
pnpm --filter @nexora/database db:push

# Re-seed
pnpm --filter @nexora/database db:seed
```

---

## Version History

| Date | Version | Status | Changes |
|------|---------|--------|---------|
| 2026-06-27 | 0.3.0 | 🚧 Current | Added test credentials, comprehensive README |
| 2026-06-26 | 0.2.0 | ✅ | Database connectivity fixed, full documentation |
| 2026-06-26 | 0.1.1 | ✅ | Electron desktop, DEPLOYMENT.md |
| 2026-06-25 | 0.1.0 | ✅ | Initial UI prototype from Figma |

---

## Getting Help

- **Questions**: Check [MASTER.md](./MASTER.md) or [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Bugs**: Open GitHub issue with reproducible example
- **Security**: Email security@nexora.ai (don't open public issue)
- **Features**: See [PLAN/](./PLAN/) specification

---

## License

[Add your license here - MIT, Apache 2.0, etc.]

---

## Contributors

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to contribute.

**Last Updated**: June 27, 2026 | **Version**: 0.3.0 | **Status**: 🚧 Active Development
