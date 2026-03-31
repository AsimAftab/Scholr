# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation References

The project has comprehensive documentation in the `docs/` directory. Consult these for detailed information:

- **[docs/QUICK_START.md](docs/QUICK_START.md)** — Fastest path to get Scholr running locally
- **[docs/API.md](docs/API.md)** — Complete API contract with request/response formats
- **[docs/BACKEND.md](docs/BACKEND.md)** — Backend architecture, auth, services, migrations
- **[docs/FRONTEND.md](docs/FRONTEND.md)** — Frontend routes, components, theme, validation
- **[docs/CRAWLER.md](docs/CRAWLER.md)** — Scholarship scraper architecture and behavior
- **[docs/OPS.md](docs/OPS.md)** — Docker services, environment strategy, operations
- **[docs/ROADMAP.md](docs/ROADMAP.md)** — Production roadmap and priority order
- **[docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md)** — Comprehensive system context and domain models
- **[docs/README.md](docs/README.md)** — Documentation index with recommended reading order

## Repository Overview

Scholr is an AI-powered scholarship discovery and matching platform with three main services:

- **frontend/** — Next.js 14 dashboard (App Router, React 18, TypeScript, Tailwind CSS)
- **backend/** — FastAPI REST API with SQLAlchemy ORM and Alembic migrations
- **crawler/** — Playwright-based scholarship scraper

## Common Development Commands

### Docker (Recommended)

Start all services (PostgreSQL, Backend, Frontend):
```bash
docker compose up --build
```

Start detached:
```bash
docker compose up -d --build
```

Stop all services:
```bash
docker compose down
```

### PowerShell Scripts

```powershell
.\setup.ps1           # Initial setup
.\run-backend.ps1     # Start backend only
.\run-frontend.ps1    # Start frontend only
.\run-crawler.ps1     # Start crawler only
```

For production mode frontend:
```powershell
.\run-frontend.ps1 -Production
```

### Backend (Manual)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### Frontend (Manual)

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
# or
npm run build
npm start
```

### Crawler (Manual)

```bash
cd crawler
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
playwright install
python -m scholr_crawler.main
```

### Database Migrations

Run migrations (backend directory):
```bash
alembic upgrade head
```

## High-Level Architecture

### Backend Structure (`backend/app/`)

- `api/` — Route handlers and dependency injection (`routes.py`, `deps.py`)
- `core/` — Configuration, security, logging, middleware, exception handling
- `db/` — SQLAlchemy base and session management
- `models/` — ORM models (User, Profile, Scholarship)
- `schemas/` — Pydantic request/response models
- `services/` — Domain logic (auth, matching, AI generation, profile, scholarship)

**Important:** Business logic belongs in `services/`, not in route handlers.

### Frontend Structure (`frontend/`)

- `app/` — Next.js App Router pages (routes: `/`, `/sign-in`, `/sign-up`, `/dashboard`, `/scholarships`)
- `components/` — Shared React components (app-shell, auth-form, scholarship-card)
- `providers/` — React context providers for app-wide state management (auth, future providers)
- `lib/` — API client (`api.ts`), auth hook (`auth-context.ts`), types, validation schemas

### API Endpoints

Base path: `/api/v1`

**Auth:**
- `POST /auth/signup` — Create user and set session cookie
- `POST /auth/login` — Set session cookie
- `POST /auth/logout` — Clear session cookie
- `GET /auth/me` — Get current user

**Scholarships & Profile:**
- `POST /profile` — Create/update user profile
- `GET /scholarships` — List all scholarships
- `POST /match` — Match user profile against scholarships
- `POST /scholarships/structure` — Structure eligibility text via AI

**AI Generation:**
- `POST /generate-sop` — Generate Statement of Purpose
- `POST /generate-lor` — Generate Letter of Recommendation
- `POST /summarize-scholarship` — Generate scholarship summary

### Domain Models

**User:** `id`, `email`, `full_name`, `hashed_password`, `profile_id`
**Profile:** `country`, `target_country`, `degree`, `gpa`, `ielts_score`
**Scholarship:** `title`, `country`, `degree`, `source_url`, `deadline`, `eligibility_text`, `structured_eligibility`

### Authentication Model

- Cookie-based sessions using signed tokens (`SESSION_SECRET`)
- Backend sets `HttpOnly` cookie on signup/login
- Frontend uses React Context for global auth state (`providers/auth-provider.tsx`)
- Auth state persists across route changes without page refreshes
- `useAuthContext()` hook provides access to auth state throughout the app
- Protected routes use the auth hook and redirect unauthenticated users to `/sign-in`

### Design Tokens

Frontend uses a minimal Tailwind theme with neutral colors (zinc palette). Custom color tokens like `bronze`, `bark`, `custard`, `chocolate`, `paprika` were planned but are not currently implemented.

When extending the theme, maintain the "serious SaaS" visual direction.

## Important Conventions

### Backend

- **Migrations:** Schema changes must use Alembic. Do not use `Base.metadata.create_all()`.
- **Error Handling:** All API errors return `{ "detail": "message", "request_id": "uuid" }`.
- **AI Services:** Degrade gracefully to mock outputs if `OPENAI_API_KEY` is not provided.
- **Logging:** Request IDs assigned via middleware; logs include method, path, status, duration.

### Frontend

- **Routing:** Follow Next.js App Router conventions (`layout.tsx`, `page.tsx`).
- **State Management:** Add app-wide state to `providers/` directory; consume via custom hooks in `lib/`.
- **Data Fetching:** Use `lib/api.ts` for all backend communication (includes credentials for cookies).
- **Validation:** Use Zod schemas in `lib/validation.ts`.

### Environment Variables

Backend:
- `DATABASE_URL` — PostgreSQL connection string
- `OPENAI_API_KEY` — Optional (for AI features)
- `OPENAI_MODEL` — Default: `gpt-4.1-mini`
- `SESSION_SECRET` — Required for session signing
- `AUTO_SEED` — Dev-only seed data

Frontend:
- `NEXT_PUBLIC_API_URL` — Backend API base URL (default: `http://localhost:8000/api/v1`)

## Runtime Considerations

- PostgreSQL defaults to `localhost:5432` (user/pass: `scholr/scholr`)
- Backend runs on `http://localhost:8000`
- Frontend runs on `http://localhost:3000`
- Docker healthchecks wait for PostgreSQL before starting backend
- Backend container runs migrations before serving traffic

## Safe Editing Guidelines

- Do not reintroduce direct table creation (`Base.metadata.create_all()`)
- Keep business logic in service layer, not route handlers
- Maintain the `{ detail, request_id }` error response shape
- Maintain the minimal "serious SaaS" visual direction using the neutral zinc palette
- Use Alembic for any schema changes
