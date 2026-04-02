from pydantic import BaseModel, Field


class MatchRequest(BaseModel):
    force_refresh: bool = False


class ScholarshipMatch(BaseModel):
    scholarship_id: int
    title: str
    country: str
    deadline: str | None
    match_score: int
    rule_score: int | None = None
    llm_score: int | None = None
    llm_confidence: int | None = None
    missing_requirements: list[str] = Field(default_factory=list)
    summary: str
    personalized_reasoning: str | None = None


class MatchResponse(BaseModel):
    matches: list[ScholarshipMatch]
