from pydantic import BaseModel, ConfigDict, Field


class ProfileBase(BaseModel):
    country: str = Field(..., examples=["Nepal"])
    target_country: str = Field(..., examples=["Canada"])
    degree: str = Field(..., examples=["Masters"])
    major: str | None = Field(None, examples=["Computer Science"])
    passout_year: int | None = Field(None, examples=[2024])
    gpa: float = Field(..., ge=0, le=4.0)
    ielts_score: float = Field(..., ge=0, le=9.0)


class ProfileCreate(ProfileBase):
    pass


class ProfileRead(ProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: int | None = None

