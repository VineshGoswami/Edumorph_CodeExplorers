// Service Worker for Edumorph - Offline-First Functionality

const CACHE_NAME = 'edumorph-cache-v1';
const DYNAMIC_CACHE = 'edumorph-dynamic-cache-v1';

// Resources to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js',
  '/static/css/main.chunk.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME, DYNAMIC_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Skip non-GET requests and browser extensions
  if (event.request.method !== 'GET' || 
      !event.request.url.startsWith('http')) {
    return;
  }

  // API requests - network first, then cache
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response to store in cache
          const responseToCache = response.clone();
          
          caches.open(DYNAMIC_CACHE)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // For other requests - cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache, get from network
        return fetch(event.request)
          .then(response => {
            // Cache the response for future
            const responseToCache = response.clone();
            
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
      })
      .catch(error => {
        console.error('Fetch failed:', error);
        // Could return a custom offline page here
      })
  );
});

// Handle sync events for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'sync-lesson-progress') {
    event.waitUntil(syncLessonProgress());
  }
});

// Function to sync offline lesson progress
async function syncLessonProgress() {
  try {
    // Get all pending progress updates from IndexedDB
    const db = await openDatabase();
    const pendingUpdates = await getPendingUpdates(db);
    
    // Process each pending update
    for (const update of pendingUpdates) {
      try {
        const response = await fetch('/api/lessons/' + update.lessonId + '/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + update.token
          },
          body: JSON.stringify({ progress: update.progress })
        });
        
        if (response.ok) {
          // If successful, remove from pending
          await removePendingUpdate(db, update.id);
        }
      } catch (error) {
        console.error('Failed to sync update:', error);
        // Keep in pending for next sync attempt
      }
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// IndexedDB helper functions
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('edumorph-offline', 1);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingUpdates')) {
        db.createObjectStore('pendingUpdates', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = event => resolve(event.target.result);
    request.onerror = event => reject(event.target.error);
  });
}

function getPendingUpdates(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingUpdates'], 'readonly');
    const store = transaction.objectStore('pendingUpdates');
    const request = store.getAll();
    
    request.onsuccess = event => resolve(event.target.result);
    request.onerror = event => reject(event.target.error);
  });
}

function removePendingUpdate(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingUpdates'], 'readwrite');
    const store = transaction.objectStore('pendingUpdates');
    const request = store.delete(id);
    
    request.onsuccess = event => resolve();
    request.onerror = event => reject(event.target.error);
  });
}