from datetime import date, datetime

from sqlalchemy import JSON, Boolean, Date, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Scholarship(Base):
    __tablename__ = "scholarships"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True)
    country: Mapped[str] = mapped_column(String(120), index=True)
    degree: Mapped[str] = mapped_column(String(120))
    region: Mapped[str | None] = mapped_column(String(120), index=True, nullable=True)
    source_key: Mapped[str | None] = mapped_column(String(120), index=True, nullable=True)
    source_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    official_source: Mapped[bool] = mapped_column(Boolean, default=True)
    source_url: Mapped[str] = mapped_column(String(500), unique=True)
    deadline: Mapped[date | None] = mapped_column(Date, nullable=True)
    funding_type: Mapped[str | None] = mapped_column(String(120), nullable=True)
    coverage_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_fully_funded: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    field_of_study: Mapped[list[str]] = mapped_column(JSON, default=list)
    eligible_countries: Mapped[list[str]] = mapped_column(JSON, default=list)
    eligibility_text: Mapped[str] = mapped_column(Text)
    structured_eligibility: Mapped[dict] = mapped_column(JSON)
    raw_payload: Mapped[dict] = mapped_column(JSON, default=dict)
    extracted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
