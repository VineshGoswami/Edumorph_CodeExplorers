from ..schemas.context import Context
def apply(ctx: Context, draft: str) -> str:
    if ctx.user.grade <= 5:
        return "Use simple words. " + draft
    return draft
