# Scholr Project Context

This document is the working context file for future engineering and agent handoff.

It explains the current system shape, service boundaries, key files, runtime flows, operational assumptions, and the highest-value next steps.

## Product Summary

Scholr is a scholarship intelligence SaaS product with four core responsibilities:

1. Ingest scholarship opportunities from public sources.
2. Structure messy eligibility text into machine-usable requirements.
3. Match applicants against scholarships using profile-aware logic.
4. Support applications with AI-generated content and guidance.

The repo currently contains:

- `frontend/`: Next.js product UI
- `backend/`: FastAPI API and application logic
- `crawler/`: Playwright-based scholarship scraper
- `docker-compose.yml`: local multi-service orchestration

## High-Level Architecture

```text
Frontend (Next.js)
  -> calls Backend API over HTTP with cookie-based auth

Backend (FastAPI)
  -> PostgreSQL via SQLAlchemy
  -> OpenAI-compatible generation flow via `AIService`
  -> profile/match/auth/business logic in service layer

Crawler (Playwright + BeautifulSoup)
  -> scrapes scholarship pages
  -> emits normalized scholarship objects
```

## Current Backend Structure

Root: `backend/app`

- `api/`
  Route layer and dependency helpers.
- `core/`
  Settings, security, logging, middleware, exception handling.
- `db/`
  SQLAlchemy base and session management.
- `models/`
  ORM models.
- `schemas/`
  Pydantic request/response models.
- `services/`
  Domain logic and orchestration.

### Important Backend Files

- [main.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\main.py)
  FastAPI app creation, middleware registration, exception handlers, health checks.

- [config.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\core\config.py)
  Central application settings loaded from env files and runtime env vars.

- [middleware.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\core\middleware.py)
  Request ID assignment and request logging.

- [exceptions.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\core\exceptions.py)
  Normalized API error responses.

- [security.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\core\security.py)
  Password hashing and session signing helpers.

- [routes.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\api\routes.py)
  Public and authenticated API endpoints.

- [auth_service.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\services\auth_service.py)
  Signup, login, session cookie management, current-user resolution.

- [matching.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\services\matching.py)
  Scholarship matching logic.

- [ai_service.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\services\ai_service.py)
  Eligibility structuring, SOP/LOR generation, scholarship summaries.

- [seed.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\services\seed.py)
  Dev-only seed behavior, controlled by `AUTO_SEED`.

## Backend Domain Model

### `User`

File: [user.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\models\user.py)

Fields:

- `id`
- `email`
- `full_name`
- `hashed_password`
- `profile_id`

Notes:

- One user can have one profile.
- Authentication is currently session-cookie based.

### `Profile`

File: [profile.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\models\profile.py)

Fields:

- `id`
- `country`
- `target_country`
- `degree_level`
- `field_of_study`
- `passout_year` (optional)
- `gpa`
- `ielts_score` (optional, nullable)
- `gender` (optional)
- `date_of_birth` (optional)
- `resume_url` (optional)

Notes:

- User profile fields are validated via Pydantic schemas
- `ielts_score` supports half bands (0, 1, 2, 2.5, 3, 3.5, 4, 4.5, ..., 9)
- Migration downgrades use `-1` as sentinel for missing IELTS scores

### `Scholarship`

File: [scholarship.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\models\scholarship.py)

Fields:

- `id`
- `title`
- `country`
- `degree`
- `region`
- `source_key`
- `source_name`
- `official_source`
- `source_url`
- `deadline`
- `funding_type`
- `coverage_summary`
- `is_fully_funded`
- `field_of_study` (array)
- `eligible_countries` (array)
- `eligibility_text`
- `structured_eligibility` (JSON)
- `raw_payload` (JSON)

Notes:

- `structured_eligibility` is stored as JSON with fields like `gpa_required`, `ielts_required`, `degree_levels`, etc.
- `raw_payload` stores the original extraction data from TinyFish or crawler
- Current schema supports multiple sources and ingestion methods

## Backend Auth Model

Authentication is cookie-based.

Current flow:

1. `POST /api/v1/auth/signup`
2. backend hashes the password with `pbkdf2_sha256`
3. backend signs a session token using `SESSION_SECRET`
4. backend sets an `HttpOnly` cookie
5. authenticated requests resolve the current user from the signed cookie

Current auth-related env vars:

- `SESSION_SECRET`
- `SESSION_COOKIE_NAME`
- `SESSION_COOKIE_SECURE`

Current auth limitations:

- no CSRF protection yet
- no session rotation
- no refresh/session store model
- no password reset flow
- no email verification
- no RBAC

## Frontend Auth Model

Frontend uses React Context for global auth state management.

Current flow:

1. App initializes with `AuthProvider` in root layout
2. Provider fetches current user via `GET /api/v1/auth/me` on mount
3. Auth state (user, loading, error) is stored in context
4. Pages access auth via `useAuthContext()` hook
5. Protected pages redirect unauthenticated users to `/sign-in`
6. Auth state persists across route changes without page refreshes

Benefits:

- Single auth check on app load instead of per-page
- Smooth client-side navigation without page refreshes
- Centralized auth state management
- Easy to extend with additional providers

## Backend API Surface

Auth:

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

Scholarships and profile:

- `POST /api/v1/profile`
- `GET /api/v1/scholarships`
- `POST /api/v1/match`
- `POST /api/v1/scholarships/structure`

AI generation:

- `POST /api/v1/generate-sop`
- `POST /api/v1/generate-lor`
- `POST /api/v1/summarize-scholarship`

Ops:

- `GET /health`
- `GET /ready`

## Backend Configuration and Environments

Files:

- [backend/.env.example](C:\Users\asima\Desktop\Projects\Scholr\backend\.env.example)
- [backend/.env.development.example](C:\Users\asima\Desktop\Projects\Scholr\backend\.env.development.example)
- [backend/.env.production.example](C:\Users\asima\Desktop\Projects\Scholr\backend\.env.production.example)

Key env vars:

- `APP_ENV`
- `DEBUG`
- `LOG_LEVEL`
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `CORS_ORIGINS`
- `SESSION_SECRET`
- `SESSION_COOKIE_NAME`
- `SESSION_COOKIE_SECURE`
- `AUTO_SEED`

Behavior notes:

- `AUTO_SEED=true` is for development only.
- Production should use `SESSION_COOKIE_SECURE=true`.
- `APP_ENV=production` should be the default assumption for deployment.

## Backend Logging and Error Handling

### Logging

Configured in [logging.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\core\logging.py).

Current behavior:

- global logging configured at app startup
- request-level logs include method, path, status, and duration
- request IDs are attached via middleware

### Errors

Configured in [exceptions.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\core\exceptions.py).

Current API error shape:

```json
{
  "detail": "Human-readable error message",
  "request_id": "uuid-or-null"
}
```

This is the error contract frontend code should expect.

## Database and Migrations

Migrations are managed with Alembic.

Important files:

- [alembic.ini](C:\Users\asima\Desktop\Projects\Scholr\backend\alembic.ini)
- [env.py](C:\Users\asima\Desktop\Projects\Scholr\backend\alembic\env.py)
- [20260328_0001_initial_schema.py](C:\Users\asima\Desktop\Projects\Scholr\backend\alembic\versions\20260328_0001_initial_schema.py)

Current migration state:

- Initial schema exists for `profiles`, `users`, and `scholarships`.
- Startup no longer auto-creates tables directly.
- Docker backend runs `alembic upgrade head` before booting Uvicorn.

Run locally:

```bash
cd backend
alembic upgrade head
```

## Current Frontend Structure

Root: `frontend/`

- `app/`
  Next.js app router pages.
- `components/`
  Shared UI components and app shell pieces.
- `providers/`
  React context providers for app-wide state management.
- `lib/`
  API client, auth hook, shared types, validation.

### Important Frontend Files

- [layout.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\app\layout.tsx)
  Global app layout wrapper.

- [globals.css](C:\Users\asima\Desktop\Projects\Scholr\frontend\app\globals.css)
  Global visual system and base background treatment.

- [page.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\app\page.tsx)
  Public landing page.

- [sign-in/page.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\app\sign-in\page.tsx)
  Sign-in route.

- [sign-up/page.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\app\sign-up\page.tsx)
  Sign-up route.

- [dashboard/page.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\app\dashboard\page.tsx)
  Main authenticated overview page.

- [scholarships/page.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\app\scholarships\page.tsx)
  Authenticated scholarship listing page.

- [app-shell.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\components\app-shell.tsx)
  Logged-in sidebar application shell.

- [auth-form.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\components\auth-form.tsx)
  Shared auth UI.

- [api.ts](C:\Users\asima\Desktop\Projects\Scholr\frontend\lib\api.ts)
  Central frontend API client.

- [auth-context.ts](C:\Users\asima\Desktop\Projects\Scholr\frontend\lib\auth-context.ts)
  Custom hook for accessing auth context.

- [validation.ts](C:\Users\asima\Desktop\Projects\Scholr\frontend\lib\validation.ts)
  Zod validation schemas.

- [auth-provider.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\providers\auth-provider.tsx)
  Authentication context provider with global state management.

- [app-provider.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\providers\app-provider.tsx)
  Root provider wrapper for the application.

## Frontend Routing Model

Public:

- `/`
- `/sign-in`
- `/sign-up`

Authenticated:

- `/dashboard`
- `/scholarships`

Current auth behavior:

- session is resolved via `GET /api/v1/auth/me`
- protected pages use the client auth hook
- unauthenticated users are redirected to `/sign-in`

## Frontend Theme and Design Tokens

The current UI theme is based on a bronze / bark / custard / paprika palette.

Primary theme source:

- [tailwind.config.ts](C:\Users\asima\Desktop\Projects\Scholr\frontend\tailwind.config.ts)

Color families available:

- `bronze`
- `bark`
- `custard`
- `chocolate`
- `paprika`

Notes for future UI work:

- Preserve the more mature SaaS direction.
- Avoid reverting to generic “soft pastel cards everywhere” design.
- Prefer stronger hierarchy, grid discipline, clearer app shell, and page purpose.

## Crawler Structure

Root: `crawler/scholr_crawler`

Important files:

- [main.py](C:\Users\asima\Desktop\Projects\Scholr\crawler\scholr_crawler\main.py)
- [scraper.py](C:\Users\asima\Desktop\Projects\Scholr\crawler\scholr_crawler\scraper.py)

Current behavior:

- launches Playwright
- visits configured URLs
- parses HTML via BeautifulSoup
- extracts:
  - `source_url`
  - `title`
  - `country`
  - `deadline`
  - `eligibility_text`

Current limitations:

- not integrated into a job queue
- no persistent ingestion pipeline into backend DB
- source extraction heuristics are basic
- no anti-bot or retry strategy yet

## Docker and Runtime Operations

Important files:

- [docker-compose.yml](C:\Users\asima\Desktop\Projects\Scholr\docker-compose.yml)
- [backend/Dockerfile](C:\Users\asima\Desktop\Projects\Scholr\backend\Dockerfile)
- [frontend/Dockerfile](C:\Users\asima\Desktop\Projects\Scholr\frontend\Dockerfile)

Compose services:

- `postgres`
- `backend`
- `frontend`

Backend container:

- applies migrations
- starts FastAPI
- exposes `8000`

Frontend container:

- builds Next.js app
- serves production build
- exposes `3000`

Local startup:

```bash
docker compose up --build
```

## Local Development Commands

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

### Crawler

```bash
cd crawler
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
playwright install
python -m scholr_crawler.main
```

## Production Gaps Still Open

This repo is now stronger than the original MVP, but still not fully production-complete.

Critical remaining work:

1. Add automated tests.
2. Add real scholarship persistence and admin ingestion flows.
3. Add background jobs for crawling and AI-heavy workflows.
4. Harden session auth with CSRF strategy and stronger lifecycle controls.
5. Add audit logging and richer observability.
6. Add role model / admin boundaries.
7. Replace seed-data assumptions in user-facing flows.
8. Add scholarship detail pages and richer saved/application states in the frontend.

## Safe Editing Guidance For Future Agents

When editing this project:

- Do not reintroduce `Base.metadata.create_all()` startup table creation.
- Use Alembic for schema changes.
- Keep API error responses compatible with `{ detail, request_id }`.
- Preserve session-cookie auth behavior unless intentionally redesigning auth.
- Keep the bronze/bark/custard/paprika visual system coherent across new pages.
- Avoid collapsing the app back into a single route or single-page auth/dashboard flow.
- Keep backend logic in `services/`, not inside route functions.
- Add new app-wide state to `providers/` directory, consume via custom hooks in `lib/`.
- If adding new production concerns, prefer isolated modules in `core/` or `services/`.

## Suggested Next Priorities

1. Backend tests for auth, profile, and matching.
2. Scholarship detail pages and application state machine.
3. Admin ingestion workflow for scholarships.
4. Background workers and async pipeline architecture.
5. Security hardening for production session auth.

