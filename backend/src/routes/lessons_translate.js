const express = require('express');
const { translateText } = require('../utils/translationClient');
const router = express.Router();

// POST /lessons/translate
router.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  const translated = await translateText(text, targetLang);
  res.json({ translated });
});

module.exports = router;
