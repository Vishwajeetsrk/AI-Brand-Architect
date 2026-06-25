# NEXORA — AI Brand Architect

> **Phase:** UI Prototype (Frontend Demo) — Planning for Full-Stack Production
>
> Part of the **Learnify AI** ecosystem (see PLAN/ for complete 12-book specification)

## Current Status

✅ **Built (Frontend Prototype):**
- 45+ lazy-loaded screens (auth, dashboard, brand studio, AI tools, analytics, settings, etc.)
- Code-split via `React.lazy()` + `Suspense` — main entry ~24 kB, vendors separated
- Dark theme (`bg-[#07081a]`), shadcn/ui component system, Radix UI primitives
- Shared component library (Btn, Card, Badge, Input, StatCard, Avatar, Toggle, PageHeader, EmptyPlaceholder)
- Layout system (Sidebar, TopBar, AppLayout, navConfig)
- Route definitions for all 45 screens in `App.tsx`
- Build passes cleanly (2679 modules, ~9s build time)

⚠️ **Pending (Production Layers — see PLAN Books 11 & 12):**

| Layer | Status | Reference Plan Volume |
|-------|--------|----------------------|
| UI Prototype (screens, routing, components) | ✅ 100% | V101 |
| Design System (design tokens, theme, responsive) | ✅ 80% | V123 |
| **Database** (PostgreSQL, Prisma, Redis, Vector DB, 600+ tables) | ❌ Not started | V102, V125 |
| **Authentication** (Better Auth, OAuth 2.1, Passkeys, MFA, RBAC, SSO) | ❌ Not started | V126 |
| **Backend API** (REST, GraphQL, WebSockets, MCP, 5000+ endpoints) | ❌ Not started | V103, V124 |
| **Backend Services** (NestJS microservices, business logic, workflows) | ❌ Not started | V105 |
| **AI Engine** (LLM Gateway, multi-provider, RAG, prompt engine, memory) | ❌ Not started | V106, V127 |
| **Multi-Agent Runtime** (AgentOS, brand agents, planning, collaboration) | ❌ Not started | V128 |
| **Analytics Platform** (BI, real-time dashboards, data warehouse) | ❌ Not started | V110 |
| **Knowledge Platform** (wiki, docs, semantic search, digital brain) | ❌ Not started | V109 |
| **Commerce/Billing** (subscriptions, payments, marketplace) | ❌ Not started | V117 |
| **DevSecOps** (CI/CD, Kubernetes, platform engineering) | ❌ Not started | V111 |
| **Security** (zero trust, IAM, AI security, privacy) | ❌ Not started | V112 |
| **Automation** (workflow engine, BPM, no-code builder) | ❌ Not started | V108 |
| **CRM & Marketing** (sales automation, support, growth) | ❌ Not started | V119 |
| **Desktop** (Electron, Windows, macOS, Linux) | ❌ Not started | V114 |
| **Mobile** (Android, iOS, offline, push notifications) | ❌ Not started | V113 (Book 11) |
| **Enterprise** (orgs, teams, audit, compliance) | ❌ Not started | V118, V119, V120 |

## Quick Start

```bash
npm install
npm run dev      # Vite dev server
npm run build    # Production build
```

## Tech Stack (Current)

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build | Vite 6 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Library | shadcn/ui (Radix UI primitives) |
| Animation | Motion (Framer Motion) |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router 7 |
| Icons (MUI) | MUI Icons v7 |

## Project Structure

```
NEXORA/
├── src/
│   ├── App.tsx                  # Root with React.lazy routes (45 screens)
│   ├── main.tsx                 # Entry point
│   ├── types.ts                 # Screen/NavItem type definitions
│   ├── components/
│   │   └── shared/              # 9 shared components (Btn, Card, etc.)
│   ├── layout/                  # Sidebar, TopBar, AppLayout, navConfig
│   ├── screens/                 # 45 screen components (all default exports)
│   │   ├── DashboardPage.tsx
│   │   ├── BrandStudioPage.tsx
│   │   ├── AIAgentsPage.tsx
│   │   └── ... (42 more)
│   └── styles/                  # Theme, fonts, gradients
├── dist/                        # Build output
└── PLAN/                        # Complete 12-book specification (parent dir)
```

## Screens (45 total)

- **Auth:** SignIn, SignUp, Forgot, Verify, Onboarding
- **Dashboard:** Dashboard, Analytics, MissionControl, Notifications, Activity
- **Brand:** BrandStudio, BrandGuidelines, LogoMaker, Templates
- **AI Tools:** AIAgents, AIImage, WebsiteBuilder, EmailBuilder, SocialMedia, Marketing, UIUX, Presentation, FormBuilder, Workflow
- **Content:** CMSDashboard, KnowledgeHub, Assets, Docs
- **Commerce:** Billing, Team, Integrations, APIKeys
- **Utility:** Settings, Profile, Projects, Export, Help, Changelog, Legal, NotFound, Maintenance
- **Landing:** LandingPage, GenericToolPage, AuthCard, MCPToolsPage

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
