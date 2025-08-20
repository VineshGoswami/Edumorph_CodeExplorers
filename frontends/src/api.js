import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
export const login = (email: string, password: string) => 
  api.post('/auth/login', { email, password });

export const register = (name: string, email: string, password: string) => 
  api.post('/auth/register', { name, email, password });

// User API calls
export const getCurrentUser = () => 
  api.get('/users/me');

export const updateUserPreferences = (preferences) => 
  api.put('/users/preferences', preferences);

export const updatePassword = (currentPassword, newPassword) => 
  api.put('/users/password', { currentPassword, newPassword });

// Lessons API calls
export const getLessons = () => 
  api.get('/lessons');

export const getLesson = (id: string) => 
  api.get(`/lessons/${id}`);

export const trackProgress = (lessonId: string, progress: number) => 
  api.post(`/lessons/${lessonId}/progress`, { progress });

export const submitQuiz = (lessonId: string, answers: Array<number>) => 
  api.post(`/lessons/${lessonId}/quiz`, { answers });

export const getUserProgress = () => 
  api.get('/lessons/progress/all');

export default api;