from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.scholarship import Scholarship


SEED_SCHOLARSHIPS = [
    {
        "title": "Maple Global Graduate Scholarship",
        "country": "Canada",
        "degree": "Masters",
        "source_url": "https://example.org/maple-global-graduate",
        "deadline": date(2026, 7, 15),
        "eligibility_text": (
            "Applicants must have a minimum GPA of 3.2 and IELTS score of 6.5. "
            "Required documents include SOP, LOR, CV, and Transcript."
        ),
        "structured_eligibility": {
            "gpa_required": 3.2,
            "ielts_required": 6.5,
            "documents_required": ["SOP", "LOR", "CV", "Transcript"],
            "degree_levels": ["Masters"],
            "countries_allowed": [],
        },
    },
    {
        "title": "Northern Research Excellence Award",
        "country": "United Kingdom",
        "degree": "PhD",
        "source_url": "https://example.org/northern-research-excellence",
        "deadline": date(2026, 9, 1),
        "eligibility_text": (
            "Open to high-performing international students applying for PhD programs. "
            "Minimum GPA 3.5. IELTS 7.0 preferred. Submit SOP, CV, Passport, and two LORs."
        ),
        "structured_eligibility": {
            "gpa_required": 3.5,
            "ielts_required": 7.0,
            "documents_required": ["SOP", "CV", "Passport", "LOR"],
            "degree_levels": ["PhD"],
            "countries_allowed": [],
        },
    },
    {
        "title": "Asia Future Leaders Scholarship",
        "country": "Australia",
        "degree": "Masters",
        "source_url": "https://example.org/asia-future-leaders",
        "deadline": date(2026, 6, 10),
        "eligibility_text": (
            "Citizens of Nepal, India, and Bangladesh may apply. Applicants should have GPA of 3.0 "
            "or above and IELTS 6.0. Required documents: SOP, LOR, CV."
        ),
        "structured_eligibility": {
            "gpa_required": 3.0,
            "ielts_required": 6.0,
            "documents_required": ["SOP", "LOR", "CV"],
            "degree_levels": ["Masters"],
            "countries_allowed": ["Nepal", "India", "Bangladesh"],
        },
    },
]


def seed_database() -> None:
    if not settings.auto_seed:
        return
    db: Session = SessionLocal()
    try:
        existing = db.scalar(select(Scholarship.id).limit(1))
        if existing is not None:
            return
        for item in SEED_SCHOLARSHIPS:
            db.add(Scholarship(**item))
        db.commit()
    finally:
        db.close()
