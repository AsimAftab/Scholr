from datetime import date

from pydantic import BaseModel, ConfigDict


class ScholarshipRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    country: str
    degree: str
    source_url: str
    deadline: date
    eligibility_text: str
    structured_eligibility: dict

