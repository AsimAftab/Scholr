from __future__ import annotations

from dataclasses import dataclass


@dataclass(slots=True)
class AIRuntimeSettings:
    ai_provider: str
    ai_fallback_order: list[str]
    openai_api_key: str | None
    openai_model: str
    cerebras_api_key: str | None
    cerebras_model: str
    cerebras_max_completion_tokens: int
    glm_api_key: str | None
    glm_model: str
    glm_base_url: str
    ollama_model: str
    ollama_base_url: str
    ollama_timeout_seconds: int
    ollama_keep_alive: str
    llm_match_top_n: int
    llm_match_rule_weight: float
