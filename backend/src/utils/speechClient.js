export async function speechToText(audioBuffer, language = null) {
  try {
    // If OpenAI API key is not available, return a placeholder
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not available for speech-to-text');
      return 'Speech recognition unavailable';
    }
    
    // Use environment variable for default language if not specified
    const selectedLanguage = language || process.env.STT_DEFAULT_LANGUAGE || 'en';
    
    // Extract language code from locale format if needed (e.g., 'en-US' -> 'en')
    const languageCode = selectedLanguage.split('-')[0].toLowerCase();
    
    // Convert audio buffer to FormData for API request
    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer], { type: 'audio/wav' }), 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', languageCode);
    
    // Add optional parameters for better transcription
    formData.append('response_format', 'json');
    
    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Whisper API error:', error);
      throw new Error(`Whisper API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Speech-to-text error:', error);
    throw error;
  }
}

export async function textToSpeech(text, voice = null, language = 'en') {
  try {
    // If OpenAI API key is not available, return a placeholder audio buffer
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not available for text-to-speech');
      return Buffer.from('AUDIO_DATA_PLACEHOLDER');
    }
    
    // Use environment variable for default voice if not specified
    const selectedVoice = voice || process.env.TTS_DEFAULT_VOICE || 'alloy';
    
    // Validate voice option
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    if (!validVoices.includes(selectedVoice)) {
      console.warn(`Invalid voice: ${selectedVoice}, falling back to alloy`);
    }
    
    // Adjust speed based on user preferences (could be stored in user profile)
    const speed = 1.0;
    
    // Call OpenAI TTS API
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: validVoices.includes(selectedVoice) ? selectedVoice : 'alloy',
        response_format: 'mp3',
        speed: speed
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('TTS API error:', error);
      throw new Error(`TTS API error: ${error.error?.message || 'Unknown error'}`);
    }

    // Convert response to buffer
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Text-to-speech error:', error);
    throw error;
  }
}