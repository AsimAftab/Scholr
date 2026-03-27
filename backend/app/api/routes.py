from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.ai import ScholarshipActionRequest, StructuredEligibilityResponse, StructureEligibilityRequest
from app.schemas.auth import AuthResponse, UserLogin, UserRead, UserSignup
from app.schemas.match import MatchResponse
from app.schemas.profile import ProfileCreate, ProfileRead
from app.schemas.scholarship import ScholarshipRead
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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MatchResponse:
    if current_user.profile is None:
        raise HTTPException(status_code=400, detail="Create a profile before matching")
    profile = ProfileRead.model_validate(current_user.profile)
    return MatchingService(db).match(profile)


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
    return {"content": AIService().generate_sop(profile, scholarship)}


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
    return {"content": AIService().generate_lor(profile, scholarship)}


@router.post("/summarize-scholarship")
def summarize_scholarship(
    payload: ScholarshipActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, str]:
    scholarship = ScholarshipService(db).get_by_id(payload.scholarship_id)
    if scholarship is None:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return {"content": AIService().summarize_scholarship(scholarship)}


@router.post("/scholarships/structure", response_model=StructuredEligibilityResponse)
def structure_eligibility(payload: StructureEligibilityRequest) -> StructuredEligibilityResponse:
    return AIService().structure_eligibility(payload.eligibility_text)
