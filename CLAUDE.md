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

- **frontend/** — Next.js 14 dashboard (App Router, React 18, TypeScript, Tailwind CSS, Bun runtime)
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

**No built-in tests yet** — integration and unit tests are planned.

### Frontend (Manual)

**Important:** The frontend has been migrated to use Bun instead of npm.

```bash
cd frontend
bun install
copy .env.example .env.local
bun run dev
# or
bun run build
bun start
```

**Linting:**
```bash
bun run lint
```

**No built-in tests yet** — Jest/React Testing Library setup is planned.

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

Create new migration:
```bash
alembic revision --autogenerate -m "description"
```

## High-Level Architecture

### Backend Structure (`backend/app/`)

- `api/` — Route handlers and dependency injection (`routes.py`, `deps.py`)
- `core/` — Configuration, security, logging, middleware, exception handling
- `db/` — SQLAlchemy base and session management
- `models/` — ORM models (User, Profile, Scholarship, UserScholarshipMatch)
- `schemas/` — Pydantic request/response models
- `services/` — Domain logic:
  - `auth_service.py` — Authentication, session management
  - `profile_service.py` — User profile CRUD
  - `scholarship_service.py` — Scholarship queries
  - `matching.py` — Scholarship matching algorithm
  - `ai_service.py` — AI content generation (SOP, LOR, summaries)
  - `job_runner.py` — Background job processing
  - `tinyfish_client.py` — TinyFish API integration for ingestion
  - `scholarship_ingestion.py` — Scholarship data ingestion pipeline
  - `source_registry.py` — Source manifest registry
  - `admin_service.py` — Admin operations

**Important:** Business logic belongs in `services/`, not in route handlers.

### Frontend Structure (`frontend/`)

- `app/` — Next.js App Router pages:
  - Public: `/`, `/sign-in`, `/sign-up`
  - Authenticated: `/dashboard`, `/scholarships`, `/profile`, `/admin`, `/settings`, `/sources`
- `components/` — Shared React components (app-shell, auth-form, scholarship-card)
- `providers/` — React context providers for app-wide state management (auth, future providers)
- `lib/` — API client (`api.ts`), auth hook (`auth-context.ts`), types, validation schemas

**Runtime:** Frontend uses Bun (not npm) for package management and execution.

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

**Admin (if applicable):**
- Admin endpoints for ingestion and source management

### Domain Models

**User:** `id`, `email`, `full_name`, `hashed_password`, `profile_id`, `role`
**Profile:** `country`, `target_country`, `degree_level`, `field_of_study`, `passout_year`, `gpa`, `ielts_score`, `gender`, `date_of_birth`, `resume_url`
**Scholarship:** `title`, `country`, `degree`, `region`, `source_key`, `source_name`, `official_source`, `source_url`, `deadline`, `funding_type`, `coverage_summary`, `is_fully_funded`, `field_of_study`, `eligible_countries`, `eligibility_text`, `structured_eligibility`, `raw_payload`
**UserScholarshipMatch:** Junction table for user-scholarship interactions

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
- **Background Jobs:** `JobRunner` service handles async task processing in the backend lifespan.

### Frontend

- **Routing:** Follow Next.js App Router conventions (`layout.tsx`, `page.tsx`).
- **State Management:** Add app-wide state to `providers/` directory; consume via custom hooks in `lib/`.
- **Data Fetching:** Use `lib/api.ts` for all backend communication (includes credentials for cookies).
- **Validation:** Use Zod schemas in `lib/validation.ts`.
- **Runtime:** Use Bun commands (`bun install`, `bun run dev`, `bun run build`, `bun start`) instead of npm.

### Environment Variables

Backend:
- `DATABASE_URL` — PostgreSQL connection string
- `OPENAI_API_KEY` — Optional (for AI features)
- `OPENAI_MODEL` — Default: `gpt-4o-mini`
- `SESSION_SECRET` — Required for session signing
- `AUTO_SEED` — Dev-only seed data
- `TINYFISH_API_KEY` — For TinyFish ingestion
- `TINYFISH_BASE_URL` — Default: `https://agent.tinyfish.ai`
- `TINYFISH_TIMEOUT_SECONDS` — Default: 180
- `TINYFISH_POLL_INTERVAL_SECONDS` — Default: 5
- `TINYFISH_BATCH_SIZE` — Default: 5
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_FULL_NAME` — Admin bootstrap

Frontend:
- `NEXT_PUBLIC_API_URL` — Backend API base URL (default: `http://localhost:8000/api/v1`)

## Runtime Considerations

- PostgreSQL defaults to `localhost:5432` (user/pass: `scholr/scholr`)
- Backend runs on `http://localhost:8000`
- Frontend runs on `http://localhost:3000`
- Docker healthchecks wait for PostgreSQL before starting backend
- Backend container runs migrations before serving traffic
- Backend starts `JobRunner` on startup for background job processing
- Frontend uses Bun for optimal performance (not npm/node)

## Safe Editing Guidelines

- Do not reintroduce direct table creation (`Base.metadata.create_all()`)
- Keep business logic in service layer, not route handlers
- Maintain the `{ detail, request_id }` error response shape
- Maintain the minimal "serious SaaS" visual direction using the neutral zinc palette
- Use Alembic for any schema changes
- Use Bun commands for frontend operations, not npm
- Be aware that the project includes TinyFish integration for scholarship ingestion
- Background jobs are handled by `JobRunner` service running in the backend lifespan
