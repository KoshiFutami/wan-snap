.PHONY: up down logs logs-api logs-web \
        migrate migrate-dev db-reset db-studio \
        lint lint-fix typecheck test cdk-synth \
        commit push pr review

# ── 環境 ──────────────────────────────────────────────
up:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f

logs-api:
	docker compose logs -f api

logs-web:
	docker compose logs -f web

# ── DB ──────────────────────────────────────────────
migrate:
	docker compose exec api pnpm prisma migrate deploy

migrate-dev:
	docker compose exec api pnpm prisma migrate dev

db-reset:
	docker compose exec api pnpm prisma migrate reset --force

db-studio:
	docker compose exec api pnpm prisma studio

# ── コード品質 ───────────────────────────────────────
lint:
	pnpm --recursive run lint

lint-fix:
	pnpm --recursive run lint --fix

typecheck:
	pnpm --recursive run typecheck

test:
	pnpm --recursive run test

cdk-synth:
	pnpm --filter cdk run synth

# ── Git ──────────────────────────────────────────────
commit:
	claude --print /commit

push:
	claude --print /push

pr:
	claude --print /pr

review:
	claude --print /review
