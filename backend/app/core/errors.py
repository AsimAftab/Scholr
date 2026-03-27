from pydantic import BaseModel


class APIError(BaseModel):
    detail: str
    request_id: str | None = None
