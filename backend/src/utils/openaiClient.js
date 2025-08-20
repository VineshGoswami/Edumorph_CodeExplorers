// backend/src/utils/openaiClient.js
import axios from 'axios';
import { openaiConfig } from '../config/openai.js';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function chatAdapt({ content, language, region, grade, hints = '' }) {
  if (!process.env.OPENAI_API_KEY) {
    return `[Fallback] ${language}/${region}/g${grade}\n${content}`;
  }

  const prompt =
    `Translate and culturally adapt for grade ${grade} in ${region}. ` +
    `Target language: ${language}. Be concise and age-appropriate.` +
    (hints ? ` Context: ${hints}` : '') +
    `\n\nLesson:\n${content}`;

  const { data } = await axios.post(
    OPENAI_API_URL,
    {
      model: openaiConfig.model,
      messages: [
        {
          role: 'system',
          content:
            'You adapt educational content with cultural sensitivity and accuracy.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: openaiConfig.temperature,
    },
    {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    }
  );

  return data?.choices?.[0]?.message?.content?.trim() || '';
}
