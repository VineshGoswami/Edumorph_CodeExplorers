from ..schemas.context import Context
from ..policies import short_on_mobile, regional_examples, tone_reading_level

def build_prompt(ctx: Context, lesson_content: str, personalization: dict) -> str:
    hints = f"Personalization score: {personalization.get('score',0.5):.2f} ({personalization.get('label','neutral')}). Subject: {ctx.content.subject}. Difficulty: {ctx.content.difficulty}."
    return (
        f"Translate and culturally adapt for grade {ctx.user.grade} in {ctx.user.region}. "
        f"Target language: {ctx.user.preferred_language}. Be concise and age-appropriate. {hints}\n\n"
        f"Lesson:\n{lesson_content}"
    )

def postprocess(ctx: Context, adapted_text: str) -> str:
    text = adapted_text
    text = tone_reading_level.apply(ctx, text)
    text = regional_examples.apply(ctx, text)
    text = short_on_mobile.apply(ctx, text)
    return text
