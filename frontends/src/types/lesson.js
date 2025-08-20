/**
 * Lesson type definitions
 */

/**
 * @typedef {Object} Lesson
 * @property {string} id - The unique identifier for the lesson
 * @property {string} title - The lesson title
 * @property {string} description - Brief description of the lesson
 * @property {string} content - The main content of the lesson (can be HTML/markdown)
 * @property {string} difficulty - Difficulty level (beginner, intermediate, advanced)
 * @property {string[]} tags - Array of tags/categories for the lesson
 * @property {number} estimatedTime - Estimated completion time in minutes
 * @property {LessonResource[]} resources - Additional learning resources
 * @property {LessonQuiz[]} quizzes - Assessment quizzes for the lesson
 */

/**
 * @typedef {Object} LessonResource
 * @property {string} id - Resource identifier
 * @property {string} title - Resource title
 * @property {string} type - Resource type (video, article, exercise, etc.)
 * @property {string} url - URL to the resource
 * @property {string} description - Brief description of the resource
 */

/**
 * @typedef {Object} LessonQuiz
 * @property {string} id - Quiz identifier
 * @property {string} question - The quiz question
 * @property {string[]} options - Array of possible answers
 * @property {number} correctOption - Index of the correct answer
 * @property {string} explanation - Explanation of the correct answer
 */

/**
 * @typedef {Object} UserProgress
 * @property {string} userId - The user's ID
 * @property {string} lessonId - The lesson's ID
 * @property {number} progress - Percentage of lesson completed (0-100)
 * @property {boolean} completed - Whether the lesson is completed
 * @property {number} score - Quiz score if applicable
 * @property {Date} lastAccessed - When the lesson was last accessed
 */

export {}; // This export is needed for TypeScript to recognize this as a module