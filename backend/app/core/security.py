import hashlib
import hmac
import time

from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def sign_session(user_id: int) -> str:
    created_at = int(time.time())
    payload = f"{user_id}.{created_at}"
    signature = hmac.new(
        settings.session_secret.encode("utf-8"),
        payload.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return f"{payload}.{signature}"


def verify_session(session_token: str) -> int | None:
    parts = session_token.split(".")
    if len(parts) != 3:
        return None

    user_id_str, created_at_str, signature = parts
    payload = f"{user_id_str}.{created_at_str}"

    expected = hmac.new(
        settings.session_secret.encode("utf-8"),
        payload.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    if not hmac.compare_digest(signature, expected):
        return None

    try:
        created_at = int(created_at_str)
    except ValueError:
        return None

    if int(time.time()) - created_at > settings.session_max_age_seconds:
        return None

    return int(user_id_str)
