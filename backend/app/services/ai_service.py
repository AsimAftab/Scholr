import json
import re

from openai import OpenAI

from app.core.config import settings
from app.models.scholarship import Scholarship
from app.schemas.ai import StructuredEligibilityResponse
from app.schemas.profile import ProfileRead


class AIService:
    def __init__(self) -> None:
        self.client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None

    def structure_eligibility(self, eligibility_text: str) -> StructuredEligibilityResponse:
        if self.client is None:
            return self._structure_with_rules(eligibility_text)

        prompt = (
            "Convert the scholarship eligibility text into JSON with keys "
            "gpa_required, ielts_required, documents_required, degree_levels, countries_allowed. "
            "Return only valid JSON.\n\n"
            f"Eligibility text:\n{eligibility_text}"
        )
        response = self.client.responses.create(model=settings.openai_model, input=prompt)
        return StructuredEligibilityResponse(**json.loads(response.output_text))

    def generate_sop(self, profile: ProfileRead, scholarship: Scholarship) -> str:
        if self.client is None:
            return (
                f"I am applying for the {scholarship.title} in {scholarship.country} to pursue a "
                f"{profile.degree}. My academic profile includes a GPA of {profile.gpa} and IELTS "
                f"score of {profile.ielts_score}. This scholarship aligns with my goal to study in "
                f"{profile.target_country} and contribute meaningfully after graduation."
            )
        prompt = (
            f"Write a concise statement of purpose draft for a scholarship application.\n"
            f"Applicant: {profile.model_dump_json()}\n"
            f"Scholarship: {scholarship.title}, {scholarship.country}, {scholarship.eligibility_text}"
        )
        return self.client.responses.create(model=settings.openai_model, input=prompt).output_text

    def generate_lor(self, profile: ProfileRead, scholarship: Scholarship) -> str:
        if self.client is None:
            return (
                f"To the scholarship committee,\n\nI strongly recommend this candidate for the "
                f"{scholarship.title}. Their GPA of {profile.gpa} and international study goals "
                f"demonstrate the discipline and potential required for success."
            )
        prompt = (
            f"Write a recommendation letter template for this scholarship.\n"
            f"Applicant: {profile.model_dump_json()}\n"
            f"Scholarship: {scholarship.title}, {scholarship.country}"
        )
        return self.client.responses.create(model=settings.openai_model, input=prompt).output_text

    def summarize_scholarship(self, scholarship: Scholarship) -> str:
        if self.client is None:
            docs = ", ".join(scholarship.structured_eligibility.get("documents_required", []))
            docs = docs or "standard academic documents"
            return (
                f"{scholarship.title} supports {scholarship.degree} study in {scholarship.country}. "
                f"Deadline: {scholarship.deadline.isoformat()}. Required documents include {docs}."
            )
        prompt = (
            "Summarize this scholarship for a student dashboard in 2 sentences.\n"
            f"{scholarship.title}\n{scholarship.country}\n{scholarship.eligibility_text}"
        )
        return self.client.responses.create(model=settings.openai_model, input=prompt).output_text

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
        )

