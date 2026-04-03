from __future__ import annotations

from app.ai_providers.base import AIProvider, AIProviderError


class MultiProvider(AIProvider):
    def __init__(self, providers: list[AIProvider]) -> None:
        self.providers = providers

    @staticmethod
    def _format_unavailable(provider: AIProvider) -> str:
        return f"{provider.provider_name}: unavailable"

    @property
    def is_available(self) -> bool:
        return any(provider.is_available for provider in self.providers)

    @property
    def provider_name(self) -> str:
        return "multi"

    def generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
        expect_json: bool = False,
    ) -> str:
        errors: list[str] = []
        for provider in self.providers:
            if not provider.is_available:
                errors.append(self._format_unavailable(provider))
                continue
            try:
                return provider.generate_text(system_prompt, user_prompt, temperature, expect_json)
            except AIProviderError as error:
                errors.append(f"{provider.provider_name}: {error}")
        raise AIProviderError("; ".join(errors) if errors else "No AI providers are configured")
