# 🚀 NEXORA Quick Reference Guide

> **Essential commands and information for NEXORA development**

---

## ⚡ One-Minute Setup

```bash
git clone https://github.com/Vishwajeetsrk/AI-Brand-Architect.git
cd AI-Brand-Architect
make setup
make dev
# Open http://localhost:5173
# Login: demo@nexora.ai / password123
```

---

## 📋 Most Used Commands

```bash
# Development
make dev              # Start all services
make dev-web          # Frontend only
make dev-server       # Backend only

# Building
make build            # Production build
make build-web        # Frontend
make build-server     # Backend

# Testing
make test             # Run tests
make test-coverage    # With coverage
make lint             # Check code

# Database
make db-push          # Apply schema
make db-studio        # GUI explorer
make db-seed          # Load demo data
make db-reset         # Full reset

# Docker
make docker-up        # Start services
make docker-down      # Stop services
make docker-logs      # View logs

# Cleanup
make clean            # Remove build files
make clean-all        # Full cleanup
```

---

## 📱 Access Points

| Service | URL | When |
|---------|-----|------|
| Frontend | http://localhost:5173 | During dev |
| API Docs | http://localhost:3001/api/docs | Check endpoints |
| DB Studio | Run `make db-studio` | Manage data |
| Swagger | http://localhost:3001 | API testing |

---

## 🔑 Test Login

```
Email:    demo@nexora.ai
Password: password123
```

---

## 📚 Key Documentation

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Project overview |
| [MASTER.md](./MASTER.md) | Complete guide |
| [DESIGN.md](./DESIGN.md) | Design system |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute |
| [SECURITY_POLICY.md](./SECURITY_POLICY.md) | Security info |
| [PLAN_133_VOLUMES.md](./PLAN_133_VOLUMES.md) | Full roadmap |
| [PROJECT_STATUS.md](./PROJECT_STATUS.md) | Current status |

---

## 🛠️ Troubleshooting

### Port already in use
```bash
# Find process
lsof -i :5173  # Frontend
lsof -i :3001  # Backend

# Kill process
kill -9 <PID>
```

### Database errors
```bash
# Reset everything
make db-reset
# Or manually
make docker-down
make docker-up
make db-push
make db-seed
```

### Build fails
```bash
# Clear cache
make clean-all
pnpm install
make build
```

### Services won't start
```bash
# Check status
make docker-ps

# View logs
make docker-logs

# Restart
make docker-restart
```

---

## 🔑 Environment Variables

| Variable | Default | Required |
|----------|---------|----------|
| DATABASE_URL | postgresql://... | Yes |
| REDIS_URL | redis://localhost:6379 | Yes |
| JWT_SECRET | — | Yes |
| OPENAI_API_KEY | — | For AI |
| PORT | 3001 | No |
| NODE_ENV | development | No |

**Set in `.env` file (copy from `.env.example`)**

---

## 📊 Project Structure Quick Ref

```
NEXORA/
├── apps/
│   ├── web/        # React frontend (port 5173)
│   ├── server/     # NestJS backend (port 3001)
│   └── desktop/    # Electron app
├── packages/
│   ├── database/   # Prisma + schema
│   ├── ai-engine/  # LLM integration
│   └── [others]/   # Domain modules
├── docs/           # Documentation
└── config files
```

---

## ✅ Pre-deployment Checklist

- [ ] All tests pass: `make test`
- [ ] No lint errors: `make lint`
- [ ] Builds successfully: `make build`
- [ ] Database migrations run: `make db-push`
- [ ] Demo data seeds: `make db-seed`
- [ ] Frontend loads: http://localhost:5173
- [ ] API responds: http://localhost:3001/api/health
- [ ] Can login with demo@nexora.ai
- [ ] No console errors in browser
- [ ] No API 5xx errors

---

## 🎯 Common Tasks

### Add a new screen
1. Create `apps/web/src/app/screens/NewScreen.tsx`
2. Add to `apps/web/src/app/App.tsx`
3. Add routing
4. Run `make dev-web`

### Add database table
1. Update `packages/database/prisma/schema.prisma`
2. Run `make db-migrate -- --name description`
3. Generate types: `make db-generate`

### Create API endpoint
1. Add route to NestJS module
2. Add controller method
3. Add service logic
4. Document in Swagger
5. Test in Postman/API docs

### Run tests
```bash
make test            # All tests
make test-watch      # Watch mode
make test-coverage   # Coverage report
```

---

## 🔒 Security Reminders

- Never commit secrets to git
- Use `.env` for sensitive data
- Rotate JWT_SECRET regularly
- Enable 2FA for GitHub
- Review SECURITY_POLICY.md
- Check dependencies: `pnpm audit`

---

## 📞 Getting Help

1. **Check docs first**: [MASTER.md](./MASTER.md)
2. **Search issues**: [GitHub Issues](https://github.com/Vishwajeetsrk/AI-Brand-Architect/issues)
3. **Ask community**: [GitHub Discussions](https://github.com/Vishwajeetsrk/AI-Brand-Architect/discussions)
4. **Email**: hello@nexora.ai

---

## 🚀 Deploy to Production

```bash
# Build
make build

# Create `.env.production`
# with production values

# Deploy (see DEPLOYMENT.md)
make deploy-prod
```

---

**For more info: see [README.md](./README.md) or [MASTER.md](./MASTER.md)**

⭐ **Star us**: https://github.com/Vishwajeetsrk/AI-Brand-Architect
