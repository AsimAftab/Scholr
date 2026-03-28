from contextlib import asynccontextmanager
import asyncio

from fastapi import FastAPI
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.routes import router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging
from app.core.middleware import RequestContextMiddleware
from app.db.session import get_db
from app.models import admin as _admin  # noqa: F401
from app.models import profile as _profile  # noqa: F401
from app.models import scholarship as _scholarship  # noqa: F401
from app.models import user as _user  # noqa: F401
from app.models import user_scholarship_match as _user_scholarship_match  # noqa: F401
from app.services.job_runner import JobRunner
from app.services.seed import seed_database

configure_logging(settings.log_level)


@asynccontextmanager
async def lifespan(_: FastAPI):
    seed_database()
    runner = JobRunner()
    task = asyncio.create_task(runner.run_forever())
    yield
    runner.stop()
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass


app = FastAPI(
    title="Scholr API",
    version="0.1.0",
    lifespan=lifespan,
    debug=settings.debug,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestContextMiddleware)
register_exception_handlers(app)

app.include_router(router, prefix="/api/v1")


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/ready")
def readiness(db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {"status": "ready"}
