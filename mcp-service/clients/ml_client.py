import httpx
from ..configs.settings import ML_SERVICE_URL

async def infer_score(grade: int, subject: str, difficulty: str) -> dict:
    try:
        async with httpx.AsyncClient(timeout=3) as c:
            r = await c.post(f"{ML_SERVICE_URL}/infer", json={"grade":grade,"subject":subject,"difficulty":difficulty})
            if r.status_code == 200:
                return r.json()
    except Exception:
        pass
    return {"score": 0.5, "label": "neutral"}
