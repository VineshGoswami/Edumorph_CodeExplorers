from ..schemas.context import Context
def derive_locale(ctx: Context) -> Context:
    lang = ctx.user.preferred_language or "en"
    region_code = {"pa":"IN","hi":"IN","ml":"IN","ta":"IN","mr":"IN","en":"IN"}.get(lang,"IN")
    ctx.device.locale_hint = ctx.device.locale_hint or f"{lang}-{region_code}"
    return ctx
