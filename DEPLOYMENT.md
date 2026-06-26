# NEXORA — Deployment Guide

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | >= 22 | Runtime |
| pnpm | >= 10 | Package manager |
| Docker | >= 27 | Containerisation |
| Docker Compose | >= 2.30 | Local services orchestration |
| PostgreSQL | 16 (via Docker) | Primary database |
| Redis | 7 (via Docker) | Caching / session store |

## Development Setup

### 1. Environment Variables

```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `postgresql://nexora:nexora_dev@localhost:5432/nexora` | PostgreSQL connection string |
| `REDIS_URL` | Yes | `redis://localhost:6379` | Redis connection string |
| `JWT_SECRET` | Yes | — | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | No | `7d` | JWT expiration duration |
| `OPENAI_API_KEY` | Conditional | — | Required for OpenAI LLM provider |
| `ANTHROPIC_API_KEY` | Conditional | — | Required for Anthropic LLM provider |
| `GOOGLE_AI_API_KEY` | Conditional | — | Required for Google AI LLM provider |
| `DEEPSEEK_API_KEY` | Conditional | — | Required for DeepSeek LLM provider |
| `PORT` | No | `3001` | Backend API port |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Allowed CORS origin |
| `NODE_ENV` | No | `development` | Runtime environment |

### 2. Start Infrastructure

```bash
docker compose up -d    # Starts PostgreSQL + Redis
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Database Setup

```bash
# Push schema to database (dev quickstart)
pnpm --filter @nexora/database db:push

# Or use migrations (recommended for staging/production)
pnpm --filter @nexora/database db:migrate

# Seed demo data
pnpm --filter @nexora/database db:seed
```

### 5. Start Development Servers

```bash
pnpm dev                # All packages in parallel
pnpm dev:web            # Vite frontend only (port 5173)
pnpm dev:server         # NestJS backend only (port 3001)
```

## Building for Production

```bash
# Build all packages
pnpm build

# Or build individually
pnpm build:web          # Vite → dist/
pnpm build:server       # NestJS → dist/
```

## Docker Deployment

### Build Images

```bash
docker compose build
```

### Run Stack

```bash
docker compose up -d
```

The API is exposed on `http://localhost:3001`. The frontend should be served via a reverse proxy (see nginx example below).

### Production Docker Compose

For production, use the `docker-compose.prod.yml` overlay (create if needed):

```yaml
version: '3.8'
services:
  api:
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./apps/web/dist:/usr/share/nginx/html:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - api
```

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  Vite React   │  │ Electron     │  │  Mobile (Future)      │  │
│  │  (Web App)    │  │ (Desktop)    │  │  (React Native)       │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬────────────┘  │
└─────────┼─────────────────┼──────────────────────┼──────────────┘
          │        HTTP/REST │        WebSocket    │
          ▼                  ▼                      ▼
┌──────────────────────────────────────────────────────────────────┐
│                     Reverse Proxy (nginx)                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  /api/* → backend:3001   /ws/* → backend:3001   /* → SPA  │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Backend (NestJS)                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐ │
│  │ REST API │  │ GraphQL  │  │WebSocket │  │  Auth / RBAC    │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐ │
│  │ AI Engine│  │  Agent   │  │Analytics │  │  Billing        │ │
│  │ (LLM GW) │  │ Runtime  │  │ Engine   │  │  (Stripe)       │ │
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

## CI/CD Pipeline

### GitHub Actions (`.github/workflows/ci.yml`)

```yaml
name: CI/CD
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'pnpm' }
      - run: pnpm install
      - run: pnpm lint

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: pgvector/pgvector:pg16
        env:
          POSTGRES_DB: nexora_test
          POSTGRES_USER: nexora
          POSTGRES_PASSWORD: nexora_test
        ports: ['5432:5432']
      redis:
        image: redis:7-alpine
        ports: ['6379:6379']
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'pnpm' }
      - run: pnpm install
      - run: pnpm test

  build:
    if: github.ref == 'refs/heads/main'
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install && pnpm build
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - run: docker compose build
      - run: docker compose push
```

## Monitoring

| Tool | Purpose | Setup |
|------|---------|-------|
| Sentry | Error tracking | `SENTRY_DSN` env var |
| Grafana | Metrics dashboard | Deploy via docker-compose extension |
| Prometheus | Metrics collection | Scrape `/metrics` endpoint |
| Loki | Log aggregation | Docker logging driver |
| Uptime Kuma | Uptime monitoring | External service |

### Logging

```bash
# View container logs
docker compose logs -f api

# Tail application logs
pnpm --filter @nexora/server logs
```

## Backup Strategy

| Asset | Frequency | Retention | Tool |
|-------|-----------|-----------|------|
| PostgreSQL | Every 6h | 30 days | `pg_dump` + R2 cold storage |
| Uploads | Daily | 90 days | rclone sync to R2 |
| Redis | Snapshot every 5min | 7 days | RDB persistence in volume |

### Backup Commands

```bash
# Database backup
docker exec nexora-postgres pg_dump -U nexora nexora > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
cat backup.sql | docker exec -i nexora-postgres psql -U nexora nexora
```

## Scaling Guide

### Vertical Scaling

| Component | Scale‑up Path |
|-----------|---------------|
| API Server | Increase `NODE_OPTIONS=--max-old-space-size=4096`, add CPU/memory |
| PostgreSQL | Increase instance size, enable `pgvector` indexing |
| Redis | Increase memory, enable cluster mode |

### Horizontal Scaling

```bash
# Run multiple API instances behind nginx load balancer
docker compose up -d --scale api=3
```

| Component | Strategy |
|-----------|----------|
| API | Stateless (session in Redis), scale to N instances |
| AI Engine | Queue-based processing via Bull + Redis |
| WebSocket | Redis adapter for horizontal pub/sub |
| Database | Read replicas for analytics queries |

### Performance Tuning

- Enable `pgvector` HNSW indexes for similarity search
- Configure Redis `maxmemory-policy allkeys-lru`
- Use CDN (Cloudflare) for static asset delivery
- Implement API rate limiting via Redis sliding window

## Security Checklist

- [ ] JWT secret rotated and stored in secrets manager
- [ ] CORS restricted to known origins
- [ ] Rate limiting enabled on all public endpoints
- [ ] Helmet.js security headers configured
- [ ] Input validation (class-validator / zod)
- [ ] SQL injection protection (parameterised queries via Prisma)
- [ ] API keys stored server-side only
- [ ] HTTPS enforced in production
- [ ] Regular dependency audits (`pnpm audit`)
- [ ] Container images scanned for vulnerabilities
