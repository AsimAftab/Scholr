from __future__ import annotations

from cerebras.cloud.sdk import Cerebras

from app.ai_providers.base import AIProvider, AIProviderError
from app.ai_providers.runtime import AIRuntimeSettings


class CerebrasProvider(AIProvider):
    def __init__(self, runtime: AIRuntimeSettings) -> None:
        self.model = runtime.cerebras_model
        self.max_completion_tokens = runtime.cerebras_max_completion_tokens
        self.client = Cerebras(api_key=runtime.cerebras_api_key) if runtime.cerebras_api_key else None

    @property
    def is_available(self) -> bool:
        return self.client is not None and bool(self.model)

    @property
    def provider_name(self) -> str:
        return "cerebras"

    def generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
        expect_json: bool = False,
    ) -> str:
        if self.client is None:
            raise AIProviderError("Cerebras provider is not configured")
        if not self.model:
            raise AIProviderError("Cerebras model is not configured")

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]
        if expect_json:
            messages[0]["content"] = f"{system_prompt}\nReturn valid JSON only."

        try:
            response = self.client.chat.completions.create(
                messages=messages,
                model=self.model,
                stream=False,
                max_completion_tokens=self.max_completion_tokens,
                temperature=temperature,
                top_p=1,
                timeout=30.0,
            )
        except Exception as error:
            raise AIProviderError(f"Cerebras provider request failed: {error}") from error

        content = response.choices[0].message.content if response.choices else None
        if not isinstance(content, str) or not content.strip():
            raise AIProviderError("Cerebras provider returned an empty response")
        return content.strip()
