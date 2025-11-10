const CACHE_NAME = 'anuranan-admin-v2';
const urlsToCache = [
  '/admin/',
  '/admin/index.html',
  '/admin/courses.html',
  '/admin/admin.css',
  '/admin/admin.js',
  '/admin/supabase-loader.js',
  '/admin/public/admin-logo-192x192.png',
  '/admin/public/admin-logo-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Admin Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Admin Service Worker: Opened cache');
        return cache.addAll(urlsToCache).catch(err => {
          console.error('Failed to cache some resources:', err);
          // Continue even if some resources fail
          return Promise.resolve();
        });
      })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch(() => {
        // Return offline page or default response
        return caches.match('/admin/index.html');
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
