# NEXORA — AI Brand Architect

> **Phase:** pnpm Monorepo — Frontend (Vite React) + Backend (NestJS) + Shared Packages
>
> Part of the **Learnify AI** ecosystem (see PLAN/ for complete 12-book specification)

## Project Structure (Monorepo)

```
NEXORA/
├── apps/
│   ├── web/                     # Vite React frontend (existing UI prototype)
│   │   ├── src/                 # App source (App.tsx, main.tsx, screens/, components/, etc.)
│   │   ├── public/              # Static assets
│   │   ├── index.html
│   │   └── vite.config.ts
│   └── server/                  # NestJS backend (in progress)
│       └── src/
├── packages/
│   ├── shared/                  # Shared TypeScript types, constants, utils
│   │   └── src/
│   │       ├── index.ts
│   │       └── types.ts         # User, Brand, Project, Asset, AI interfaces
│   └── database/                # Prisma schema + client
│       └── src/
├── package.json                 # Workspace root
├── pnpm-workspace.yaml
└── tsconfig.json                # Root TS config
```

## Quick Start

```bash
pnpm install
pnpm dev           # Start all packages in parallel
pnpm dev:web       # Vite dev server only
pnpm dev:server    # NestJS dev server only
pnpm build         # Build all packages
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 6, TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui |
| Backend | NestJS 11 (in progress) |
| Database | PostgreSQL + Prisma (in progress) |
| Charts | Recharts |
| Icons | Lucide React, MUI Icons v7 |
| Routing | React Router 7 |

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
| **Book 11** | **➡️ In Progress** | **Production Implementation Library (Vol 101-120)** |
| **Book 12** | **➡️ In Progress** | **Enterprise Source Code & Dev Library (Vol 121-128)** |

## Next Implementation Steps

Priority order for production build-out (from Book 11 & 12 specs):

1. **Database Layer** (Vol 102/125) — PostgreSQL schema, Prisma models, Redis, pgvector
2. **Authentication** (Vol 126) — Better Auth, OAuth, Passkeys, RBAC, multi-tenant IAM
3. **Backend API** (Vol 103/124) — REST endpoints, GraphQL, WebSockets, OpenAPI
4. **AI Engine** (Vol 106/127) — LLM Gateway, RAG pipeline, prompt engine, memory system
5. **Multi-Agent Runtime** (Vol 128) — AgentOS, brand agents, planning engine, skills
6. **Remaining modules** — analytics, billing, enterprise, mobile, desktop

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-06-26 | 0.2.0 | Code-split 45 screens, shared components, layout refactor |
| 2026-06-25 | 0.1.0 | Initial UI prototype from Figma design |
