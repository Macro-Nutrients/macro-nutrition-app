import { openDB } from 'idb';

const DATABASE_NAME = 'favorite-stories';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'saved-stories';

// Membuka database dan membuat object store jika belum ada
const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    }
  },
});

// Menambahkan cerita baru
const Database = {
  async addStory(story) {
    if (!story.id) {
      throw new Error('`id` is required to save story.');
    }
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },

  // Mendapatkan cerita berdasarkan ID
  async getStoryById(id) {
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  // Mendapatkan semua cerita yang disimpan
  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  // Menghapus cerita berdasarkan ID
  async removeStory(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};

export default Database;