from ..schemas.context import Context
def apply(ctx: Context, draft: str) -> str:
    if ctx.device.is_mobile:
        lines = [l.strip() for l in draft.split("\n") if l.strip()]
        out = [("• " + l[:120] + "…") if len(l) > 120 else ("• " + l) for l in lines]
        return "\n".join(out)
    return draft
