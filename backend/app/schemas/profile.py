from datetime import date, datetime
from typing import Literal
from urllib.parse import urlparse

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator, model_validator

from app.schemas.country_options import COUNTRIES
from app.schemas.education import EducationCreate, EducationRead
from app.schemas.work_experience import WorkExperienceCreate, WorkExperienceRead


class ProfileBase(BaseModel):
    country: str | None = Field(None, examples=["Nepal"])
    target_country: str | None = Field(None, examples=["Canada"])
    degree_level: str = Field(..., examples=["Masters"])
    field_of_study: str | None = Field(None, examples=["Computer Science"])
    passout_year: int | None = Field(None, examples=[2024])
    gpa: float = Field(..., ge=0, le=10.0)
    ielts_score: float | None = Field(None, ge=0, le=9.0)
    gender: Literal["Male", "Female", "Other"] | None = Field(None, examples=["Male", "Female", "Other"])
    date_of_birth: date | None = Field(None, examples=["2000-01-01"])
    resume_url: HttpUrl | None = Field(None, examples=["https://drive.google.com/file/d/123/view"])
    resume_is_accessible: bool | None = Field(None, examples=[True])
    resume_format: Literal["EuroPass", "Normal"] | None = Field(None, examples=["Normal"])
    @field_validator("country", "target_country")
    @classmethod
    def validate_country(cls, value: str | None) -> str | None:
        if value is None or value == "":
            return None
        if value not in COUNTRIES:
            raise ValueError("Select a valid country from the list.")
        return value

    @field_validator("passout_year")
    @classmethod
    def validate_passout_year(cls, value: int | None) -> int | None:
        if value is not None:
            max_year = datetime.now().year + 10
            if value < 1900:
                raise ValueError("Year must be 1900 or later.")
            if value > max_year:
                raise ValueError(f"Year cannot be more than 10 years in the future ({max_year}).")
        return value



class ProfileCreate(ProfileBase):
    educations: list[EducationCreate] = Field(default_factory=list)
    work_experiences: list[WorkExperienceCreate] = Field(default_factory=list)

    @field_validator("resume_url")
    @classmethod
    def validate_resume_url(cls, value: HttpUrl | None) -> HttpUrl | None:
        if value is not None and urlparse(str(value)).hostname != "drive.google.com":
            raise ValueError("Only Google Drive links (drive.google.com) are allowed for resumes.")
        return value

    @model_validator(mode="after")
    def validate_resume_metadata(self) -> "ProfileCreate":
        if self.resume_url is not None:
            if not self.resume_is_accessible:
                raise ValueError("You must confirm that the Google Drive link is publicly accessible.")
            if not self.resume_format:
                raise ValueError("You must specify the resume format (EuroPass or Normal).")
        return self


class ProfileRead(ProfileBase):
    model_config = {"from_attributes": True}

    id: int | None = None
    educations: list[EducationRead] = Field(default_factory=list)
    work_experiences: list[WorkExperienceRead] = Field(default_factory=list)
