
import { Router } from 'express';
import { translateText } from '../utils/translationClient.js';
import { auth } from '../middleware/auth.js';
const router = Router();

// GET /api/lessons?grade=5&subject=Math
router.get('/', auth, async (req, res) => {
  const { grade = 5, subject } = req.query;
  const q = { gradeLevel: Number(grade) };
  if (subject) q.subject = subject;
  const lessons = await Lesson.find(q).select('title subject gradeLevel');
  res.json({ lessons });
});


// GET /api/lessons/adapted/:id
router.get('/adapted/:id', auth, async (req, res) => {
  const { id } = req.params;
  const userDb = await User.findById(req.user.id);
  const userLang = req.query.language || userDb?.preferredLanguage || 'en';
  const userRegion = req.query.region || userDb?.region || 'Punjab';
  const userGrade = Number(req.query.grade || userDb?.grade || 5);
  const cacheKey = `${userLang}:${userRegion}:g${userGrade}`;
  const lesson = await Lesson.findById(id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  // Serve from cache if available
  if (lesson.adaptedCache && lesson.adaptedCache[cacheKey]?.content) {
    return res.json({ lessonId: id, adapted: lesson.adaptedCache[cacheKey].content, cached: true });
  }
  let ml;
  try {
    ml = await personalizeScore({
      grade: userGrade,
      subject: lesson.subject,
      difficulty: lesson.difficultyLevel
    });
  } catch (e) {
    ml = { score: 0.5, label: 'neutral' };
  }
  // Try MCP adaptation first
  let adaptedText = '';
  try {
    const mcp = await mcpAdapt({
      lessonContent: lesson.originalContent,
      user: {
        id: userDb._id.toString(),
        name: userDb.name,
        grade: userGrade,
        preferredLanguage: userLang,
        region: userRegion,
        learningStyle: userDb.learningStyle || 'auditory'
      },
      device: req.ctx.device,
      content: {
        subject: lesson.subject,
        difficulty: lesson.difficultyLevel,
        tags: [lesson.subject]
      }
    });
    adaptedText = mcp?.adapted_text || '';
  } catch (e) {
    // ignore and fall back
  }
  // Fallback: direct OpenAI call
  if (!adaptedText) {
    const hints = `Personalization score ${ml.score?.toFixed(2) || '0.50'} (${ml.label || 'neutral'}). Subject: ${lesson.subject}. Difficulty: ${lesson.difficultyLevel}.`;
    try {
      adaptedText = await chatAdapt({
        content: lesson.originalContent,
        language: userLang,
        region: userRegion,
        grade: userGrade,
        hints
      });
    } catch (e) {
      return res.status(500).json({ error: 'Adaptation failed' });
    }
  }
  // Translate if needed
  if (userLang !== 'en') {
    adaptedText = await translateText(adaptedText, userLang);
  }
  // Save to cache
  if (!lesson.adaptedCache) lesson.adaptedCache = {};
  lesson.adaptedCache[cacheKey] = { content: adaptedText, createdAt: new Date() };
  await lesson.save();
  res.json({ lessonId: id, adapted: adaptedText, cached: false, ml });
});

export default router;
