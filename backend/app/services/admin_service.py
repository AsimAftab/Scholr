import logging
from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.models.admin import AdminRuntimeSettings, CrawlJob, CrawlJobStatus, CrawlJobType, ScholarshipSourceConfig
from app.models.scholarship import Scholarship
from app.models.user import User
from app.models.user_scholarship_match import UserScholarshipMatch
from app.schemas.admin import AdminAISettingsRead, AdminAISettingsUpdate, AdminOverview, CrawlJobCreate, RematchJobCreate
from app.schemas.profile import ProfileRead
from app.services.ai_runtime_settings import ensure_runtime_settings
from app.services.matching import MatchingService

logger = logging.getLogger(__name__)


class AdminService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_sources(self) -> list[ScholarshipSourceConfig]:
        return list(
            self.db.scalars(
                select(ScholarshipSourceConfig).order_by(
                    ScholarshipSourceConfig.region,
                    ScholarshipSourceConfig.country,
                    ScholarshipSourceConfig.source_name,
                )
            ).all()
        )

    def list_jobs(self) -> list[CrawlJob]:
        return list(self.db.scalars(select(CrawlJob).order_by(CrawlJob.created_at.desc())).all())

    def get_overview(self) -> AdminOverview:
        total_sources = self.db.scalar(select(func.count()).select_from(ScholarshipSourceConfig)) or 0
        enabled_sources = (
            self.db.scalar(
                select(func.count()).select_from(ScholarshipSourceConfig).where(ScholarshipSourceConfig.enabled.is_(True))
            )
            or 0
        )
        total_jobs = self.db.scalar(select(func.count()).select_from(CrawlJob)) or 0
        pending_jobs = (
            self.db.scalar(select(func.count()).select_from(CrawlJob).where(CrawlJob.status == CrawlJobStatus.PENDING.value))
            or 0
        )
        running_jobs = (
            self.db.scalar(select(func.count()).select_from(CrawlJob).where(CrawlJob.status == CrawlJobStatus.RUNNING.value))
            or 0
        )
        completed_jobs = (
            self.db.scalar(
                select(func.count()).select_from(CrawlJob).where(CrawlJob.status == CrawlJobStatus.COMPLETED.value)
            )
            or 0
        )
        failed_jobs = (
            self.db.scalar(select(func.count()).select_from(CrawlJob).where(CrawlJob.status == CrawlJobStatus.FAILED.value))
            or 0
        )
        total_match_snapshots = self.db.scalar(select(func.count()).select_from(UserScholarshipMatch)) or 0
        
        total_users = self.db.scalar(select(func.count()).select_from(User)) or 0
        total_scholarships = self.db.scalar(select(func.count()).select_from(Scholarship)) or 0
        last_ingestion_at = self.db.scalar(
            select(func.max(CrawlJob.finished_at))
            .where(
                CrawlJob.status == CrawlJobStatus.COMPLETED.value,
                CrawlJob.job_type.in_([CrawlJobType.GLOBAL_INGEST.value, CrawlJobType.SOURCE_SYNC.value])
            )
        )

        return AdminOverview(
            total_sources=total_sources,
            enabled_sources=enabled_sources,
            total_jobs=total_jobs,
            pending_jobs=pending_jobs,
            running_jobs=running_jobs,
            completed_jobs=completed_jobs,
            failed_jobs=failed_jobs,
            total_match_snapshots=total_match_snapshots,
            total_users=total_users,
            total_scholarships=total_scholarships,
            last_ingestion_at=last_ingestion_at,
        )

    def get_ai_settings(self) -> AdminAISettingsRead:
        try:
            row = ensure_runtime_settings(self.db)
            return self._serialize_ai_settings(row)
        except SQLAlchemyError as error:
            logger.exception("Failed to load admin AI settings")
            raise RuntimeError("Unable to load admin AI settings") from error

    def update_ai_settings(self, payload: AdminAISettingsUpdate) -> AdminAISettingsRead:
        try:
            row = ensure_runtime_settings(self.db)
            row.ai_provider = payload.ai_provider.strip().lower()
            row.ai_fallback_order = ",".join(self._normalize_fallback_order(payload.ai_fallback_order, row.ai_provider))
            row.openai_model = payload.openai_model.strip()
            row.cerebras_model = payload.cerebras_model.strip()
            row.cerebras_max_completion_tokens = payload.cerebras_max_completion_tokens
            row.glm_model = payload.glm_model.strip()
            row.glm_base_url = payload.glm_base_url.strip()
            row.ollama_model = payload.ollama_model.strip()
            row.ollama_base_url = payload.ollama_base_url.strip()
            row.ollama_timeout_seconds = payload.ollama_timeout_seconds
            row.ollama_keep_alive = payload.ollama_keep_alive.strip()
            row.llm_match_top_n = payload.llm_match_top_n
            row.llm_match_rule_weight = str(payload.llm_match_rule_weight)
            row.updated_at = datetime.now(timezone.utc)
            self.db.add(row)
            self.db.commit()
            self.db.refresh(row)
            return self._serialize_ai_settings(row)
        except SQLAlchemyError as error:
            self.db.rollback()
            logger.exception("Failed to update admin AI settings")
            raise RuntimeError("Unable to update admin AI settings") from error

    def create_crawl_job(self, admin_user: User, payload: CrawlJobCreate) -> CrawlJob:
        job_type = CrawlJobType.SOURCE_SYNC.value if payload.source_key else CrawlJobType.GLOBAL_INGEST.value
        try:
            job = CrawlJob(
                job_type=job_type,
                status=CrawlJobStatus.PENDING.value,
                triggered_by_user_id=admin_user.id,
                source_key=payload.source_key,
                country_filter=payload.country_filter,
                region_filter=payload.region_filter,
                log_output="Job created and waiting for runner.",
                updated_at=datetime.now(timezone.utc),
            )
            self.db.add(job)
            self.db.commit()
            self.db.refresh(job)
            return job
        except SQLAlchemyError as error:
            self.db.rollback()
            logger.exception("Failed to create crawl job for admin user %s", admin_user.id)
            raise RuntimeError("Unable to create crawl job") from error

    def create_rematch_job(self, admin_user: User, payload: RematchJobCreate) -> CrawlJob:
        if payload.all_users:
            try:
                job = CrawlJob(
                    job_type=CrawlJobType.ALL_USERS_REMATCH.value,
                    status=CrawlJobStatus.PENDING.value,
                    triggered_by_user_id=admin_user.id,
                    log_output="Rematch job created and waiting for runner.",
                    updated_at=datetime.now(timezone.utc),
                )
                self.db.add(job)
                self.db.commit()
                self.db.refresh(job)
                return job
            except SQLAlchemyError as error:
                self.db.rollback()
                logger.exception("Failed to create all-users rematch job for admin user %s", admin_user.id)
                raise RuntimeError("Unable to create rematch job") from error

        if payload.user_id is None:
            raise ValueError("user_id is required when all_users is false")

        user = self.db.get(User, payload.user_id)
        if user is None or user.profile is None:
            raise ValueError("Target user with profile not found")

        try:
            job = CrawlJob(
                job_type=CrawlJobType.USER_REMATCH.value,
                status=CrawlJobStatus.PENDING.value,
                triggered_by_user_id=admin_user.id,
                target_user_id=user.id,
                log_output="Rematch job created and waiting for runner.",
                updated_at=datetime.now(timezone.utc),
            )
            self.db.add(job)
            self.db.commit()
            self.db.refresh(job)
            return job
        except SQLAlchemyError as error:
            self.db.rollback()
            logger.exception(
                "Failed to create user rematch job for admin user %s and target user %s",
                admin_user.id,
                user.id,
            )
            raise RuntimeError("Unable to create rematch job") from error

    def recompute_matches_for_user(self, user: User) -> None:
        profile = ProfileRead.model_validate(user.profile)
        MatchingService(self.db).match(profile, user_id=user.id, force_refresh=True)

    def _serialize_ai_settings(self, row: AdminRuntimeSettings) -> AdminAISettingsRead:
        fallback = [item.strip() for item in row.ai_fallback_order.split(",") if item.strip()]
        return AdminAISettingsRead(
            ai_provider=row.ai_provider,
            ai_fallback_order=fallback,
            openai_model=row.openai_model,
            cerebras_model=row.cerebras_model,
            cerebras_max_completion_tokens=row.cerebras_max_completion_tokens,
            glm_model=row.glm_model,
            glm_base_url=row.glm_base_url,
            ollama_model=row.ollama_model,
            ollama_base_url=row.ollama_base_url,
            ollama_timeout_seconds=row.ollama_timeout_seconds,
            ollama_keep_alive=row.ollama_keep_alive,
            llm_match_top_n=row.llm_match_top_n,
            llm_match_rule_weight=float(row.llm_match_rule_weight),
            openai_key_configured=bool(settings.openai_api_key),
            cerebras_key_configured=bool(settings.cerebras_api_key),
            glm_key_configured=bool(settings.glm_api_key),
        )

    def _normalize_fallback_order(self, providers: list[str], active_provider: str) -> list[str]:
        seen: set[str] = set()
        ordered: list[str] = []
        normalized_active = active_provider.strip().lower()
        for provider in providers:
            normalized = provider.strip().lower()
            if not normalized or normalized == normalized_active or normalized in seen:
                continue
            seen.add(normalized)
            ordered.append(normalized)
        return ordered
