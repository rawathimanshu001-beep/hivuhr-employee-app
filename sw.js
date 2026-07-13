/**
 * PayHR Service Worker
 * Enables offline support and makes the app installable as APK via PWABuilder
 */

const CACHE_NAME = 'payhr-v1';
const ASSETS = [
  '/hivuhr-employee-app/',
  '/hivuhr-employee-app/index.html',
  '/hivuhr-employee-app/config.js',
  '/hivuhr-employee-app/manifest.json'
];

// Install — cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fall back to network
self.addEventListener('fetch', event => {
  // Skip Google Sheets API calls — always go to network
  if (event.request.url.includes('script.google.com')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        // Cache new responses
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback
      if (event.request.destination === 'document') {
        return caches.match('/hivuhr-employee-app/index.html');
      }
    })
  );
});
