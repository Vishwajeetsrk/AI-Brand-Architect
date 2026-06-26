# Contributing to NEXORA

Thank you for your interest in contributing to NEXORA! This document provides guidelines for contributing code, documentation, and feedback.

---

## Code of Conduct

Be respectful, inclusive, and professional. We welcome contributors of all backgrounds and experience levels.

- **Harassment** of any kind is not tolerated
- **Discrimination** based on identity is not tolerated
- **Be helpful** and assume good intent

Violations should be reported to **conduct@nexora.ai**.

---

## Getting Started

### Prerequisites

- Node.js >= 22
- pnpm >= 10
- Docker >= 27
- Git

### Fork & Clone

```bash
# Fork repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/nexora.git
cd nexora

# Add upstream
git remote add upstream https://github.com/nexora/nexora.git
```

### Setup Development Environment

```bash
# Install dependencies
pnpm install

# Start infrastructure
docker compose up -d

# Initialize database
pnpm --filter @nexora/database db:push
pnpm --filter @nexora/database db:seed

# Start development servers
pnpm dev
```

---

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
git checkout -b docs/documentation-update
```

**Branch naming convention:**
- `feat/` — New feature
- `fix/` — Bug fix
- `docs/` — Documentation
- `test/` — Tests
- `refactor/` — Code refactoring
- `perf/` — Performance improvement
- `chore/` — Maintenance (dependencies, config)

### 2. Make Changes

**Code Changes**:
```bash
# Edit files in apps/ or packages/

# Check formatting
pnpm format

# Run linting
pnpm lint

# Run tests
pnpm test

# Build locally
pnpm build
```

**Database Changes**:
```bash
# Create migration
cd packages/database
pnpm prisma migrate dev --name your_migration_name

# Push new tables/fields
pnpm prisma db push
```

**Documentation Changes**:
```bash
# Edit .md files (MASTER.md, DESIGN.md, README.md, etc.)
# Use Markdown best practices
# Include code examples where appropriate
```

### 3. Commit Changes

**Commit Message Format**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation
- `style` — Code style (formatting, semicolons)
- `refactor` — Code refactoring
- `perf` — Performance improvement
- `test` — Test updates
- `chore` — Build, dependencies

**Example**:
```
feat(brands): implement AI brand generation endpoint

- Add POST /api/brands/:id/generate endpoint
- Integrate with ai-engine for multi-agent workflow
- Add Swagger documentation
- Include database schema updates

Fixes #123
```

### 4. Push & Create Pull Request

```bash
# Push to your fork
git push origin feat/your-feature-name

# Create PR on GitHub
# Link related issues: "Fixes #123"
# Describe changes and testing steps
```

**PR Checklist**:
```markdown
## Description
Brief overview of changes

## Related Issues
Fixes #123

## Changes
- Item 1
- Item 2
- Item 3

## Testing
How to test these changes

## Checklist
- [ ] Code follows style guide
- [ ] Tests pass locally
- [ ] Docs updated if needed
- [ ] No breaking changes (or documented)
- [ ] Database migrations included (if applicable)
```

---

## Coding Standards

### TypeScript

```typescript
// ✅ DO: Strong typing
interface CreateBrandRequest {
  name: string;
  industry: string;
  targetAudience: string;
}

// ❌ DON'T: Use any
interface CreateBrandRequest {
  name: any;
  industry: any;
}

// ✅ DO: Export clear interfaces
export interface Brand {
  id: string;
  name: string;
  createdAt: Date;
}

// ✅ DO: Use meaningful variable names
const userPermissions = await getRolePermissions(userId);

// ❌ DON'T: Use single-letter names
const p = await getRolePermissions(u);
```

### NestJS Backend

```typescript
// ✅ DO: Decorator-based services
@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaClient) {}
  
  async create(dto: CreateBrandDto): Promise<Brand> {
    return this.prisma.brand.create({ data: dto });
  }
}

// ✅ DO: Use DTOs for validation
@Post()
@UseGuards(JwtAuthGuard)
async create(@Body() dto: CreateBrandDto) {
  return this.brandsService.create(dto);
}

// ✅ DO: Add Swagger documentation
@Post()
@ApiOperation({ summary: 'Create a new brand' })
@ApiResponse({ status: 201, type: Brand })
async create(@Body() dto: CreateBrandDto) {
  // implementation
}
```

### React Components

```typescript
// ✅ DO: Functional components with hooks
export function BrandCard({ brand }: { brand: Brand }) {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div>
      <h3>{brand.name}</h3>
      {isEditing && <BrandEditor brand={brand} />}
    </div>
  );
}

// ✅ DO: Use meaningful component names
export function BrandGenerator() { }
export function ProjectTimeline() { }

// ❌ DON'T: Use generic names
export function Component() { }
export function Card() { } // Too generic
```

### Testing

```typescript
// ✅ DO: Descriptive test names
it('should create a brand with valid input', async () => {
  // test implementation
});

// ✅ DO: Test behavior, not implementation
it('should return brand with correct structure', () => {
  const brand = createBrand({ name: 'Acme' });
  expect(brand).toHaveProperty('id');
  expect(brand).toHaveProperty('name', 'Acme');
});

// ✅ DO: Use setup/teardown
beforeEach(() => {
  // setup
});

afterEach(() => {
  // cleanup
});
```

---

## Commit & PR Review

### Review Process

1. **Automated Checks** (CI/CD)
   - TypeScript compilation
   - Linting (ESLint)
   - Tests (Jest)
   - Build verification

2. **Code Review** (1-2 maintainers)
   - Code quality
   - Architecture fit
   - Performance implications
   - Security concerns

3. **Approval & Merge**
   - All checks must pass
   - At least 1 approval required
   - Branch squashed and merged

### Common Feedback

**"Add types"**
```typescript
// ❌ BEFORE
async getUser(id) {
  return db.query('SELECT * FROM users WHERE id = ?', [id]);
}

// ✅ AFTER
async getUser(id: string): Promise<User> {
  return this.prisma.user.findUnique({ where: { id } });
}
```

**"Add error handling"**
```typescript
// ❌ BEFORE
@Get(':id')
async getBrand(@Param('id') id: string) {
  return this.brandsService.findOne(id);
}

// ✅ AFTER
@Get(':id')
async getBrand(@Param('id') id: string) {
  const brand = await this.brandsService.findOne(id);
  if (!brand) {
    throw new NotFoundException(`Brand ${id} not found`);
  }
  return brand;
}
```

---

## Documentation Standards

### Inline Comments

```typescript
// ✅ DO: Explain WHY, not WHAT
// Queue jobs for async processing to avoid blocking API response
await queue.add('generate-brand', { brandId });

// ❌ DON'T: State the obvious
// Add to queue
await queue.add('generate-brand', { brandId });
```

### Code Examples

```typescript
// ✅ DO: Provide clear examples
/**
 * Generate brand identity using AI agents
 * @param brandId - ID of brand to generate
 * @returns Generated brand with logo, colors, guidelines
 * 
 * @example
 * const result = await generateBrand('brand-123');
 * // { name: 'Acme', colors: [...], logo: {...} }
 */
async generateBrand(brandId: string): Promise<GeneratedBrand> {
  // implementation
}
```

### README Files

Every package should have a `README.md`:

```markdown
# @nexora/package-name

## Overview
Brief description of what this package does

## Installation
How to use/install

## Usage
Example code

## API
Key functions/exports

## Contributing
Link to main CONTRIBUTING.md
```

---

## Testing Guidelines

### Test Coverage Targets

- **Backend**: 80%+ coverage
- **Frontend**: 70%+ coverage
- **Critical paths**: 100% coverage

### Test File Naming

```
src/services/brands.service.ts
├─ tests/brands.service.spec.ts    ✅

src/components/BrandCard.tsx
├─ tests/BrandCard.test.tsx        ✅
```

### Running Tests

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

---

## Performance Considerations

### Frontend

- ✅ Code split components with `lazy()` + `Suspense`
- ✅ Memoize expensive computations with `useMemo`
- ✅ Optimize renders with `React.memo` for list items
- ✅ Lazy load images with `loading="lazy"`
- ✅ Paginate large lists (100+ items)

### Backend

- ✅ Index frequently queried fields (Prisma `@index`)
- ✅ Use pagination for list endpoints (offset-based)
- ✅ Cache responses in Redis for expensive operations
- ✅ Use connection pooling (PgBouncer)
- ✅ Batch database queries with `Promise.all()`

### Database

- ✅ Add indexes for sort/filter fields
- ✅ Denormalize frequently accessed data
- ✅ Archive old records (compliance)
- ✅ Monitor slow queries with `pg_stat_statements`

---

## Security Guidelines

### Secret Management

❌ **DON'T**: Commit secrets to git
```bash
# Never commit
API_KEY=sk-1234567890
DATABASE_PASSWORD=password123
```

✅ **DO**: Use environment variables
```bash
# .env (in .gitignore)
API_KEY=${OPENAI_API_KEY}
# .env.example
API_KEY=xxxx
```

### Input Validation

❌ **DON'T**: Trust user input
```typescript
const brand = await prisma.brand.findUnique({
  where: { id: req.body.id }  // Untrusted!
});
```

✅ **DO**: Validate with Zod or class-validator
```typescript
const dto = await CreateBrandDto.parse(req.body);
const brand = await this.brandsService.create(dto);
```

### SQL Injection Prevention

❌ **DON'T**: String concatenation
```typescript
const result = db.query(`SELECT * FROM users WHERE id = ${id}`);
```

✅ **DO**: Use Prisma (parameterized queries)
```typescript
const user = await prisma.user.findUnique({ where: { id } });
```

---

## Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild Prisma client
pnpm --filter @nexora/database db:generate

# Verify TypeScript
pnpm build
```

### Database Issues

```bash
# Reset database
docker compose down -v
docker compose up -d
pnpm --filter @nexora/database db:push
pnpm --filter @nexora/database db:seed

# Check migrations
pnpm --filter @nexora/database prisma migrate status

# Open Prisma Studio
pnpm --filter @nexora/database db:studio
```

### Port Conflicts

```bash
# Change ports in .env
PORT=3002
# or kill existing process
lsof -i :3001
kill -9 <PID>
```

---

## Release Process

### Version Bumping

We follow [Semantic Versioning](https://semver.org):
- **MAJOR**: Breaking changes (0.1.0 → 1.0.0)
- **MINOR**: New features, backward compatible (0.1.0 → 0.2.0)
- **PATCH**: Bug fixes (0.1.0 → 0.1.1)

### Changelog

Add entry to `CHANGELOG.md`:
```markdown
## [0.2.1] - 2026-06-27

### Added
- New feature description

### Fixed
- Bug fix description

### Changed
- Breaking change (if applicable)
```

---

## Getting Help

- **Questions**: GitHub Discussions
- **Bugs**: GitHub Issues (with reproducible example)
- **Ideas**: GitHub Discussions or email innovation@nexora.ai
- **Security**: security@nexora.ai (don't open public issue)

---

## Thanks!

Thank you for contributing to NEXORA. Your efforts help make brand AI accessible to everyone.

Happy coding! 🚀

---

**Last Updated**: June 26, 2026 | **Version**: 0.2.0
