import axios from 'axios';
import { cfg } from '../config/index.js';

// Delegates adaptation to Python MCP service if you use it.
// Falls back to direct OpenAI if MCP is unavailable (optional).
export async function mcpAdapt({ lessonContent, user, device, content }) {
  try {
    const { data } = await axios.post(`${cfg.mcpUrl}/adapt`, {
      lesson_content: lessonContent,
      context: {
        user: {
          id: user.id,
          name: user.name,
          grade: user.grade,
          preferred_language: user.preferredLanguage,
          region: user.region,
          learning_style: user.learningStyle || 'auditory'
        },
        device: {
          user_agent: device.userAgent,
          is_mobile: device.isMobile,
          locale_hint: device.localeHint || null
        },
        content: {
          subject: content.subject,
          difficulty: content.difficulty || 'medium',
          tags: content.tags || []
        }
      }
    }, { timeout: 5000 });
    return data; // { adapted_text, language, region, grade, personalization_* }
  } catch (e) {
    // Surface error to caller so they can fallback to openaiClient if desired
    throw e;
  }
}
