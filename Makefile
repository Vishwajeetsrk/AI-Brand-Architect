.PHONY: dev build install db-setup db-migrate db-studio docker-up docker-down clean

dev:
	pnpm dev

install:
	pnpm install

build:
	pnpm build

db-setup:
	pnpm --filter @nexora/database db:push

db-migrate:
	pnpm --filter @nexora/database db:migrate

db-studio:
	pnpm --filter @nexora/database db:studio

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-build:
	docker compose build

clean:
	rm -rf apps/*/dist packages/*/dist node_modules
