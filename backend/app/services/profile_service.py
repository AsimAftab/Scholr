from sqlalchemy.orm import Session

from app.models.profile import Profile
from app.models.user import User
from app.schemas.profile import ProfileCreate


class ProfileService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def upsert_profile(self, user: User, payload: ProfileCreate) -> Profile:
        profile = user.profile
        if profile is None:
            profile = Profile(**payload.model_dump())
            self.db.add(profile)
            self.db.flush()
            user.profile_id = profile.id
        else:
            for key, value in payload.model_dump().items():
                setattr(profile, key, value)
        self.db.commit()
        self.db.refresh(profile)
        self.db.refresh(user)
        return profile
