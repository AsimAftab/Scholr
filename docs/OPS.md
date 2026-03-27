# Ops Guide

## Main Runtime Entry Points

- [docker-compose.yml](C:\Users\asima\Desktop\Projects\Scholr\docker-compose.yml)
- [backend/Dockerfile](C:\Users\asima\Desktop\Projects\Scholr\backend\Dockerfile)
- [frontend/Dockerfile](C:\Users\asima\Desktop\Projects\Scholr\frontend\Dockerfile)

## Docker Services

- `postgres`
- `backend`
- `frontend`

Ports:

- Postgres: `5432`
- Backend: `8000`
- Frontend: `3000`

## Standard Commands

Start everything:

```bash
docker compose up --build
```

Detached:

```bash
docker compose up -d --build
```

Stop:

```bash
docker compose down
```

Stop and wipe DB volume:

```bash
docker compose down -v
```

View service status:

```bash
docker compose ps
```

Tail logs:

```bash
docker compose logs -f
```

## Migrations

Docker backend executes:

```bash
alembic upgrade head
```

Local manual migration:

```bash
cd backend
alembic upgrade head
```

## Health and Readiness

- `GET /health`
- `GET /ready`

Compose uses backend readiness for service health.

## Env Strategy

Backend:

- [backend/.env.example](C:\Users\asima\Desktop\Projects\Scholr\backend\.env.example)
- [backend/.env.development.example](C:\Users\asima\Desktop\Projects\Scholr\backend\.env.development.example)
- [backend/.env.production.example](C:\Users\asima\Desktop\Projects\Scholr\backend\.env.production.example)

Frontend:

- [frontend/.env.example](C:\Users\asima\Desktop\Projects\Scholr\frontend\.env.example)
- [frontend/.env.development.example](C:\Users\asima\Desktop\Projects\Scholr\frontend\.env.development.example)
- [frontend/.env.production.example](C:\Users\asima\Desktop\Projects\Scholr\frontend\.env.production.example)

## Local Scripts

- [setup.ps1](C:\Users\asima\Desktop\Projects\Scholr\setup.ps1)
- [run-backend.ps1](C:\Users\asima\Desktop\Projects\Scholr\run-backend.ps1)
- [run-frontend.ps1](C:\Users\asima\Desktop\Projects\Scholr\run-frontend.ps1)
- [run-crawler.ps1](C:\Users\asima\Desktop\Projects\Scholr\run-crawler.ps1)

## Operational Notes

- backend uses request logging with request IDs
- frontend Docker image serves production Next.js build
- local dev may still use `npm run dev`
- backend cookie security settings must differ between development and production

## Highest-Value Next Ops Work

1. CI pipeline for lint/build/migrations
2. test automation
3. staging/production deployment config
4. secrets and environment promotion strategy
5. observability integration

