from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class WorkExperienceCreate(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=255)
    job_title: str = Field(..., min_length=1, max_length=255)
    start_date: str | None = Field(None, max_length=50)
    end_date: str | None = Field(None, max_length=50)
    is_current: bool = False
    employment_type: Literal["Full-time", "Part-time", "Internship", "Contract"] | None = None
    location: str | None = Field(None, max_length=255)
    description: str | None = None


class WorkExperienceRead(WorkExperienceCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
