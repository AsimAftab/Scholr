from __future__ import annotations

import json

from app.models.scholarship import Scholarship
from app.schemas.profile import ProfileRead


def _academic_profile_summary(profile: ProfileRead) -> dict[str, str | int | float | None]:
    return {
        "country_of_origin": profile.country,
        "degree": profile.degree_level,
        "field_of_study": profile.field_of_study,
        "gpa": profile.gpa,
        "target_country": profile.target_country,
        "passout_year": profile.passout_year,
        "ielts_score": profile.ielts_score,
    }


def _lor_profile_summary(profile: ProfileRead) -> dict[str, str | int | float | None]:
    # Recommendation templates do not need direct identifiers; use a generic placeholder.
    return {
        "applicant_name": "Student",
        "degree": profile.degree_level,
        "field_of_study": profile.field_of_study,
        "gpa": profile.gpa,
        "target_country": profile.target_country,
        "passout_year": profile.passout_year,
    }


def build_structure_eligibility_prompt(eligibility_text: str) -> tuple[str, str, float]:
    system_prompt = "You extract scholarship eligibility into strict JSON."
    user_prompt = (
        "Convert the scholarship eligibility text into JSON with keys "
        "gpa_required, ielts_required, documents_required, degree_levels, countries_allowed, "
        "fields_of_study, programs, funding_type, fully_funded, benefits, application_requirements, "
        "eligible_nationalities_summary. "
        "Return only valid JSON.\n\n"
        f"Eligibility text:\n{eligibility_text}"
    )
    return system_prompt, user_prompt, 0.2


def build_sop_prompt(profile: ProfileRead, scholarship: Scholarship) -> tuple[str, str, float]:
    system_prompt = "You write concise, credible scholarship SOP drafts."

    user_prompt = (
        "Write a concise statement of purpose draft for a scholarship application.\n"
        f"Applicant: {json.dumps(_academic_profile_summary(profile))}\n"
        f"Scholarship: {scholarship.title}, {scholarship.country}, {scholarship.eligibility_text}"
    )
    return system_prompt, user_prompt, 0.6


def build_lor_prompt(profile: ProfileRead, scholarship: Scholarship) -> tuple[str, str, float]:
    system_prompt = "You write recommendation letter templates for scholarship applications."

    user_prompt = (
        "Write a recommendation letter template for this scholarship.\n"
        f"Applicant: {json.dumps(_lor_profile_summary(profile))}\n"
        f"Scholarship: {scholarship.title}, {scholarship.country}"
    )
    return system_prompt, user_prompt, 0.6


def build_scholarship_summary_prompt(scholarship: Scholarship) -> tuple[str, str, float]:
    system_prompt = "You summarize scholarships for a student dashboard in 2 concise sentences."
    user_prompt = (
        "Summarize this scholarship for a student dashboard in 2 sentences.\n"
        f"{scholarship.title}\n{scholarship.country}\n{scholarship.eligibility_text}"
    )
    return system_prompt, user_prompt, 0.4


def build_fit_scoring_prompt(
    profile: ProfileRead,
    scholarship: Scholarship,
    rule_score: int,
    missing_requirements: list[str],
) -> tuple[str, str, float]:
    system_prompt = (
        "You are a scholarship admissions advisor scoring how well a student fits a specific scholarship. "
        "Score based on: eligibility alignment, academic strength relative to requirements, field relevance, and competitiveness.\n\n"
        "Scoring rubric:\n"
        "- 0-30: Ineligible or major mismatches (wrong degree level, ineligible nationality)\n"
        "- 30-50: Meets some criteria but significant gaps remain\n"
        "- 50-65: Meets all hard requirements but average among typical applicants\n"
        "- 65-80: Strong alignment with requirements and relevant academic background\n"
        "- 80-90: Excellent fit — exceeds requirements in a relevant field\n"
        "- 90-100: Exceptional alignment across all dimensions (reserve for rare cases)\n\n"
        "Never override hard eligibility failures (ineligible nationality, wrong degree level). "
        "Do not invent missing facts. Return strict JSON only."
    )

    user_prompt = (
        "## Applicant Profile\n"
        f"{json.dumps(_academic_profile_summary(profile), indent=2)}\n\n"
        "## Scholarship Details\n"
        f"Title: {scholarship.title}\n"
        f"Country: {scholarship.country}\n"
        f"Degree: {scholarship.degree}\n"
        f"Funding type: {scholarship.funding_type or 'Not specified'}\n"
        f"Fully funded: {scholarship.is_fully_funded or False}\n"
        f"Fields of study: {json.dumps(scholarship.field_of_study)}\n"
        f"Structured eligibility: {json.dumps(scholarship.structured_eligibility)}\n"
        f"Raw eligibility text: {scholarship.eligibility_text}\n\n"
        "## Rule Engine Context\n"
        f"Rule-based score: {rule_score}/100\n"
        f"Identified gaps: {json.dumps(missing_requirements)}\n\n"
        "## Your Task\n"
        "Return JSON with these keys:\n"
        "- fit_score (0-100): realistic fit score using the rubric above\n"
        "- confidence (0-100): your confidence in this assessment\n"
        "- positives: 2-4 specific strengths this applicant has for THIS scholarship\n"
        "- risks: 1-3 specific concerns or gaps\n"
        "- missing_items: hard requirements the applicant does not meet (empty list if all met)\n"
        "- personalized_reasoning: exactly 2 concise sentences explaining why this scholarship is or is not a good fit for this specific student"
    )
    return system_prompt, user_prompt, 0.2


def build_fallback_sop(profile: ProfileRead, scholarship: Scholarship) -> str:
    field_fragment = f" in {profile.field_of_study}" if profile.field_of_study else ""
    ielts_fragment = f" and IELTS score of {profile.ielts_score}" if profile.ielts_score is not None else ""
    return (
        f"I am applying for the {scholarship.title} in {scholarship.country} to pursue a "
        f"{profile.degree_level}{field_fragment}. My academic profile includes a GPA of {profile.gpa}{ielts_fragment}. "
        f"This scholarship aligns with my goal to study in {profile.target_country} and contribute meaningfully after graduation."
    )


def build_fallback_lor(profile: ProfileRead, scholarship: Scholarship) -> str:
    return (
        f"To the scholarship committee,\n\nI strongly recommend this candidate for the "
        f"{scholarship.title}. Their GPA of {profile.gpa} and international study goals "
        f"demonstrate the discipline and potential required for success."
    )


def build_match_summary(scholarship: Scholarship, personalized_reasoning: str | None = None) -> str:
    if personalized_reasoning:
        return personalized_reasoning

    docs = ", ".join(scholarship.structured_eligibility.get("documents_required", []))
    docs = docs or "standard academic documents"
    return (
        f"{scholarship.title} supports {scholarship.degree} study in {scholarship.country}. "
        f"Deadline: {scholarship.deadline.isoformat() if scholarship.deadline else 'not published'}. "
        f"Required documents include {docs}."
    )
