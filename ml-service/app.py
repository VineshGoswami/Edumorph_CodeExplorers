from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from joblib import dump, load
import os

app = FastAPI(title="EduMorph ML Service")
MODEL_PATH = "model_registry/default/model.joblib"
os.makedirs("model_registry/default", exist_ok=True)

SUBJECT_MAP = { 'Math': 0, 'Science': 1, 'English': 2 }
DIFF_MAP = { 'easy': 0, 'medium': 1, 'hard': 2 }

class TrainItem(BaseModel):
    grade: int
    subject: str
    difficulty: str
    engagement: float

class InferItem(BaseModel):
    grade: int
    subject: str
    difficulty: str

from sklearn.neighbors import KNeighborsRegressor

@app.post("/train")
def train(items: list[TrainItem]):
    if not items:
        return {"ok": False, "error": "no data"}
    X, y = [], []
    for it in items:
        X.append([it.grade, SUBJECT_MAP.get(it.subject,0), DIFF_MAP.get(it.difficulty,1)])
        y.append(it.engagement)
    model = KNeighborsRegressor(n_neighbors=3)
    model.fit(np.array(X), np.array(y))
    dump(model, MODEL_PATH)
    return {"ok": True, "count": len(X), "model": MODEL_PATH}

@app.post("/infer")
def infer(it: InferItem):
    if not os.path.exists(MODEL_PATH):
        return {"score": 0.5, "label": "neutral"}
    model = load(MODEL_PATH)
    X = np.array([[it.grade, SUBJECT_MAP.get(it.subject,0), DIFF_MAP.get(it.difficulty,1)]])
    score = float(model.predict(X)[0])
    label = 'low' if score < 0.4 else ('high' if score > 0.7 else 'neutral')
    return {"score": score, "label": label}

@app.get("/health")
def health():
    return {"ok": True, "service": "ml-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
