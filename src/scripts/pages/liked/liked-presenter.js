import { IdbHelper } from '../../utils/idb.js';

export default class LikedPresenter {
  constructor({ view }) {
    this.view = view;
  }

  async init() {
    // Load stories yang sudah di-like
    await this.loadLikedStories();
  }

  // Ambil cerita yang sudah di-like
  async loadLikedStories() {
    const likedStories = await IdbHelper.getLikedStories();
    this.view.renderList(likedStories);
  }

  // Handler untuk menambah like
  async addLike(story) {
    // Simpan story yang di-like ke IndexedDB
    await IdbHelper.addLikedStory(story);
    alert('Cerita berhasil disukai!');
    await this.loadLikedStories();
  }

  // Handler untuk menghapus like
  async removeLike(storyId) {
    // Hapus cerita yang di-like dari IndexedDB
    await IdbHelper.removeLikedStory(storyId);
    alert('Cerita berhasil dihapus dari like!');
    await this.loadLikedStories();
  }
}