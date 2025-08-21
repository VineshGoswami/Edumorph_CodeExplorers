# Edumorph Deployment Guide

This document outlines the steps to deploy the Edumorph application to production environments.

## Architecture Overview

The Edumorph application consists of four main components:

1. **Frontend** - React application
2. **Backend** - Node.js/Express API
3. **ML Service** - Python FastAPI for machine learning
4. **MCP Service** - Python FastAPI for content personalization

## Deployment Platforms

- **Frontend**: Vercel
- **Backend**: Render
- **ML Service**: Render
- **MCP Service**: Render
- **Database**: MongoDB Atlas

## Deployment Steps

### 1. Frontend Deployment (Vercel)

1. Create a Vercel account if you don't have one: https://vercel.com/signup
2. Install Vercel CLI: `npm install -g vercel`
3. Navigate to the `frontends` directory
4. Run `vercel login` and follow the authentication steps
5. Run `vercel` to deploy
6. For production deployment, run `vercel --prod`

### 2. Backend Deployment (Render)

1. Create a Render account if you don't have one: https://render.com/signup
2. Create a new Web Service
3. Connect your GitHub repository
4. Select the `backend` directory
5. Configure the service using the `render.yaml` file
6. Set up the environment variables as specified in `.env.example`
7. Deploy the service

### 3. ML Service Deployment (Render)

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Select the `ml-service` directory
4. Configure the service using the `render.yaml` file
5. Deploy the service

### 4. MCP Service Deployment (Render)

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Select the `mcp-service` directory
4. Configure the service using the `render.yaml` file
5. Set the OPENAI_API_KEY environment variable
6. Deploy the service

### 5. MongoDB Atlas Setup

1. Create a MongoDB Atlas account if you don't have one: https://www.mongodb.com/cloud/atlas/register
2. Create a new cluster
3. Set up database access (username and password)
4. Configure network access (IP whitelist)
5. Get your connection string and update the MONGO_URI environment variable in the backend service

## Environment Variables

### Backend

Refer to `.env.example` in the backend directory for all required environment variables.

### Frontend

The frontend requires the following environment variables:

- `REACT_APP_API_URL`: URL of the deployed backend API

### ML Service

No specific environment variables required beyond those in `render.yaml`.

### MCP Service

- `OPENAI_API_KEY`: Your OpenAI API key

## Post-Deployment Verification

1. Verify the frontend is accessible and loads correctly
2. Test user authentication (login/signup)
3. Verify that lessons load correctly
4. Test the ML service integration by checking lesson recommendations
5. Test the MCP service by verifying content adaptation

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend has the correct FRONTEND_URL in environment variables
2. **Database Connection Issues**: Verify MongoDB Atlas connection string and network access settings
3. **API Key Issues**: Check that all required API keys are correctly set

## Monitoring and Maintenance

1. Set up monitoring on Render for all services
2. Configure alerts for service downtime
3. Regularly backup the MongoDB database

## Deployment URLs

- Frontend: https://edumorph-frontend.vercel.app
- Backend API: https://edumorph-backend.onrender.com
- ML Service: https://edumorph-ml-service.onrender.com
- MCP Service: https://edumorph-mcp-service.onrender.com