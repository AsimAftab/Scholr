from sqlalchemy.orm import Session

from app.models.scholarship import Scholarship
from app.schemas.match import MatchResponse, ScholarshipMatch
from app.schemas.profile import ProfileRead
from app.services.ai_service import AIService
from app.services.scholarship_service import ScholarshipService


class MatchingService:
    def __init__(self, db: Session) -> None:
        self.scholarships = ScholarshipService(db)
        self.ai = AIService()

    def match(self, profile: ProfileRead) -> MatchResponse:
        matches: list[ScholarshipMatch] = []
        for scholarship in self.scholarships.list_scholarships_models():
            score, missing = self._calculate_score(profile, scholarship)
            matches.append(
                ScholarshipMatch(
                    scholarship_id=scholarship.id,
                    title=scholarship.title,
                    country=scholarship.country,
                    deadline=scholarship.deadline.isoformat() if scholarship.deadline else None,
                    match_score=score,
                    missing_requirements=missing,
                    summary=self.ai.summarize_scholarship(scholarship),
                )
            )
        matches.sort(key=lambda item: item.match_score, reverse=True)
        return MatchResponse(matches=matches)

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
        if required_ielts is None or profile.ielts_score >= required_ielts:
            score += 15
        else:
            missing.append(f"IELTS requirement not met ({required_ielts})")

        countries_allowed = structured.get("countries_allowed", [])
        if not countries_allowed or profile.country.lower() in [country.lower() for country in countries_allowed]:
            score += 10
        else:
            missing.append("Applicant nationality may be ineligible")

        return min(score, 100), missing
