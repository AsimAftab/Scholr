from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    country: Mapped[str] = mapped_column(String(120))
    target_country: Mapped[str] = mapped_column(String(120))
    degree: Mapped[str] = mapped_column(String(120))
    major: Mapped[str | None] = mapped_column(String(120), nullable=True)
    passout_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    gpa: Mapped[float] = mapped_column(Float)
    ielts_score: Mapped[float] = mapped_column(Float)

