/**
 * Teacher Dashboard API client
 * Provides functions to interact with the teacher dashboard backend API
 */

import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Get teacher dashboard overview data
 * @param {string} teacherId - ID of the teacher
 * @returns {Promise} - Promise with dashboard data
 */
export const getTeacherDashboard = async (teacherId) => {
  try {
    const response = await api.get(`/teacher/dashboard?teacherId=${teacherId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher dashboard:', error);
    throw error;
  }
};

/**
 * Get all students for a teacher
 * @param {string} teacherId - ID of the teacher
 * @returns {Promise} - Promise with students data
 */
export const getTeacherStudents = async (teacherId) => {
  try {
    const response = await api.get(`/teacher/students?teacherId=${teacherId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher students:', error);
    throw error;
  }
};

/**
 * Get a specific student's details
 * @param {string} studentId - ID of the student
 * @returns {Promise} - Promise with student details
 */
export const getStudentDetails = async (studentId) => {
  try {
    const response = await api.get(`/teacher/students/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student details:', error);
    throw error;
  }
};

/**
 * Get progress for a specific student
 * @param {string} studentId - ID of the student
 * @returns {Promise} - Promise with student progress
 */
export const getStudentProgress = async (studentId) => {
  try {
    const response = await api.get(`/teacher/progress?studentId=${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student progress:', error);
    throw error;
  }
};

/**
 * Get analytics data for teacher dashboard
 * @param {string} teacherId - ID of the teacher
 * @returns {Promise} - Promise with analytics data
 */
export const getTeacherAnalytics = async (teacherId) => {
  try {
    const response = await api.get(`/teacher/analytics?teacherId=${teacherId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher analytics:', error);
    throw error;
  }
};

/**
 * Save teacher dashboard settings
 * @param {string} teacherId - ID of the teacher
 * @param {Object} notificationPreferences - Notification settings
 * @param {Object} dashboardCustomization - Dashboard customization settings
 * @returns {Promise} - Promise with save result
 */
export const saveTeacherSettings = async (teacherId, notificationPreferences, dashboardCustomization) => {
  try {
    const response = await api.post('/teacher/settings', {
      teacherId,
      notificationPreferences,
      dashboardCustomization
    });
    return response.data;
  } catch (error) {
    console.error('Error saving teacher settings:', error);
    throw error;
  }
};

export default {
  getTeacherDashboard,
  getTeacherStudents,
  getStudentDetails,
  getStudentProgress,
  getTeacherAnalytics,
  saveTeacherSettings
};