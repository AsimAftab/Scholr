# Backend Guide

## Stack

- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- Pydantic Settings
- Passlib

Root:

- `backend/`

## Structure

Inside `backend/app`:

- `api/`
- `core/`
- `db/`
- `models/`
- `schemas/`
- `services/`

## Important Files

- [main.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\main.py)
- [config.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\core\config.py)
- [logging.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\core\logging.py)
- [middleware.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\core\middleware.py)
- [exceptions.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\core\exceptions.py)
- [security.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\core\security.py)
- [session.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\db\session.py)
- [routes.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\api\routes.py)

## Models

- [user.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\models\user.py)
- [profile.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\models\profile.py)
- [scholarship.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\models\scholarship.py)

## Services

- [auth_service.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\services\auth_service.py)
- [profile_service.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\services\profile_service.py)
- [scholarship_service.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\services\scholarship_service.py)
- [matching.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\services\matching.py)
- [ai_service.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\services\ai_service.py)
- [seed.py](C:\Users\asima\Desktop\Projects\Scholr\backend\app\services\seed.py)

## Auth

Current auth model:

- signed session cookie
- `HttpOnly`
- frontend uses `credentials: "include"`
- current user resolved from signed cookie

Current env vars affecting auth:

- `SESSION_SECRET`
- `SESSION_COOKIE_NAME`
- `SESSION_COOKIE_SECURE`

Password hashing:

- `pbkdf2_sha256`

Known auth gaps:

- no CSRF protection
- no session rotation
- no password reset
- no email verification
- no RBAC

## Logging and Error Handling

Logging:

- configured at startup
- request logs include method, path, status, duration

Errors:

- normalized to `{ detail, request_id }`

This contract should be preserved unless there is an intentional breaking change.

## Migrations

Alembic files:

- [alembic.ini](C:\Users\asima\Desktop\Projects\Scholr\backend\alembic.ini)
- [env.py](C:\Users\asima\Desktop\Projects\Scholr\backend\alembic\env.py)
- [20260328_0001_initial_schema.py](C:\Users\asima\Desktop\Projects\Scholr\backend\alembic\versions\20260328_0001_initial_schema.py)

Important rule:

- do not reintroduce runtime `create_all()` table creation
- use Alembic for schema changes

## Env Files

- [backend/.env.example](C:\Users\asima\Desktop\Projects\Scholr\backend\.env.example)
- [backend/.env.development.example](C:\Users\asima\Desktop\Projects\Scholr\backend\.env.development.example)
- [backend/.env.production.example](C:\Users\asima\Desktop\Projects\Scholr\backend\.env.production.example)

Main settings:

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
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_FULL_NAME`

## Runtime Notes

- Docker backend runs `alembic upgrade head` before starting Uvicorn.
- `AUTO_SEED=true` is intended for local development only.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` can be set to bootstrap an admin account on startup.
- `/health` is lightweight.
- `/ready` checks DB readiness.

## Safe Editing Guidance

- keep business logic in `services/`
- keep route functions thin
- keep settings centralized in `core/config.py`
- do not mix migration logic into runtime code
- preserve normalized error responses
- avoid introducing DB schema drift outside Alembic

## Highest-Value Next Backend Work

1. automated tests
2. scholarship ingestion and persistence pipeline
3. session hardening and CSRF strategy
4. role model and admin endpoints
5. async jobs for crawler and AI workloads
