from fastapi import HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password, sign_session, verify_password, verify_session
from app.models.user import User
from app.schemas.auth import UserLogin, UserSignup, UserUpdate


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def signup(self, payload: UserSignup) -> User:
        existing = self.db.scalar(select(User).where(User.email == payload.email.lower()))
        if existing is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

        user = User(
            email=payload.email.lower(),
            full_name=payload.full_name,
            hashed_password=hash_password(payload.password),
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def login(self, payload: UserLogin) -> User:
        user = self.db.scalar(select(User).where(User.email == payload.email.lower()))
        if user is None or not verify_password(payload.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        return user

    def update_user(self, user: User, payload: UserUpdate) -> User:
        if payload.full_name is not None:
            user.full_name = payload.full_name.strip()

        if payload.new_password is not None:
            if payload.current_password is None:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is required to change password")
            if not verify_password(payload.current_password, user.hashed_password):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid current password")
            user.hashed_password = hash_password(payload.new_password)

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def set_session_cookie(self, response: Response, user: User) -> None:
        response.set_cookie(
            key=settings.session_cookie_name,
            value=sign_session(user.id),
            httponly=True,
            samesite="lax",
            secure=settings.session_cookie_secure,
            max_age=60 * 60 * 24 * 7,
        )

    @staticmethod
    def clear_session_cookie(response: Response) -> None:
        response.delete_cookie(settings.session_cookie_name)

    def current_user(self, request: Request) -> User:
        token = request.cookies.get(settings.session_cookie_name)
        if not token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

        user_id = verify_session(token)
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")

        user = self.db.get(User, user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")
        return user
