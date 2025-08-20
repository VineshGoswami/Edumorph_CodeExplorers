from pydantic import BaseModel
from typing import Optional
from .context import Context

class TranslateRequest(BaseModel):
    text: str
    target_language: str
    source_language: Optional[str] = None
    context: Optional[Context] = None
    preserve_formatting: bool = True

class TranslateResponse(BaseModel):
    translated_text: str
    source_language: str
    target_language: str
    quality_score: Optional[float] = None
    context_preserved: bool = True