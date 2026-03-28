from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.schemas.profile import ProfileRead


class UserSignup(BaseModel):
    email: EmailStr
    full_name: str
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str
    role: str
    profile: ProfileRead | None = None


class AuthResponse(BaseModel):
    user: UserRead
