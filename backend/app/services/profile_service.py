from sqlalchemy.orm import Session

from app.models.education import Education
from app.models.profile import Profile
from app.models.user import User
from app.models.work_experience import WorkExperience
from app.schemas.profile import ProfileCreate


class ProfileService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def upsert_profile(self, user: User, payload: ProfileCreate) -> Profile:
        profile_data = payload.model_dump(exclude={"educations", "work_experiences"})
        education_data = payload.educations
        work_experience_data = payload.work_experiences

        profile = user.profile
        if profile is None:
            profile = Profile(**profile_data)
            self.db.add(profile)
            self.db.flush()
            user.profile_id = profile.id
        else:
            for key, value in profile_data.items():
                setattr(profile, key, value)

        # Replace educations
        profile.educations.clear()
        for edu in education_data:
            profile.educations.append(Education(**edu.model_dump()))

        # Replace work experiences
        profile.work_experiences.clear()
        for exp in work_experience_data:
            profile.work_experiences.append(WorkExperience(**exp.model_dump()))

        self.db.commit()
        self.db.refresh(profile)
        self.db.refresh(user)
        return profile
