from datetime import date

from pydantic import BaseModel, ConfigDict


class ScholarshipRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    country: str
    degree: str
    region: str | None = None
    source_key: str | None = None
    source_name: str | None = None
    official_source: bool
    source_url: str
    deadline: date | None = None
    funding_type: str | None = None
    coverage_summary: str | None = None
    is_fully_funded: bool | None = None
    field_of_study: list[str]
    eligible_countries: list[str]
    eligibility_text: str
    structured_eligibility: dict
    raw_payload: dict
