import { Router } from 'express';
import { translateText, simplifyText } from '../utils/nlpClient.js';
const router = Router();

// POST /lessons/translate
router.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  const translated = await translateText(text, targetLang);
  res.json({ translated });
});

// POST /lessons/simplify
router.post('/simplify', async (req, res) => {
  const { text, level } = req.body;
  const simplified = await simplifyText(text, level);
  res.json({ simplified });
});

export default router;
