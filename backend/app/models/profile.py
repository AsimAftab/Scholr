from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    country: Mapped[str] = mapped_column(String(120))
    target_country: Mapped[str] = mapped_column(String(120))
    degree_level: Mapped[str] = mapped_column("degree", String(120))
    field_of_study: Mapped[str | None] = mapped_column("major", String(120), nullable=True)
    passout_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    gpa: Mapped[float] = mapped_column(Float)
    ielts_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    gender: Mapped[str | None] = mapped_column(String(50), nullable=True)
    date_of_birth: Mapped[str | None] = mapped_column(String(50), nullable=True)
    resume_url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    educations = relationship("Education", cascade="all, delete-orphan", lazy="joined")
    work_experiences = relationship("WorkExperience", cascade="all, delete-orphan", lazy="joined")
