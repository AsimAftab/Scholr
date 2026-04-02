from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


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
    total_users: int
    total_scholarships: int
    last_ingestion_at: datetime | None = None


class AdminAISettingsRead(BaseModel):
    ai_provider: str
    ai_fallback_order: list[str]
    openai_model: str
    cerebras_model: str
    cerebras_max_completion_tokens: int
    glm_model: str
    glm_base_url: str
    ollama_model: str
    ollama_base_url: str
    ollama_timeout_seconds: int
    ollama_keep_alive: str
    llm_match_top_n: int
    llm_match_rule_weight: float
    openai_key_configured: bool
    cerebras_key_configured: bool
    glm_key_configured: bool


class AdminAISettingsUpdate(BaseModel):
    ai_provider: str = Field(min_length=1)
    ai_fallback_order: list[str] = Field(default_factory=list)
    openai_model: str = Field(min_length=1)
    cerebras_model: str = Field(min_length=1)
    cerebras_max_completion_tokens: int = Field(ge=1, le=32768)
    glm_model: str = Field(min_length=1)
    glm_base_url: str = Field(min_length=1)
    ollama_model: str = Field(min_length=1)
    ollama_base_url: str = Field(min_length=1)
    ollama_timeout_seconds: int = Field(ge=10, le=3600)
    ollama_keep_alive: str = Field(min_length=1, max_length=50)
    llm_match_top_n: int = Field(ge=1, le=100)
    llm_match_rule_weight: float = Field(ge=0.0, le=1.0)
