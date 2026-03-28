from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timezone
from itertools import islice

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.admin import CrawlJob, CrawlJobStatus, CrawlJobType, ScholarshipSourceConfig
from app.models.user import User
from app.services.admin_service import AdminService
from app.services.scholarship_ingestion import ScholarshipIngestionService
from app.services.tinyfish_client import TinyFishClient, TinyFishRunResult

logger = logging.getLogger(__name__)


class JobRunner:
    def __init__(self, poll_interval_seconds: int = 5) -> None:
        self.poll_interval_seconds = poll_interval_seconds
        self._running = True

    async def run_forever(self) -> None:
        while self._running:
            try:
                processed = await asyncio.to_thread(self.process_next_job)
                if not processed:
                    await asyncio.sleep(self.poll_interval_seconds)
            except asyncio.CancelledError:
                raise
            except Exception:
                logger.exception("Job runner loop failed")
                await asyncio.sleep(self.poll_interval_seconds)

    def stop(self) -> None:
        self._running = False

    def process_next_job(self) -> bool:
        db: Session = SessionLocal()
        try:
            job = db.scalar(
                select(CrawlJob)
                .where(CrawlJob.status == CrawlJobStatus.PENDING.value)
                .order_by(CrawlJob.created_at.asc())
                .limit(1)
            )
            if job is None:
                return False

            self._mark_running(db, job)
            try:
                completed = True
                if job.job_type in (CrawlJobType.GLOBAL_INGEST.value, CrawlJobType.SOURCE_SYNC.value):
                    completed = self._run_ingest_job(db, job)
                elif job.job_type == CrawlJobType.USER_REMATCH.value:
                    self._run_user_rematch_job(db, job)
                elif job.job_type == CrawlJobType.ALL_USERS_REMATCH.value:
                    self._run_all_users_rematch_job(db, job)
                else:
                    raise ValueError(f"Unsupported job type: {job.job_type}")

                if completed:
                    job.status = CrawlJobStatus.COMPLETED.value
                    job.finished_at = datetime.now(timezone.utc)
                    job.updated_at = datetime.now(timezone.utc)
                    self._append_log(job, "Job completed successfully.")
                else:
                    job.status = CrawlJobStatus.PENDING.value
                    job.updated_at = datetime.now(timezone.utc)
                    self._append_log(job, "Remote TinyFish runs are still in progress. Job requeued.")
                db.commit()
            except Exception as error:
                db.rollback()
                job = db.get(CrawlJob, job.id)
                if job is None:
                    raise
                job.status = CrawlJobStatus.FAILED.value
                job.error_message = str(error)
                job.finished_at = datetime.now(timezone.utc)
                job.updated_at = datetime.now(timezone.utc)
                self._append_log(job, f"Job failed: {error}")
                db.commit()
                logger.exception("Job %s failed", job.id)
            return True
        finally:
            db.close()

    def _mark_running(self, db: Session, job: CrawlJob) -> None:
        job.status = CrawlJobStatus.RUNNING.value
        if job.started_at is None:
            job.started_at = datetime.now(timezone.utc)
        job.updated_at = datetime.now(timezone.utc)
        job.error_message = None
        self._append_log(job, "Runner picked up the job.")
        db.commit()

    def _run_ingest_job(self, db: Session, job: CrawlJob) -> bool:
        query = select(ScholarshipSourceConfig).where(ScholarshipSourceConfig.enabled.is_(True))
        if job.source_key:
            query = query.where(ScholarshipSourceConfig.source_key == job.source_key)
        if job.country_filter:
            query = query.where(ScholarshipSourceConfig.country == job.country_filter)
        if job.region_filter:
            query = query.where(ScholarshipSourceConfig.region == job.region_filter)

        sources = list(db.scalars(query.order_by(ScholarshipSourceConfig.region, ScholarshipSourceConfig.country)).all())
        if job.total_items == 0 and job.processed_items == 0:
            job.total_items = len(sources)
            job.processed_items = 0
            job.success_count = 0
            job.failed_count = 0
            job.updated_at = datetime.now(timezone.utc)
            self._append_log(job, f"Starting ingestion across {len(sources)} source(s).")
            db.commit()
        else:
            self._append_log(job, "Resuming ingestion for unfinished TinyFish runs.")
            job.updated_at = datetime.now(timezone.utc)
            db.commit()

        ingestion = ScholarshipIngestionService(db)
        tinyfish = TinyFishClient()
        batch_size = max(1, min(settings.tinyfish_batch_size, 100))
        remaining_sources = [source for source in sources if self._source_needs_processing(job, source)]
        has_pending_remote_runs = False
        for source_batch in self._chunk_sources(remaining_sources, batch_size):
            if self._submit_and_process_batch(db, job, source_batch, tinyfish, ingestion):
                has_pending_remote_runs = True

        if not sources:
            self._append_log(job, "No enabled sources matched the filters.")
            job.updated_at = datetime.now(timezone.utc)
            db.commit()
            return True
        return not has_pending_remote_runs and job.processed_items >= job.total_items

    def _submit_and_process_batch(
        self,
        db: Session,
        job: CrawlJob,
        source_batch: list[ScholarshipSourceConfig],
        tinyfish: TinyFishClient,
        ingestion: ScholarshipIngestionService,
    ) -> bool:
        sources_to_start = [source for source in source_batch if not self._source_has_active_remote_run(job, source)]
        run_to_source: dict[str, ScholarshipSourceConfig] = {}
        if sources_to_start:
            run_payloads = [ingestion.build_run_request(source) for source in sources_to_start]
            run_ids = tinyfish.start_batch_runs(run_payloads)
            submitted_at = datetime.now(timezone.utc)

            for source, run_id in zip(sources_to_start, run_ids, strict=True):
                source.last_crawled_at = submitted_at
                source.last_run_id = run_id
                source.last_error = None
                run_to_source[run_id] = source
                self._append_log(job, f"Queued source {source.source_key} as TinyFish run {run_id}.")

            job.updated_at = datetime.now(timezone.utc)
            db.commit()

        for source in source_batch:
            if source.last_run_id:
                run_to_source[source.last_run_id] = source

        run_ids = list(run_to_source)
        results, pending_run_ids = tinyfish.wait_for_runs(run_ids)
        for run_id, result in results.items():
            source = run_to_source[run_id]
            self._settle_source_run(db, job, source, result, ingestion)
        for pending_run_id in pending_run_ids:
            source = run_to_source[pending_run_id]
            self._append_log(job, f"Source {source.source_key} is still running remotely as TinyFish run {pending_run_id}.")
            job.updated_at = datetime.now(timezone.utc)
            db.commit()
        return bool(pending_run_ids)

    def _settle_source_run(
        self,
        db: Session,
        job: CrawlJob,
        source: ScholarshipSourceConfig,
        run: TinyFishRunResult | None,
        ingestion: ScholarshipIngestionService,
    ) -> None:
        try:
            if run is None:
                raise ValueError("TinyFish run result was missing from batch lookup")
            if run.status != "COMPLETED":
                raise ValueError(run.error or f"TinyFish run ended with status {run.status}")

            result = ingestion.ingest_completed_run(source, run)
            source.last_success_at = datetime.now(timezone.utc)
            source.last_error = None
            job.success_count += 1
            self._append_log(
                job,
                (
                    f"Processed source {source.source_key} "
                    f"(run {result.run_id}, total {result.total}, "
                    f"created {result.created}, updated {result.updated})."
                ),
            )
        except Exception as error:
            source.last_error = str(error)
            job.failed_count += 1
            self._append_log(job, f"Failed source {source.source_key}: {error}")
        finally:
            job.processed_items += 1
            job.updated_at = datetime.now(timezone.utc)
            db.commit()

    def _run_user_rematch_job(self, db: Session, job: CrawlJob) -> None:
        if job.target_user_id is None:
            raise ValueError("Target user id missing for user rematch job")
        user = db.get(User, job.target_user_id)
        if user is None or user.profile is None:
            raise ValueError("Target user with profile not found")

        job.total_items = 1
        job.processed_items = 0
        job.success_count = 0
        job.failed_count = 0
        self._append_log(job, f"Recomputing matches for user {user.id}.")
        db.commit()

        AdminService(db).recompute_matches_for_user(user)
        job.processed_items = 1
        job.success_count = 1
        job.updated_at = datetime.now(timezone.utc)
        self._append_log(job, f"Stored refreshed match snapshot for user {user.id}.")
        db.commit()

    def _run_all_users_rematch_job(self, db: Session, job: CrawlJob) -> None:
        users = list(db.scalars(select(User).where(User.profile_id.is_not(None)).order_by(User.id)).all())
        job.total_items = len(users)
        job.processed_items = 0
        job.success_count = 0
        job.failed_count = 0
        self._append_log(job, f"Recomputing matches for {len(users)} profiled user(s).")
        db.commit()

        service = AdminService(db)
        for user in users:
            try:
                service.recompute_matches_for_user(user)
                job.success_count += 1
                self._append_log(job, f"Recomputed user {user.id}.")
            except Exception as error:
                job.failed_count += 1
                self._append_log(job, f"Failed user {user.id}: {error}")
                logger.exception("Failed rematch for user %s", user.id)
            finally:
                job.processed_items += 1
                job.updated_at = datetime.now(timezone.utc)
                db.commit()

    def _append_log(self, job: CrawlJob, message: str) -> None:
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        line = f"[{timestamp}] {message}"
        job.log_output = f"{job.log_output}\n{line}".strip() if job.log_output else line

    def _chunk_sources(
        self,
        sources: list[ScholarshipSourceConfig],
        batch_size: int,
    ) -> list[list[ScholarshipSourceConfig]]:
        iterator = iter(sources)
        batches: list[list[ScholarshipSourceConfig]] = []
        while batch := list(islice(iterator, batch_size)):
            batches.append(batch)
        return batches

    def _source_needs_processing(self, job: CrawlJob, source: ScholarshipSourceConfig) -> bool:
        return not self._source_completed_for_job(job, source) and not self._source_failed_for_job(job, source)

    def _source_has_active_remote_run(self, job: CrawlJob, source: ScholarshipSourceConfig) -> bool:
        return (
            self._source_started_for_job(job, source)
            and bool(source.last_run_id)
            and not self._source_completed_for_job(job, source)
            and not self._source_failed_for_job(job, source)
        )

    def _source_completed_for_job(self, job: CrawlJob, source: ScholarshipSourceConfig) -> bool:
        return (
            self._source_started_for_job(job, source)
            and source.last_success_at is not None
            and source.last_crawled_at is not None
            and source.last_success_at >= source.last_crawled_at
        )

    def _source_failed_for_job(self, job: CrawlJob, source: ScholarshipSourceConfig) -> bool:
        return (
            self._source_started_for_job(job, source)
            and bool(source.last_error)
            and not self._source_completed_for_job(job, source)
        )

    def _source_started_for_job(self, job: CrawlJob, source: ScholarshipSourceConfig) -> bool:
        return (
            job.started_at is not None
            and source.last_crawled_at is not None
            and source.last_crawled_at >= job.started_at
        )
