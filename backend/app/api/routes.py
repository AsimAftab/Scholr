from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.api.deps import get_admin_user, get_current_user
from app.db.session import get_db
from app.models.admin import CrawlJob
from app.models.user import User
from app.schemas.admin import (
    AdminAISettingsRead,
    AdminAISettingsUpdate,
    AdminOverview,
    CrawlJobCreate,
    CrawlJobRead,
    RematchJobCreate,
    ScholarshipSourceConfigRead,
)
from app.schemas.ai import ScholarshipActionRequest, StructuredEligibilityResponse, StructureEligibilityRequest
from app.schemas.auth import AuthResponse, UserLogin, UserRead, UserSignup, UserUpdate
from app.schemas.match import MatchRequest, MatchResponse
from app.schemas.profile import ProfileCreate, ProfileRead
from app.schemas.scholarship import ScholarshipRead
from app.services.admin_service import AdminService
from app.services.ai_service import AIService
from app.services.auth_service import AuthService
from app.services.matching import MatchingService
from app.services.profile_service import ProfileService
from app.services.scholarship_service import ScholarshipService

router = APIRouter()


@router.post("/auth/signup", response_model=AuthResponse)
def signup(payload: UserSignup, response: Response, db: Session = Depends(get_db)) -> AuthResponse:
    service = AuthService(db)
    user = service.signup(payload)
    service.set_session_cookie(response, user)
    return AuthResponse(user=user)


@router.post("/auth/login", response_model=AuthResponse)
def login(payload: UserLogin, response: Response, db: Session = Depends(get_db)) -> AuthResponse:
    service = AuthService(db)
    user = service.login(payload)
    service.set_session_cookie(response, user)
    return AuthResponse(user=user)


@router.post("/auth/logout")
def logout(response: Response) -> dict[str, str]:
    AuthService.clear_session_cookie(response)
    return {"status": "ok"}


@router.get("/auth/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)) -> UserRead:
    return current_user


@router.put("/auth/me", response_model=UserRead)
def update_me(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserRead:
    return AuthService(db).update_user(current_user, payload)


@router.post("/auth/onboarding/complete", response_model=UserRead)
def complete_onboarding(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserRead:
    return AuthService(db).complete_onboarding(current_user)


@router.post("/profile", response_model=ProfileRead)
def create_profile(
    payload: ProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProfileRead:
    return ProfileService(db).upsert_profile(current_user, payload)


@router.get("/scholarships", response_model=list[ScholarshipRead])
def list_scholarships(db: Session = Depends(get_db)) -> list[ScholarshipRead]:
    return ScholarshipService(db).list_scholarships()


@router.post("/match", response_model=MatchResponse)
def match_profile(
    payload: MatchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MatchResponse:
    if current_user.profile is None:
        raise HTTPException(status_code=400, detail="Create a profile before matching")
    profile = ProfileRead.model_validate(current_user.profile)
    return MatchingService(db).match(profile, user_id=current_user.id, force_refresh=payload.force_refresh)


@router.post("/generate-sop")
def generate_sop(
    payload: ScholarshipActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, str]:
    if current_user.profile is None:
        raise HTTPException(status_code=400, detail="Create a profile before generating documents")
    scholarship = ScholarshipService(db).get_by_id(payload.scholarship_id)
    if scholarship is None:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    profile = ProfileRead.model_validate(current_user.profile)
    return {"content": AIService(db).generate_sop(profile, scholarship)}


@router.post("/generate-lor")
def generate_lor(
    payload: ScholarshipActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, str]:
    if current_user.profile is None:
        raise HTTPException(status_code=400, detail="Create a profile before generating documents")
    scholarship = ScholarshipService(db).get_by_id(payload.scholarship_id)
    if scholarship is None:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    profile = ProfileRead.model_validate(current_user.profile)
    return {"content": AIService(db).generate_lor(profile, scholarship)}


@router.post("/summarize-scholarship")
def summarize_scholarship(
    payload: ScholarshipActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, str]:
    scholarship = ScholarshipService(db).get_by_id(payload.scholarship_id)
    if scholarship is None:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return {"content": AIService(db).summarize_scholarship(scholarship)}


@router.post("/scholarships/structure", response_model=StructuredEligibilityResponse)
def structure_eligibility(
    payload: StructureEligibilityRequest,
    db: Session = Depends(get_db),
) -> StructuredEligibilityResponse:
    return AIService(db).structure_eligibility(payload.eligibility_text)


@router.get("/admin/overview", response_model=AdminOverview)
def admin_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
) -> AdminOverview:
    return AdminService(db).get_overview()


@router.get("/admin/sources", response_model=list[ScholarshipSourceConfigRead])
def admin_sources(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
) -> list[ScholarshipSourceConfigRead]:
    return AdminService(db).list_sources()


@router.get("/admin/ai-settings", response_model=AdminAISettingsRead)
def admin_get_ai_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
) -> AdminAISettingsRead:
    try:
        return AdminService(db).get_ai_settings()
    except RuntimeError as error:
        raise HTTPException(status_code=500, detail=str(error)) from error


@router.put("/admin/ai-settings", response_model=AdminAISettingsRead)
def admin_update_ai_settings(
    payload: AdminAISettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
) -> AdminAISettingsRead:
    try:
        return AdminService(db).update_ai_settings(payload)
    except RuntimeError as error:
        raise HTTPException(status_code=500, detail=str(error)) from error


@router.get("/admin/crawl-jobs", response_model=list[CrawlJobRead])
def admin_list_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
) -> list[CrawlJob]:
    return AdminService(db).list_jobs()


@router.post("/admin/crawl-jobs", response_model=CrawlJobRead)
def admin_create_crawl_job(
    payload: CrawlJobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
) -> CrawlJob:
    try:
        return AdminService(db).create_crawl_job(current_user, payload)
    except RuntimeError as error:
        raise HTTPException(status_code=500, detail=str(error)) from error


@router.post("/admin/rematch-jobs", response_model=CrawlJobRead)
def admin_create_rematch_job(
    payload: RematchJobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
) -> CrawlJob:
    try:
        return AdminService(db).create_rematch_job(current_user, payload)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(status_code=500, detail=str(error)) from error
