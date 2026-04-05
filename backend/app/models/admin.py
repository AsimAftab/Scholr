from __future__ import annotations

from datetime import datetime
from enum import StrEnum
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.user import User

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class CrawlJobType(StrEnum):
    GLOBAL_INGEST = "global_ingest"
    SOURCE_SYNC = "source_sync"
    USER_REMATCH = "user_rematch"
    ALL_USERS_REMATCH = "all_users_rematch"


class CrawlJobStatus(StrEnum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class ScholarshipSourceConfig(Base):
    __tablename__ = "scholarship_sources"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    source_key: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    source_name: Mapped[str] = mapped_column(String(255))
    base_url: Mapped[str] = mapped_column(String(500))
    country: Mapped[str] = mapped_column(String(120), index=True)
    region: Mapped[str] = mapped_column(String(120), index=True)
    fetcher_kind: Mapped[str] = mapped_column(String(50), default="playwright")
    official: Mapped[bool] = mapped_column(Boolean, default=True)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    last_crawled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_success_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_run_id: Mapped[str | None] = mapped_column(String(120), nullable=True)
    last_error: Mapped[str | None] = mapped_column(Text, nullable=True)


class CrawlJob(Base):
    __tablename__ = "crawl_jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    job_type: Mapped[str] = mapped_column(String(50), index=True)
    status: Mapped[str] = mapped_column(String(50), index=True, default=CrawlJobStatus.PENDING.value)
    triggered_by_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    target_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    source_key: Mapped[str | None] = mapped_column(ForeignKey("scholarship_sources.source_key"), nullable=True)

    triggered_by_user: Mapped["User | None"] = relationship(
        foreign_keys=[triggered_by_user_id]
    )
    target_user: Mapped["User | None"] = relationship(
        foreign_keys=[target_user_id]
    )
    source: Mapped["ScholarshipSourceConfig | None"] = relationship(
        primaryjoin="CrawlJob.source_key==ScholarshipSourceConfig.source_key"
    )
    country_filter: Mapped[str | None] = mapped_column(String(120), nullable=True)
    region_filter: Mapped[str | None] = mapped_column(String(120), nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    total_items: Mapped[int] = mapped_column(Integer, default=0)
    processed_items: Mapped[int] = mapped_column(Integer, default=0)
    success_count: Mapped[int] = mapped_column(Integer, default=0)
    failed_count: Mapped[int] = mapped_column(Integer, default=0)
    log_output: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class AdminRuntimeSettings(Base):
    __tablename__ = "admin_runtime_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, default=1)
    ai_provider: Mapped[str] = mapped_column(String(50), default="openai")
    ai_fallback_order: Mapped[str] = mapped_column(Text, default="")
    openai_model: Mapped[str] = mapped_column(String(120), default="gpt-4o-mini")
    cerebras_model: Mapped[str] = mapped_column(String(120), default="llama3.1-8b")
    cerebras_max_completion_tokens: Mapped[int] = mapped_column(Integer, default=2048)
    glm_model: Mapped[str] = mapped_column(String(120), default="glm-5")
    glm_base_url: Mapped[str] = mapped_column(String(500), default="https://open.bigmodel.cn/api/paas/v4/")
    ollama_model: Mapped[str] = mapped_column(String(120), default="qwen3:8b")
    ollama_base_url: Mapped[str] = mapped_column(String(500), default="http://localhost:11434")
    ollama_timeout_seconds: Mapped[int] = mapped_column(Integer, default=600)
    ollama_keep_alive: Mapped[str] = mapped_column(String(50), default="30m")
    llm_match_top_n: Mapped[int] = mapped_column(Integer, default=12)
    llm_match_rule_weight: Mapped[float] = mapped_column(Float, default=0.6)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
