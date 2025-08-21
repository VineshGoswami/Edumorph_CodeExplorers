import axios from 'axios';
import { 
  getLessonsOffline, 
  getLessonOffline, 
  saveProgressOffline, 
  saveLessons,
  isOnline 
} from './utils/offlineStorage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API calls
export const login = (email, password) => 
  api.post('/auth/login', { email, password });

export const register = (name, email, password, preferredLanguage = 'en', region = 'Punjab', grade = 5) => 
  api.post('/auth/register', { name, email, password, preferredLanguage, region, grade });

// User API calls
export const getCurrentUser = () => 
  api.get('/users/me');

export const updateUserPreferences = (preferences) => {
  // Always try online first
  if (isOnline()) {
    return api.put('/users/preferences', preferences);
  } else {
    // Store locally and return a resolved promise
    const userId = JSON.parse(localStorage.getItem('user'))?.id;
    if (userId) {
      return new Promise((resolve) => {
        // Save preferences to localStorage
        try {
          localStorage.setItem(`user_preferences_${userId}`, JSON.stringify(preferences));
          resolve({ data: { ...preferences, offlineStored: true } });
        } catch (err) {
          console.error('Failed to save preferences offline:', err);
          resolve({ data: { ...preferences, offlineStored: false, error: err.message } });
        }
      });
    }
    return Promise.reject(new Error('User ID not available for offline storage'));
  }
};

export const updatePassword = (currentPassword, newPassword) => 
  api.put('/users/password', { currentPassword, newPassword });

// Lessons API calls with offline support
export const getLessons = async () => {
  if (isOnline()) {
    try {
      // Try to fetch from API
      const response = await api.get('/lessons');
      // Cache lessons for offline use
      saveLessons(response.data);
      return response;
    } catch (error) {
      console.error('Online fetch failed, trying offline:', error);
      // Fall back to offline if online fails
      return getOfflineLessons();
    }
  } else {
    // Directly use offline data
    return getOfflineLessons();
  }
};

// Helper for offline lessons
const getOfflineLessons = async () => {
  try {
    const lessons = await getLessonsOffline();
    return { 
      data: lessons, 
      offlineData: true 
    };
  } catch (error) {
    console.error('Offline lessons fetch failed:', error);
    throw error;
  }
};

export const getLesson = async (id) => {
  if (isOnline()) {
    try {
      // Try to fetch from API
      const response = await api.get(`/lessons/${id}`);
      // Cache lesson for offline use
      saveLessons([response.data]);
      return response;
    } catch (error) {
      console.error(`Online fetch for lesson ${id} failed, trying offline:`, error);
      // Fall back to offline if online fails
      return getOfflineLesson(id);
    }
  } else {
    // Directly use offline data
    return getOfflineLesson(id);
  }
};

// Helper for offline lesson
const getOfflineLesson = async (id) => {
  try {
    const lesson = await getLessonOffline(id);
    if (!lesson) {
      throw new Error(`Lesson ${id} not found in offline storage`);
    }
    return { 
      data: lesson, 
      offlineData: true 
    };
  } catch (error) {
    console.error(`Offline lesson ${id} fetch failed:`, error);
    throw error;
  }
};

export const trackProgress = async (lessonId, progress) => {
  if (isOnline()) {
    try {
      // Try to send to API
      return await api.post(`/lessons/${lessonId}/progress`, { progress });
    } catch (error) {
      console.error(`Online progress update for lesson ${lessonId} failed, storing offline:`, error);
      // Fall back to offline storage
      return saveProgressOffline(lessonId, progress, localStorage.getItem('token'));
    }
  } else {
    // Store offline and sync later
    return saveProgressOffline(lessonId, progress, localStorage.getItem('token'));
  }
};

// Cultural adaptation API calls
export const adaptContent = async (content, userContext) => {
  if (isOnline()) {
    try {
      return await api.post('/adapt', { lesson_content: content, context: userContext });
    } catch (error) {
      console.error('Content adaptation failed:', error);
      // Return original content if adaptation fails
      return { data: { adapted_text: content } };
    }
  } else {
    // Return original content when offline
    return { data: { adapted_text: content, offlineMode: true } };
  }
};

// Fast cultural adaptation using templates instead of LLM
export const adaptContentCultural = async (content, userContext) => {
  if (isOnline()) {
    try {
      return await api.post('/cultural-adapt', { lesson_content: content, context: userContext });
    } catch (error) {
      console.error('Cultural adaptation failed:', error);
      // Fall back to regular adaptation if cultural adaptation fails
      try {
        return await adaptContent(content, userContext);
      } catch (innerError) {
        console.error('Fallback adaptation failed:', innerError);
        // Return original content if all adaptations fail
        return { data: { adapted_text: content } };
      }
    }
  } else {
    // Return original content when offline
    return { data: { adapted_text: content, offlineMode: true } };
  }
};

// Translation API calls
export const translateContent = async (content, targetLanguage, sourceLanguage = 'en') => {
  if (isOnline()) {
    try {
      return await api.post('/translate', { 
        text: content, 
        target_language: targetLanguage,
        source_language: sourceLanguage
      });
    } catch (error) {
      console.error('Translation failed:', error);
      // Return original content if translation fails
      return { data: { translated_text: content } };
    }
  } else {
    // Return original content when offline
    return { data: { translated_text: content, offlineMode: true } };
  }
};

// Context-aware translation for educational content
export const translateContentWithContext = async (content, targetLanguage, context, sourceLanguage = 'en') => {
  if (isOnline()) {
    try {
      return await api.post('/translate', { 
        text: content, 
        target_language: targetLanguage,
        source_language: sourceLanguage,
        context: context,
        preserve_formatting: true
      });
    } catch (error) {
      console.error('Context-aware translation failed:', error);
      // Fall back to regular translation if context-aware translation fails
      try {
        return await translateContent(content, targetLanguage, sourceLanguage);
      } catch (innerError) {
        console.error('Fallback translation failed:', innerError);
        // Return original content if all translations fail
        return { data: { translated_text: content } };
      }
    }
  } else {
    // Return original content when offline
    return { data: { translated_text: content, offlineMode: true } };
  }
};