from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timezone
import json
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.admin import ScholarshipSourceConfig
from app.models.scholarship import Scholarship
from app.schemas.ai import StructuredEligibilityResponse
from app.services.tinyfish_client import TinyFishRunResult


@dataclass(slots=True)
class IngestionResult:
    run_id: str
    created: int
    updated: int
    total: int


class ScholarshipIngestionService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def build_run_request(self, source: ScholarshipSourceConfig) -> dict[str, Any]:
        return {
            "url": source.base_url,
            "goal": self._build_goal(source),
            "browser_profile": "lite",
            "api_integration": "scholr",
        }

    def ingest_completed_run(self, source: ScholarshipSourceConfig, run: TinyFishRunResult) -> IngestionResult:
        if run.status != "COMPLETED":
            raise ValueError(f"Cannot ingest TinyFish run in status {run.status}")
        if not isinstance(run.result, dict):
            raise ValueError("TinyFish completed without a JSON result payload")

        scholarships = self._normalize_payload(run.result, source)
        created = 0
        updated = 0

        for item in scholarships:
            existing = self.db.scalar(select(Scholarship).where(Scholarship.source_url == item["source_url"]))
            if existing is None:
                self.db.add(Scholarship(**item))
                created += 1
                continue

            for key, value in item.items():
                setattr(existing, key, value)
            updated += 1

        self.db.flush()
        return IngestionResult(run_id=run.run_id, created=created, updated=updated, total=len(scholarships))

    def _build_goal(self, source: ScholarshipSourceConfig) -> str:
        return (
            "Extract every scholarship scheme you can find from this source and return strict JSON only. "
            'Use the shape {"scholarships":[...]} with no markdown. '
            "Each scholarship item must include these keys, using null or [] when unknown: "
            "title, source_url, host_country, degree_levels, fields_of_study, programs, funding_type, "
            "fully_funded, coverage_summary, deadline, eligibility_summary, countries_allowed, "
            "gpa_required, ielts_required, documents_required, application_requirements, benefits. "
            f"The source country is {source.country} and the region is {source.region}. "
            "Only include scholarships that are currently described on the source or directly linked detail pages."
        )

    def _normalize_payload(self, payload: dict[str, Any], source: ScholarshipSourceConfig) -> list[dict[str, Any]]:
        items = payload.get("scholarships")
        if not isinstance(items, list):
            raise ValueError("TinyFish result did not contain a scholarships array")

        normalized: list[dict[str, Any]] = []
        extracted_at = datetime.now(timezone.utc)
        for raw_item in items:
            if not isinstance(raw_item, dict):
                continue
            title = self._coerce_text(raw_item.get("title"))
            if not title:
                continue
            source_url = self._coerce_text(raw_item.get("source_url")) or self._coerce_text(raw_item.get("detail_url"))
            if not source_url:
                source_url = f"{source.base_url.rstrip('/')}/#scholarship-{self._slugify(title)}"

            degree_levels = self._coerce_list(raw_item.get("degree_levels") or raw_item.get("degrees"))
            fields_of_study = self._coerce_list(raw_item.get("fields_of_study") or raw_item.get("programs"))
            programs = self._coerce_list(raw_item.get("programs"))
            countries_allowed = self._coerce_list(raw_item.get("countries_allowed") or raw_item.get("eligible_countries"))
            documents_required = self._coerce_list(raw_item.get("documents_required"))
            application_requirements = self._coerce_list(raw_item.get("application_requirements"))
            benefits = self._coerce_list(raw_item.get("benefits"))
            eligibility_summary = self._coerce_text(raw_item.get("eligibility_summary")) or self._compose_eligibility_text(
                countries_allowed=countries_allowed,
                documents_required=documents_required,
                application_requirements=application_requirements,
            )

            structured = StructuredEligibilityResponse(
                gpa_required=self._coerce_float(raw_item.get("gpa_required")),
                ielts_required=self._coerce_float(raw_item.get("ielts_required")),
                documents_required=documents_required,
                degree_levels=degree_levels,
                countries_allowed=countries_allowed,
                fields_of_study=fields_of_study,
                programs=programs,
                funding_type=self._coerce_text(raw_item.get("funding_type")),
                fully_funded=self._coerce_bool(raw_item.get("fully_funded")),
                benefits=benefits,
                application_requirements=application_requirements,
                eligible_nationalities_summary=self._coerce_text(raw_item.get("eligible_nationalities_summary")),
            )

            normalized.append(
                {
                    "title": title,
                    "country": self._coerce_text(raw_item.get("host_country")) or source.country,
                    "degree": self._primary_degree(degree_levels),
                    "region": source.region,
                    "source_key": source.source_key,
                    "source_name": source.source_name,
                    "official_source": source.official,
                    "source_url": source_url,
                    "deadline": self._coerce_date(raw_item.get("deadline")),
                    "funding_type": self._coerce_text(raw_item.get("funding_type")),
                    "coverage_summary": self._coerce_text(raw_item.get("coverage_summary")),
                    "is_fully_funded": self._coerce_bool(raw_item.get("fully_funded")),
                    "field_of_study": fields_of_study,
                    "eligible_countries": countries_allowed,
                    "eligibility_text": eligibility_summary,
                    "structured_eligibility": structured.model_dump(),
                    "raw_payload": raw_item,
                    "extracted_at": extracted_at,
                    "last_verified_at": extracted_at,
                }
            )

        return normalized

    def _compose_eligibility_text(
        self,
        *,
        countries_allowed: list[str],
        documents_required: list[str],
        application_requirements: list[str],
    ) -> str:
        parts: list[str] = []
        if countries_allowed:
            parts.append(f"Eligible countries: {', '.join(countries_allowed)}.")
        if documents_required:
            parts.append(f"Required documents: {', '.join(documents_required)}.")
        if application_requirements:
            parts.append(f"Application requirements: {', '.join(application_requirements)}.")
        return " ".join(parts) or "Eligibility details were extracted in structured form."

    def _primary_degree(self, degree_levels: list[str]) -> str:
        return degree_levels[0] if degree_levels else "Unspecified"

    def _coerce_text(self, value: Any) -> str | None:
        if value is None:
            return None
        if isinstance(value, str):
            text = value.strip()
            return text or None
        if isinstance(value, (int, float, bool)):
            return str(value)
        return None

    def _coerce_list(self, value: Any) -> list[str]:
        if value is None:
            return []
        if isinstance(value, list):
            return [text for item in value if (text := self._coerce_text(item))]
        if isinstance(value, str):
            cleaned = value.strip()
            if not cleaned:
                return []
            if cleaned.startswith("["):
                try:
                    parsed = json.loads(cleaned)
                except json.JSONDecodeError:
                    parsed = None
                if isinstance(parsed, list):
                    return [text for item in parsed if (text := self._coerce_text(item))]
            return [item.strip() for item in cleaned.split(",") if item.strip()]
        return []

    def _coerce_bool(self, value: Any) -> bool | None:
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            lowered = value.strip().lower()
            if lowered in {"true", "yes", "fully funded", "full", "1"}:
                return True
            if lowered in {"false", "no", "partial", "0"}:
                return False
        return None

    def _coerce_float(self, value: Any) -> float | None:
        if value is None:
            return None
        if isinstance(value, (int, float)):
            return float(value)
        if isinstance(value, str):
            try:
                return float(value.strip())
            except ValueError:
                return None
        return None

    def _coerce_date(self, value: Any) -> date | None:
        text = self._coerce_text(value)
        if not text:
            return None
        for candidate in (text, text.split("T")[0]):
            try:
                return date.fromisoformat(candidate)
            except ValueError:
                continue
        return None

    def _slugify(self, text: str) -> str:
        slug = "".join(char.lower() if char.isalnum() else "-" for char in text)
        while "--" in slug:
            slug = slug.replace("--", "-")
        return slug.strip("-") or "item"
