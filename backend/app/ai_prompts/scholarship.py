from __future__ import annotations

import json

from app.models.scholarship import Scholarship
from app.schemas.profile import ProfileRead


def _academic_profile_summary(profile: ProfileRead) -> dict[str, str | int | float | None]:
    return {
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
        "You score scholarship fit for a student. "
        "Follow the input facts closely and return strict JSON only."
    )

    user_prompt = (
        "You are scoring scholarship fit for a student. "
        "Use the applicant profile, scholarship facts, and current rule-based score as context. "
        "Do not override hard eligibility failures, and do not invent missing facts. "
        "Return strict JSON with keys fit_score, confidence, positives, risks, missing_items, personalized_reasoning. "
        "fit_score must be 0-100 and reflect overall fit among realistically eligible applicants. "
        "personalized_reasoning must be 2 concise sentences tailored to the user.\n\n"
        f"Applicant profile:\n{json.dumps(_academic_profile_summary(profile))}\n\n"
        f"Scholarship:\n"
        f"title={scholarship.title}\n"
        f"country={scholarship.country}\n"
        f"degree={scholarship.degree}\n"
        f"funding_type={scholarship.funding_type}\n"
        f"field_of_study={json.dumps(scholarship.field_of_study)}\n"
        f"structured_eligibility={json.dumps(scholarship.structured_eligibility)}\n"
        f"eligibility_text={scholarship.eligibility_text}\n\n"
        f"Current rule-based score: {rule_score}\n"
        f"Current missing requirements: {json.dumps(missing_requirements)}"
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
