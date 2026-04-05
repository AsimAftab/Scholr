# Scholr

## Project Overview

Scholr is an AI-powered scholarship discovery and matching platform. It operates as a full-stack SaaS application composed of three primary services:

1.  **Frontend:** A user-facing web application built with Next.js 14 (App Router), React 18, TypeScript, and Tailwind CSS.
2.  **Backend:** A REST API built with Python, FastAPI, SQLAlchemy, and Alembic, backed by a PostgreSQL database. It handles authentication, profile management, scholarship matching, and AI-powered content generation.
3.  **Crawler:** A Python-based scraper using Playwright and BeautifulSoup to ingest scholarship opportunities from public sources.

## Documentation References

The project has a comprehensive `docs/` directory. When working on specific parts of the system or if you need more context, refer to these files:

*   **`docs/PROJECT_CONTEXT.md`:** The primary working context file. Explains system architecture, service boundaries, core domain models (User, Profile, Scholarship), authentication model, and highest-value next steps. Start here for a deep dive.
*   **`docs/QUICK_START.md`:** The shortest path to getting Scholr running locally (Docker or manual).
*   **`docs/API.md`:** Details the current REST API contract, endpoints, and base paths (`/api/v1`).
*   **`docs/BACKEND.md`:** Backend-specific guide detailing the FastAPI/SQLAlchemy stack and root structure.
*   **`docs/FRONTEND.md`:** Frontend-specific guide covering Next.js App Router conventions, Tailwind CSS usage, and route structures.
*   **`docs/CRAWLER.md`:** Guide for the Playwright/BeautifulSoup scholarship scraper.
*   **`docs/OPS.md`:** Operations guide covering Docker services (`postgres`, `backend`, `frontend`) and runtime entry points.
*   **`docs/ROADMAP.md`:** The recommended production roadmap, tracking planned phases and upcoming goals.
*   **`docs/README.md`:** The docs index providing the recommended reading order.

## Building and Running

The easiest way to run the entire stack locally is using Docker Compose.

**Using Docker (Recommended):**

```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker compose up --build

# Stop all services
docker compose down
```

The backend container is expected to become healthy on `http://localhost:8000/ready`, and the frontend uses `NEXT_PUBLIC_API_URL` to reach the API.

**Using PowerShell Scripts:**

The repository includes root-level scripts for quick local setup and execution:

```powershell
.\setup.ps1
.\run-backend.ps1
.\run-frontend.ps1
.\run-crawler.ps1
```

**Manual Local Setup:**

*   **Backend:**
    ```bash
    cd backend
    python -m venv .venv
    .venv\Scripts\activate # On Windows
    pip install -r requirements.txt
    copy .env.example .env
    alembic upgrade head
    uvicorn app.main:app --reload --port 8000
    ```
*   **Frontend:**
    ```bash
    cd frontend
    npm install
    copy .env.example .env.local
    npm run dev
    ```
*   **Crawler:**
    ```bash
    cd crawler
    python -m venv .venv
    .venv\Scripts\activate # On Windows
    pip install -r requirements.txt
    playwright install
    python -m scholr_crawler.main
    ```

## Development Conventions

*   **Architecture Boundaries:** The backend strictly separates API routes (`api/`), domain logic (`services/`), database models (`models/`), and schemas (`schemas/`). Business logic belongs in `services/`, not route handlers.
*   **Database Migrations:** Schema changes must be managed via Alembic. Do not use `Base.metadata.create_all()`. Run migrations with `alembic upgrade head`.
*   **Authentication:** The platform uses signed session cookies. Ensure `SESSION_SECRET` is properly set. The frontend resolves sessions via the `GET /api/v1/auth/me` endpoint and must point `NEXT_PUBLIC_API_URL` at the backend API base.
*   **Error Handling:** The backend normalizes API errors into a consistent `{ "detail": "message", "request_id": "uuid-or-null" }` JSON shape. The frontend API client (`lib/api.ts`) is hardened to parse Pydantic validation errors and include short Request IDs (RID) in user-facing alerts for rapid debugging.
*   **Data Integrity & Privacy:** GPA inputs use a robust text-based decimal validation with late-clamping to prevent `NaN` propagation. All AI prompt builders (`app/ai_prompts/`) strictly strip PII (names, emails, dates) and replace them with generic placeholders before reaching LLM providers.
*   **Infrastructure Resilience:** The AI provider layer features defensive bounds checking (choices[0] validation), non-empty response enforcement, and broad exception handling in the `MultiProvider` to ensure reliable fallback during upstream outages.
