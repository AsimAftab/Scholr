from pydantic import BaseModel, Field

class ScholarshipMatch(BaseModel):
    scholarship_id: int
    title: str
    country: str
    deadline: str | None
    match_score: int
    missing_requirements: list[str] = Field(default_factory=list)
    summary: str


class MatchResponse(BaseModel):
    matches: list[ScholarshipMatch]
