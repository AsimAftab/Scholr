from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.scholarship import Scholarship


class ScholarshipService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_scholarships(self) -> list[Scholarship]:
        return list(self.db.scalars(select(Scholarship).order_by(Scholarship.deadline)).all())

    def list_scholarships_models(self) -> list[Scholarship]:
        return self.list_scholarships()

    def get_by_id(self, scholarship_id: int) -> Scholarship | None:
        return self.db.get(Scholarship, scholarship_id)

