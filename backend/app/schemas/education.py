from pydantic import BaseModel, ConfigDict, Field


class EducationCreate(BaseModel):
    institution_name: str = Field(..., min_length=1, max_length=255)
    degree: str = Field(..., min_length=1, max_length=120)
    field_of_study: str | None = Field(None, max_length=120)
    start_year: int | None = Field(None, ge=1900, le=2100)
    end_year: int | None = Field(None, ge=1900, le=2100)
    gpa: float | None = Field(None, ge=0, le=10.0)
    country: str | None = Field(None, max_length=120)
    city: str | None = Field(None, max_length=120)
    achievements: str | None = None


class EducationRead(EducationCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
