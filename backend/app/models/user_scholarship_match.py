from __future__ import annotations

from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class UserScholarshipMatch(Base):
    __tablename__ = "user_scholarship_matches"
    __table_args__ = (UniqueConstraint("user_id", "scholarship_id", name="uq_user_scholarship_match"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    scholarship_id: Mapped[int] = mapped_column(ForeignKey("scholarships.id"), index=True)
    match_score: Mapped[int] = mapped_column(Integer, index=True)
    missing_requirements: Mapped[list[str]] = mapped_column(JSON)
    computed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, index=True)
