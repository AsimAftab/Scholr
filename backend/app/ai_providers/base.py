from __future__ import annotations

from abc import ABC, abstractmethod


class AIProviderError(RuntimeError):
    pass


class AIProvider(ABC):
    @property
    @abstractmethod
    def is_available(self) -> bool:
        raise NotImplementedError

    @property
    @abstractmethod
    def provider_name(self) -> str:
        raise NotImplementedError

    @abstractmethod
    def generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
        expect_json: bool = False,
    ) -> str:
        raise NotImplementedError
