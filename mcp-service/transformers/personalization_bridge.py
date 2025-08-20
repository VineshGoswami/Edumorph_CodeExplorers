from ..schemas.context import Context
from ..clients.ml_client import infer_score

async def attach_personalization(ctx: Context) -> dict:
    return await infer_score(ctx.user.grade, ctx.content.subject, ctx.content.difficulty)
