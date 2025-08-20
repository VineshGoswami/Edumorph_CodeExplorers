import { Router } from 'express';
import { getRecommendations } from '../utils/mlClient.js';
const router = Router();

// GET /recommendations?userId=...
router.get('/recommendations', async (req, res) => {
  const { userId } = req.query;
  const recs = await getRecommendations(userId);
  res.json({ recommendations: recs });
});



export default router;
