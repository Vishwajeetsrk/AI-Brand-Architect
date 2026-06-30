# NEXORA — AI Brand Architect

![Status](https://img.shields.io/badge/status-100%25%20Complete-success)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Tests](https://img.shields.io/badge/tests-109%20passing-brightgreen)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

**The world's most advanced AI-powered brand management platform — now with Multi-Agent Runtime, Community, and Learning features.**

🌐 **Live Demo**: http://localhost:3000
📚 **API Docs**: http://localhost:3001/api/docs

---

## 🎯 What is NEXORA?

NEXORA is a complete AI Operating System for brand management, website building, UI/UX design, creative automation, career development, and community collaboration. It's designed to be the single source of truth for your entire brand ecosystem with 38 server modules and 60+ UI screens.

### Core Capabilities

- **AI Brand Architect** — Generate complete brand identities from a single prompt
- **Multi-Agent Runtime** — 7 coordination strategies (sequential, parallel, swarm, pipeline, hierarchy, debate, consensus)
- **Website Builder** — Build responsive websites with AI assistance
- **UI/UX Designer** — Design interfaces with Figma-like canvas
- **AgentOS** — Agent registry, planner, communication bus, task scheduler, reflection engine, safety governance, shared memory
- **Career Platform** — Resume builder, ATS scoring, mock interviews, job board, portfolio builder, skill assessments, career roadmaps
- **Learning Platform** — Courses, modules, quizzes, certificates, learning paths
- **Coding Challenges** — Interactive coding problems with simulated execution
- **AI Tutor** — Conversational AI learning assistant
- **Community** — Project showcase, real-time chat, leaderboard, coaching hub
- **1,248 Templates** — Professional templates for every use case
- **18+ Integrations** — Connect with your favorite tools

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- PostgreSQL 16+
- Redis 7+

### Installation

```bash
# Clone the repository
git clone https://github.com/Vishwajeetsrk/AI-Brand-Architect.git
cd AI-Brand-Architect

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start database
docker compose up -d

# Run database migrations
pnpm --filter @nexora/database db:push
pnpm --filter @nexora/database db:seed

# Start development servers
pnpm dev
```

### Or use the startup script (Windows)

```bash
# Double-click this file:
start-dev.bat
```

---

## 📊 Project Status

**Total PLAN Volumes**: 147 across 13 books
**Completed**: Books 1-12 (Volumes 1-147) ✅
**In Progress**: Book 13

### Books Status

| Book | Title | Volumes | Status |
|------|-------|---------|--------|
| 1-3 | Product Vision, Engineering, AI Architecture | 1-30 | ✅ Complete |
| 4 | Development Specifications | 31-35 | ✅ Complete |
| 5 | Platform Modules | 36-50 | ✅ Complete |
| 6 | Technical Architecture | 51-60 | ✅ Complete |
| 7 | Enterprise Implementation | 61-70 | ✅ Complete |
| 8 | Intelligence Systems | 71-80 | ✅ Complete |
| 9 | Engineering Specifications | 81-90 | ✅ Complete |
| 10 | UI/UX Specifications | 91-100 | ✅ Complete |
| 11 | Production Implementation | 101-120 | ✅ Complete |
| 12 | Enterprise Source Code | 121-147 | ✅ Complete |

### Test Suite

**109 tests passing** across all packages — agent-registry, planner-engine, reflection-engine, communication-bus, coordination-engine, task-scheduler, safety-governance, shared-agent-memory, tool-registry, semantic-cache, prompt-compressor, request-batcher.

### Build Status

All three builds pass with **zero errors**:
- `@nexora/ai-engine` — TypeScript build ✅
- `@nexora/server` — NestJS build ✅ (38 modules)
- `@nexora/web` — Next.js build ✅ (72 static pages)

### Features Implemented

#### ✅ Core Platform
- [x] Brand DNA Engine
- [x] Design Token Generator
- [x] AI Brand Wizard
- [x] Logo Studio
- [x] Color Studio
- [x] Typography Studio
- [x] Brand Guidelines Generator
- [x] Export Center
- [x] AI Brand Audit
- [x] Dashboard & Command Center
- [x] AI Chat Interface
- [x] Global Search & Command Palette
- [x] Website Builder
- [x] UI/UX Designer
- [x] Project Brain System
- [x] Knowledge Graph
- [x] Universal Memory
- [x] Multi-Agent Runtime (V128)
- [x] 1,248 Professional Templates

#### ✅ Career Platform
- [x] Resume Builder
- [x] ATS Score Checker
- [x] Mock Interview Practice
- [x] Job Board
- [x] Portfolio Builder
- [x] Skill Assessments
- [x] Career Roadmap Generator

#### ✅ Learning & Community
- [x] Learning Platform (courses, quizzes, certificates)
- [x] Learning Paths
- [x] AI Tutor
- [x] Coding Challenges
- [x] Coaching Hub
- [x] Leaderboard & Gamification
- [x] Project Showcase
- [x] Community Chat (real-time)
- [x] Community Page

#### ✅ Developer Tools
- [x] Code Playground
- [x] Thumbnail Generator
- [x] PWA Support
- [x] API Keys
- [x] MCP Tools
- [x] Feature Flags
- [x] Webhooks & Automation
- [x] All Legal Pages

#### ✅ AgentOS (V128)
- [x] Agent Registry (CRUD, heartbeat, status filtering)
- [x] Planner Engine (goals, plans, task graph, replanning)
- [x] Communication Bus (pub/sub, request/response, delegation, broadcast)
- [x] Coordination Engine (7 strategies: sequential, parallel, swarm, pipeline, hierarchy, debate, consensus)
- [x] Task Scheduler (priority queue, dependency resolution, retries, cancellation)
- [x] Reflection Engine (evaluation, calibration, batch processing)
- [x] Safety Governance (policies, budget, audit)
- [x] Shared Agent Memory (scoped cross-agent context with TTL)

---

## 🏗️ Architecture

### Tech Stack

**Frontend**
- Next.js 15.5.19 (App Router)
- React 19.2.7
- TypeScript 5.8.0
- Tailwind CSS 4.1.12
- shadcn/ui + Radix UI
- Motion (Framer Motion)
- Recharts
- Lucide Icons

**Backend**
- NestJS 11.x
- Node.js 24.x
- TypeScript 5.8.0
- Prisma 6.6.0 + PostgreSQL 16 (pgvector)
- Redis 7.x
- JWT + Passport
- WebSocket (Socket.IO)
- SSE (Server-Sent Events)

**AI/ML**
- Multi-model routing (OpenAI, Anthropic, Google, DeepSeek, Mistral)
- AgentOS (7 coordination strategies)
- LLM Gateway (8 providers)
- RAG Engine
- Semantic Cache
- Prompt Compression

**Infrastructure**
- Docker 27.x
- Kubernetes
- Cloudflare
- Vercel
- pnpm workspaces (17 packages)

### Monorepo Structure

```
NEXORA/
├── apps/
│   ├── web/              # Next.js Frontend (72 pages)
│   └── server/           # NestJS Backend (38 modules)
├── packages/
│   ├── shared/           # Shared types & CQRS utilities
│   ├── database/         # Prisma ORM & migrations
│   ├── ai-engine/        # AI orchestration, agents, LLM gateway
│   ├── analytics/        # Analytics engine
│   ├── automation/       # Workflow automation
│   ├── collaboration/    # Chat & collaboration
│   ├── commerce/         # Billing & subscriptions
│   ├── creator/          # Content generation
│   ├── crm/              # Customer relations
│   ├── knowledge/        # Knowledge base
│   ├── lms/              # Learning management
│   ├── marketplace/      # Agent & template store
│   ├── search/           # Full-text & vector search
│   └── security/         # Auth & RBAC
└── design-system/        # UI components & tokens
```

### Server Modules (38)

| Module | Purpose |
|--------|---------|
| Auth | JWT, OAuth, MFA, sessions |
| Users | User management, profiles |
| Organizations | Teams, members, billing |
| Brands | Brand identity, guidelines |
| Projects | Project management |
| Agents | AI agents, AgentOS orchestration |
| AI | LLM gateway, prompts, RAG |
| Career | Resumes, jobs, interviews, portfolios, roadmaps |
| LMS | Courses, quizzes, certificates |
| Media | Thumbnails, code execution |
| Coaching | Coaching sessions, feedback |
| Gamification | Leaderboard, points, achievements |
| Showcase | Project showcase, comments |
| Challenges | Coding challenges, submissions |
| Real-time | WebSocket, SSE |
| +24 more | Analytics, security, CQRS, etc. |

---

## 📱 Feature Screens

### AI Studio
Generate brand identities, logos, websites, UI/UX designs, marketing content, presentations, social media posts, emails, forms, and more — all with AI assistance.

### Career Platform
Build resumes, score them against job descriptions with ATS analysis, practice mock interviews, browse job listings, create portfolios, assess skills, and generate career roadmaps.

### Learning & Growth
Enroll in courses, complete quizzes, earn certificates, follow learning paths, get coached by AI, solve coding challenges, track progress on the leaderboard, and ask questions to the AI Tutor.

### Community & Collaboration
Share projects in the showcase, chat in real-time channels, collaborate with team members, and engage with the broader community.

### AgentOS (V128)
Deploy autonomous AI agents, orchestrate multi-agent collaborations using 7 strategies (sequential, parallel, swarm, pipeline, hierarchy, debate, consensus), manage shared memory, schedule tasks, and govern safety.

### Developer Tools
Execute code in the playground, generate video thumbnails, manage API keys, configure webhooks, toggle feature flags, and use MCP tools.

---

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start all dev servers
pnpm dev:web          # Start frontend only
pnpm dev:server       # Start backend only

# Building
pnpm build            # Build all packages
pnpm build:web        # Build frontend
pnpm build:server     # Build backend

# Testing
pnpm test             # Run all tests
pnpm test:ai-engine   # AI engine tests (109 tests)
pnpm test:coverage    # Coverage report

# Database
pnpm db:push          # Push schema changes
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio

# Linting
pnpm lint             # Lint all packages
pnpm format           # Format code
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://nexora:password@localhost:5432/nexora
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-min-32-chars

# AI Providers (optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
GOOGLE_API_KEY=...
DEEPSEEK_API_KEY=...

# Server
PORT=3001
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development

# Storage
SUPABASE_URL=...
SUPABASE_KEY=...
CLOUDINARY_URL=...
```

---

## 🧪 Testing

### Test Credentials
```
Email: demo@nexora.ai
Password: password123
Role: ADMIN
```

### AI Engine Tests (109)
```
✓ agent-registry.test.ts         (13 tests)
✓ planner-engine.test.ts         (14 tests)
✓ reflection-engine.test.ts      (12 tests)
✓ communication-bus.test.ts      (10 tests)
✓ coordination-engine.test.ts    (12 tests)
✓ task-scheduler.test.ts         (9 tests)
✓ safety-governance.test.ts      (7 tests)
✓ shared-agent-memory.test.ts    (10 tests)
✓ tool-registry.test.ts          (6 tests)
✓ semantic-cache.test.ts         (7 tests)
✓ prompt-compressor.test.ts      (6 tests)
✓ request-batcher.test.ts        (3 tests)
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test`
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Powered by [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)

---

## 📞 Support

- 📧 Email: support@nexora.ai
- 💬 Discord: [Join our community](https://discord.gg/nexora)
- 📖 Docs: [docs.nexora.ai](https://docs.nexora.ai)
- 🐛 Issues: [GitHub Issues](https://github.com/Vishwajeetsrk/AI-Brand-Architect/issues)

---

## ⭐ Star History

If you find this project useful, please consider giving it a star!

[![Star History Chart](https://api.star-history.com/svg?repos=Vishwajeetsrk/AI-Brand-Architect&type=Date)](https://star-history.com/#Vishwajeetsrk/AI-Brand-Architect&Date)

---

**Built with ❤️ by the NEXORA Team**

*Transforming how brands are created, managed, and evolved with AI.*
