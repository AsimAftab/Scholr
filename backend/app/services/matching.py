import hashlib
import json
import logging

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.scholarship import Scholarship
from app.models.user_scholarship_match import UserScholarshipMatch
from app.schemas.match import MatchResponse, ScholarshipMatch
from app.schemas.profile import ProfileRead
from app.services.ai_service import AIService
from app.services.scholarship_service import ScholarshipService

logger = logging.getLogger(__name__)


class MatchingService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.scholarships = ScholarshipService(db)
        self.ai = AIService(db)

    def match(self, profile: ProfileRead, user_id: int | None = None, force_refresh: bool = False) -> MatchResponse:
        scholarship_models = self.scholarships.list_scholarships_models()
        profile_fingerprint = self._profile_fingerprint(profile)

        if user_id is not None and not force_refresh:
            cached = self._load_cached_matches(user_id, profile_fingerprint, scholarship_models)
            if cached is not None:
                return MatchResponse(matches=cached)

        matches = self._compute_matches(profile, scholarship_models)
        if user_id is not None:
            self._persist_matches(user_id, profile_fingerprint, matches)
            self.db.commit()
        return MatchResponse(matches=matches)

    def _compute_matches(
        self,
        profile: ProfileRead,
        scholarship_models: list[Scholarship],
    ) -> list[ScholarshipMatch]:
        scored: list[tuple[Scholarship, int, list[str]]] = []
        for scholarship in scholarship_models:
            score, missing = self._calculate_score(profile, scholarship)
            scored.append((scholarship, score, missing))

        scored.sort(key=lambda item: item[1], reverse=True)
        top_n = max(1, min(len(scored), self._llm_top_n()))
        top_ids = {scholarship.id for scholarship, _, _ in scored[:top_n]}
        matches: list[ScholarshipMatch] = []
        for scholarship, rule_score, missing in scored:
            llm_score: int | None = None
            llm_confidence: int | None = None
            personalized_reasoning: str | None = None
            merged_missing = list(missing)
            final_score = rule_score

            if scholarship.id in top_ids:
                try:
                    fit = self.ai.score_scholarship_fit(profile, scholarship, rule_score, missing)
                    llm_score = fit.fit_score
                    llm_confidence = fit.confidence
                    personalized_reasoning = fit.personalized_reasoning or None
                    merged_missing = self._dedupe_preserve_order([*missing, *fit.missing_items, *fit.risks])
                    final_score = self._blend_scores(rule_score, fit.fit_score, merged_missing)
                except Exception as error:
                    logger.exception(
                        "LLM fit scoring failed for scholarship %s and user profile; falling back to rule score",
                        scholarship.id,
                    )
                    personalized_reasoning = self.ai.build_match_summary(scholarship)
                    merged_missing = self._dedupe_preserve_order(missing)
                    final_score = rule_score

            matches.append(
                ScholarshipMatch(
                    scholarship_id=scholarship.id,
                    title=scholarship.title,
                    country=scholarship.country,
                    deadline=scholarship.deadline.isoformat() if scholarship.deadline else None,
                    match_score=final_score,
                    rule_score=rule_score,
                    llm_score=llm_score,
                    llm_confidence=llm_confidence,
                    missing_requirements=merged_missing,
                    summary=self.ai.build_match_summary(scholarship, personalized_reasoning),
                    personalized_reasoning=personalized_reasoning,
                )
            )
        matches.sort(key=lambda item: item.match_score, reverse=True)
        return matches

    def _calculate_score(self, profile, scholarship: Scholarship) -> tuple[int, list[str]]:
        structured = scholarship.structured_eligibility
        score = 0
        missing: list[str] = []

        if scholarship.country.lower() == profile.target_country.lower():
            score += 30

        degree_levels = structured.get("degree_levels") or []
        degree_candidates = [scholarship.degree, *degree_levels]
        if any(candidate.lower() == profile.degree_level.lower() for candidate in degree_candidates if candidate):
            score += 20
        else:
            missing.append(f"Degree preference differs: {scholarship.degree}")

        required_gpa = structured.get("gpa_required")
        if required_gpa is None or profile.gpa >= required_gpa:
            score += 25
        else:
            missing.append(f"GPA requirement not met ({required_gpa})")

        required_ielts = structured.get("ielts_required")
        if required_ielts is None or (profile.ielts_score is not None and profile.ielts_score >= required_ielts):
            score += 15
        else:
            missing.append(f"IELTS requirement not met ({required_ielts})")

        countries_allowed = structured.get("countries_allowed", [])
        if not countries_allowed or profile.country.lower() in [country.lower() for country in countries_allowed]:
            score += 10
        else:
            missing.append("Applicant nationality may be ineligible")

        return min(score, 100), missing

    def _profile_fingerprint(self, profile: ProfileRead) -> str:
        payload = json.dumps(
            {
                "profile": profile.model_dump(mode="json"),
                "strategy": {
                    "ai_provider": self.ai.runtime_settings.ai_provider,
                    "ai_fallback_order": self.ai.runtime_settings.ai_fallback_order,
                    "openai_model": self.ai.runtime_settings.openai_model,
                    "cerebras_model": self.ai.runtime_settings.cerebras_model,
                    "cerebras_max_completion_tokens": self.ai.runtime_settings.cerebras_max_completion_tokens,
                    "glm_model": self.ai.runtime_settings.glm_model,
                    "glm_base_url": self.ai.runtime_settings.glm_base_url,
                    "ollama_model": self.ai.runtime_settings.ollama_model,
                    "ollama_base_url": self.ai.runtime_settings.ollama_base_url,
                    "ollama_timeout_seconds": self.ai.runtime_settings.ollama_timeout_seconds,
                    "ollama_keep_alive": self.ai.runtime_settings.ollama_keep_alive,
                    "llm_match_top_n": self.ai.runtime_settings.llm_match_top_n,
                    "llm_match_rule_weight": self.ai.runtime_settings.llm_match_rule_weight,
                },
            },
            sort_keys=True,
        )
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()

    def _load_cached_matches(
        self,
        user_id: int,
        profile_fingerprint: str,
        scholarship_models: list[Scholarship],
    ) -> list[ScholarshipMatch] | None:
        rows = list(
            self.db.scalars(
                select(UserScholarshipMatch).where(
                    UserScholarshipMatch.user_id == user_id,
                    UserScholarshipMatch.profile_fingerprint == profile_fingerprint,
                )
            ).all()
        )
        if not rows:
            return None

        scholarship_lookup = {scholarship.id: scholarship for scholarship in scholarship_models}
        if len(rows) != len(scholarship_models):
            return None
        if {row.scholarship_id for row in rows} != set(scholarship_lookup):
            return None

        matches = [
            ScholarshipMatch(
                scholarship_id=row.scholarship_id,
                title=scholarship_lookup[row.scholarship_id].title,
                country=scholarship_lookup[row.scholarship_id].country,
                deadline=(
                    scholarship_lookup[row.scholarship_id].deadline.isoformat()
                    if scholarship_lookup[row.scholarship_id].deadline
                    else None
                ),
                match_score=row.match_score,
                rule_score=row.rule_score,
                llm_score=row.llm_score,
                llm_confidence=row.llm_confidence,
                missing_requirements=row.missing_requirements,
                summary=row.match_summary or self.ai.build_match_summary(scholarship_lookup[row.scholarship_id]),
                personalized_reasoning=row.personalized_reasoning,
            )
            for row in rows
        ]
        matches.sort(key=lambda item: item.match_score, reverse=True)
        return matches

    def _persist_matches(
        self,
        user_id: int,
        profile_fingerprint: str,
        matches: list[ScholarshipMatch],
    ) -> None:
        self.db.execute(delete(UserScholarshipMatch).where(UserScholarshipMatch.user_id == user_id))
        self.db.flush()
        self.db.add_all(
            [
                UserScholarshipMatch(
                    user_id=user_id,
                    scholarship_id=match.scholarship_id,
                    match_score=match.match_score,
                    rule_score=match.rule_score,
                    llm_score=match.llm_score,
                    llm_confidence=match.llm_confidence,
                    profile_fingerprint=profile_fingerprint,
                    match_summary=match.summary,
                    personalized_reasoning=match.personalized_reasoning,
                    missing_requirements=match.missing_requirements,
                )
                for match in matches
            ]
        )
        self.db.flush()

    def _blend_scores(self, rule_score: int, llm_score: int, missing_requirements: list[str]) -> int:
        rule_weight = min(max(self._rule_weight(), 0.0), 1.0)
        blended = round((rule_score * rule_weight) + (llm_score * (1.0 - rule_weight)))
        if len(missing_requirements) >= 2 and rule_score < 50:
            blended = min(blended, rule_score + 10)
        return max(0, min(blended, 100))

    def _llm_top_n(self) -> int:
        return max(1, self.ai.runtime_settings.llm_match_top_n)

    def _rule_weight(self) -> float:
        return self.ai.runtime_settings.llm_match_rule_weight

    def _dedupe_preserve_order(self, items: list[str]) -> list[str]:
        seen: set[str] = set()
        result: list[str] = []
        for item in items:
            if item and item not in seen:
                seen.add(item)
                result.append(item)
        return result
