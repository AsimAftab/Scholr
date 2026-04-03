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

    @property
    def request_timeout(self) -> httpx.Timeout:
        return httpx.Timeout(connect=10.0, read=float(self.timeout), write=60.0, pool=60.0)

    def generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
        expect_json: bool = False,
    ) -> str:
        if not self.model:
            raise AIProviderError("Ollama model is not configured")
        if not self.base_url:
            raise AIProviderError("Ollama base URL is not configured")

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

        try:
            response = httpx.post(
                f"{self.base_url}/api/chat",
                json=payload,
                timeout=self.request_timeout,
            )
            response.raise_for_status()
        except httpx.ConnectTimeout as error:
            raise AIProviderError("Ollama provider connection timed out") from error
        except httpx.ReadTimeout as error:
            raise AIProviderError("Ollama provider response timed out") from error
        except httpx.ConnectError as error:
            raise AIProviderError("Ollama provider connection failed") from error
        except httpx.HTTPError as error:
            raise AIProviderError(f"Ollama provider request failed: {error}") from error

        try:
            payload = response.json()
        except ValueError as error:
            raise AIProviderError("Ollama provider returned invalid JSON") from error

        if not isinstance(payload, dict):
            raise AIProviderError("Ollama provider returned an unexpected response format")

        message = payload.get("message") or {}
        if not isinstance(message, dict):
            raise AIProviderError("Ollama provider response is missing a valid message object")

        content = message.get("content")
        if not isinstance(content, str) or not content.strip():
            raise AIProviderError("Ollama provider returned an empty response")
        return content.strip()
