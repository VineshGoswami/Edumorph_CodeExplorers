/**
 * Offline Storage Utility for Edumorph
 * Provides IndexedDB-based storage for offline-first functionality
 */

const DB_NAME = 'edumorph-offline';
const DB_VERSION = 1;

// Store names
const STORES = {
  LESSONS: 'lessons',
  PROGRESS: 'progress',
  PENDING_UPDATES: 'pendingUpdates',
  USER_PREFERENCES: 'userPreferences'
};

/**
 * Open the IndexedDB database
 * @returns {Promise<IDBDatabase>} The database instance
 */
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.LESSONS)) {
        db.createObjectStore(STORES.LESSONS, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
        db.createObjectStore(STORES.PROGRESS, { keyPath: 'lessonId' });
      }
      
      if (!db.objectStoreNames.contains(STORES.PENDING_UPDATES)) {
        db.createObjectStore(STORES.PENDING_UPDATES, { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains(STORES.USER_PREFERENCES)) {
        db.createObjectStore(STORES.USER_PREFERENCES, { keyPath: 'userId' });
      }
    };
    
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

/**
 * Save lessons to offline storage
 * @param {Array} lessons - Array of lesson objects
 * @returns {Promise<void>}
 */
export const saveLessons = async (lessons) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([STORES.LESSONS], 'readwrite');
    const store = transaction.objectStore(STORES.LESSONS);
    
    // Add each lesson to the store
    lessons.forEach(lesson => {
      store.put(lesson);
    });
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error('Failed to save lessons offline:', error);
    throw error;
  }
};

/**
 * Get all lessons from offline storage
 * @returns {Promise<Array>} Array of lesson objects
 */
export const getLessonsOffline = async () => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([STORES.LESSONS], 'readonly');
    const store = transaction.objectStore(STORES.LESSONS);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error('Failed to get lessons from offline storage:', error);
    throw error;
  }
};

/**
 * Get a specific lesson from offline storage
 * @param {string} lessonId - ID of the lesson to retrieve
 * @returns {Promise<Object|null>} Lesson object or null if not found
 */
export const getLessonOffline = async (lessonId) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([STORES.LESSONS], 'readonly');
    const store = transaction.objectStore(STORES.LESSONS);
    
    return new Promise((resolve, reject) => {
      const request = store.get(lessonId);
      request.onsuccess = (event) => resolve(event.target.result || null);
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error(`Failed to get lesson ${lessonId} from offline storage:`, error);
    throw error;
  }
};

/**
 * Save lesson progress to offline storage and queue for sync
 * @param {string} lessonId - ID of the lesson
 * @param {number} progress - Progress percentage (0-100)
 * @param {string} token - Authentication token for later sync
 * @returns {Promise<void>}
 */
export const saveProgressOffline = async (lessonId, progress, token) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([STORES.PROGRESS, STORES.PENDING_UPDATES], 'readwrite');
    
    // Save to progress store
    const progressStore = transaction.objectStore(STORES.PROGRESS);
    progressStore.put({ lessonId, progress, updatedAt: new Date().toISOString() });
    
    // Add to pending updates for later sync
    const updatesStore = transaction.objectStore(STORES.PENDING_UPDATES);
    updatesStore.add({ lessonId, progress, token, createdAt: new Date().toISOString() });
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        // Request sync if possible
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready
            .then(registration => registration.sync.register('sync-lesson-progress'))
            .catch(err => console.error('Sync registration failed:', err));
        }
        resolve();
      };
      transaction.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error(`Failed to save progress for lesson ${lessonId}:`, error);
    throw error;
  }
};

/**
 * Get lesson progress from offline storage
 * @param {string} lessonId - ID of the lesson
 * @returns {Promise<number|null>} Progress percentage or null if not found
 */
export const getProgressOffline = async (lessonId) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([STORES.PROGRESS], 'readonly');
    const store = transaction.objectStore(STORES.PROGRESS);
    
    return new Promise((resolve, reject) => {
      const request = store.get(lessonId);
      request.onsuccess = (event) => {
        const result = event.target.result;
        resolve(result ? result.progress : null);
      };
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error(`Failed to get progress for lesson ${lessonId}:`, error);
    throw error;
  }
};

/**
 * Save user preferences to offline storage
 * @param {string} userId - User ID
 * @param {Object} preferences - User preferences object
 * @returns {Promise<void>}
 */
export const saveUserPreferencesOffline = async (userId, preferences) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([STORES.USER_PREFERENCES], 'readwrite');
    const store = transaction.objectStore(STORES.USER_PREFERENCES);
    
    store.put({ userId, ...preferences, updatedAt: new Date().toISOString() });
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error(`Failed to save preferences for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get user preferences from offline storage
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User preferences or null if not found
 */
export const getUserPreferencesOffline = async (userId) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([STORES.USER_PREFERENCES], 'readonly');
    const store = transaction.objectStore(STORES.USER_PREFERENCES);
    
    return new Promise((resolve, reject) => {
      const request = store.get(userId);
      request.onsuccess = (event) => resolve(event.target.result || null);
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error(`Failed to get preferences for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Check if the device is currently online
 * @returns {boolean} True if online, false if offline
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Register online/offline event listeners
 * @param {Function} onOnline - Callback when device goes online
 * @param {Function} onOffline - Callback when device goes offline
 * @returns {Function} Cleanup function to remove listeners
 */
export const registerConnectivityListeners = (onOnline, onOffline) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};