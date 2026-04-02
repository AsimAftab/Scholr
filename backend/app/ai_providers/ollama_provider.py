from __future__ import annotations

import httpx

from app.ai_providers.base import AIProvider, AIProviderError
from app.ai_providers.runtime import AIRuntimeSettings


class OllamaProvider(AIProvider):
    def __init__(self, runtime: AIRuntimeSettings) -> None:
        self.model = runtime.ollama_model
        self.base_url = runtime.ollama_base_url.rstrip("/")
        self.timeout = runtime.ollama_timeout_seconds
        self.keep_alive = runtime.ollama_keep_alive

    @property
    def is_available(self) -> bool:
        return bool(self.model and self.base_url)

    @property
    def provider_name(self) -> str:
        return "ollama"

    def generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
        expect_json: bool = False,
    ) -> str:
        try:
            payload = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "stream": False,
                "keep_alive": self.keep_alive,
                "options": {
                    "temperature": temperature,
                },
            }
            if expect_json:
                payload["format"] = "json"
            response = httpx.post(
                f"{self.base_url}/api/chat",
                json=payload,
                timeout=httpx.Timeout(connect=10.0, read=float(self.timeout), write=60.0, pool=60.0),
            )
            response.raise_for_status()
        except httpx.HTTPError as error:
            raise AIProviderError(f"Ollama provider request failed: {error}") from error

        payload = response.json()
        message = payload.get("message") or {}
        content = message.get("content")
        if not isinstance(content, str) or not content.strip():
            raise AIProviderError("Ollama provider returned an empty response")
        return content.strip()
