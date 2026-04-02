from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.ai_providers.runtime import AIRuntimeSettings
from app.core.config import settings
from app.models.admin import AdminRuntimeSettings


def load_runtime_ai_settings(db: Session | None = None) -> AIRuntimeSettings:
    record = db.get(AdminRuntimeSettings, 1) if db is not None else None
    return AIRuntimeSettings(
        ai_provider=record.ai_provider if record else settings.ai_provider,
        ai_fallback_order=_split_fallback(record.ai_fallback_order if record else settings.ai_fallback_order_raw),
        openai_api_key=settings.openai_api_key,
        openai_model=record.openai_model if record else settings.openai_model,
        cerebras_api_key=settings.cerebras_api_key,
        cerebras_model=record.cerebras_model if record else settings.cerebras_model,
        cerebras_max_completion_tokens=record.cerebras_max_completion_tokens if record else settings.cerebras_max_completion_tokens,
        glm_api_key=settings.glm_api_key,
        glm_model=record.glm_model if record else settings.glm_model,
        glm_base_url=record.glm_base_url if record else settings.glm_base_url,
        ollama_model=record.ollama_model if record else settings.ollama_model,
        ollama_base_url=record.ollama_base_url if record else settings.ollama_base_url,
        ollama_timeout_seconds=record.ollama_timeout_seconds if record else settings.ollama_timeout_seconds,
        ollama_keep_alive=record.ollama_keep_alive if record else settings.ollama_keep_alive,
        llm_match_top_n=record.llm_match_top_n if record else settings.llm_match_top_n,
        llm_match_rule_weight=float(record.llm_match_rule_weight if record else settings.llm_match_rule_weight),
    )


def ensure_runtime_settings(db: Session) -> AdminRuntimeSettings:
    row = db.get(AdminRuntimeSettings, 1)
    if row is None:
        row = AdminRuntimeSettings(
            id=1,
            ai_provider=settings.ai_provider,
            ai_fallback_order=settings.ai_fallback_order_raw,
            openai_model=settings.openai_model,
            cerebras_model=settings.cerebras_model,
            cerebras_max_completion_tokens=settings.cerebras_max_completion_tokens,
            glm_model=settings.glm_model,
            glm_base_url=settings.glm_base_url,
            ollama_model=settings.ollama_model,
            ollama_base_url=settings.ollama_base_url,
            ollama_timeout_seconds=settings.ollama_timeout_seconds,
            ollama_keep_alive=settings.ollama_keep_alive,
            llm_match_top_n=settings.llm_match_top_n,
            llm_match_rule_weight=str(settings.llm_match_rule_weight),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


def _split_fallback(raw: str) -> list[str]:
    return [item.strip().lower() for item in raw.split(",") if item.strip()]
