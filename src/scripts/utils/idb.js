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
};