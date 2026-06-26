# NEXORA Maintenance Guide

## Build & Test

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm --filter @nexora/web build
pnpm --filter @nexora/server build
pnpm --filter @nexora/desktop build

# Run tests
pnpm --filter @nexora/web test

# Run backend dev server
pnpm --filter @nexora/server start:dev

# Run frontend dev server
pnpm --filter @nexora/web dev
```

## Project Structure

```
apps/
  web/          # Vite + React frontend (port 5173)
  server/       # NestJS backend (port 3001)
  desktop/      # Electron desktop app
packages/
  shared/       # Shared TypeScript types & utils
  database/     # Prisma schema + migrations
  ai-engine/    # Multi-provider LLM gateway, RAG, memory
  analytics/    # Brand health & engagement analytics
  knowledge/    # Knowledge base engine
  commerce/     # Billing, subscriptions, plans
  marketplace/  # Agent marketplace engine
  automation/   # Workflow automation engine
  security/     # Security monitoring & compliance
  collaboration/# Team chat & calendar
  creator/      # Creator platform & monetization
  lms/          # Learning management system
  crm/          # Customer relationship management
```

## Adding a New Screen

1. Create `apps/web/src/app/screens/YourPage.tsx` with `export default`
2. Add `lazy(() => import("./screens/YourPage"))` in `App.tsx`
3. Add a `case "your-page"` in the `renderScreen` switch
4. Add `"your-page"` to `Screen` type in `types.ts`
5. Add to `APP_SCREENS` and `LABEL_MAP` in `navConfig.ts`
6. Add to sidebar `NAV_SECTIONS` if needed
7. Run `pnpm --filter @nexora/web test` to validate

## Adding a New API Module

1. Create module in `apps/server/src/modules/your-module/`
2. Register in `app.module.ts`
3. Add package in `packages/your-module/`
4. Register in `pnpm-workspace.yaml`

## Database Migrations

```bash
# Generate Prisma client
cd packages/database
pnpm prisma generate

# Create migration
pnpm prisma migrate dev --name your_migration_name

# Apply to production
pnpm prisma migrate deploy
```

## Deployment

See `DEPLOYMENT.md` for full deployment guide.

## Testing Checklist

Before each release:
- [ ] `pnpm --filter @nexora/web build` succeeds
- [ ] `pnpm --filter @nexora/server build` succeeds
- [ ] All routes render (check via "All Screens" debug menu)
- [ ] No console errors in browser
- [ ] `pnpm --filter @nexora/web test` passes
