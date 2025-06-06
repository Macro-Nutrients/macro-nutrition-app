import CONFIG from '../config.js';
import { openDB } from 'idb';

const BASE = CONFIG.BASE_URL;
const DB_NAME = 'story-app-db';
const STORE_NAME = 'offline-stories';

/**
 * Generic request helper
 */
async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, options);
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.message || `HTTP ${response.status}`);
  }
  return json;
}

/**
 * IndexedDB helper untuk offline stories
 */
async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export const StoryAPI = {
  // Register new user
  register: (payload) =>
    request('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  // Login user and store token
  login: async (payload) => {
    const data = await request('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!data.error) {
      localStorage.setItem('token', data.loginResult.token);
    }
    return data;
  },

  // Fetch all stories
  getStories: (opts = {}) => {
    const { page = 1, size = 20, location = 0 } = opts;
    const token = localStorage.getItem('token') || '';
    const params = new URLSearchParams({ page, size, location });
    return request(`/stories?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Fetch detail of one story
  getStoryDetail: (id) => {
    if (!id) return Promise.reject(new Error('Story ID is required'));
    const token = localStorage.getItem('token') || '';
    return request(`/stories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  elevation: async (lat, lon) => {
    const url = `https://api.opentopodata.org/v1/test-dataset?locations=${lat},${lon}`;
    const resp = await fetch(url);
    const data = await resp.json();
    return data.results?.[0]?.elevation ?? 0;
  },

  reverseGeocode: async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'DicodingStoryApp' },
    });
    const data = await resp.json();
    return data.address?.state ?? null;
  },

  // Add new story (authenticated)
  addStory: (payload) => {
    const token = localStorage.getItem('token') || '';
    const form = new FormData();
    form.append('description', payload.description);
    form.append('photo', payload.photo);
    if (payload.lat != null && payload.lon != null) {
      form.append('lat', payload.lat);
      form.append('lon', payload.lon);
    }
    return request('/stories', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
  },

  // Add new story as guest (no auth)
  addStoryGuest: (payload) => {
    const form = new FormData();
    form.append('description', payload.description);
    form.append('photo', payload.photo);
    if (payload.lat != null && payload.lon != null) {
      form.append('lat', payload.lat);
      form.append('lon', payload.lon);
    }
    return request('/stories/guest', {
      method: 'POST',
      body: form,
    });
  },

  // Push subscription
  subscribePush: (payload) => {
    const token = localStorage.getItem('token') || '';
    return request('/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  // Unsubscribe
  unsubscribePush: (payload) => {
    const token = localStorage.getItem('token') || '';
    return request('/notifications/subscribe', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },

  // Helper: get token
  getToken: () => localStorage.getItem('token'),

  /**
   * === Offline Stories Handling ===
   */

  async addOfflineStory(storyPayload) {
    const db = await getDb();
    await db.add(STORE_NAME, {
      ...storyPayload,
      createdAt: new Date().toISOString(),
      synced: false,
    });
    alert('Cerita berhasil disimpan offline!');
  },

  async getOfflineStories() {
    const db = await getDb();
    return db.getAll(STORE_NAME);
  },

  async deleteOfflineStory(id) {
    const db = await getDb();
    return db.delete(STORE_NAME, id);
    alert('Cerita offline berhasil dihapus!');
  },

  async syncOfflineStories() {
    const db = await getDb();
    const allStories = await db.getAll(STORE_NAME);
    for (const story of allStories) {
      if (!story.synced) {
        try {
          // Submit ke server
          const form = new FormData();
          form.append('description', story.description);
          form.append('photo', story.photo);
          if (story.lat != null && story.lon != null) {
            form.append('lat', story.lat);
            form.append('lon', story.lon);
          }
          const token = localStorage.getItem('token') || '';
          await request('/stories', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: form,
          });
          // Kalau berhasil, hapus dari indexedDB
          await db.delete(STORE_NAME, story.id);
          console.log(`Cerita offline id=${story.id} berhasil disinkronisasi`);
        } catch (error) {
          console.error('Gagal sinkronisasi cerita offline:', error);
          // Jika gagal, biarkan tetap ada di IndexedDB untuk dicoba lain waktu
        }
      }
    }
  },
};