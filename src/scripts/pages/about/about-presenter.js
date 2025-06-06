import { StoryAPI } from '../../data/api.js';

export default class AddPresenter {
  constructor({ view }) {
    this.view = view;
  }

  async fetchElevation(lat, lon) {
    this.view.showElevationLoading();
    try {
      const alt = await StoryAPI.elevation(lat, lon);
      this.view.showElevation(alt);
    } catch {
      this.view.showElevation(0);
    }
  }

  async submitStory(payload) {
    this.view.showSubmitting();
    const isOnline = navigator.onLine;

    if (isOnline) {
      try {
        // Submit dengan timeout 5 detik
        const res = await Promise.race([
          this.trySubmit(payload),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000)),
        ]);
        if (res.error) {
          this.view.showResult(`Error: ${res.message}`);
        } else {
          this.view.showResult('Cerita berhasil ditambahkan!');
          setTimeout(() => { location.hash = '/'; }, 1000);
        }
      } catch (error) {
        console.warn('Submit gagal atau timeout, simpan offline:', error);
        await StoryAPI.addOfflineStory(payload);
        this.view.showResult('Cerita disimpan secara offline.');
        location.hash = '/offline';
      }
    } else {
      await StoryAPI.addOfflineStory(payload);
      this.view.showResult('Cerita disimpan secara offline.');
      location.hash = '/offline';
    }
  }

  async trySubmit(payload) {
    const token = localStorage.getItem('token');
    return token
      ? await StoryAPI.addStory(payload)
      : await StoryAPI.addStoryGuest(payload);
  }
}