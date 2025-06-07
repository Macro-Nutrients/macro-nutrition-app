/* global self, clients, caches, indexedDB */

const CACHE_NAME = 'dicoding-macro-nutrition-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/192-png.png',
  '/512-png.png',
  '/styles/styles.css',
];

// ✅ Install: Caching App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// ✅ Activate: Clean old cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      )
    )
  );
  self.clients.claim();
});

// ✅ Fetch: Fallback to cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cacheResponse) => {
          if (cacheResponse) {
            return cacheResponse;
          }
          // fallback default jika tidak ada cache (bisa halaman offline atau respons kosong)
          return new Response('Offline page not found in cache.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain' }),
          });
        })
      )
  );
});

// ✅ Push Notification
self.addEventListener('push', function (event) {
  const data = event.data?.json();

  const title = data.title || 'Notifikasi Baru';
  const options = {
    body: data.options?.body || 'Anda memiliki notifikasi baru.',
    icon: '/favicon.png',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ✅ Background Sync - Sinkronisasi story yang tertunda
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-new-stories') {
    event.waitUntil(syncOfflineStories());
  }
});

