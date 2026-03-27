# Scholr

Scholr is an AI-powered scholarship discovery and matching platform built with:

- Next.js 14 + TypeScript + Tailwind CSS
- FastAPI + SQLAlchemy + Alembic
- PostgreSQL
- Playwright crawler in Python

## Repository Layout

```text
frontend/   Next.js dashboard
backend/    FastAPI API, matching engine, AI features
crawler/    Playwright-based scholarship scraper
```

## Features

- Scholarship scraping for title, country, eligibility text, and deadline
- AI-powered eligibility structuring into JSON
- User profile creation
- Rule-based + AI-assisted scholarship matching
- AI content generation for SOP, LOR, and scholarship summaries
- Clean SaaS dashboard for recommendations and actions

## Prerequisites

- Node.js 20+
- Python 3.11+
- Docker Desktop or local PostgreSQL

## Runtime Modes

- `backend/.env.development.example`
- `backend/.env.production.example`
- `frontend/.env.development.example`
- `frontend/.env.production.example`

## 1. Start PostgreSQL

From the repo root:

```bash
docker compose up -d
```

## One-Command Docker Startup

If you want the full MVP stack from the repo root, use:

```bash
docker compose up --build
```

This starts:

- PostgreSQL on `localhost:5432`
- FastAPI on `http://localhost:8000`
- Next.js on `http://localhost:3000`

The backend container runs `alembic upgrade head` before serving traffic.

To run it detached:

```bash
docker compose up -d --build
```

To stop everything:

```bash
docker compose down
```

## Quick Start

If you want root-level scripts instead of manual per-folder setup:

```powershell
.\setup.ps1
.\run-backend.ps1
.\run-frontend.ps1
```

Optional crawler:

```powershell
.\run-crawler.ps1
```

If `next dev` fails in your environment, run the frontend in production mode:

```powershell
.\run-frontend.ps1 -Production
```

## 2. Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Backend runs on `http://localhost:8000`.

## 3. Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Frontend runs on `http://localhost:3000`.

## 4. Crawler Setup

```bash
cd crawler
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
playwright install
python -m scholr_crawler.main
```

## Environment Variables

### Backend

See `backend/.env.example`.

- `DATABASE_URL`
- `APP_ENV`
- `DEBUG`
- `LOG_LEVEL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `CORS_ORIGINS`
- `SESSION_SECRET`
- `SESSION_COOKIE_NAME`
- `SESSION_COOKIE_SECURE`
- `AUTO_SEED`

### Frontend

See `frontend/.env.example`.

- `NEXT_PUBLIC_API_URL`

## API Endpoints

- `POST /api/v1/profile`
- `GET /api/v1/scholarships`
- `POST /api/v1/match`
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/generate-sop`
- `POST /api/v1/generate-lor`
- `POST /api/v1/summarize-scholarship`
- `POST /api/v1/scholarships/structure`

## Backend Operations

Run migrations:

```bash
cd backend
alembic upgrade head
```

Health endpoints:

- `GET /health`
- `GET /ready`

## Architecture Notes

- The backend separates schemas, services, persistence, middleware, and API routes.
- The frontend uses React Context for global state management (auth in `providers/`, consumed via hooks in `lib/`).
- Auth state persists across route changes without page refreshes for smooth navigation.
- The matching engine is deterministic first, then enriches missing requirement reasoning.
- AI services degrade gracefully to deterministic mock outputs if `OPENAI_API_KEY` is absent.
- The crawler outputs normalized scholarship objects ready for insertion or API ingestion.
- Request IDs and API logging are handled centrally.
- Errors are normalized into a consistent `{ detail, request_id }` shape.

## Production Considerations

- Replace local development defaults with managed PostgreSQL in deployment.
- Add background jobs for large crawling and structuring batches.
- Add role-based access control, observability, and audit trails before launch.
