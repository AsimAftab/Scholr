from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, model_validator


class CrawlJobCreate(BaseModel):
    source_key: str | None = None
    country_filter: str | None = None
    region_filter: str | None = None


class RematchJobCreate(BaseModel):
    user_id: int | None = None
    all_users: bool = False

    @model_validator(mode='after')
    def check_target_specified(self) -> 'RematchJobCreate':
        if self.user_id is None and not self.all_users:
            raise ValueError("Either 'user_id' must be specified or 'all_users' must be True")
        if self.user_id is not None and self.all_users:
            raise ValueError("Cannot specify both 'user_id' and 'all_users'")
        return self


class ScholarshipSourceConfigRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    source_key: str
    source_name: str
    base_url: str
    country: str
    region: str
    fetcher_kind: str
    official: bool
    enabled: bool
    last_crawled_at: datetime | None = None
    last_success_at: datetime | None = None
    last_run_id: str | None = None
    last_error: str | None = None


class CrawlJobRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    job_type: str
    status: str
    triggered_by_user_id: int | None = None
    target_user_id: int | None = None
    source_key: str | None = None
    country_filter: str | None = None
    region_filter: str | None = None
    error_message: str | None = None
    total_items: int
    processed_items: int
    success_count: int
    failed_count: int
    log_output: str | None = None
    created_at: datetime
    updated_at: datetime
    started_at: datetime | None = None
    finished_at: datetime | None = None


class AdminOverview(BaseModel):
    total_sources: int
    enabled_sources: int
    total_jobs: int
    pending_jobs: int
    running_jobs: int
    completed_jobs: int
    failed_jobs: int
    total_match_snapshots: int
