from pydantic import BaseModel
from .context import Context

class AdaptRequest(BaseModel):
    lesson_content: str
    context: Context

class AdaptResponse(BaseModel):
    adapted_text: str
    cached: bool = False
    personalization_score: float | None = None
    personalization_label: str | None = None
    language: str
    region: str
    grade: int
