#!/usr/bin/env bash
set -e
pushd backend
npm run seed
popd

pushd ml-service
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python - <<'PY'
import requests
data=[
 {"grade":5,"subject":"Math","difficulty":"medium","engagement":0.8},
 {"grade":5,"subject":"Science","difficulty":"medium","engagement":0.6},
 {"grade":5,"subject":"English","difficulty":"easy","engagement":0.9},
 {"grade":6,"subject":"Math","difficulty":"hard","engagement":0.3}
]
print(requests.post("http://localhost:8000/train", json=data).json())
PY
popd
