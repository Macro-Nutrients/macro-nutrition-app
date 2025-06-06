import { IdbHelper } from '../../utils/idb.js';

export default class OfflinePresenter {
  constructor({ view }) {
    this.view = view;
  }

  async init() {
    await this.loadStories();
    this._bindAddForm();
  }

  async loadStories() {
    const stories = await IdbHelper.getAllStories();
    this.view.renderStories(stories);
  }

  _bindAddForm() {
    this.view.getAddForm().addEventListener('submit', async (e) => {
      e.preventDefault();

      // Ambil data dari form
      const description = this.view.getDescription();
      const photoFile = this.view.getPhotoFile();

      if (!description || !photoFile) {
        alert('Deskripsi dan foto harus diisi!');
        return;
      }

      // Convert foto ke base64
      const photoBase64 = await this._fileToBase64(photoFile);

      // Siapkan data cerita
      const newStory = {
        id: 'local-' + Date.now(),
        description,
        photo: photoBase64,
        createdAt: new Date().toISOString(),
      };

      // Simpan ke IndexedDB
      await IdbHelper.putStory(newStory);

      alert('Cerita berhasil disimpan offline!');

      // Refresh list dan reset form
      this.view.resetForm();
      await this.loadStories();
    });

    // Handle delete button click di story list (delegation)
    this.view.getStoriesContainer().addEventListener('click', async (e) => {
      if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        await IdbHelper.deleteStory(id);
        alert('Cerita berhasil dihapus!');
        await this.loadStories();
      }
    });
  }

  _fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Gagal konversi file ke base64'));
      reader.readAsDataURL(file);
    });
  }
}