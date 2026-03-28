from pydantic import BaseModel, Field

class StructuredEligibilityResponse(BaseModel):
    gpa_required: float | None = None
    ielts_required: float | None = None
    documents_required: list[str] = Field(default_factory=list)
    degree_levels: list[str] = Field(default_factory=list)
    countries_allowed: list[str] = Field(default_factory=list)
    fields_of_study: list[str] = Field(default_factory=list)
    programs: list[str] = Field(default_factory=list)
    funding_type: str | None = None
    fully_funded: bool | None = None
    benefits: list[str] = Field(default_factory=list)
    application_requirements: list[str] = Field(default_factory=list)
    eligible_nationalities_summary: str | None = None


class StructureEligibilityRequest(BaseModel):
    eligibility_text: str


class ScholarshipActionRequest(BaseModel):
    scholarship_id: int
