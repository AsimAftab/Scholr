import json
import re
from typing import Any

from app import ai_prompts
from app.ai_providers import build_ai_provider
from app.ai_providers.runtime import AIRuntimeSettings
from app.models.scholarship import Scholarship
from app.schemas.ai import ScholarshipFitAssessment, StructuredEligibilityResponse
from app.schemas.profile import ProfileRead
from app.services.ai_runtime_settings import load_runtime_ai_settings
from sqlalchemy.orm import Session


class AIService:
    def __init__(self, db: Session | None = None, runtime_settings: AIRuntimeSettings | None = None) -> None:
        self.runtime_settings = runtime_settings or load_runtime_ai_settings(db)
        self.provider = build_ai_provider(self.runtime_settings)

    def structure_eligibility(self, eligibility_text: str) -> StructuredEligibilityResponse:
        if not self.provider.is_available:
            return self._structure_with_rules(eligibility_text)

        system_prompt, user_prompt, temperature = ai_prompts.build_structure_eligibility_prompt(eligibility_text)
        content = self._generate_text(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=temperature,
            expect_json=True,
        )
        return StructuredEligibilityResponse(**self._extract_json_object(content))

    def generate_sop(self, profile: ProfileRead, scholarship: Scholarship) -> str:
        if not self.provider.is_available:
            return ai_prompts.build_fallback_sop(profile, scholarship)
        system_prompt, user_prompt, temperature = ai_prompts.build_sop_prompt(profile, scholarship)
        return self._generate_text(system_prompt=system_prompt, user_prompt=user_prompt, temperature=temperature)

    def generate_lor(self, profile: ProfileRead, scholarship: Scholarship) -> str:
        if not self.provider.is_available:
            return ai_prompts.build_fallback_lor(profile, scholarship)
        system_prompt, user_prompt, temperature = ai_prompts.build_lor_prompt(profile, scholarship)
        return self._generate_text(system_prompt=system_prompt, user_prompt=user_prompt, temperature=temperature)

    def summarize_scholarship(self, scholarship: Scholarship) -> str:
        if not self.provider.is_available:
            return self.build_match_summary(scholarship)
        system_prompt, user_prompt, temperature = ai_prompts.build_scholarship_summary_prompt(scholarship)
        return self._generate_text(system_prompt=system_prompt, user_prompt=user_prompt, temperature=temperature)

    def score_scholarship_fit(
        self,
        profile: ProfileRead,
        scholarship: Scholarship,
        rule_score: int,
        missing_requirements: list[str],
    ) -> ScholarshipFitAssessment:
        if not self.provider.is_available:
            return self._score_fit_with_rules(profile, scholarship, rule_score, missing_requirements)

        system_prompt, user_prompt, temperature = ai_prompts.build_fit_scoring_prompt(
            profile,
            scholarship,
            rule_score,
            missing_requirements,
        )
        content = self._generate_text(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=temperature,
            expect_json=True,
        )
        return ScholarshipFitAssessment(**self._normalize_fit_assessment_payload(self._extract_json_object(content)))

    def build_match_summary(
        self,
        scholarship: Scholarship,
        personalized_reasoning: str | None = None,
    ) -> str:
        return ai_prompts.build_match_summary(scholarship, personalized_reasoning)

    def _structure_with_rules(self, eligibility_text: str) -> StructuredEligibilityResponse:
        gpa_match = re.search(r"GPA(?: of)?\s*(\d+(?:\.\d+)?)", eligibility_text, re.IGNORECASE)
        ielts_match = re.search(r"IELTS(?: score of)?\s*(\d+(?:\.\d+)?)", eligibility_text, re.IGNORECASE)
        document_candidates = ["SOP", "LOR", "CV", "Passport", "Transcript"]
        documents_required = [doc for doc in document_candidates if doc.lower() in eligibility_text.lower()]
        degree_levels = [
            level for level in ["Bachelors", "Masters", "PhD"] if level.lower() in eligibility_text.lower()
        ]
        country_match = re.findall(r"citizens of ([A-Za-z, ]+)", eligibility_text, re.IGNORECASE)
        countries_allowed = []
        if country_match:
            countries_allowed = [item.strip() for item in country_match[0].split(",") if item.strip()]

        return StructuredEligibilityResponse(
            gpa_required=float(gpa_match.group(1)) if gpa_match else None,
            ielts_required=float(ielts_match.group(1)) if ielts_match else None,
            documents_required=documents_required or ["SOP", "LOR", "CV"],
            degree_levels=degree_levels,
            countries_allowed=countries_allowed,
            fields_of_study=[],
            programs=[],
            funding_type=None,
            fully_funded=None,
            benefits=[],
            application_requirements=[],
            eligible_nationalities_summary=None,
        )

    def _score_fit_with_rules(
        self,
        profile: ProfileRead,
        scholarship: Scholarship,
        rule_score: int,
        missing_requirements: list[str],
    ) -> ScholarshipFitAssessment:
        from datetime import date, timedelta

        positives: list[str] = []
        risks = list(missing_requirements)
        signals_matched = 0
        scholarship_fields = scholarship.field_of_study if isinstance(scholarship.field_of_study, list) else []
        structured = scholarship.structured_eligibility or {}

        # Country alignment
        if (
            profile.target_country
            and scholarship.country
            and profile.target_country.lower() == scholarship.country.lower()
        ):
            positives.append("Target country aligns with the scholarship destination")
            signals_matched += 1

        # Field of study alignment
        if (
            profile.field_of_study
            and scholarship_fields
            and any(
                field.lower() == profile.field_of_study.lower()
                for field in scholarship_fields
                if isinstance(field, str) and field
            )
        ):
            positives.append("Field of study aligns directly with the scholarship scope")
            rule_score = min(rule_score + 10, 100)
            signals_matched += 1

        # GPA strength
        required_gpa = structured.get("gpa_required")
        if required_gpa is not None and profile.gpa is not None and profile.gpa >= required_gpa + 0.5:
            positives.append(f"GPA of {profile.gpa} exceeds the minimum requirement of {required_gpa}")
            signals_matched += 1

        # Funding
        if scholarship.is_fully_funded:
            positives.append("Fully funded scholarship covers tuition and living expenses")
            signals_matched += 1

        # Deadline
        today = date.today()
        if scholarship.deadline and today < scholarship.deadline <= today + timedelta(days=180):
            positives.append("Application deadline is upcoming — still actionable")
            signals_matched += 1

        # Academic timeline
        if profile.passout_year is not None:
            positives.append(f"Academic timeline indicates recent background ({profile.passout_year})")
            signals_matched += 1

        # Work experience
        work_experiences = profile.work_experiences or []
        if work_experiences:
            current_roles = [exp.job_title for exp in work_experiences if exp.is_current]
            if current_roles:
                positives.append(f"Currently employed as {current_roles[0]} — demonstrates active professional engagement")
            else:
                positives.append(f"Professional experience across {len(work_experiences)} role(s) demonstrates practical knowledge")
            signals_matched += 1

        # Education depth
        educations = profile.educations or []
        if len(educations) > 1:
            positives.append(f"Multiple qualifications across {len(educations)} institution(s) show continuous learning")
            signals_matched += 1

        # Scale confidence based on signal count (40-70 range)
        confidence = min(40 + (signals_matched * 5), 70)

        return ScholarshipFitAssessment(
            fit_score=max(0, min(rule_score, 100)),
            confidence=confidence,
            positives=positives,
            risks=risks,
            missing_items=list(missing_requirements),
            personalized_reasoning=self.build_match_summary(scholarship),
        )

    def _generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float,
        expect_json: bool = False,
    ) -> str:
        return self.provider.generate_text(system_prompt, user_prompt, temperature, expect_json)

    def _extract_json_object(self, content: str) -> dict[str, Any]:
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", content, re.DOTALL)
            if not match:
                raise
            return json.loads(match.group(0))

    def _normalize_fit_assessment_payload(self, payload: dict[str, Any]) -> dict[str, Any]:
        normalized = dict(payload)

        fit_score = normalized.get("fit_score")
        normalized["fit_score"] = self._coerce_score(fit_score, default=50)

        confidence = normalized.get("confidence")
        normalized["confidence"] = self._coerce_score(confidence, default=50)

        for key in ("positives", "risks", "missing_items"):
            normalized[key] = self._coerce_string_list(normalized.get(key))

        normalized["personalized_reasoning"] = self._coerce_reasoning(normalized.get("personalized_reasoning"))
        return normalized

    def _coerce_score(self, value: Any, default: int) -> int:
        if value is None:
            return default
        if isinstance(value, bool):
            return default
        if isinstance(value, (int, float)):
            score = float(value)
        elif isinstance(value, str):
            try:
                score = float(value.strip())
            except ValueError:
                return default
        else:
            return default

        if 0 <= score <= 1:
            score *= 100
        return max(0, min(100, int(round(score))))

    def _coerce_string_list(self, value: Any) -> list[str]:
        if value is None:
            return []
        if isinstance(value, str):
            text = value.strip()
            return [text] if text else []
        if isinstance(value, list):
            items: list[str] = []
            for item in value:
                if item is None:
                    continue
                text = str(item).strip()
                if text:
                    items.append(text)
            return items
        text = str(value).strip()
        return [text] if text else []

    def _coerce_reasoning(self, value: Any) -> str:
        if value is None:
            return ""
        if isinstance(value, list):
            return " ".join(str(item).strip() for item in value if str(item).strip())
        if isinstance(value, str):
            return value.strip()
        return str(value).strip()
