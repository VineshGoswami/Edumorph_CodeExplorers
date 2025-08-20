import { Router } from 'express';
import { speechToText, textToSpeech } from '../utils/speechClient.js';
const router = Router();

// POST /speech-to-text
router.post('/speech-to-text', async (req, res) => {
  try {
    const { audio, language } = req.body;
    if (!audio) {
      return res.status(400).json({ error: 'Audio data is required' });
    }
    
    const transcript = await speechToText(audio, language);
    res.json({ transcript });
  } catch (error) {
    console.error('Speech-to-text error:', error);
    res.status(500).json({ error: error.message || 'Error processing speech to text' });
  }
});

// POST /text-to-speech
router.post('/text-to-speech', async (req, res) => {
  try {
    const { text, voice, language } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const audioBuffer = await textToSpeech(text, voice, language);
    res.set('Content-Type', 'audio/mp3');
    res.send(audioBuffer);
  } catch (error) {
    console.error('Text-to-speech error:', error);
    res.status(500).json({ error: error.message || 'Error processing text to speech' });
  }
});

export default router;
