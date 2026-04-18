from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.schemas.profile import ProfileRead


def validate_password_complexity(v: str) -> str:
    if not any(c.isdigit() for c in v):
        raise ValueError("Password must contain at least one number.")
    if not any(not c.isalnum() for c in v):
        raise ValueError("Password must contain at least one special character.")
    return v


class UserSignup(BaseModel):
    email: EmailStr
    full_name: str
    password: str = Field(min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def check_password(cls, v: str) -> str:
        return validate_password_complexity(v)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class UserUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2)
    current_password: str | None = Field(default=None)
    new_password: str | None = Field(default=None, min_length=8, max_length=128)

    @field_validator("new_password")
    @classmethod
    def check_new_password(cls, v: str | None) -> str | None:
        if v is not None:
            return validate_password_complexity(v)
        return v


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str
    role: str
    onboarding_completed: bool
    profile: ProfileRead | None = None


class AuthResponse(BaseModel):
    user: UserRead
