# Copilot Instructions for Scholr

Scholr is an AI-powered scholarship discovery and matching platform with three main services: **Frontend** (Next.js 14), **Backend** (FastAPI), and **Crawler** (Playwright).

## Documentation

The `docs/` directory contains comprehensive guides:

- **`docs/PROJECT_CONTEXT.md`** — System architecture, domain models, and next steps (start here)
- **`docs/QUICK_START.md`** — Fastest path to running Scholr locally
- **`docs/API.md`** — REST API contract (`/api/v1` endpoints)
- **`docs/BACKEND.md`** — FastAPI/SQLAlchemy stack details
- **`docs/FRONTEND.md`** — Next.js App Router conventions and theme
- **`docs/CRAWLER.md`** — Playwright scholarship scraper guide
- **`docs/OPS.md`** — Docker services and runtime operations
- **`docs/ROADMAP.md`** — Production roadmap and priorities

## Build, Test, and Lint

### Running the Stack

**Docker (recommended):**
```bash
docker compose up --build        # Start all services
docker compose up -d --build     # Start detached
docker compose down              # Stop all services
```

**PowerShell scripts:**
```powershell
.\setup.ps1                      # Initial setup
.\run-backend.ps1                # Backend only
.\run-frontend.ps1               # Frontend only
.\run-frontend.ps1 -Production   # Frontend in production mode
.\run-crawler.ps1                # Crawler only
```

### Backend (FastAPI)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate           # Windows
pip install -r requirements.txt
alembic upgrade head             # Run migrations
uvicorn app.main:app --reload --port 8000
```

**Database migrations:**
```bash
cd backend
alembic upgrade head             # Apply migrations
alembic revision --autogenerate -m "description"  # Create new migration
```

**No built-in tests yet** — integration and unit tests are planned.

### Frontend (Next.js 14)

```bash
cd frontend
npm install
npm run dev                      # Development server
npm run build                    # Production build
npm start                        # Production server
npm run lint                     # ESLint check
```

**No built-in tests yet** — Jest/React Testing Library setup is planned.

### Crawler (Playwright)

```bash
cd crawler
python -m venv .venv
.venv\Scripts\activate           # Windows
pip install -r requirements.txt
playwright install               # Install browser binaries
python -m scholr_crawler.main    # Run scraper
```

## High-Level Architecture

### Service Boundaries

```
Frontend (Next.js on :3000)
  ↓ HTTP + cookies
Backend (FastAPI on :8000)
  ↓ SQLAlchemy
PostgreSQL (:5432)

Crawler (standalone Python)
  → emits scholarship data
```

### Backend Structure (`backend/app/`)

- **`api/`** — Route handlers and dependency injection (`routes.py`, `deps.py`)
- **`core/`** — Settings, security, logging, middleware, exception handling
- **`db/`** — SQLAlchemy base and session management
- **`models/`** — ORM models (User, Profile, Scholarship)
- **`schemas/`** — Pydantic request/response models
- **`services/`** — Domain logic (auth, matching, AI generation, profile, scholarship)

**Critical:** Business logic belongs in `services/`, not in route handlers.

### Frontend Structure (`frontend/`)

- **`app/`** — Next.js App Router pages and layouts
  - Routes: `/`, `/sign-in`, `/sign-up`, `/dashboard`, `/scholarships`
- **`components/`** — Shared React components (app-shell, auth-form, scholarship-card)
- **`providers/`** — React Context providers (auth state management)
- **`lib/`** — API client (`api.ts`), auth hook (`auth-context.ts`), types, validation

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

**User:** `id`, `email`, `full_name`, `hashed_password`, `profile_id` (references Profile.id)

**Profile:** `id`, `country`, `target_country`, `degree`, `gpa`, `ielts_score`

**Scholarship:** `id`, `title`, `country`, `degree`, `source_url`, `deadline`, `eligibility_text`, `structured_eligibility`

## Key Conventions

### Backend

**Database Migrations:**
- Schema changes must use Alembic migrations
- Never use `Base.metadata.create_all()` — this pattern was removed
- Run `alembic upgrade head` before starting the server

**Error Handling:**
- All API errors return `{ "detail": "message", "request_id": "uuid" }`
- Request IDs are assigned by middleware and logged automatically
- Preserve this error shape unless making an intentional breaking change

**Service Layer:**
- Business logic lives in `services/`, not route handlers
- Services handle orchestration, validation, and persistence
- Route handlers delegate to services and return schemas

**AI Integration:**
- AI features degrade gracefully to mock outputs if `OPENAI_API_KEY` is not set
- Use `AIService` for all OpenAI-compatible generation (SOP, LOR, summarization, structuring)

**Logging:**
- Request logs include method, path, status code, and duration
- Use the centralized logger from `app.core.logging`

### Frontend

**Routing:**
- Follow Next.js App Router conventions (`layout.tsx`, `page.tsx`)
- Protected routes use `useAuthContext()` and redirect to `/sign-in` if unauthenticated

**State Management:**
- App-wide state lives in `providers/` directory
- Auth state is managed by `AuthProvider` and accessed via `useAuthContext()`
- Auth persists across route changes without page refreshes

**Data Fetching:**
- Use `lib/api.ts` for all backend communication
- API client includes `credentials: "include"` for cookie-based auth
- Handle errors consistently with backend's `{ detail, request_id }` shape

**Validation:**
- Use Zod schemas in `lib/validation.ts` for client-side validation
- Validation schemas mirror backend Pydantic models where applicable

**Styling:**
- Currently uses neutral zinc palette from Tailwind
- Custom color tokens (`bronze`, `bark`, `custard`, `chocolate`, `paprika`) are planned but not yet implemented
- Maintain the "serious SaaS" visual direction when adding new components
- Avoid generic startup gradients or toy-like UI patterns
- Preserve the sidebar shell for authenticated areas

### Authentication Model

- Cookie-based sessions using signed tokens (`SESSION_SECRET`)
- Backend sets `HttpOnly` cookie on signup/login
- Frontend resolves sessions via `GET /api/v1/auth/me` on app load
- Auth state managed globally through React Context (`AuthProvider`)
- Protected routes check auth state and redirect unauthenticated users

**Known gaps:**
- No CSRF protection
- No session rotation
- No password reset flow
- No email verification
- No RBAC (role-based access control)

### Environment Variables

**Backend:**
- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — Required for session signing
- `OPENAI_API_KEY` — Optional (AI features degrade to mocks if missing)
- `OPENAI_MODEL` — Default: `gpt-4.1-mini`
- `AUTO_SEED` — Dev-only seed data toggle
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_FULL_NAME` — Admin user bootstrap

**Frontend:**
- `NEXT_PUBLIC_API_URL` — Backend API base URL (default: `http://localhost:8000/api/v1`)

## Runtime

- PostgreSQL defaults to `localhost:5432` (user/pass: `scholr/scholr`)
- Backend runs on `http://localhost:8000`
- Frontend runs on `http://localhost:3000`
- Docker healthchecks ensure PostgreSQL is ready before starting backend
- Backend container runs `alembic upgrade head` before serving traffic

## Safe Editing Guidelines

- Do not reintroduce `Base.metadata.create_all()` — use Alembic migrations
- Keep business logic in service layer, not route handlers
- Maintain the `{ detail, request_id }` error response shape
- Use Alembic for any schema changes
- Test AI features with and without `OPENAI_API_KEY` to ensure graceful degradation
