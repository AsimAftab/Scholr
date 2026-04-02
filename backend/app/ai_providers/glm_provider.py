from __future__ import annotations

from openai import OpenAI

from app.ai_providers.base import AIProvider, AIProviderError
from app.ai_providers.runtime import AIRuntimeSettings


class GLMProvider(AIProvider):
    def __init__(self, runtime: AIRuntimeSettings) -> None:
        self.model = runtime.glm_model
        self.client = (
            OpenAI(api_key=runtime.glm_api_key, base_url=runtime.glm_base_url)
            if runtime.glm_api_key
            else None
        )

    @property
    def is_available(self) -> bool:
        return self.client is not None and bool(self.model)

    @property
    def provider_name(self) -> str:
        return "glm"

    def generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
        expect_json: bool = False,
    ) -> str:
        if self.client is None:
            raise AIProviderError("GLM provider is not configured")
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=temperature,
        )
        # Add bounds check before accessing choices[0]
        if not response.choices:
            raise AIProviderError("GLM returned no choices in response")
        content = response.choices[0].message.content or ""
        if isinstance(content, list):
            return "".join(
                part.get("text", "") if isinstance(part, dict) else str(part)
                for part in content
            ).strip()
        return content.strip()
