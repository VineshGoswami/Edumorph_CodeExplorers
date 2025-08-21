# Environment Variables Configuration for Edumorph

This document provides detailed information about the environment variables required for each component of the Edumorph application.

## Frontend Environment Variables

### Development (.env.development)

```
REACT_APP_API_URL=http://localhost:4000/api
```

### Production (.env.production)

```
REACT_APP_API_URL=https://edumorph-backend.onrender.com/api
```

## Backend Environment Variables

### Development (.env)

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/edumorph
JWT_SECRET=your_local_jwt_secret
OPENAI_API_KEY=your_openai_api_key
ML_SERVICE_URL=http://localhost:5000
MCP_SERVICE_URL=http://localhost:5001
LOG_LEVEL=development
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.7
FRONTEND_URL=http://localhost:3000
```

### Production (Render Environment Variables)

```
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/edumorph?retryWrites=true&w=majority
JWT_SECRET=your_production_jwt_secret
OPENAI_API_KEY=your_openai_api_key
ML_SERVICE_URL=https://edumorph-ml-service.onrender.com
MCP_SERVICE_URL=https://edumorph-mcp-service.onrender.com
LOG_LEVEL=production
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.7
FRONTEND_URL=https://edumorph-frontend.vercel.app
```

## ML Service Environment Variables

### Development (.env)

```
PORT=5000
PYTHON_VERSION=3.10.0
```

### Production (Render Environment Variables)

```
PORT=10000  # Render will override this with its own port
PYTHON_VERSION=3.10.0
```

## MCP Service Environment Variables

### Development (.env)

```
PORT=5001
PYTHON_VERSION=3.10.0
OPENAI_API_KEY=your_openai_api_key
```

### Production (Render Environment Variables)

```
PORT=10000  # Render will override this with its own port
PYTHON_VERSION=3.10.0
OPENAI_API_KEY=your_openai_api_key
```

## MongoDB Atlas Configuration

### Connection String Format

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/edumorph?retryWrites=true&w=majority
```

Replace:
- `<username>` with your MongoDB Atlas database user
- `<password>` with your database user's password
- `<cluster>` with your cluster name

## Security Considerations

1. **JWT Secret**: Use a strong, random string for JWT_SECRET in production
2. **API Keys**: Never commit API keys to your repository
3. **Database Credentials**: Use environment variables for database credentials
4. **Access Control**: Restrict database access to specific IP addresses when possible

## Setting Environment Variables

### Vercel (Frontend)

1. Go to your project settings in Vercel
2. Navigate to the "Environment Variables" section
3. Add each variable with its corresponding value
4. Deploy or redeploy your application

### Render (Backend, ML Service, MCP Service)

1. Go to your web service in Render
2. Navigate to the "Environment" tab
3. Add each variable with its corresponding value
4. Click "Save Changes"
5. Your service will automatically redeploy with the new environment variables

## Troubleshooting

### Common Environment Variable Issues

1. **CORS Errors**: Ensure FRONTEND_URL matches your actual frontend URL
2. **Database Connection Issues**: Verify MONGO_URI is correct and includes proper credentials
3. **API Key Issues**: Check that OPENAI_API_KEY is valid and has sufficient credits
4. **Service Communication**: Ensure ML_SERVICE_URL and MCP_SERVICE_URL are correct and accessible

### Verifying Environment Variables

#### Frontend

Check if environment variables are loaded correctly:

```javascript
console.log('API URL:', process.env.REACT_APP_API_URL);
```

#### Backend

Check if environment variables are loaded correctly:

```javascript
console.log('MongoDB URI:', process.env.MONGO_URI);
console.log('ML Service URL:', process.env.ML_SERVICE_URL);
```

#### ML Service and MCP Service

Check if environment variables are loaded correctly:

```python
import os
print(f"Port: {os.getenv('PORT')}")
```

## Best Practices

1. Use `.env.example` files to document required environment variables without exposing actual values
2. Set up different environment configurations for development, testing, and production
3. Validate environment variables on application startup
4. Use a secure method to manage and share environment variables with team members
5. Regularly rotate secrets and API keys