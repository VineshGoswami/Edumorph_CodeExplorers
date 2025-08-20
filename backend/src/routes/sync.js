const express = require('express');
const Progress = require('../models/progress');
const router = express.Router();

// POST /sync/upload
router.post('/upload', async (req, res) => {
  // Accepts batch progress data from client
  const { userId, progress } = req.body;
  // Upsert logic for offline sync
  await Progress.updateOne({ userId }, { $set: { progress, lastSynced: new Date() } }, { upsert: true });
  res.json({ status: 'ok' });
});

// GET /sync/download?userId=...
router.get('/download', async (req, res) => {
  const { userId } = req.query;
  const data = await Progress.findOne({ userId });
  res.json({ progress: data ? data.progress : null });
});

module.exports = router;
