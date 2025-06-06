// src/scripts/utils/idb.js
import { openDB } from 'idb';

const DB_NAME = 'story-offline-db'; 
const DB_VERSION = 2; 
const STORE_NAME = 'stories'; 
const LIKED_STORE_NAME = 'liked_stories';  // Store untuk cerita yang disukai

// Inisialisasi database
const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains(LIKED_STORE_NAME)) {
      db.createObjectStore(LIKED_STORE_NAME, { keyPath: 'id' });
    }
  },
});

// Helper untuk berinteraksi dengan IndexedDB
export const IdbHelper = {
  async putStory(story) {
    if (!story.id) throw new Error('Cerita harus memiliki ID');
    const db = await dbPromise;
    await db.put(STORE_NAME, story);
  },

  async getAllStories() {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
  },

  async deleteStory(id) {
    const db = await dbPromise;
    return db.delete(STORE_NAME, id);
  },

  // Menyimpan cerita yang disukai
  async addLikedStory(story) {
    if (!story.id) throw new Error('Cerita harus memiliki ID');
    const db = await dbPromise;
    
    // Menambahkan waktu saat cerita disukai
    const storyWithLikedAt = {
      ...story,
      likedAt: new Date().toISOString(),  // Menyimpan waktu saat disukai
    };
    
    await db.put(LIKED_STORE_NAME, storyWithLikedAt);  // Menyimpan cerita yang disukai
  },

  // Mengambil semua cerita yang disukai, disortir berdasarkan `likedAt`
  async getLikedStories() {
    const db = await dbPromise;
    const likedStories = await db.getAll(LIKED_STORE_NAME);  // Mengambil semua cerita yang disukai

    // Urutkan cerita berdasarkan waktu disukai (terbaru di atas)
    return likedStories.sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt));
  },

  // Menghapus cerita dari liked stories
  async removeLikedStory(id) {
    const db = await dbPromise;
    return db.delete(LIKED_STORE_NAME, id);  // Menghapus cerita dari liked stories
  },
};