// backend/src/config/openai.js
export const openaiConfig = {
  model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  temperature: Number(process.env.OPENAI_TEMPERATURE || 0.7),
};
