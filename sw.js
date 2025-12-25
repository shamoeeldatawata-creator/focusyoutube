const CACHE_NAME = 'focustube-v2';
const ASSETS = [
  'index.html',
  'manifest.json',
  'https://raw.githubusercontent.com/shamoeeldatawata-creator/focusyoutube/main/focustube-192x192.png'
];

// Install: Cache basic assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    }).then(() => clients.claim())
  );
});

// Fetch: Network First for API calls, Cache Fallback for static files
self.addEventListener('fetch', (event) => {
  // Always try network first for YouTube Data API calls
  if (event.request.url.includes('googleapis.com')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else {
    // Cache first for UI assets
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }

});
