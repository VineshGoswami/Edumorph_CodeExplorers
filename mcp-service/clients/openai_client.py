import httpx
from ..configs.settings import OPENAI_API_KEY, OPENAI_MODEL, OPENAI_TEMPERATURE

OPENAI_URL = "https://api.openai.com/v1/chat/completions"

async def chat_adapt(prompt: str) -> str:
    if not OPENAI_API_KEY:
        return ""
    async with httpx.AsyncClient(timeout=15) as c:
        r = await c.post(OPENAI_URL,
            headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
            json={
                "model": OPENAI_MODEL,
                "messages": [
                    {"role":"system","content":"You adapt educational content with cultural sensitivity and accuracy."},
                    {"role":"user","content": prompt}
                ],
                "temperature": OPENAI_TEMPERATURE
            })
        r.raise_for_status()
        j = r.json()
        return (j.get("choices", [{}])[0].get("message",{}).get("content","") or "").strip()
