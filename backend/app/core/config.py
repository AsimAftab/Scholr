from functools import lru_cache
from urllib.parse import urlparse

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

VALID_APP_ENVS = {"development", "test", "staging", "production"}
VALID_AI_PROVIDERS = {"openai", "cerebras", "glm", "ollama", "local"}
VALID_LOG_LEVELS = {"CRITICAL", "ERROR", "WARNING", "INFO", "DEBUG"}


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local"),
        env_ignore_empty=True,
        extra="ignore",
    )

    app_env: str = Field(default="development", alias="APP_ENV")
    debug: bool = Field(default=False, alias="DEBUG")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    database_url: str = Field(alias="DATABASE_URL")
    ai_provider: str = Field(default="openai", alias="AI_PROVIDER")
    ai_fallback_order_raw: str = Field(default="", alias="AI_FALLBACK_ORDER")
    openai_api_key: str | None = Field(default=None, alias="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4o-mini", alias="OPENAI_MODEL")
    cerebras_api_key: str | None = Field(default=None, alias="CEREBRAS_API_KEY")
    cerebras_model: str = Field(default="llama3.1-8b", alias="CEREBRAS_MODEL")
    cerebras_max_completion_tokens: int = Field(default=2048, alias="CEREBRAS_MAX_COMPLETION_TOKENS")
    glm_api_key: str | None = Field(default=None, alias="GLM_API_KEY")
    glm_model: str = Field(default="glm-5", alias="GLM_MODEL")
    glm_base_url: str = Field(default="https://open.bigmodel.cn/api/paas/v4/", alias="GLM_BASE_URL")
    ollama_model: str = Field(default="qwen3:8b", alias="OLLAMA_MODEL")
    ollama_base_url: str = Field(default="http://localhost:11434", alias="OLLAMA_BASE_URL")
    ollama_timeout_seconds: int = Field(default=600, alias="OLLAMA_TIMEOUT_SECONDS")
    ollama_keep_alive: str = Field(default="30m", alias="OLLAMA_KEEP_ALIVE")
    llm_match_top_n: int = Field(default=12, alias="LLM_MATCH_TOP_N")
    llm_match_rule_weight: float = Field(default=0.6, alias="LLM_MATCH_RULE_WEIGHT")
    tinyfish_api_key: str | None = Field(default=None, alias="TINYFISH_API_KEY")
    tinyfish_base_url: str = Field(default="https://agent.tinyfish.ai", alias="TINYFISH_BASE_URL")
    tinyfish_timeout_seconds: int = Field(default=180, alias="TINYFISH_TIMEOUT_SECONDS")
    tinyfish_poll_interval_seconds: int = Field(default=5, alias="TINYFISH_POLL_INTERVAL_SECONDS")
    tinyfish_batch_size: int = Field(default=5, alias="TINYFISH_BATCH_SIZE")
    cors_origins_raw: str = Field(default="http://localhost:3000", alias="CORS_ORIGINS")
    session_secret: str = Field(alias="SESSION_SECRET")
    session_cookie_name: str = Field(default="scholr_session", alias="SESSION_COOKIE_NAME")
    session_cookie_secure: bool = Field(default=False, alias="SESSION_COOKIE_SECURE")
    auto_seed: bool = Field(default=False, alias="AUTO_SEED")
    admin_email: str | None = Field(default=None, alias="ADMIN_EMAIL")
    admin_password: str | None = Field(default=None, alias="ADMIN_PASSWORD")
    admin_full_name: str = Field(default="Scholr Admin", alias="ADMIN_FULL_NAME")

    @field_validator("app_env", mode="before")
    @classmethod
    def validate_app_env(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in VALID_APP_ENVS:
            valid = ", ".join(sorted(VALID_APP_ENVS))
            raise ValueError(f"APP_ENV must be one of: {valid}")
        return normalized

    @field_validator("log_level", mode="before")
    @classmethod
    def validate_log_level(cls, value: str) -> str:
        normalized = value.strip().upper()
        if normalized not in VALID_LOG_LEVELS:
            valid = ", ".join(sorted(VALID_LOG_LEVELS))
            raise ValueError(f"LOG_LEVEL must be one of: {valid}")
        return normalized

    @field_validator("ai_provider", mode="before")
    @classmethod
    def validate_ai_provider(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in VALID_AI_PROVIDERS:
            valid = ", ".join(sorted(VALID_AI_PROVIDERS))
            raise ValueError(f"AI_PROVIDER must be one of: {valid}")
        return normalized

    @field_validator("ai_fallback_order_raw", mode="before")
    @classmethod
    def validate_ai_fallback_order_raw(cls, value: str) -> str:
        normalized_items: list[str] = []
        seen: set[str] = set()

        for provider in value.split(","):
            normalized = provider.strip().lower()
            if not normalized:
                continue
            if normalized not in VALID_AI_PROVIDERS:
                valid = ", ".join(sorted(VALID_AI_PROVIDERS))
                raise ValueError(f"AI_FALLBACK_ORDER entries must be one of: {valid}")
            if normalized in seen:
                continue
            seen.add(normalized)
            normalized_items.append(normalized)

        return ",".join(normalized_items)

    @field_validator(
        "database_url",
        "glm_base_url",
        "ollama_base_url",
        "tinyfish_base_url",
        mode="before",
    )
    @classmethod
    def validate_required_url_like_values(cls, value: str, info) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError(f"{info.field_name.upper()} must not be empty")

        parsed = urlparse(normalized)
        if info.field_name == "database_url":
            if not parsed.scheme:
                raise ValueError("DATABASE_URL must include a valid scheme")
        elif parsed.scheme not in {"http", "https"} or not parsed.netloc:
            env_name = info.field_name.upper()
            raise ValueError(f"{env_name} must be a valid http(s) URL")

        return normalized

    @field_validator(
        "openai_model",
        "cerebras_model",
        "glm_model",
        "ollama_model",
        "ollama_keep_alive",
        "session_secret",
        "session_cookie_name",
        "admin_full_name",
        mode="before",
    )
    @classmethod
    def validate_non_empty_strings(cls, value: str, info) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError(f"{info.field_name.upper()} must not be empty")
        return normalized

    @field_validator(
        "cerebras_max_completion_tokens",
        "ollama_timeout_seconds",
        "llm_match_top_n",
        "tinyfish_timeout_seconds",
        "tinyfish_poll_interval_seconds",
        "tinyfish_batch_size",
    )
    @classmethod
    def validate_positive_integers(cls, value: int, info) -> int:
        if value <= 0:
            raise ValueError(f"{info.field_name.upper()} must be greater than 0")
        return value

    @field_validator("llm_match_rule_weight")
    @classmethod
    def validate_llm_match_rule_weight(cls, value: float) -> float:
        if not 0 <= value <= 1:
            raise ValueError("LLM_MATCH_RULE_WEIGHT must be between 0 and 1")
        return value

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins_raw.split(",") if origin.strip()]

    @property
    def ai_fallback_order(self) -> list[str]:
        return [provider.strip().lower() for provider in self.ai_fallback_order_raw.split(",") if provider.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
