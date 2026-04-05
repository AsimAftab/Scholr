from __future__ import annotations

from app.ai_providers.base import AIProvider, AIProviderError
from app.ai_providers.cerebras_provider import CerebrasProvider
from app.ai_providers.glm_provider import GLMProvider
from app.ai_providers.multi_provider import MultiProvider
from app.ai_providers.ollama_provider import OllamaProvider
from app.ai_providers.openai_provider import OpenAIProvider
from app.ai_providers.runtime import AIRuntimeSettings


def build_ai_provider(runtime: AIRuntimeSettings) -> AIProvider:
    configured = runtime.ai_provider.strip().lower()
    providers: dict[str, type[AIProvider]] = {
        "cerebras": CerebrasProvider,
        "openai": OpenAIProvider,
        "glm": GLMProvider,
        "ollama": OllamaProvider,
    }
    normalized_configured = "ollama" if configured == "local" else configured
    if normalized_configured not in providers:
        available = ", ".join(sorted([*providers.keys(), "local"]))
        raise ValueError(f"Unknown AI provider '{runtime.ai_provider}'. Available providers: {available}")

    order = _build_provider_order(configured, runtime.ai_fallback_order)
    built: list[AIProvider] = []
    for provider_name in order:
        provider_cls = providers.get(provider_name)
        if provider_cls is None:
            continue
        built.append(provider_cls(runtime))

    if len(built) == 1:
        return built[0]
    if built:
        return MultiProvider(built)

    provider_cls = providers.get(normalized_configured)
    if provider_cls is not None:
        return provider_cls(runtime)
    available = ", ".join(sorted([*providers.keys(), "local"]))
    raise ValueError(f"Unknown AI provider '{runtime.ai_provider}'. Available providers: {available}")


def _build_provider_order(configured: str, fallback_order: list[str]) -> list[str]:
    normalized = "ollama" if configured == "local" else configured
    seen: set[str] = set()
    ordered: list[str] = []
    for provider_name in [normalized, *fallback_order]:
        if not provider_name or provider_name in seen:
            continue
        seen.add(provider_name)
        ordered.append(provider_name)
    if not ordered:
        ordered.append("openai")
    return ordered
