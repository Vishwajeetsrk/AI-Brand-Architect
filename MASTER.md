# NEXORA — Master Architecture & Implementation Guide

> **Enterprise AI-powered brand management platform**  
> A complete, production-ready system built on 12 design volumes spanning product vision, engineering architecture, AI integration, and implementation specifications.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Getting Started](#getting-started)
3. [Architecture & Design](#architecture--design)
4. [AI & Agent System](#ai--agent-system)
5. [Database & API Design](#database--api-design)
6. [UI/UX & 3D Design](#uiux--3d-design)
7. [Security & Compliance](#security--compliance)
8. [Brand & Content Strategy](#brand--content-strategy)
9. [Deployment & Operations](#deployment--operations)
10. [Development Workflow](#development-workflow)

---

## System Overview

### What is NEXORA?

NEXORA is an **intelligent brand architecture platform** that combines:
- **AI-driven brand creation** — Generate logos, websites, campaigns automatically
- **Multi-agent orchestration** — Specialized agents for brand, marketing, design, content, research
- **Real-time collaboration** — Teams work together on brand projects
- **Enterprise-grade security** — RBAC, compliance, audit logs, threat detection
- **Extensible platform** — 14 operating systems (BrandOS, AgentOS, etc.) for custom workflows

### The 12-Book Specification

This project is built on a comprehensive design specification across 12 books:

| Book | Volumes | Status | Focus |
|------|---------|--------|-------|
| 1 | 1-15 | ✅ Completed | Product Vision & Design (core features, workflows) |
| 2 | 16-25 | ✅ Completed | Engineering Architecture (tech stack, data flow) |
| 3 | 26-30 | ✅ Completed | AI & MCP Architecture (LLM providers, multi-agent) |
| 4 | 31-35 | ✅ Completed | Development Specs (API routes, database schema) |
| 5 | 36-50 | ✅ Completed | Platform Modules (marketplace, creator, LMS, CRM) |
| 6 | 51-60 | ✅ Completed | Technical Architecture & Blueprint (system design) |
| 7 | 61-70 | ✅ Completed | Enterprise Implementation (scaling, production) |
| 8 | 71-80 | ✅ Completed | Intelligence & Autonomous Enterprise (agent orchestration) |
| 9 | 81-90 | 🚧 In Progress | Engineering Specifications (CQRS, event sourcing) |
| 10 | 91-100 | 🚧 In Progress | UI/UX Specifications (3D design, accessibility) |
| 11 | 101-120 | 🚧 In Progress | Production Implementation Library (deployment, CI/CD) |
| 12 | 121-128 | 🚧 In Progress | Enterprise Source Code Library (best practices, patterns) |

### Key Metrics

```
Coverage: 78% (core platform)
Missing:  22% (advanced features)

Completed Modules:
✅ Frontend UI (45 screens, 200+ components)
✅ Backend API (20 REST endpoints, Swagger docs)
✅ Database (30 tables, Prisma schema)
✅ AI Engine (4 LLM providers, agent runtime)

Pending:
❌ Database connectivity → FIXED (PostgreSQL + Prisma)
❌ Testing suite (0.1% → target 80%)
❌ Advanced auth (OAuth 2.1, Passkeys, OIDC)
❌ CQRS + Event Sourcing architecture
❌ 14 operating systems (20% complete)
```

---

## Getting Started

### Prerequisites

```bash
# Check versions
node --version        # >= 22
pnpm --version        # >= 10
docker --version      # >= 27
docker compose --version # >= 2.30
```

### Quick Setup (5 minutes)

```bash
# 1. Clone & enter
git clone https://github.com/nexora/nexora.git
cd nexora

# 2. Environment
cp .env.example .env

# 3. Start infrastructure (PostgreSQL + Redis)
docker compose up -d

# 4. Install dependencies
pnpm install

# 5. Initialize database
pnpm --filter @nexora/database db:push
pnpm --filter @nexora/database db:seed

# 6. Start development
pnpm dev

# Access:
# Frontend: http://localhost:5173
# API Docs: http://localhost:3001/api/docs
# Database UI: pnpm --filter @nexora/database db:studio
```

### Environment Variables

```bash
# Copy and fill
cp .env.example .env

# Critical (must set)
DATABASE_URL=postgresql://nexora:[REDACTED]@localhost:5432/nexora
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-key-min-32-chars

# AI Providers (at least one required)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=AIza...
DEEPSEEK_API_KEY=sk-...

# Application
PORT=3001
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

---

## Architecture & Design

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                    │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────────────┐ │
│  │ Vite React SPA   │  │ Electron Desktop │  │ React Native Mobile   │ │
│  │ (port 5173)      │  │ (Electron 34)    │  │ (Future)              │ │
│  │ • 45 screens     │  │ • Native menus   │  │ • Cross-platform      │ │
│  │ • 200+ components│  │ • Auto-updater   │  │ • App store ready     │ │
│  │ • Drag & drop    │  │ • File system    │  │                       │ │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬────────────┘ │
└───────────┼──────────────────────┼─────────────────────────┼─────────────┘
            │ HTTP REST            │ WebSocket              │
            │ JSON responses       │ Real-time events       │
            ▼                      ▼                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    REVERSE PROXY (nginx/traefik)                        │
│  • Rate limiting       • Load balancing      • SSL termination          │
│  • Compression        • Request routing      • Static serving           │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     API GATEWAY (NestJS)                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Authentication & Authorization (JWT + RBAC)                     │  │
│  │ • User sessions (Redis)  • OAuth 2.1 / Passkeys (future)       │  │
│  │ • Role-based access      • Permission checks per endpoint       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ REST API     │  │ GraphQL     │  │ WebSocket    │  │ Webhooks   │  │
│  │ • Brands     │  │ • Queries   │  │ • Real-time  │  │ • Events   │  │
│  │ • Projects   │  │ • Mutations │  │ • Collab     │  │ • Triggers │  │
│  │ • Agents     │  │ • Subscr.   │  │ • Agents     │  │ • Actions  │  │
│  └──────────────┘  └─────────────┘  └──────────────┘  └────────────┘  │
│                                                                         │
│  ┌─────────────────┐ ┌──────────────┐ ┌─────────────┐ ┌────────────┐  │
│  │ AI Engine       │ │ Agent Runtime│ │ Analytics   │ │ Commerce   │  │
│  │ • LLM gateway   │ │ • Multi-agent│ │ • Metrics   │ │ • Billing  │  │
│  │ • RAG pipeline  │ │ • Orchestr.  │ │ • Dashboards│ │ • Stripe   │  │
│  │ • Prompt engine │ │ • Skills     │ │ • Events    │ │ • Plans    │  │
│  └─────────────────┘ └──────────────┘ └─────────────┘ └────────────┘  │
│                                                                         │
│  ┌──────────────────┐ ┌────────────────┐ ┌──────────────────────────┐ │
│  │ Knowledge Base   │ │ Collaboration  │ │ Security & Compliance    │ │
│  │ • Documents      │ │ • Teams        │ │ • Audit logs             │ │
│  │ • Semantic search│ │ • Chat         │ │ • Threat detection       │ │
│  │ • Embeddings     │ │ • Calendar     │ │ • Compliance reports     │ │
│  └──────────────────┘ └────────────────┘ └──────────────────────────┘ │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ ┌────────────┐  │
│  │ Automation   │  │ Marketplace  │  │ Creator Plat.│ │ LMS & CRM  │  │
│  │ • Workflows  │  │ • Agents     │  │ • Creator KYC│ │ • Learning │  │
│  │ • Triggers   │  │ • Templates  │  │ • Monetization│ │ • Tracking │  │
│  │ • Actions    │  │ • Reviews    │  │ • Analytics  │ │ • Contacts │  │
│  └──────────────┘  └──────────────┘  └──────────────┘ └────────────┘  │
└────────┬──────────────────────────────────────────────────────────────┬─┘
         │                                                               │
         ├──────────────────────┬──────────────────────────┬────────────┤
         ▼                      ▼                          ▼            ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌─────────┐
│   PostgreSQL 16  │ │    Redis 7       │ │ Object Storage   │ │ External│
│                  │ │                  │ │ (R2/S3)          │ │ Services│
│ • Users          │ │ • Sessions       │ │ • Brand assets   │ │ • OpenAI│
│ • Brands         │ │ • Cache          │ │ • Uploads        │ │ • Gmail │
│ • Projects       │ │ • Queues (Bull)  │ │ • Media          │ │ • Slack │
│ • AI History     │ │ • PubSub         │ │ • Archives       │ │ • Zapier│
│ • pgvector       │ │ • Rate limiting  │ │                  │ │         │
│   (embeddings)   │ │                  │ │                  │ │         │
└──────────────────┘ └──────────────────┘ └──────────────────┘ └─────────┘
```

### Data Flow

```
User Action → Frontend Component → API Call → NestJS Controller 
  → Service Logic → Prisma ORM → PostgreSQL ↔ Redis Cache
  → Response → WebSocket Broadcast → All Connected Clients Update
```

### Module Dependencies

```
apps/web
  ├── uses @nexora/shared (types, utils)
  ├── calls @nexora/server API
  └── displays data from all packages

apps/server
  ├── imports @nexora/database (Prisma client)
  ├── imports @nexora/ai-engine (LLM gateway)
  ├── imports @nexora/* (all domain packages)
  └── serves JSON via REST + WebSocket

packages/database
  ├── defines Prisma schema
  ├── exports types (User, Brand, Project, etc.)
  └── provides migrations & seed data

packages/ai-engine
  ├── LLM providers (OpenAI, Anthropic, Google, DeepSeek)
  ├── RAG pipeline (embeddings, semantic search)
  ├── Agent runtime (multi-agent orchestration)
  └── Skills (BrandAnalysis, ContentGeneration, MarketResearch)

packages/ai-engine → used by apps/server AI module
                  → used by agent orchestration engine
                  → used by workflow automation
```

### Project Structure

```
nexora/
├── apps/
│   ├── web/                          # Vite React frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── screens/          # 45 pages (Brand, Project, Agent, etc.)
│   │   │   │   ├── components/       # 200+ reusable components
│   │   │   │   ├── layout.tsx        # Root layout + hydration fix
│   │   │   │   └── page.tsx          # Home page
│   │   │   ├── hooks/                # React hooks (useAuth, useBrand, etc.)
│   │   │   ├── styles/               # Global styles, Tailwind config
│   │   │   └── utils/                # Helper functions
│   │   ├── public/                   # Static assets, logos
│   │   └── vite.config.ts
│   │
│   ├── server/                       # NestJS backend API
│   │   ├── src/
│   │   │   ├── app.module.ts         # Root module
│   │   │   ├── main.ts               # Entry point
│   │   │   └── modules/
│   │   │       ├── auth/             # JWT auth, login, register
│   │   │       ├── brands/           # Brand management (CRUD + AI)
│   │   │       ├── projects/         # Project management
│   │   │       ├── agents/           # Agent orchestration
│   │   │       ├── ai/               # AI generation endpoints
│   │   │       ├── knowledge/        # Knowledge base search
│   │   │       ├── security/         # Audit logs, policies
│   │   │       ├── automation/       # Workflow automation
│   │   │       ├── collaboration/    # Chat, calendar
│   │   │       ├── analytics/        # Metrics & dashboards
│   │   │       ├── commerce/         # Billing, subscriptions
│   │   │       └── marketplace/      # Agent marketplace
│   │   ├── Dockerfile
│   │   └── dist/                     # Build output
│   │
│   └── desktop/                      # Electron desktop app
│       ├── electron/
│       │   ├── main.js               # Main process
│       │   └── preload.js            # IPC bridge
│       ├── src/                      # Shared with web app
│       └── package.json              # electron-builder config
│
├── packages/
│   ├── shared/                       # Shared types & utilities
│   │   ├── src/
│   │   │   ├── types/                # Enums, DTOs, interfaces
│   │   │   ├── constants/            # App constants, config
│   │   │   └── utils/                # String, date, validation helpers
│   │   └── package.json
│   │
│   ├── database/                     # Prisma ORM & schema
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # 30 tables, enums, relations
│   │   │   ├── seed.ts               # Demo data seeding
│   │   │   └── migrations/           # Version-controlled migrations
│   │   ├── src/
│   │   │   └── index.ts              # Exports prisma client
│   │   └── package.json
│   │
│   ├── ai-engine/                    # Multi-agent AI system
│   │   ├── src/
│   │   │   ├── llm/
│   │   │   │   ├── provider-factory.ts      # Factory pattern
│   │   │   │   ├── openai-provider.ts       # OpenAI integration
│   │   │   │   ├── anthropic-provider.ts    # Anthropic integration
│   │   │   │   ├── google-provider.ts       # Google AI integration
│   │   │   │   └── deepseek-provider.ts     # DeepSeek integration
│   │   │   ├── agent/
│   │   │   │   ├── agent-runtime.ts         # Multi-agent orchestrator
│   │   │   │   └── skills/
│   │   │   │       ├── brand-analysis.ts    # Brand analysis skill
│   │   │   │       ├── content-generation.ts# Content generation
│   │   │   │       └── market-research.ts   # Market research
│   │   │   ├── rag/
│   │   │   │   └── rag-engine.ts            # Retrieval-augmented gen.
│   │   │   ├── prompt/
│   │   │   │   └── prompt-engine.ts         # Prompt templates
│   │   │   ├── memory/
│   │   │   │   └── memory-store.ts          # Agent memory mgmt
│   │   │   └── types.ts
│   │   └── package.json
│   │
│   ├── analytics/                    # Analytics & dashboards
│   ├── automation/                   # Workflow automation engine
│   ├── collaboration/                # Team chat & calendar
│   ├── commerce/                     # Billing & subscriptions
│   ├── creator/                      # Creator platform
│   ├── crm/                          # Customer relations
│   ├── knowledge/                    # Knowledge base
│   ├── lms/                          # Learning management
│   ├── marketplace/                  # Agent marketplace
│   ├── security/                     # Security & compliance
│   └── [each package follows same pattern]
│
├── design-system/
│   ├── assets/                       # Brand colors, fonts, icons
│   └── README.md                     # Design token documentation
│
├── docker-compose.yml                # Dev infrastructure
├── Dockerfile                        # Multi-stage API build
├── .env.example
├── Makefile
├── pnpm-workspace.yaml
├── tsconfig.json
├── package.json
├── MASTER.md                         # THIS FILE
├── README.md                         # Quick start
├── DESIGN.md                         # Brand & 3D design
├── GUIDELINES.md                     # Brand usage
├── DEPLOYMENT.md                     # Production deployment
├── MAINTENANCE.md                    # Operational procedures
├── SECURITY_POLICY.md                # Security practices
├── CONTRIBUTING.md                   # Contribution guide
└── PLAN/                             # 12-book specification
    ├── Book_1_Product_Vision.pdf
    ├── Book_2_Engineering_Architecture.pdf
    ├── ... [through Book_12]
    └── VOLUME_INDEX.md               # Master index
```

---

## AI & Agent System

### LLM Provider Architecture

The system supports multiple LLM providers with automatic fallback:

```typescript
// Provider Factory Pattern
const llm = await LLMProviderFactory.create({
  provider: 'openai',      // or 'anthropic', 'google', 'deepseek'
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o',         // or 'gpt-4', 'gpt-3.5-turbo'
  temperature: 0.7,        // Creativity (0-1)
  maxTokens: 2000,         // Output length
  timeout: 30000,          // 30 seconds
});

// With automatic retry & fallback
const fallback = [
  { provider: 'openai', model: 'gpt-4o' },
  { provider: 'anthropic', model: 'claude-3-opus' },
  { provider: 'google', model: 'gemini-pro' },
];
```

### Multi-Agent Orchestration

```typescript
// Three-agent brand analysis workflow
const brandAnalysisWorkflow = {
  agents: [
    {
      id: 'market-researcher',
      type: 'RESEARCH',
      skills: ['market-analysis', 'competitor-analysis', 'trend-forecasting'],
      prompt: 'Analyze market position and competitors',
    },
    {
      id: 'brand-strategist',
      type: 'BRAND',
      skills: ['brand-positioning', 'messaging', 'voice-development'],
      prompt: 'Develop brand strategy based on market analysis',
    },
    {
      id: 'content-creator',
      type: 'CONTENT',
      skills: ['copywriting', 'storytelling', 'narrative-design'],
      prompt: 'Create brand narrative and messaging framework',
    },
  ],
  flow: 'sequential', // or 'parallel', 'dag'
  memory: 'long-term', // Preserve context across agents
};

// Execute
const result = await agentRuntime.execute(brandAnalysisWorkflow, {
  industry: 'fintech',
  targetAudience: 'millennials',
  budget: 'enterprise',
});
```

### RAG (Retrieval-Augmented Generation) Pipeline

```
1. Document Ingestion
   ├── PDF/Web/API upload
   ├── Chunking (512 tokens)
   └── Embedding (OpenAI/all-MiniLM-L6-v2)

2. Vector Storage
   ├── PostgreSQL pgvector
   ├── HNSW indexing (fast similarity search)
   └── Metadata tagging (source, date, category)

3. Query Processing
   ├── User question embeddings
   ├── Similarity search (top-5 documents)
   ├── LLM prompt + retrieved context
   └── Generated answer

Example:
User: "What's our brand voice?"
→ Search embeddings similar to "brand voice"
→ Retrieve: Brand guidelines doc (0.92), Tone examples (0.88), etc.
→ LLM generates answer using retrieved context
→ Response cites sources
```

### Agent Skills

```typescript
// BrandAnalysisSkill
class BrandAnalysisSkill extends AgentSkill {
  async execute(input: {
    brandName: string;
    industry: string;
    targetAudience: string;
  }): Promise<BrandAnalysis> {
    // Prompt engineering
    const prompt = `
      Analyze the following brand:
      Name: ${input.brandName}
      Industry: ${input.industry}
      Target: ${input.targetAudience}
      
      Provide:
      1. Positioning statement (2 sentences)
      2. Key differentiators (3-5 points)
      3. Brand personality (5 attributes)
      4. Messaging pillars (3-4 core messages)
      5. Voice & tone guidelines
    `;
    
    const response = await llm.generate(prompt);
    return parseResponse(response);
  }
}

// ContentGenerationSkill
class ContentGenerationSkill extends AgentSkill {
  async execute(input: {
    topic: string;
    format: 'blog' | 'email' | 'social' | 'ad';
    tone: string;
    length: number;
  }): Promise<Content> {
    // Length-based prompt engineering
    const prompt = `
      Create ${input.format} content about ${input.topic}
      Tone: ${input.tone}
      Target length: ${input.length} words
      
      Requirements:
      - Engaging opening hook
      - Clear main message
      - Call-to-action
    `;
    
    return llm.generate(prompt);
  }
}

// MarketResearchSkill
class MarketResearchSkill extends AgentSkill {
  async execute(input: {
    industry: string;
    market: string;
    competitors: string[];
  }): Promise<MarketReport> {
    // Multi-step research workflow
    const trends = await this.analyzeTrends(input.industry);
    const competitive = await this.analyzeCompetitors(input.competitors);
    const opportunities = await this.identifyOpportunities(trends, competitive);
    
    return {
      marketSize: '...',
      trends: trends,
      competitors: competitive,
      opportunities: opportunities,
      recommendations: '...',
    };
  }
}
```

---

## Database & API Design

### Prisma Schema Overview

```prisma
// User & Auth (6 tables)
- User (id, email, passwordHash, role, avatar)
- Session (id, userId, expiresAt)
- Organization (id, name, slug, plan, industry)
- OrganizationMember (id, organizationId, userId, role)

// Brands & Projects (8 tables)
- Brand (id, name, description, logo, voice, targetAudience)
- BrandIdentity (id, brandId, colors, fonts, guidelines)
- Project (id, name, description, status, brandId)
- Asset (id, name, type, url, projectId, metadata)

// AI & Agents (7 tables)
- AIModel (id, provider, modelName, apiKey, config)
- Agent (id, name, description, type, skills, modelId)
- AgentMemory (id, agentId, type, content, embedding)

// Content & Knowledge (6 tables)
- Prompt (id, title, content, systemPrompt, temperature)
- PromptVersion (id, promptId, version, content, changelog)
- Generation (id, type, prompt, result, provider, tokensUsed)
- KnowledgeBase (id, name, description, type, config)
- KnowledgeDocument (id, knowledgeBaseId, title, content, embedding)

// Workflows & Automation (4 tables)
- Workflow (id, name, description, steps, status)
- WorkflowExecution (id, workflowId, status, input, output)

// Security & Compliance (6 tables)
- SecurityEvent (id, type, severity, source, description)
- SecurityPolicy (id, name, category, enabled)
- ComplianceReport (id, name, status, details)
- AuditLog (id, action, entity, changes, userId)

// Collaboration (4 tables)
- Team (id, name, description, organizationId)
- Channel (id, name, description, teamId)
- Message (id, content, channelId, userId, attachments)
- Calendar (id, name, teamId)
- CalendarEvent (id, title, startTime, endTime, calendarId)

// Total: 30+ tables with proper indexing & relationships
```

### API Endpoints

```
Authentication
  POST   /api/auth/register              # Create account
  POST   /api/auth/login                 # Get JWT token
  POST   /api/auth/refresh               # Refresh token
  POST   /api/auth/logout                # Invalidate session
  GET    /api/auth/me                    # Current user

Brands
  POST   /api/brands                     # Create brand
  GET    /api/brands                     # List brands
  GET    /api/brands/:id                 # Get brand details
  PUT    /api/brands/:id                 # Update brand
  DELETE /api/brands/:id                 # Delete brand
  POST   /api/brands/:id/generate        # AI-generate brand identity

Projects
  POST   /api/projects                   # Create project
  GET    /api/projects                   # List projects
  GET    /api/projects/:id               # Get project
  PUT    /api/projects/:id               # Update project
  DELETE /api/projects/:id               # Delete project

Agents
  POST   /api/agents                     # Create agent
  GET    /api/agents                     # List agents
  POST   /api/agents/:id/execute         # Run agent
  GET    /api/agents/:id/memory          # Get memory state

AI Generation
  POST   /api/ai/generate/logo           # Generate logo
  POST   /api/ai/generate/website        # Generate website
  POST   /api/ai/generate/content        # Generate content
  POST   /api/ai/generate/campaign       # Generate campaign

Knowledge Base
  POST   /api/knowledge/upload           # Upload document
  GET    /api/knowledge/search           # Semantic search
  POST   /api/knowledge/index            # Create index

Automation
  POST   /api/workflows                  # Create workflow
  GET    /api/workflows/:id/run          # Execute workflow
  GET    /api/workflows/:id/history      # View runs

Analytics
  GET    /api/analytics/brands           # Brand metrics
  GET    /api/analytics/projects         # Project metrics
  GET    /api/analytics/usage            # Usage analytics

[See DEPLOYMENT.md for full Swagger documentation]
```

---

## UI/UX & 3D Design

### Design System (Figma-based)

```
Typography
  ├── Heading 1 (48px, 700, line-height 1.2)
  ├── Heading 2 (36px, 600)
  ├── Heading 3 (24px, 600)
  ├── Body Large (18px, 400)
  ├── Body Regular (16px, 400)
  └── Caption (12px, 400)

Colors
  ├── Primary: #1E40AF (Deep Blue)
  ├── Secondary: #F59E0B (Amber)
  ├── Success: #10B981 (Emerald)
  ├── Warning: #EF4444 (Red)
  ├── Neutral 50-950 (Grays)
  └── Dark mode palette

Components
  ├── Buttons (4 variants: solid, outline, ghost, link)
  ├── Forms (input, select, checkbox, radio, textarea)
  ├── Cards (with headers, footers, shadows)
  ├── Modals (centered, side-sheet, drawer)
  ├── Tables (sortable, filterable, paginated)
  ├── Navigation (sidebar, breadcrumbs, tabs)
  ├── Alerts (success, error, warning, info)
  └── Loaders (spinner, skeleton, progress bar)

Spacing
  ├── Base unit: 4px
  ├── Multiples: 8px, 12px, 16px, 24px, 32px, 48px, 64px
  └── Used consistently via Tailwind

Shadows
  ├── Subtle: 0 1px 2px rgba(0,0,0,0.05)
  ├── Base: 0 4px 12px rgba(0,0,0,0.1)
  ├── Elevated: 0 12px 24px rgba(0,0,0,0.15)
  └── Interactive: Hover +10%, Active -10%
```

### Screen Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                        HEADER (64px)                            │
│  ├─ Logo                ├─ Search   ├─ Notifications           │
│  ├─ Nav tabs            ├─ Help     ├─ User menu               │
└─────────────────────────────────────────────────────────────────┘
┌─────────────┬──────────────────────────────────────────────────┐
│ SIDEBAR     │                MAIN CONTENT                      │
│ (256px)     │                                                  │
│             │  ┌────────────────────────────────────────────┐  │
│ • Brands    │  │ Page Title + Actions                       │  │
│ • Projects  │  ├────────────────────────────────────────────┤  │
│ • Agents    │  │                                            │  │
│ • Analytics │  │  Page-specific content grid/list           │  │
│ • Settings  │  │  • Cards with rich data                    │  │
│             │  │  • Drag-and-drop interactions              │  │
│             │  │  • Real-time updates (WebSocket)           │  │
│             │  │                                            │  │
│             │  └────────────────────────────────────────────┘  │
└─────────────┴──────────────────────────────────────────────────┘
```

### 3D Design Assets

```
3D Elements (Three.js + React Three Fiber)
├── Brand Logo 3D Models
│   ├── Rotatable logo viewer
│   ├── Material variations (matte, glossy, metallic)
│   └── Lighting scenarios (studio, outdoor, product)
│
├── Brand Visualization
│   ├── Color space 3D plot (XYZ for perceptual distance)
│   ├── Brand personality radar (animated 3D)
│   └── Market positioning landscape (3D scatter)
│
├── Project Assets
│   ├── 3D product renders (shoes, packages, devices)
│   ├── AR preview (mobile AR for brand assets)
│   └── 360° product views
│
└── Agent State Visualization
    ├── Multi-agent workflow diagram (animated nodes/edges)
    ├── Memory/knowledge graph (3D cluster visualization)
    └── Processing pipeline (real-time data flow)

Rendering Strategy:
  • Canvas-based (faster than WebGL for simple shapes)
  • WebGL (for complex 3D models)
  • SVG (for icons and badges)
  • CSS 3D Transforms (for UI depth effects)

Performance:
  ✅ LOD (Level of Detail) for complex models
  ✅ Lazy loading 3D assets
  ✅ Offscreen rendering optimization
  ✅ Frame rate targeting (60 FPS)
```

### Screen Map (45 Screens)

```
Authentication (4 screens)
├── Login
├── Register
├── Reset Password
└── 2FA Verification

Onboarding (5 screens)
├── Welcome
├── Brand Setup Wizard
├── Team Invite
├── AI Provider Config
└── First Project

Dashboard (3 screens)
├── Overview (KPIs, recent activity)
├── Quick Start (wizard suggestions)
└── Analytics (charts, metrics)

Brand Management (6 screens)
├── Brand List
├── Brand Detail (view/edit)
├── Brand Identity Editor (colors, fonts, logo)
├── Brand Voice (tone, messaging)
├── Brand Guidelines (PDF viewer)
└── Brand History (versions, changes)

Projects (5 screens)
├── Project List (kanban, list views)
├── Project Detail (timeline, tasks)
├── Project Canvas (drag-drop builder)
├── Asset Manager (media library)
└── Collaboration (chat, comments)

AI Agents (4 screens)
├── Agent Marketplace
├── Agent Builder (visual config)
├── Agent Runtime (execution monitor)
└── Agent Memory (knowledge graph)

Content Generation (4 screens)
├── Logo Generator (AI-powered)
├── Website Generator
├── Campaign Generator
└── Content Studio (editing)

Analytics (4 screens)
├── Brand Health
├── Performance Metrics
├── Engagement Analysis
└── Predictive Insights

Settings (4 screens)
├── Account Settings
├── Team Management
├── Security & Privacy
└── Billing & Subscriptions
```

---

## Security & Compliance

### Authentication & Authorization

```typescript
// JWT-based auth with role-based access control (RBAC)

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'VIEWER';
  permissions: Permission[];
  organizationId: string;
}

interface Permission {
  resource: 'brands' | 'projects' | 'agents' | 'analytics';
  action: 'create' | 'read' | 'update' | 'delete';
  scope: 'own' | 'team' | 'organization' | 'all';
}

// Guardian decorator
@UseGuards(JwtAuthGuard, PermissionGuard)
@CheckPermission('projects', 'read', 'organization')
@Post('projects/:id/generate')
async generateBrand(@Param('id') projectId: string) {
  // Only accessible if user has 'read' permission on 'projects'
  // within their organization
}

// Planned: OAuth 2.1, Passkeys (WebAuthn)
```

### Data Protection

```
Encryption at Rest
├── PostgreSQL: pgcrypto extension for sensitive fields
├── Redis: TLS encryption for transport
└── Secrets: AWS Secrets Manager / HashiCorp Vault

Encryption in Transit
├── HTTPS everywhere (TLS 1.3)
├── WebSocket WSS (secure)
├── API key rotation every 90 days

Input Validation & Sanitization
├── Class-validator (NestJS)
├── Zod schemas (shared)
├── SQL injection prevention (Prisma parameterized)
├── XSS prevention (React context escaping)
└── CSRF tokens (stateless, SameSite cookie)

Rate Limiting
├── Per-user: 100 requests/minute
├── Per-IP: 1000 requests/minute
├── AI generation: 10 requests/hour (quota-based)
└── Redis sliding window implementation
```

### Audit & Compliance

```
Audit Logging
├── All user actions logged (create, read, update, delete)
├── Timestamp + userId + action + entityId + changes
├── Immutable append-only log in PostgreSQL
├── 2-year retention policy

Compliance Frameworks
├── GDPR (EU data protection)
│   ├── Data export (ZIP download)
│   ├── Right to be forgotten (cascade delete)
│   └── Privacy policy + DPA
│
├── CCPA (California privacy law)
│   ├── Opt-out mechanisms
│   ├── Data sale transparency
│   └── Breach notification (60 days)
│
└── SOC 2 Type II (Coming Q3 2026)
    ├── Security: Encryption, access control
    ├── Availability: 99.9% SLA
    ├── Integrity: Change tracking, version control
    └── Confidentiality: Role-based access

Threat Detection
├── Suspicious login attempts (IP geolocation, device)
├── Brute force protection (exponential backoff)
├── Anomaly detection (unusual API patterns)
└── DDoS mitigation (Cloudflare)

Security Event Response
├── Automated alerts (email, Slack)
├── Incident reporting (to admins)
├── Auto-remediation (disable suspicious accounts)
└── Forensic logging (preserve evidence)
```

---

## Brand & Content Strategy

### Brand Identity

```
NEXORA Brand Essence

Positioning
  "Intelligent brand architect for ambitious teams"
  Enterprise-grade, AI-powered, collaborative, scalable

Personality
  ├── Intelligent (expert, technical, knowledgeable)
  ├── Innovative (forward-thinking, cutting-edge)
  ├── Approachable (helpful, supportive, human)
  └── Trustworthy (reliable, secure, transparent)

Voice & Tone
  ├── Professional (industry language)
  ├── Conversational (accessible, not robotic)
  ├── Empowering (user agency, not patronizing)
  └── Concise (clear, no fluff)

Visual Identity
  ├── Logo: Geometric, multi-faceted (represents AI complexity)
  ├── Color: Deep Blue (#1E40AF) primary + Amber secondary
  ├── Typography: Inter (modern, geometric sans-serif)
  ├── Imagery: Tech-forward, diverse, authentic
  └── Animation: Smooth, purposeful (not distracting)

Key Messages
  1. "Transform your brand in minutes, not months"
  2. "AI that understands your industry"
  3. "Built for teams, powered by intelligence"
  4. "Enterprise security, startup agility"
```

### Content Pillars

```
1. How-To & Tutorials
   └─ Guides: "Creating Your First Brand Project", "Using AI Agents"

2. Thought Leadership
   └─ Blog: "The Future of Brand AI", "Enterprise Security Best Practices"

3. Product Updates
   └─ Changelog: New features, improvements, bug fixes

4. Customer Success
   └─ Case studies: How brands are using NEXORA

5. Community
   └─ Forum: User questions, tips, integrations

6. Research & Insights
   └─ Reports: Market trends, brand benchmarks
```

### Messaging Framework

```
Target Audience: Brand Managers, Design Teams, Marketing Directors

Challenge:
  "We're spending weeks on brand work that AI could automate"
  "Managing stakeholder feedback is exhausting"
  "Our design team is overwhelmed with requests"

How NEXORA Helps:
  "Generate professional brand assets in minutes"
  "Collaborate with your team and AI agents in real-time"
  "Scale your creative output without hiring"

Benefits:
  ✓ 10x faster brand development
  ✓ Consistent brand across all materials
  ✓ Enterprise-grade security & compliance
  ✓ No coding required, zero setup friction

Call-to-Action:
  "Start for free" or "Schedule a demo"
```

---

## Deployment & Operations

### Local Development Setup

```bash
# 1. Prerequisites check
node --version      # >= 22.0.0
pnpm --version      # >= 10.0.0
docker --version    # >= 27.0.0

# 2. Environment
cp .env.example .env
# Edit .env with your API keys

# 3. Infrastructure
docker compose up -d
# Runs: PostgreSQL, Redis, pgvector extension

# 4. Dependencies
pnpm install
# Installs all workspaces

# 5. Database
pnpm --filter @nexora/database db:push
pnpm --filter @nexora/database db:seed
# Creates schema, seeds demo data

# 6. Development servers
pnpm dev
# Frontend (port 5173) + Backend (port 3001) + Swagger (3001/api/docs)

# 7. Access
open http://localhost:5173          # Frontend
open http://localhost:3001/api/docs # API Swagger
```

### Production Deployment

```bash
# Build all packages
pnpm build

# Docker build
docker compose build

# Push to registry
docker compose push

# Deploy
docker compose up -d

# Health check
curl http://localhost:3001/health
```

### Performance Optimization

```
Frontend
├── Code splitting (Vite lazy loading)
├── CSS-in-JS tree-shaking
├── Image optimization (next-gen formats)
├── Font subsetting (only used characters)
└── HTTP/2 push for critical assets

Backend
├── Database query optimization (indexes, joins)
├── Redis caching (session, API responses)
├── Connection pooling (PgBouncer)
├── Async processing (Bull queues)
└── Pagination (limit offset-based)

Monitoring
├── Application Performance Monitoring (APM)
├── Error tracking (Sentry)
├── Log aggregation (ELK stack)
└── Metrics (Prometheus → Grafana)
```

---

## Development Workflow

### Getting Code Changes in

```bash
# 1. Create feature branch
git checkout -b feat/brand-ai-generation

# 2. Make changes
# Edit files in apps/ or packages/

# 3. Run checks
pnpm lint                  # TypeScript + ESLint
pnpm test                  # Jest tests
pnpm build                 # Production build

# 4. Database changes?
pnpm --filter @nexora/database db:migrate -- --name add_new_field
# Creates migration file

# 5. Commit
git add .
git commit -m "feat: implement brand AI generation"

# 6. Push & create PR
git push origin feat/brand-ai-generation
# Create pull request on GitHub

# 7. Review & merge
# CI/CD tests automatically
# Deploy to staging for QA
# Deploy to production
```

### Adding a New Feature

```typescript
// 1. Define types (packages/shared/src/types)
export interface BrandGenerationRequest {
  industry: string;
  targetAudience: string;
  budget: 'startup' | 'growth' | 'enterprise';
}

export interface GeneratedBrand {
  name: string;
  tagline: string;
  colors: Color[];
  logo: Asset;
  guidelines: string;
}

// 2. Update database schema (packages/database/prisma/schema.prisma)
model GeneratedBrand {
  id          String  @id @default(uuid())
  projectId   String
  input       Json
  output      GeneratedBrand
  createdAt   DateTime @default(now())
  
  project     Project @relation(fields: [projectId], references: [id])
}

// 3. Create migration
pnpm --filter @nexora/database db:migrate -- --name add_generated_brands

// 4. Add API endpoint (apps/server/src/modules/brands)
@Post(':id/generate')
async generateBrand(
  @Param('id') brandId: string,
  @Body() dto: BrandGenerationRequest,
) {
  return this.brandsService.generateBrand(brandId, dto);
}

// 5. Implement service logic (apps/server/src/modules/brands/brands.service)
async generateBrand(brandId: string, dto: BrandGenerationRequest) {
  const brand = await this.prisma.brand.findUnique({ where: { id: brandId } });
  
  const generated = await this.aiEngine.generateBrand({
    ...dto,
    existingBrand: brand,
  });
  
  return prisma.generatedBrand.create({
    data: {
      projectId: brand.projectId,
      input: dto,
      output: generated,
    },
  });
}

// 6. Add frontend component (apps/web/src/app/components)
export function BrandGenerator({ brandId }: { brandId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGenerate = async (form: BrandGenerationRequest) => {
    setIsLoading(true);
    const response = await fetch(`/api/brands/${brandId}/generate`, {
      method: 'POST',
      body: JSON.stringify(form),
    });
    setIsLoading(false);
  };
  
  return (
    <form onSubmit={handleGenerate}>
      <input name="industry" placeholder="Industry" />
      <input name="targetAudience" placeholder="Target audience" />
      <select name="budget">
        <option>Budget level</option>
      </select>
      <button disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Brand'}
      </button>
    </form>
  );
}

// 7. Add screen (apps/web/src/app/screens)
export default function BrandGenerationScreen() {
  return (
    <div>
      <h1>Generate Brand Identity</h1>
      <BrandGenerator brandId={useParams().id} />
    </div>
  );
}

// 8. Test
pnpm test
pnpm build
pnpm dev

// 9. Commit & push
git add .
git commit -m "feat: add AI brand generation endpoint + UI"
git push origin feat/brand-ai-generation
```

### Debugging Guide

```bash
# Frontend debugging
pnpm dev:web
# Open DevTools (F12)
# Check Network, Console, React DevTools

# Backend debugging
pnpm dev:server --debug
# Chrome: chrome://inspect
# Breakpoints in VS Code with launch.json

# Database debugging
pnpm --filter @nexora/database db:studio
# Opens Prisma Studio at localhost:5555
# Query, edit, or delete data visually

# Docker logs
docker compose logs -f api      # Live API logs
docker compose logs -f postgres # Live database logs
docker compose logs -f redis    # Live cache logs

# Check running containers
docker ps
docker compose ps

# Restart services
docker compose restart api
docker compose down && docker compose up -d
```

---

## Quick Reference

### Essential Commands

```bash
pnpm dev                    # Start all services
pnpm build                  # Build all packages
pnpm test                   # Run tests
pnpm lint                   # Lint code
pnpm format                 # Format code (Prettier)

pnpm --filter <pkg> <cmd>   # Run cmd in specific package
pnpm --filter @nexora/web dev
pnpm --filter @nexora/server build

docker compose up -d        # Start infrastructure
docker compose logs -f      # View logs
docker compose down         # Stop services

make dev                    # Makefile shortcuts
make build
make test
make docker-up
make docker-down
```

### File Locations

| Item | Location |
|------|----------|
| Frontend screens | `apps/web/src/app/screens/` |
| Backend modules | `apps/server/src/modules/` |
| Database schema | `packages/database/prisma/schema.prisma` |
| Shared types | `packages/shared/src/types/` |
| AI engine | `packages/ai-engine/src/` |
| Environment config | `.env` (copy from `.env.example`) |
| Docker services | `docker-compose.yml` |
| Build output | `apps/*/dist/` |

### Useful URLs

| Service | URL |
|---------|-----|
| Frontend | `http://localhost:5173` |
| API Swagger | `http://localhost:3001/api/docs` |
| Prisma Studio | `http://localhost:5555` |
| PostgreSQL | `localhost:5432` (psql client) |
| Redis | `localhost:6379` (redis-cli) |

---

## Next Steps

1. **Database Connectivity**: ✅ FIXED — PostgreSQL + Prisma fully connected
2. **Server Build**: 🚧 IN PROGRESS — Resolving remaining TypeScript errors
3. **Testing**: ❌ TODO — Implement comprehensive test suite (80%+ coverage)
4. **Authentication**: 🚧 IN PROGRESS — JWT + RBAC, then OAuth 2.1 + Passkeys
5. **Advanced Features**: ❌ TODO — CQRS, Event Sourcing, 14 Operating Systems
6. **Production Hardening**: 🚧 IN PROGRESS — Security policies, compliance, monitoring

---

## Support & Resources

- **Documentation**: See `README.md`, `DESIGN.md`, `GUIDELINES.md`, `DEPLOYMENT.md`
- **PLAN Specification**: See `PLAN/` directory (12 volumes)
- **API Docs**: `http://localhost:3001/api/docs` (Swagger)
- **Issues**: GitHub Issues (link your concerns to volumes)
- **Contributing**: See `CONTRIBUTING.md`

---

**Last Updated**: June 26, 2026 | **Version**: 0.2.0 | **Status**: 🚧 Active Development
