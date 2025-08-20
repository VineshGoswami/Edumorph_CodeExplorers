from ..schemas.context import Context
def smooth_difficulty(ctx: Context) -> Context:
    if ctx.content.difficulty not in {"easy","medium","hard"}:
        ctx.content.difficulty = "medium"
    return ctx
