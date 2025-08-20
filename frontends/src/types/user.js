/**
 * User type definitions
 */

/**
 * @typedef {Object} User
 * @property {string} id - The unique identifier for the user
 * @property {string} name - The user's full name
 * @property {string} email - The user's email address
 * @property {string} role - The user's role (student, teacher, admin)
 * @property {Date} createdAt - When the user account was created
 * @property {Date} updatedAt - When the user account was last updated
 * @property {UserPreferences} preferences - User preferences
 */

/**
 * @typedef {Object} UserPreferences
 * @property {string} theme - UI theme preference (light, dark, system)
 * @property {boolean} textToSpeech - Whether text-to-speech is enabled
 * @property {string} learningPace - Preferred learning pace (slow, medium, fast)
 * @property {string[]} interests - Array of learning interests/topics
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token - JWT authentication token
 * @property {User} user - User information
 */

export {}; // This export is needed for TypeScript to recognize this as a module