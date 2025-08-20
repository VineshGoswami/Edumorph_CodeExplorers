#!/usr/bin/env bash
set -e
echo "Start ML service:"
echo "  cd ml-service && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && python app.py"
echo
echo "Start MCP service:"
echo "  cd mcp-service && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && cp .env.example .env && python app.py"
echo
echo "Start Backend:"
echo "  cd backend && cp .env.example .env && npm i && npm run seed && npm run dev"
echo
echo "Start Frontend:"
echo "  cd frontend && npm i && echo REACT_APP_API=http://localhost:4000/api > .env && npm start"
