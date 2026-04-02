import logging
from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.admin import ScholarshipSourceConfig
from app.models.scholarship import Scholarship
from app.models.user import User
from app.services.ai_runtime_settings import ensure_runtime_settings
from app.services.source_registry import SOURCE_CATALOG


SEED_SCHOLARSHIPS = [
    {
        "scholarship_key": "seed-maple-global-graduate",
        "title": "Maple Global Graduate Scholarship",
        "country": "Canada",
        "degree": "Masters",
        "region": "North America",
        "source_key": "seed-sample",
        "source_name": "Seed Data",
        "official_source": False,
        "source_url": "https://example.org/maple-global-graduate",
        "deadline": date(2026, 7, 15),
        "funding_type": "Merit Scholarship",
        "coverage_summary": "Partial tuition and living stipend",
        "is_fully_funded": False,
        "field_of_study": ["Computer Science"],
        "eligible_countries": [],
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
            "fields_of_study": ["Computer Science"],
            "programs": [],
            "funding_type": "Merit Scholarship",
            "fully_funded": False,
            "benefits": ["Partial tuition", "Living stipend"],
            "application_requirements": ["SOP", "LOR", "CV", "Transcript"],
            "eligible_nationalities_summary": None,
        },
        "raw_payload": {},
    },
    {
        "scholarship_key": "seed-northern-research-excellence",
        "title": "Northern Research Excellence Award",
        "country": "United Kingdom",
        "degree": "PhD",
        "region": "United Kingdom",
        "source_key": "seed-sample",
        "source_name": "Seed Data",
        "official_source": False,
        "source_url": "https://example.org/northern-research-excellence",
        "deadline": date(2026, 9, 1),
        "funding_type": "Research Scholarship",
        "coverage_summary": "Full tuition and research stipend",
        "is_fully_funded": True,
        "field_of_study": ["Engineering"],
        "eligible_countries": [],
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
            "fields_of_study": ["Engineering"],
            "programs": [],
            "funding_type": "Research Scholarship",
            "fully_funded": True,
            "benefits": ["Full tuition", "Research stipend"],
            "application_requirements": ["SOP", "CV", "Passport", "LOR"],
            "eligible_nationalities_summary": None,
        },
        "raw_payload": {},
    },
    {
        "scholarship_key": "seed-asia-future-leaders",
        "title": "Asia Future Leaders Scholarship",
        "country": "Australia",
        "degree": "Masters",
        "region": "Australia",
        "source_key": "seed-sample",
        "source_name": "Seed Data",
        "official_source": False,
        "source_url": "https://example.org/asia-future-leaders",
        "deadline": date(2026, 6, 10),
        "funding_type": "Government Scholarship",
        "coverage_summary": "Tuition support and travel grant",
        "is_fully_funded": False,
        "field_of_study": ["Public Policy", "Engineering"],
        "eligible_countries": ["Nepal", "India", "Bangladesh"],
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
            "fields_of_study": ["Public Policy", "Engineering"],
            "programs": [],
            "funding_type": "Government Scholarship",
            "fully_funded": False,
            "benefits": ["Tuition support", "Travel grant"],
            "application_requirements": ["SOP", "LOR", "CV"],
            "eligible_nationalities_summary": "Citizens of Nepal, India, and Bangladesh may apply.",
        },
        "raw_payload": {},
    },
]


def seed_database() -> None:
    db: Session = SessionLocal()
    try:
        _ensure_admin_user(db)
        ensure_runtime_settings(db)
        _sync_source_configs(db)
        _seed_scholarships(db)
    finally:
        db.close()


def _ensure_admin_user(db: Session) -> None:
    if not settings.admin_email or not settings.admin_password:
        return

    admin = db.scalar(select(User).where(User.email == settings.admin_email.lower()))
    if admin is None:
        admin = User(
            email=settings.admin_email.lower(),
            full_name=settings.admin_full_name,
            hashed_password=hash_password(settings.admin_password),
            role="admin",
        )
        db.add(admin)
        db.commit()
        return

    updated = False
    if admin.role != "admin":
        logger = logging.getLogger(__name__)
        logger.warning(
            f"User {admin.email} exists but does not have the admin role. "
            "Auto-promotion is disabled. Please update the role manually if needed."
        )
    if settings.admin_full_name and admin.full_name != settings.admin_full_name:
        admin.full_name = settings.admin_full_name
        updated = True
    if updated:
        db.commit()


def _seed_scholarships(db: Session) -> None:
    if not settings.auto_seed:
        return
    existing = db.scalar(select(Scholarship.id).limit(1))
    if existing is not None:
        return
    for item in SEED_SCHOLARSHIPS:
        db.add(Scholarship(**item))
    db.commit()


def _sync_source_configs(db: Session) -> None:
    existing_sources = {
        source.source_key: source
        for source in db.scalars(select(ScholarshipSourceConfig)).all()
    }

    changed = False
    for item in SOURCE_CATALOG:
        source = existing_sources.get(item["source_key"])
        if source is None:
            db.add(ScholarshipSourceConfig(**item))
            changed = True
            continue

        for key, value in item.items():
            if getattr(source, key) != value:
                setattr(source, key, value)
                changed = True

    if changed:
        db.commit()
