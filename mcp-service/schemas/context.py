from pydantic import BaseModel
from typing import List, Optional, Dict

class UserCtx(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    grade: int = 5
    preferred_language: str = "en"
    region: str = "Punjab"
    learning_style: str = "auditory"
    cultural_preferences: Dict[str, str] = {}
    local_examples: bool = True

class DeviceCtx(BaseModel):
    user_agent: Optional[str] = None
    is_mobile: bool = False
    locale_hint: Optional[str] = None

class ContentCtx(BaseModel):
    subject: str = "General"
    difficulty: str = "medium"
    tags: List[str] = []
    cultural_context: Optional[str] = None
    adaptation_level: str = "high"  # Options: none, low, medium, high

class Context(BaseModel):
    user: UserCtx
    device: DeviceCtx
    content: ContentCtx
