// Do not hardcode secrets. Use .env and environment variables for sensitive data.
export const cfg = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'devsecret',
  openaiKey: process.env.OPENAI_API_KEY || '',
  mlUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  mcpUrl: process.env.MCP_SERVICE_URL || 'http://localhost:8100',
  openaiModel: 'gpt-4o-mini',
  openaiTemp: 0.7
};
