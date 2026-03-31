from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


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
    openai_api_key: str | None = Field(default=None, alias="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4o-mini", alias="OPENAI_MODEL")
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

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins_raw.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
