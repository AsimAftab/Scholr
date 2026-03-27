from pydantic import BaseModel, Field

class StructuredEligibilityResponse(BaseModel):
    gpa_required: float | None = None
    ielts_required: float | None = None
    documents_required: list[str] = Field(default_factory=list)
    degree_levels: list[str] = Field(default_factory=list)
    countries_allowed: list[str] = Field(default_factory=list)


class StructureEligibilityRequest(BaseModel):
    eligibility_text: str


class ScholarshipActionRequest(BaseModel):
    scholarship_id: int
