from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator

from app.schemas.country_options import COUNTRIES


class ProfileBase(BaseModel):
    country: str = Field(..., examples=["Nepal"])
    target_country: str = Field(..., examples=["Canada"])
    degree_level: str = Field(..., examples=["Masters"])
    field_of_study: str | None = Field(None, examples=["Computer Science"])
    passout_year: int | None = Field(None, examples=[2024])
    gpa: float = Field(..., ge=0, le=10.0)
    ielts_score: float | None = Field(None, ge=0, le=9.0)
    gender: Literal["Male", "Female", "Other"] | None = Field(None, examples=["Male", "Female", "Other"])
    date_of_birth: date | None = Field(None, examples=["2000-01-01"])
    resume_url: HttpUrl | None = Field(None, examples=["https://example.com/resume.pdf"])

    @field_validator("country", "target_country")
    @classmethod
    def validate_country(cls, value: str) -> str:
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
    pass


class ProfileRead(ProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: int | None = None
