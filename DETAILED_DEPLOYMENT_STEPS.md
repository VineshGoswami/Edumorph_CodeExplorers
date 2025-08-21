# Detailed Deployment Steps for Edumorph

This document provides step-by-step instructions with screenshots for deploying the Edumorph application to production environments.

## 1. Frontend Deployment on Vercel

### Step 1: Log in to Vercel

1. Go to [Vercel](https://vercel.com) and log in with your account
2. If you don't have an account, sign up at https://vercel.com/signup

### Step 2: Import Your GitHub Repository

1. Click on "Add New..." > "Project"
2. Connect to GitHub if not already connected
3. Find and select the "Edumorph_CodeExplorers" repository

### Step 3: Configure Project Settings

1. Set the following configuration:
   - **Project Name**: `edumorph-frontend` (or your preferred name)
   - **Framework Preset**: React.js
   - **Root Directory**: `frontends`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

2. Expand "Environment Variables" and add:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://edumorph-backend.onrender.com/api`

3. Click "Deploy"

### Step 4: Verify Deployment

1. Wait for the build to complete
2. Click on the deployment URL (e.g., https://edumorph-frontend.vercel.app)
3. Verify that the frontend loads correctly

## 2. Backend Deployment on Render

### Step 1: Log in to Render

1. Go to [Render](https://render.com) and log in with your account
2. If you don't have an account, sign up at https://render.com/signup

### Step 2: Create a New Web Service

1. Click on "New" > "Web Service"
2. Connect to GitHub if not already connected
3. Find and select the "Edumorph_CodeExplorers" repository

### Step 3: Configure Web Service

1. Set the following configuration:
   - **Name**: `edumorph-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free (or select a paid plan for production)

2. Expand "Advanced" > "Environment Variables" and add all variables from `.env.example`:
   - `PORT`: `4000`
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `ML_SERVICE_URL`: `https://edumorph-ml-service.onrender.com`
   - `MCP_SERVICE_URL`: `https://edumorph-mcp-service.onrender.com`
   - `LOG_LEVEL`: `production`
   - `OPENAI_MODEL`: `gpt-4o-mini`
   - `OPENAI_TEMPERATURE`: `0.7`
   - `FRONTEND_URL`: `https://edumorph-frontend.vercel.app`

3. Click "Create Web Service"

### Step 4: Verify Deployment

1. Wait for the build to complete
2. Click on the deployment URL (e.g., https://edumorph-backend.onrender.com)
3. Verify that the API is running by accessing https://edumorph-backend.onrender.com/api/health (or another health check endpoint)

## 3. ML Service Deployment on Render

### Step 1: Create a New Web Service

1. In your Render dashboard, click on "New" > "Web Service"
2. Select the same GitHub repository

### Step 2: Configure Web Service

1. Set the following configuration:
   - **Name**: `edumorph-ml-service`
   - **Root Directory**: `ml-service`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free (or select a paid plan for production)

2. No additional environment variables are required

3. Click "Create Web Service"

### Step 3: Verify Deployment

1. Wait for the build to complete
2. Click on the deployment URL (e.g., https://edumorph-ml-service.onrender.com)
3. Verify that the service is running by accessing https://edumorph-ml-service.onrender.com/health

## 4. MCP Service Deployment on Render

### Step 1: Create a New Web Service

1. In your Render dashboard, click on "New" > "Web Service"
2. Select the same GitHub repository

### Step 2: Configure Web Service

1. Set the following configuration:
   - **Name**: `edumorph-mcp-service`
   - **Root Directory**: `mcp-service`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free (or select a paid plan for production)

2. Add the following environment variable:
   - `OPENAI_API_KEY`: Your OpenAI API key

3. Click "Create Web Service"

### Step 3: Verify Deployment

1. Wait for the build to complete
2. Click on the deployment URL (e.g., https://edumorph-mcp-service.onrender.com)
3. Verify that the service is running by accessing https://edumorph-mcp-service.onrender.com/health

## 5. MongoDB Atlas Setup

### Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up or log in

### Step 2: Create a New Cluster

1. Click on "Build a Database"
2. Select your preferred cloud provider and region
3. Choose the free tier (M0) for development or a paid tier for production
4. Click "Create Cluster"

### Step 3: Set Up Database Access

1. In the left sidebar, click on "Database Access"
2. Click "Add New Database User"
3. Create a username and password (save these securely)
4. Set appropriate privileges (e.g., "Read and Write to Any Database")
5. Click "Add User"

### Step 4: Configure Network Access

1. In the left sidebar, click on "Network Access"
2. Click "Add IP Address"
3. For development, you can select "Allow Access from Anywhere" (0.0.0.0/0)
4. For production, add the specific IP addresses of your Render services
5. Click "Confirm"

### Step 5: Get Connection String

1. In the left sidebar, click on "Database"
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user's password
6. Update the `MONGO_URI` environment variable in your backend service on Render

## 6. Update Backend Environment Variables

1. Go to your Render dashboard
2. Select the `edumorph-backend` service
3. Go to "Environment" tab
4. Update the `MONGO_URI` with your MongoDB Atlas connection string
5. Update the `ML_SERVICE_URL` and `MCP_SERVICE_URL` with the actual deployed URLs
6. Click "Save Changes"

## 7. End-to-End Testing

After all services are deployed, perform end-to-end testing using the checklist in `TESTING.md`:

1. Access the frontend at https://edumorph-frontend.vercel.app
2. Test user registration and login
3. Verify that lessons load correctly
4. Test the ML service integration by checking lesson recommendations
5. Test the MCP service by verifying content adaptation

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check that the `FRONTEND_URL` in the backend environment variables matches your actual frontend URL
   - Verify that the backend's CORS configuration is correct

2. **Database Connection Issues**
   - Ensure your MongoDB Atlas connection string is correct
   - Check that the database user has the correct permissions
   - Verify that the IP whitelist includes your Render service IPs

3. **API Key Issues**
   - Verify that your OpenAI API key is valid and has sufficient credits
   - Check that the key is correctly set in both the backend and MCP service

4. **Build Failures**
   - Check the build logs for specific errors
   - Ensure all dependencies are correctly specified in package.json or requirements.txt
   - Verify that the specified Node.js or Python version is compatible with your code

5. **Runtime Errors**
   - Check the service logs in the Render dashboard
   - Verify that all required environment variables are set
   - Ensure that the services can communicate with each other

## Monitoring and Maintenance

1. Set up monitoring on Render for all services
2. Configure alerts for service downtime
3. Regularly backup the MongoDB database
4. Monitor API usage and costs, especially for OpenAI API

## Scaling Considerations

As your application grows, consider:

1. Upgrading to paid plans on Render for better performance
2. Implementing caching strategies
3. Setting up a CDN for static assets
4. Implementing database indexing and optimization
5. Adding load balancing for high-traffic scenarios