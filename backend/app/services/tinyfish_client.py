from __future__ import annotations

from dataclasses import dataclass
import time
from typing import Any

import httpx

from app.core.config import settings


@dataclass(slots=True)
class TinyFishRunResult:
    run_id: str
    status: str
    result: dict[str, Any] | None
    error: str | None = None


class TinyFishRateLimitError(Exception):
    def __init__(self, retry_after_seconds: int | None = None) -> None:
        self.retry_after_seconds = retry_after_seconds
        message = "TinyFish rate limited batch submission"
        if retry_after_seconds is not None:
            message = f"{message}; retry after {retry_after_seconds}s"
        super().__init__(message)


class TinyFishClient:
    def __init__(self) -> None:
        self.base_url = settings.tinyfish_base_url.rstrip("/")
        self.timeout_seconds = settings.tinyfish_timeout_seconds
        self.poll_interval_seconds = settings.tinyfish_poll_interval_seconds
        self.api_key = settings.tinyfish_api_key

    def start_batch_runs(self, runs: list[dict[str, Any]]) -> list[str]:
        if not self.api_key:
            raise ValueError("TINYFISH_API_KEY is not configured")
        if not runs:
            return []
        if len(runs) > 100:
            raise ValueError("TinyFish batch start supports at most 100 runs per request")

        with self._client() as client:
            response = client.post("/v1/automation/run-batch", json={"runs": runs})
            try:
                response.raise_for_status()
            except httpx.HTTPStatusError as error:
                if error.response.status_code == 429:
                    retry_after = self._coerce_retry_after(error.response.headers.get("Retry-After"))
                    raise TinyFishRateLimitError(retry_after) from error
                raise
            payload = response.json()
            run_ids = payload.get("run_ids")
            if not isinstance(run_ids, list) or not run_ids:
                error = payload.get("error") or "TinyFish batch start did not return run_ids"
                raise ValueError(str(error))
            return [str(run_id) for run_id in run_ids]

    def get_runs(self, run_ids: list[str]) -> dict[str, TinyFishRunResult]:
        if not self.api_key:
            raise ValueError("TINYFISH_API_KEY is not configured")
        if not run_ids:
            return {}
        if len(run_ids) > 100:
            raise ValueError("TinyFish batch run lookup supports at most 100 run_ids per request")

        with self._client() as client:
            response = client.post("/v1/runs/batch", json={"run_ids": run_ids})
            response.raise_for_status()
            payload = response.json()

        results: dict[str, TinyFishRunResult] = {}
        for item in payload.get("data") or []:
            if not isinstance(item, dict):
                continue
            run_id = item.get("run_id")
            if not run_id:
                continue
            results[str(run_id)] = TinyFishRunResult(
                run_id=str(run_id),
                status=str(item.get("status") or "").upper(),
                result=item.get("result") if isinstance(item.get("result"), dict) else None,
                error=self._coerce_error(item.get("error")),
            )

        for run_id in payload.get("not_found") or []:
            results[str(run_id)] = TinyFishRunResult(
                run_id=str(run_id),
                status="NOT_FOUND",
                result=None,
                error="Run not found or not owned by this API key",
            )

        return results

    def wait_for_runs(self, run_ids: list[str]) -> tuple[dict[str, TinyFishRunResult], set[str]]:
        pending = {run_id: None for run_id in run_ids}
        completed: dict[str, TinyFishRunResult] = {}
        deadline = time.monotonic() + self.timeout_seconds

        while pending and time.monotonic() < deadline:
            try:
                batch_results = self.get_runs(list(pending))
            except httpx.TimeoutException:
                time.sleep(self.poll_interval_seconds)
                continue
            for run_id, result in batch_results.items():
                if result.status in {"COMPLETED", "FAILED", "CANCELLED", "NOT_FOUND"}:
                    completed[run_id] = result
                    pending.pop(run_id, None)
            # Return as soon as any run reaches a terminal state so the job runner
            # can persist local progress without waiting for the entire batch.
            if completed:
                break
            if pending:
                time.sleep(self.poll_interval_seconds)

        return completed, set(pending)

    def _client(self) -> httpx.Client:
        return httpx.Client(
            base_url=self.base_url,
            timeout=self.timeout_seconds,
            headers={
                "Content-Type": "application/json",
                "X-API-Key": self.api_key or "",
            },
        )

    def _coerce_error(self, value: Any) -> str | None:
        if value is None:
            return None
        if isinstance(value, str):
            return value
        if isinstance(value, dict):
            message = value.get("message") or value.get("detail") or value.get("error")
            if message:
                return str(message)
        return str(value)

    def _coerce_retry_after(self, value: Any) -> int | None:
        if value is None:
            return None
        if isinstance(value, str):
            try:
                parsed = int(value.strip())
            except ValueError:
                return None
            return parsed if parsed >= 0 else None
        return None
