// CACHE_NAME is bumped automatically by deploy.ps1 on every deploy
const CACHE_NAME = 'anuranan-v6-202603271556';

// Pre-cache versioned static assets (NOT HTML — HTML is always network-first)
const PRECACHE_URLS = [
  '/styles.css?v=202603271556',
  '/script.js?v=202603271556',
  '/supabase-loader.js?v=202603271556',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Hind+Siliguri:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install: pre-cache static assets only
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch((err) => console.warn('Pre-cache partial failure, continuing:', err))
  );
  // Take over immediately without waiting for old SW to finish
  self.skipWaiting();
});

// Activate: delete ALL old caches so stale assets are purged instantly
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          })
      )
    )
  );
  // Take control of all open pages immediately
  self.clients.claim();
});

// Fetch strategy:
//  - HTML navigations  → Network-first (always get the freshest HTML from server)
//  - Versioned assets  → Cache-first (CSS/JS with ?v= never stale by design)
//  - Everything else   → Cache-first with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET requests
  if (request.method !== 'GET') return;

  // ── HTML navigation requests: ALWAYS go to network ──────────────────────
  // This ensures users get the latest index.html (with updated ?v= strings)
  // after every deploy, without needing to clear cache manually.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/index.html')) // offline fallback
    );
    return;
  }

  // ── All other assets: cache-first, fetch & cache on miss ─────────────────
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        // Only cache valid same-origin or CORS responses
        if (!response || response.status !== 200 ||
            (response.type !== 'basic' && response.type !== 'cors')) {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      });
    })
  );
});
