# Edumorph CodeExplorers

A comprehensive educational platform designed to provide adaptive learning experiences through AI-powered personalization.

## Project Overview

Edumorph is an innovative educational platform that combines adaptive learning paths with AI-driven content personalization. The platform analyzes student engagement and performance to deliver customized educational content that meets individual learning needs.

## Architecture

The application consists of four main components:

1. **Frontend** - React application for user interface
2. **Backend** - Node.js/Express API for business logic and data management
3. **ML Service** - Python FastAPI for machine learning and analytics
4. **MCP Service** - Python FastAPI for content personalization

## Features

- Adaptive learning paths based on student performance
- AI-powered content personalization
- Cultural and linguistic adaptation
- Progress tracking and analytics
- Teacher dashboard for monitoring student progress
- Accessibility features for inclusive learning
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Python 3.8+ (for ML services)
- MongoDB (local development)

### Local Development Setup

1. Clone the repository
   ```
   git clone https://github.com/VineshGoswami/Edumorph_CodeExplorers.git
   cd Edumorph_CodeExplorers
   ```

2. Install frontend dependencies
   ```
   cd frontends
   npm install
   ```

3. Install backend dependencies
   ```
   cd ../backend
   npm install
   ```

4. Install ML service dependencies
   ```
   cd ../ml-service
   pip install -r requirements.txt
   ```

5. Install MCP service dependencies
   ```
   cd ../mcp-service
   pip install -r requirements.txt
   ```

6. Set up environment variables
   - Create `.env` file in the backend directory based on `.env.example`
   - Create `.env.local` file in the frontends directory with `REACT_APP_API_URL=http://localhost:4000/api`

7. Start the services
   - Frontend: `cd frontends && npm start`
   - Backend: `cd backend && npm run dev`
   - ML Service: `cd ml-service && uvicorn app:app --host 0.0.0.0 --port 8000`
   - MCP Service: `cd mcp-service && uvicorn app:app --host 0.0.0.0 --port 8100`

## Deployment

The application is configured for deployment on the following platforms:

- **Frontend**: Vercel
- **Backend**: Render
- **ML Service**: Render
- **MCP Service**: Render
- **Database**: MongoDB Atlas

### Deployment Steps

#### 1. Frontend Deployment (Vercel)

1. Log in to your Vercel account
2. Import your GitHub repository
3. Configure the project:
   - Root Directory: `frontends`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Add environment variables:
   - `REACT_APP_API_URL`: URL of your deployed backend API
5. Deploy the project

#### 2. Backend Deployment (Render)

1. Log in to your Render account
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the service:
   - Name: `edumorph-backend`
   - Root Directory: `backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add environment variables from `.env.example`
6. Deploy the service

#### 3. ML Service Deployment (Render)

1. Create a new Web Service in Render
2. Configure the service:
   - Name: `edumorph-ml-service`
   - Root Directory: `ml-service`
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
3. Deploy the service

#### 4. MCP Service Deployment (Render)

1. Create a new Web Service in Render
2. Configure the service:
   - Name: `edumorph-mcp-service`
   - Root Directory: `mcp-service`
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
3. Add environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
4. Deploy the service

#### 5. MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Set up database access (username and password)
4. Configure network access (IP whitelist or allow access from anywhere)
5. Get your connection string and update the `MONGO_URI` environment variable in the backend service

### Deployment URLs

- Frontend: https://edumorph-frontend.vercel.app
- Backend API: https://edumorph-backend.onrender.com
- ML Service: https://edumorph-ml-service.onrender.com
- MCP Service: https://edumorph-mcp-service.onrender.com

## Testing

Refer to the `TESTING.md` file for a comprehensive testing checklist to verify the deployment.

## Troubleshooting

Common deployment issues and their solutions:

1. **CORS Errors**: Ensure the backend has the correct `FRONTEND_URL` in environment variables
2. **Database Connection Issues**: Verify MongoDB Atlas connection string and network access settings
3. **API Key Issues**: Check that all required API keys are correctly set

## Documentation

- `DEPLOYMENT.md`: Detailed deployment instructions
- `TESTING.md`: Testing checklist for deployment verification

## License

This project is licensed under the terms found in the LICENSE file.