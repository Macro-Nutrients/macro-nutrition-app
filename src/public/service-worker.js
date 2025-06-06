/* global self, clients, caches, indexedDB */

const CACHE_NAME = 'dicoding-story-cache-v1';
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
      .catch(() => caches.match(event.request))
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

// ✅ Fungsi: Sinkronisasi ke server dari IndexedDB
async function syncOfflineStories() {
  const db = await openIndexedDB();
  const tx = db.transaction('stories', 'readwrite');
  const store = tx.objectStore('stories');
  const stories = await store.getAll();

  for (const story of stories) {
    try {
      const formData = new FormData();
      formData.append('description', story.description);
      formData.append('lat', story.lat || 0);
      formData.append('lon', story.lon || 0);
      formData.append('photo', story.photo);

      await fetch('https://story-api.dicoding.dev/v1/stories', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      await store.delete(story.id);
    } catch (err) {
      console.error('Gagal sinkronisasi:', err.message);
    }
  }

  clients.matchAll().then((clientList) => {
    clientList.forEach((client) =>
      client.postMessage({ type: 'sync-complete' })
    );
  });
}

// ✅ Fungsi bantu buka IndexedDB
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('stories-db', 1);

    request.onerror = () => reject('Gagal membuka IndexedDB');
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('stories')) {
        db.createObjectStore('stories', { keyPath: 'id' });
      }
    };
  });
}