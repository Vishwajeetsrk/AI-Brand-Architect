# Testing Guide — NEXORA

> **Comprehensive testing strategies, test credentials, and quality assurance procedures** for the NEXORA platform.

---

## Test Credentials

### Primary Demo User

| Field | Value |
|-------|-------|
| Email | `demo@nexora.ai` |
| Password | `password123` |
| Role | ADMIN |
| Organization | Acme Corp |

### Pre-seeded Resources

The demo user has access to:
- **Organization**: Acme Corp (free tier)
- **Brand**: ACME Brand Identity (professional voice, tech industry)
- **Project**: Website Redesign (active status)
- **Brand Identity**: Complete with colors, fonts, guidelines
- **Prompt Template**: "Brand Voice Guide Generator"

### Secondary Test Users

You can create additional test accounts via:
1. Registration form at `/auth/register`
2. API: `POST /api/auth/register`
3. Prisma Studio: Add to User table

---

## Testing Scenarios

### 1. Authentication & Authorization

**Test Case: Login with Valid Credentials**
```bash
# Endpoint
POST /api/auth/login

# Payload
{
  "email": "demo@nexora.ai",
  "password": "password123"
}

# Expected Response (200 OK)
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "email": "demo@nexora.ai",
    "name": "Demo User",
    "role": "ADMIN"
  }
}
```

**Test Case: Login with Invalid Email**
```bash
# Expected Response (401 Unauthorized)
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

**Test Case: Login with Wrong Password**
```bash
# After 5 failed attempts: Account locked for 15 minutes
# Expected Response (429 Too Many Requests)
{
  "statusCode": 429,
  "message": "Too many login attempts. Try again in 15 minutes.",
  "error": "Too Many Requests"
}
```

### 2. Brand Management

**Test Case: Create Brand**
```bash
# Endpoint
POST /api/brands
Authorization: Bearer {accessToken}

# Payload
{
  "name": "Test Brand",
  "description": "A test brand for QA",
  "industry": "Technology",
  "targetAudience": "Startups",
  "voice": "PROFESSIONAL"
}

# Expected Response (201 Created)
{
  "id": "brand-456",
  "name": "Test Brand",
  "description": "A test brand for QA",
  "industry": "Technology",
  "targetAudience": "Startups",
  "voice": "PROFESSIONAL",
  "createdAt": "2026-06-27T10:30:00Z",
  "updatedAt": "2026-06-27T10:30:00Z"
}
```

**Test Case: List Brands**
```bash
# Endpoint
GET /api/brands
Authorization: Bearer {accessToken}

# Expected Response (200 OK)
{
  "data": [
    {
      "id": "brand-123",
      "name": "ACME Brand Identity",
      "industry": "Technology",
      "voice": "PROFESSIONAL"
    },
    {
      "id": "brand-456",
      "name": "Test Brand",
      "industry": "Technology",
      "voice": "PROFESSIONAL"
    }
  ],
  "total": 2,
  "page": 1,
  "pageSize": 20
}
```

**Test Case: Update Brand**
```bash
# Endpoint
PUT /api/brands/brand-123
Authorization: Bearer {accessToken}

# Payload
{
  "name": "ACME Brand (Updated)",
  "voice": "PLAYFUL"
}

# Expected Response (200 OK)
{
  "id": "brand-123",
  "name": "ACME Brand (Updated)",
  "voice": "PLAYFUL",
  "updatedAt": "2026-06-27T10:35:00Z"
}
```

**Test Case: Delete Brand**
```bash
# Endpoint
DELETE /api/brands/brand-123
Authorization: Bearer {accessToken}

# Expected Response (204 No Content)
```

### 3. Project Management

**Test Case: Create Project**
```bash
# Endpoint
POST /api/projects
Authorization: Bearer {accessToken}

# Payload
{
  "name": "Mobile App Design",
  "description": "Design system for mobile app",
  "brandId": "brand-123",
  "status": "DRAFT"
}

# Expected Response (201 Created)
{
  "id": "project-789",
  "name": "Mobile App Design",
  "brandId": "brand-123",
  "status": "DRAFT",
  "createdAt": "2026-06-27T10:40:00Z"
}
```

### 4. AI Generation

**Test Case: Generate Brand Strategy**
```bash
# Endpoint
POST /api/ai/generate/brand-strategy
Authorization: Bearer {accessToken}
Content-Type: application/json

# Payload
{
  "brandId": "brand-123",
  "includeCompetitorAnalysis": true,
  "includePositioning": true
}

# Expected Response (200 OK)
{
  "generatedAt": "2026-06-27T10:45:00Z",
  "strategy": {
    "positioning": "...",
    "targetAudience": "...",
    "keyMessages": ["...", "...", "..."],
    "competitors": [...]
  },
  "tokensUsed": 2500,
  "generationTime": 4500
}
```

### 5. Knowledge Base

**Test Case: Upload Document**
```bash
# Endpoint
POST /api/knowledge/upload
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

# Payload
file: <PDF file>
knowledgeBaseId: "kb-123"
title: "Brand Guidelines"

# Expected Response (201 Created)
{
  "id": "doc-456",
  "knowledgeBaseId": "kb-123",
  "title": "Brand Guidelines",
  "content": "...",
  "embedding": [...],
  "createdAt": "2026-06-27T10:50:00Z"
}
```

**Test Case: Search Documents**
```bash
# Endpoint
GET /api/knowledge/search?q=brand+voice
Authorization: Bearer {accessToken}

# Expected Response (200 OK)
{
  "results": [
    {
      "id": "doc-456",
      "title": "Brand Guidelines",
      "content": "...",
      "similarity": 0.92
    },
    {
      "id": "doc-789",
      "title": "Tone Examples",
      "content": "...",
      "similarity": 0.88
    }
  ],
  "count": 2
}
```

### 6. Analytics & Dashboards

**Test Case: Get Brand Metrics**
```bash
# Endpoint
GET /api/analytics/brands/brand-123
Authorization: Bearer {accessToken}

# Expected Response (200 OK)
{
  "brandId": "brand-123",
  "brandName": "ACME Brand Identity",
  "metrics": {
    "totalProjects": 5,
    "activeProjects": 2,
    "generationsThisMonth": 42,
    "collaborators": 3,
    "lastUpdated": "2026-06-27T08:00:00Z"
  },
  "trends": {
    "projectsGrowth": 20,
    "generationsGrowth": 15
  }
}
```

---

## Frontend Testing Checklist

### Authentication
- [ ] Login with valid credentials → redirects to dashboard
- [ ] Login with invalid credentials → shows error message
- [ ] Account lockout after 5 failed attempts
- [ ] Logout clears session and tokens
- [ ] Navigation guards protect private routes
- [ ] Expired tokens trigger re-login

### Brand Management
- [ ] Create brand → form validation works
- [ ] Update brand → changes reflected immediately
- [ ] Delete brand → confirmation dialog appears
- [ ] Brand list pagination works
- [ ] Search brands by name/industry
- [ ] Brand details show all relationships (projects, assets)

### Dashboard
- [ ] Homepage loads with user's brands
- [ ] Quick stats display correctly
- [ ] Recent activity feed updates
- [ ] Navigation sidebar collapses/expands
- [ ] Dark mode toggle works
- [ ] Responsive layout on mobile

### AI Features
- [ ] Generate brand strategy button works
- [ ] Loading indicator shows during generation
- [ ] Results display in formatted view
- [ ] Can download generated content
- [ ] Can save results to brand
- [ ] Error handling shows user-friendly message

### UI Components
- [ ] Buttons have proper hover/active states
- [ ] Form inputs validate on blur/submit
- [ ] Modals can be opened/closed
- [ ] Notifications appear and auto-dismiss
- [ ] Tables are sortable and filterable
- [ ] Dropdowns work on mobile (touch)

---

## Backend Testing Checklist

### API Endpoints
- [ ] All endpoints return correct status codes
- [ ] Response payloads match Swagger schema
- [ ] Authentication guards work correctly
- [ ] Authorization checks prevent access violations
- [ ] Pagination works on list endpoints
- [ ] Filtering and sorting work on list endpoints
- [ ] Error messages are helpful and consistent

### Database
- [ ] Migrations apply without errors
- [ ] Seed data creates expected records
- [ ] Foreign key relationships are enforced
- [ ] Indexes exist on frequently queried fields
- [ ] Soft deletes work (if implemented)
- [ ] Cascading deletes work as expected

### Authentication & Security
- [ ] JWT tokens are created with correct claims
- [ ] JWT expiration is enforced
- [ ] Refresh tokens rotate on use
- [ ] CORS headers are sent correctly
- [ ] Rate limiting works as configured
- [ ] Input validation prevents SQL injection
- [ ] Password hashing is consistent

### AI Integration
- [ ] LLM provider fallback works
- [ ] Embedding generation succeeds
- [ ] RAG retrieval returns relevant documents
- [ ] Agent execution completes without errors
- [ ] Token usage is calculated correctly
- [ ] Cost estimation is accurate

---

## Manual Testing Procedure

### Step 1: Fresh Start Setup

```bash
# Clean environment
docker compose down -v
docker compose up -d

# Reset database
pnpm --filter @nexora/database db:push
pnpm --filter @nexora/database db:seed

# Start servers
pnpm dev
```

### Step 2: Login & Explore

1. Open http://localhost:5173
2. Login with `demo@nexora.ai` / `password123`
3. Navigate through each menu item:
   - Brands → View/Create/Edit
   - Projects → View/Create/Edit
   - Agents → View/Execute
   - Analytics → View metrics
   - Settings → Account/Team/Billing

### Step 3: Test AI Generation

1. Select a brand
2. Click "Generate Strategy"
3. Wait for generation to complete
4. Verify output displays correctly
5. Test download/save functionality

### Step 4: Test Collaboration

1. Open Prisma Studio: `pnpm --filter @nexora/database db:studio`
2. Add a second user to the organization
3. In another browser, login with new user
4. Verify both users see the same brands
5. Test that only organization members see data

### Step 5: Test Error Cases

1. Try accessing another user's private brand (should fail)
2. Logout and try accessing protected routes (should redirect)
3. Submit invalid form data (should show validation errors)
4. Simulate network error (open DevTools → Network → Offline)
5. Verify graceful error handling

---

## Automated Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run specific package
pnpm --filter @nexora/server test

# Watch mode
pnpm test --watch

# Coverage report
pnpm test --coverage
```

**Target Coverage**:
- Backend: 80%+
- Frontend: 70%+
- AI Engine: 85%+

### Integration Tests

```bash
# Start test database
docker compose -f docker-compose.test.yml up -d

# Run integration tests
pnpm test:integration

# Cleanup
docker compose -f docker-compose.test.yml down
```

### E2E Tests (Upcoming)

```bash
# Using Playwright/Cypress
pnpm test:e2e

# Headless
pnpm test:e2e --headed=false

# Specific test file
pnpm test:e2e auth.spec.ts
```

---

## Performance Testing

### Load Testing

```bash
# Using Artillery.io
npm install -g artillery

# Run load test
artillery quick --count 100 --num 1000 http://localhost:3001/api/brands

# Expected: <200ms response time
```

### Database Query Performance

```bash
# Enable query logging
# In .env: DATABASE_DEBUG=true

# Run slow query log
docker exec nexora-postgres psql -U nexora -d nexora \
  -c "SELECT query, calls, total_time, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"
```

### Frontend Performance

1. Open DevTools → Lighthouse
2. Run Performance audit
3. Target scores:
   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+

---

## Security Testing

### OWASP Top 10

- [ ] **SQL Injection**: Test with `'; DROP TABLE users; --`
- [ ] **Broken Authentication**: Test password reset, token expiry
- [ ] **XSS**: Test with `<script>alert('xss')</script>`
- [ ] **CSRF**: Verify tokens are required
- [ ] **Broken Access Control**: Test authorization boundaries
- [ ] **Sensitive Data Exposure**: Verify encryption in transit/at rest
- [ ] **XML External Entities**: Test file uploads
- [ ] **Broken Access Control (API)**: Test endpoint authorization
- [ ] **Using Components with Known Vulnerabilities**: Run `pnpm audit`
- [ ] **Insufficient Logging**: Verify audit logs are created

### Penetration Testing Tools

```bash
# Dependency scan
pnpm audit

# OWASP dependency check
npm install -g @cyclonedx/npm
npm sbom @nexora/server

# SQL injection scanning
sqlmap -u "http://localhost:3001/api/brands" -p id --batch

# XSS scanning
npm install -g retire
retire --js --jshint --ignore-npm
```

---

## Bug Reporting Template

```markdown
## Bug Title

**Severity**: Critical / High / Medium / Low

### Reproduction Steps
1. Login with demo@nexora.ai / password123
2. Navigate to Brands
3. Click "Create Brand"
4. Enter "Test" in name field
5. Click Save

### Expected Behavior
Brand is created and appears in list

### Actual Behavior
Form shows error message "Invalid input"

### Screenshots
[Attach screenshot]

### Environment
- Browser: Chrome 126.0
- OS: Windows 11
- Device: Desktop
- App Version: 0.3.0

### Console Errors
[Paste any console errors]

### Additional Context
Only happens with certain brand names
```

---

## Test Data Management

### Create Test Dataset

```bash
# Bulk create brands via API
for i in {1..10}; do
  curl -X POST http://localhost:3001/api/brands \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Test Brand $i\",\"industry\":\"Tech\"}"
done

# Or use Prisma Studio to manually add data
pnpm --filter @nexora/database db:studio
```

### Reset to Known State

```bash
# Re-seed database
docker compose down -v
docker compose up -d
pnpm --filter @nexora/database db:push
pnpm --filter @nexora/database db:seed
```

---

## Continuous Testing (CI/CD)

### GitHub Actions Pipeline

```bash
# On every push:
1. pnpm lint
2. pnpm build
3. pnpm test (with coverage)
4. pnpm test:integration
5. Security scan (pnpm audit)

# On PR merge to main:
1. Deploy to staging
2. Run E2E tests
3. Run performance tests
4. Manual QA sign-off
5. Deploy to production
```

---

## Monitoring & Logging

### Access Logs

```bash
# View API request logs
docker compose logs -f api

# View database logs
docker compose logs -f postgres

# View Redis logs
docker compose logs -f redis
```

### Error Tracking

- **Sentry** (coming): Error aggregation & alerting
- **Datadog** (coming): APM & metrics
- **ELK Stack** (coming): Log aggregation

---

## Regression Testing Checklist

Before each release, verify:
- [ ] Login/logout works
- [ ] Create/read/update/delete for all resources
- [ ] AI generation produces output
- [ ] No console errors
- [ ] No API 5xx errors
- [ ] Performance is acceptable
- [ ] Mobile UI is responsive
- [ ] Dark mode works
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

---

## Test Credentials Summary

| Use Case | Email | Password | Role |
|----------|-------|----------|------|
| General Testing | `demo@nexora.ai` | `password123` | ADMIN |
| Viewer Role | Register new | `password123` | VIEWER |
| Member Role | Register new | `password123` | USER |

Generate as many test accounts as needed via registration form or API.

---

**Last Updated**: June 27, 2026 | **Version**: 0.1.0
