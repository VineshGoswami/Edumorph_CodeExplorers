import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

/**
 * Speech API client for handling speech-to-text and text-to-speech operations
 */
const speechApi = {
  /**
   * Convert speech audio to text
   * @param {Blob} audioBlob - The audio blob to convert to text
   * @param {string} language - The language code (e.g., 'en-US', 'es-ES')
   * @returns {Promise<string>} The transcribed text
   */
  async speechToText(audioBlob, language = 'en-US') {
    try {
      // Convert blob to base64
      const base64Audio = await blobToBase64(audioBlob);
      
      const response = await api.post('/speech/speech-to-text', {
        audio: base64Audio,
        language
      });
      
      return response.data.transcript;
    } catch (error) {
      console.error('Speech to text error:', error);
      throw new Error(error.response?.data?.error || 'Failed to convert speech to text');
    }
  },
  
  /**
   * Convert text to speech audio
   * @param {string} text - The text to convert to speech
   * @param {string} voice - The voice to use (e.g., 'alloy', 'echo', 'fable')
   * @param {string} language - The language code (e.g., 'en-US', 'es-ES')
   * @returns {Promise<Blob>} The audio blob
   */
  async textToSpeech(text, voice = 'alloy', language = 'en-US') {
    try {
      const response = await api.post('/speech/text-to-speech', {
        text,
        voice,
        language
      }, {
        responseType: 'arraybuffer'
      });
      
      return new Blob([response.data], { type: 'audio/mp3' });
    } catch (error) {
      console.error('Text to speech error:', error);
      throw new Error(error.response?.data?.error || 'Failed to convert text to speech');
    }
  },
  
  /**
   * Get accessibility settings
   * @returns {Promise<Object>} The accessibility settings
   */
  async getAccessibilitySettings() {
    try {
      const response = await api.get('/api/accessibility/settings');
      return response.data;
    } catch (error) {
      console.error('Get accessibility settings error:', error);
      // Fallback to default settings if API fails
      return {
        speechToText: true,
        textToSpeech: true,
        availableVoices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
        availableLanguages: [{ code: 'en-US', name: 'English (US)' }]
      };
    }
  },
  
  /**
   * Get user accessibility preferences
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} The user preferences
   */
  async getUserAccessibilityPreferences(userId) {
    try {
      const response = await api.get(`/api/accessibility/preferences/${userId}`);
      return response.data.preferences;
    } catch (error) {
      console.error('Get user accessibility preferences error:', error);
      // Try to get from localStorage if API fails
      const localPrefs = localStorage.getItem('edumorph_accessibility');
      if (localPrefs) {
        return JSON.parse(localPrefs);
      }
      throw new Error(error.response?.data?.error || 'Failed to get user accessibility preferences');
    }
  },
  
  /**
   * Save user accessibility preferences
   * @param {Object} preferences - The user preferences
   * @param {string} userId - The user ID (optional)
   * @returns {Promise<Object>} The saved preferences
   */
  async saveAccessibilityPreferences(preferences, userId) {
    try {
      // Save to localStorage as a fallback
      localStorage.setItem('edumorph_accessibility', JSON.stringify(preferences));
      
      // Try to save to the server
      const payload = { preferences };
      if (userId) {
        payload.userId = userId;
      }
      const response = await api.post('/api/accessibility/preferences', payload);
      return response.data;
    } catch (error) {
      console.error('Save accessibility preferences error:', error);
      // Return the preferences that were saved to localStorage
      return { 
        success: true, 
        message: 'Preferences saved locally only',
        preferences
      };
    }
  }
};

/**
 * Convert a Blob to base64 string
 * @param {Blob} blob - The blob to convert
 * @returns {Promise<string>} The base64 string
 */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default speechApi;