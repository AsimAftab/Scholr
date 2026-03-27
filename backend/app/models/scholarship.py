from datetime import date

from sqlalchemy import JSON, Date, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Scholarship(Base):
    __tablename__ = "scholarships"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True)
    country: Mapped[str] = mapped_column(String(120), index=True)
    degree: Mapped[str] = mapped_column(String(120))
    source_url: Mapped[str] = mapped_column(String(500), unique=True)
    deadline: Mapped[date] = mapped_column(Date)
    eligibility_text: Mapped[str] = mapped_column(Text)
    structured_eligibility: Mapped[dict] = mapped_column(JSON)
