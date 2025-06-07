import { FetchAPI } from '../../data/api.js';
import { showToast } from '../../utils/toast.js';
import { requireAuth } from '../../utils/auth.js';

export default class PredictPresenter {
  constructor({ view }) {
    this.view = view;
  }

  async init() {
    if (!requireAuth()) {
      showToast('Silakan login terlebih dahulu', 'error');
      window.location.hash = '/login';
      return;
    }

    this._bindEvents();
    await this.showStories();
  }

  _bindEvents() {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) this.view.showImagePreview(file);
      });
    }

    const form = document.getElementById('analisa');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = document.getElementById('file-input').files[0];

        if (!file) {
          showToast('Silakan pilih gambar terlebih dahulu', 'error');
          return;
        }

        this.view.showLoading();
        await this.analyzeImage(file);
        this.view.hideLoading();
      });
    }
  }

async analyzeImage(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);  // Ganti 'photo' dengan 'image'

    // Debug FormData
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const result = await FetchAPI.analyze(formData);

    if (result.error) {
      throw new Error(result.message || 'Terjadi kesalahan saat analisa');
    }

    const facts = result.result?.facts;
    if (facts) {
      const summary = Object.entries(facts).map(([name, value]) => ({
        name,
        value,
      }));
      this.view.renderSummary(summary);
    } else {
      this.view.renderSummary([]);
      showToast('Data nutrisi tidak ditemukan', 'info');
    }
  } catch (err) {
    showToast(err.message || 'Terjadi kesalahan saat analisa', 'error');
  }
}


  async showStories() {
    // nanti
  }
}