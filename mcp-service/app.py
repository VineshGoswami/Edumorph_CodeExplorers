from fastapi import FastAPI
from schemas.adapt import AdaptRequest, AdaptResponse
from schemas.translate import TranslateRequest, TranslateResponse
from utils.logger import get_logger
from collectors.user_collector import collect_user
from collectors.device_collector import collect_device
from collectors.content_collector import collect_content
from transformers.locale_deriver import derive_locale
from transformers.difficulty_smoother import smooth_difficulty
from transformers.personalization_bridge import attach_personalization
from transformers.cultural_adapter import apply_cultural_adaptation
from prompt.builder import build_prompt, postprocess
from clients.openai_client import chat_adapt
from services.cultural_adaptation import adapt_content
from services.translation import translate_text
from configs.settings import PORT

app = FastAPI(title="EduMorph MCP Service")
log = get_logger("mcp")

@app.get("/health")
def health():
    return {"ok": True, "service": "mcp-service"}

@app.post("/adapt", response_model=AdaptResponse)
async def adapt(req: AdaptRequest):
    ctx = req.context
    ctx.user = collect_user(ctx.user)
    ctx.device = collect_device(ctx.device)
    ctx.content = collect_content(ctx.content)

    ctx = derive_locale(ctx)
    ctx = smooth_difficulty(ctx)
    ctx = apply_cultural_adaptation(ctx)
    personalization = await attach_personalization(ctx)

    prompt = build_prompt(ctx, req.lesson_content, personalization)
    adapted = await chat_adapt(prompt)
    if not adapted:
        adapted = f"[Fallback] {ctx.user.preferred_language}/{ctx.user.region}/g{ctx.user.grade}\n{req.lesson_content}"
    adapted = postprocess(ctx, adapted)

    return AdaptResponse(
        adapted_text=adapted,
        cached=False,
        personalization_score=personalization.get("score"),
        personalization_label=personalization.get("label"),
        language=ctx.user.preferred_language,
        region=ctx.user.region,
        grade=ctx.user.grade
    )

@app.post("/cultural-adapt", response_model=AdaptResponse)
async def cultural_adapt(req: AdaptRequest):
    """
    Endpoint specifically for cultural adaptation of content
    This uses templates and cultural context rather than LLM for faster processing
    """
    # Apply the cultural adaptation service
    return adapt_content(req)

@app.post("/translate", response_model=TranslateResponse)
async def translate(req: TranslateRequest):
    """
    Endpoint for context-aware translation of educational content
    Preserves educational context, formatting, and domain-specific terminology
    """
    return await translate_text(req)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=PORT, reload=True)
