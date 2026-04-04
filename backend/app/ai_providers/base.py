from __future__ import annotations

from abc import ABC, abstractmethod


class AIProviderError(RuntimeError):
    pass


class AIProvider(ABC):
    @property
    @abstractmethod
    def is_available(self) -> bool:
        """Return whether the provider is configured and ready to serve requests."""
        raise NotImplementedError

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Return the stable provider identifier used in logs and configuration."""
        raise NotImplementedError

    @abstractmethod
    def generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
        expect_json: bool = False,
    ) -> str:
        """Generate text from the provider or raise ``AIProviderError`` on failure.

        Args:
            system_prompt: Instruction prompt that sets the model behavior.
            user_prompt: Task-specific prompt content.
            temperature: Sampling temperature for the request.
            expect_json: Whether the caller expects strict JSON output.

        Returns:
            The provider response text.
        """
        raise NotImplementedError
