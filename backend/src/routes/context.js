import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import ContextEvent from '../models/ContextEvent.js';

const router = Router();

// GET /api/context/events
router.get('/events', auth, async (req, res) => {
  const items = await ContextEvent.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ items });
});

export default router;
