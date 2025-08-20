import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import Progress from '../models/progress.js';
import ContextEvent from '../models/ContextEvent.js';

const router = Router();

// POST /api/progress
router.post('/', auth, async (req, res) => {
  const { lessonId, status = 'completed', score = 0 } = req.body;
  const row = await Progress.create({ userId: req.user.id, lessonId, status, score });

  await ContextEvent.create({
    userId: req.user.id,
    sessionId: req.headers['x-session-id'] || 'demo',
    lastAction: 'complete_lesson'
  });

  res.json({ ok: true, progressId: row._id });
});

// GET /api/progress
router.get('/', auth, async (req, res) => {
  const items = await Progress.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50);
  const completed = items.filter(i => i.status === 'completed').length;
  res.json({ count: items.length, completed, items });
});

export default router;
