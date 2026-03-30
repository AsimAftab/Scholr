from __future__ import annotations

import logging
from datetime import datetime, timezone

from sqlalchemy import delete, func, select
from sqlalchemy.orm import Session

from app.models.admin import CrawlJob, CrawlJobStatus, CrawlJobType, ScholarshipSourceConfig
from app.models.scholarship import Scholarship
from app.models.user import User
from app.models.user_scholarship_match import UserScholarshipMatch
from app.schemas.admin import AdminOverview, CrawlJobCreate, RematchJobCreate
from app.schemas.profile import ProfileRead
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

    def create_crawl_job(self, admin_user: User, payload: CrawlJobCreate) -> CrawlJob:
        job_type = CrawlJobType.SOURCE_SYNC.value if payload.source_key else CrawlJobType.GLOBAL_INGEST.value
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

    def create_rematch_job(self, admin_user: User, payload: RematchJobCreate) -> CrawlJob:
        if payload.all_users:
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

        if payload.user_id is None:
            raise ValueError("user_id is required when all_users is false")

        user = self.db.get(User, payload.user_id)
        if user is None or user.profile is None:
            raise ValueError("Target user with profile not found")

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

    def recompute_matches_for_user(self, user: User) -> None:
        profile = ProfileRead.model_validate(user.profile)
        response = MatchingService(self.db).match(profile)

        # Bulk delete existing matches
        self.db.execute(delete(UserScholarshipMatch).where(UserScholarshipMatch.user_id == user.id))
        self.db.flush()

        # Bulk insert new matches
        now = datetime.now(timezone.utc)
        new_matches = [
            UserScholarshipMatch(
                user_id=user.id,
                scholarship_id=match.scholarship_id,
                match_score=match.match_score,
                missing_requirements=match.missing_requirements,
                computed_at=now,
            )
            for match in response.matches
        ]
        self.db.add_all(new_matches)
        self.db.flush()
