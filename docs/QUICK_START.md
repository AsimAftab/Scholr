# Scholr Quick Start

This file is the shortest path to getting Scholr running locally.

For full architecture and handoff context, see:

- [PROJECT_CONTEXT.md](C:\Users\asima\Desktop\Projects\Scholr\docs\PROJECT_CONTEXT.md)

## Option A: Docker

From repo root:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

Stop:

```bash
docker compose down
```

Reset DB:

```bash
docker compose down -v
```

## Option B: Local Development

### 1. Start PostgreSQL

Use Docker:

```bash
docker compose up -d postgres
```

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

### 4. Crawler

Optional:

```bash
cd crawler
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
playwright install
python -m scholr_crawler.main
```

## Root-Level Scripts

Available scripts:

- [setup.ps1](C:\Users\asima\Desktop\Projects\Scholr\setup.ps1)
- [run-backend.ps1](C:\Users\asima\Desktop\Projects\Scholr\run-backend.ps1)
- [run-frontend.ps1](C:\Users\asima\Desktop\Projects\Scholr\run-frontend.ps1)
- [run-crawler.ps1](C:\Users\asima\Desktop\Projects\Scholr\run-crawler.ps1)

Useful commands:

```powershell
.\setup.ps1
.\run-backend.ps1
.\run-frontend.ps1
.\run-frontend.ps1 -Production
.\run-crawler.ps1
```

## Health Checks

- Backend health: `GET http://localhost:8000/health`
- Backend readiness: `GET http://localhost:8000/ready`

## Auth Notes

- Auth uses signed session cookies.
- Password minimum is currently `6` characters for testing.
- Production should use a strong `SESSION_SECRET` and secure cookies.

## Common Commands

Rebuild containers:

```bash
docker compose up --build
```

Show running services:

```bash
docker compose ps
```

Tail logs:

```bash
docker compose logs -f
```

