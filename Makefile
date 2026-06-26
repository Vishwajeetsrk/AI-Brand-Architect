.PHONY: help install dev dev-web dev-server dev-desktop build build-web build-server test lint format clean docker-up docker-down docker-logs db-push db-migrate db-studio db-seed db-reset git-setup deploy-staging deploy-prod

# Variables
PROJECT_NAME = NEXORA
DOCKER_COMPOSE = docker compose
PNPM = pnpm
NODE_BIN = ./node_modules/.bin

# Colors
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[0;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)╔════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║           $(PROJECT_NAME) Development Commands              ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)Setup & Installation:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E 'install|setup' | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Development:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E '^dev|^lint|^format|^clean' | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Building:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E '^build|^docker' | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Database:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E '^db-' | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Testing & Quality:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E '^test' | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Deployment:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E '^deploy|^git' | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# ============================================================================
# SETUP & INSTALLATION
# ============================================================================

install: ## Install all dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	$(PNPM) install

setup: install docker-up db-push db-seed ## Complete setup (install + docker + db)
	@echo "$(GREEN)✓ Setup complete! Run 'make dev' to start development$(NC)"

git-setup: ## Setup Git hooks and configuration
	@echo "$(BLUE)Setting up Git configuration...$(NC)"
	git config core.hooksPath .githooks
	chmod +x .githooks/pre-commit .githooks/pre-push
	@echo "$(GREEN)✓ Git hooks installed$(NC)"

# ============================================================================
# DEVELOPMENT
# ============================================================================

dev: ## Start all development servers (frontend + backend)
	@echo "$(BLUE)Starting all development servers...$(NC)"
	$(PNPM) dev

dev-web: ## Start Vite frontend dev server (port 5173)
	@echo "$(BLUE)Starting frontend (port 5173)...$(NC)"
	$(PNPM) --filter @nexora/web dev

dev-server: ## Start NestJS backend dev server (port 3001)
	@echo "$(BLUE)Starting backend (port 3001)...$(NC)"
	$(PNPM) --filter @nexora/server start:dev

dev-desktop: ## Start Electron desktop app
	@echo "$(BLUE)Starting Electron desktop app...$(NC)"
	cd apps/desktop && NODE_ENV=development $(PNPM) dev

dev-debug: ## Start backend with debugging enabled
	@echo "$(BLUE)Starting backend with debugger...$(NC)"
	$(PNPM) --filter @nexora/server start:debug

# ============================================================================
# BUILDING
# ============================================================================

build: ## Build all packages for production
	@echo "$(BLUE)Building all packages...$(NC)"
	$(PNPM) build
	@echo "$(GREEN)✓ Build complete$(NC)"

build-web: ## Build frontend to dist/
	@echo "$(BLUE)Building frontend...$(NC)"
	$(PNPM) --filter @nexora/web build

build-server: ## Build backend to dist/
	@echo "$(BLUE)Building backend...$(NC)"
	$(PNPM) --filter @nexora/server build

build-desktop: ## Build Electron app
	@echo "$(BLUE)Building Electron app...$(NC)"
	cd apps/desktop && $(PNPM) dist

# ============================================================================
# TESTING & QUALITY
# ============================================================================

test: ## Run all tests
	@echo "$(BLUE)Running tests...$(NC)"
	$(PNPM) test

test-watch: ## Run tests in watch mode
	@echo "$(BLUE)Running tests (watch mode)...$(NC)"
	$(PNPM) test --watch

test-coverage: ## Run tests with coverage report
	@echo "$(BLUE)Running tests with coverage...$(NC)"
	$(PNPM) test --coverage
	@echo "$(GREEN)✓ Coverage report generated$(NC)"

test-e2e: ## Run E2E tests (Playwright/Cypress)
	@echo "$(BLUE)Running E2E tests...$(NC)"
	$(PNPM) test:e2e

lint: ## Lint all packages (ESLint + TypeScript)
	@echo "$(BLUE)Linting code...$(NC)"
	$(PNPM) lint

format: ## Format code with Prettier
	@echo "$(BLUE)Formatting code...$(NC)"
	$(PNPM) format

format-check: ## Check if code is formatted
	@echo "$(BLUE)Checking code formatting...$(NC)"
	$(PNPM) format --check

type-check: ## Run TypeScript type checking
	@echo "$(BLUE)Type checking...$(NC)"
	$(PNPM) build

# ============================================================================
# DOCKER
# ============================================================================

docker-up: ## Start Docker services (PostgreSQL + Redis)
	@echo "$(BLUE)Starting Docker services...$(NC)"
	$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✓ Services started$(NC)"
	@echo "  PostgreSQL: localhost:5432"
	@echo "  Redis: localhost:6379"

docker-down: ## Stop Docker services
	@echo "$(BLUE)Stopping Docker services...$(NC)"
	$(DOCKER_COMPOSE) down

docker-logs: ## View Docker service logs
	@echo "$(BLUE)Showing Docker logs (Ctrl+C to exit)...$(NC)"
	$(DOCKER_COMPOSE) logs -f

docker-restart: ## Restart Docker services
	@echo "$(BLUE)Restarting Docker services...$(NC)"
	$(DOCKER_COMPOSE) restart
	@echo "$(GREEN)✓ Services restarted$(NC)"

docker-build: ## Build Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	$(DOCKER_COMPOSE) build

docker-ps: ## Show running Docker containers
	@echo "$(BLUE)Running containers:$(NC)"
	$(DOCKER_COMPOSE) ps

docker-clean: ## Remove Docker containers, volumes, networks
	@echo "$(YELLOW)Warning: This will delete all containers and volumes!$(NC)"
	@read -p "Continue? [y/N] " -n 1 -r; echo; if [[ $$REPLY =~ ^[Yy]$$ ]]; then $(DOCKER_COMPOSE) down -v; fi

# ============================================================================
# DATABASE
# ============================================================================

db-push: ## Push Prisma schema to database (no migrations)
	@echo "$(BLUE)Pushing Prisma schema...$(NC)"
	$(PNPM) --filter @nexora/database db:push

db-migrate: ## Create and run database migrations
	@echo "$(BLUE)Running migrations...$(NC)"
	$(PNPM) --filter @nexora/database db:migrate

db-studio: ## Open Prisma Studio (GUI at localhost:5555)
	@echo "$(BLUE)Opening Prisma Studio...$(NC)"
	$(PNPM) --filter @nexora/database db:studio

db-seed: ## Seed database with demo data
	@echo "$(BLUE)Seeding database...$(NC)"
	$(PNPM) --filter @nexora/database db:seed
	@echo "$(GREEN)✓ Database seeded with demo data$(NC)"
	@echo "  Email: demo@nexora.ai"
	@echo "  Password: password123"

db-generate: ## Generate Prisma client
	@echo "$(BLUE)Generating Prisma client...$(NC)"
	$(PNPM) --filter @nexora/database db:generate

db-reset: ## Reset database (careful!)
	@echo "$(YELLOW)Warning: This will reset the entire database!$(NC)"
	@read -p "Continue? [y/N] " -n 1 -r; echo; if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(DOCKER_COMPOSE) down -v; \
		$(DOCKER_COMPOSE) up -d; \
		sleep 10; \
		$(PNPM) --filter @nexora/database db:push; \
		$(PNPM) --filter @nexora/database db:seed; \
		echo "$(GREEN)✓ Database reset complete$(NC)"; \
	fi

db-backup: ## Backup database to file
	@echo "$(BLUE)Backing up database...$(NC)"
	docker exec nexora-postgres pg_dump -U nexora nexora > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✓ Backup created$(NC)"

# ============================================================================
# CLEANUP
# ============================================================================

clean: ## Remove build artifacts and dependencies
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	rm -rf dist/ build/
	$(PNPM) store prune
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

clean-all: clean ## Full cleanup (artifacts + node_modules + Docker)
	@echo "$(YELLOW)Full cleanup (removing node_modules and Docker)...$(NC)"
	rm -rf node_modules pnpm-lock.yaml
	$(DOCKER_COMPOSE) down -v
	@echo "$(GREEN)✓ Full cleanup complete$(NC)"

# ============================================================================
# DEPLOYMENT
# ============================================================================

deploy-staging: build ## Deploy to staging environment
	@echo "$(BLUE)Deploying to staging...$(NC)"
	@echo "Ensure all tests pass before deploying"
	@read -p "Continue? [y/N] " -n 1 -r; echo; if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(BLUE)Pushing to staging...$(NC)"; \
		git push origin develop; \
	fi

deploy-prod: build ## Deploy to production (requires main branch)
	@echo "$(RED)WARNING: Production Deployment$(NC)"
	@echo "This will deploy to production. Be careful!"
	@read -p "Continue? [y/N] " -n 1 -r; echo; if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(BLUE)Pushing to production...$(NC)"; \
		git push origin main; \
		echo "$(GREEN)✓ Production deployment initiated$(NC)"; \
	fi

# ============================================================================
# UTILITIES
# ============================================================================

health-check: ## Run health checks on services
	@echo "$(BLUE)Running health checks...$(NC)"
	@echo -n "Frontend (5173): "
	@curl -s http://localhost:5173 > /dev/null && echo "$(GREEN)✓$(NC)" || echo "$(RED)✗$(NC)"
	@echo -n "Backend (3001): "
	@curl -s http://localhost:3001/api/health > /dev/null && echo "$(GREEN)✓$(NC)" || echo "$(RED)✗$(NC)"
	@echo -n "PostgreSQL (5432): "
	@docker exec nexora-postgres pg_isready -U nexora > /dev/null && echo "$(GREEN)✓$(NC)" || echo "$(RED)✗$(NC)"
	@echo -n "Redis (6379): "
	@docker exec nexora-redis redis-cli ping > /dev/null && echo "$(GREEN)✓$(NC)" || echo "$(RED)✗$(NC)"

info: ## Show project info
	@echo "$(BLUE)╔════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║                    $(PROJECT_NAME) Information                  ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)Project$(NC): NEXORA AI Brand Architect"
	@echo "$(YELLOW)Version$(NC): 0.4.0"
	@echo "$(YELLOW)Node$(NC): $$(node --version)"
	@echo "$(YELLOW)pnpm$(NC): $$($(PNPM) --version)"
	@echo "$(YELLOW)Docker$(NC): $$(docker --version)"
	@echo ""
	@echo "$(YELLOW)URLs$(NC):"
	@echo "  Frontend: http://localhost:5173"
	@echo "  Backend: http://localhost:3001"
	@echo "  API Docs: http://localhost:3001/api/docs"
	@echo "  Prisma Studio: http://localhost:5555 (after running make db-studio)"
	@echo ""
	@echo "$(YELLOW)Test Credentials$(NC):"
	@echo "  Email: demo@nexora.ai"
	@echo "  Password: password123"
	@echo ""

.DEFAULT_GOAL := help
