import { FetchAPI } from '../../data/api.js';
import { showToast } from '../../utils/toast.js';
import { requireAuth } from '../../utils/auth.js';

export default class HomePresenter {
  constructor({ view }) {
    this.view = view;
  }

  async init() {
    // Cek apakah user sudah login
    if (!requireAuth()) {
      showToast('Silakan login terlebih dahulu', 'error');
      window.location.hash = '/login';
      return;
    }

    this._bindEvents(); // Bind event pada form dan input file
    await this.loadHistory(); // Muat riwayat analisa
  }

  // Binding event listener
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

        this.view.showLoading(); // Tampilkan loading
        await this.analyzeImage(file); // Lakukan analisis gambar
        this.view.hideLoading(); // Sembunyikan loading setelah selesai
      });
    }
  }

  // Fungsi untuk menganalisis gambar
  async analyzeImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', file); // Ganti 'photo' dengan 'image' sesuai backend

      const result = await FetchAPI.analyze(formData); // Panggil API analisis

      if (result.error) {
        throw new Error(result.message || 'Terjadi kesalahan saat analisa');
      }

      const facts = result.result?.facts;
      if (facts) {
        const summary = Object.entries(facts).map(([name, value]) => ({
          name,
          value,
        }));
        this.view.renderSummary(summary); // Render hasil analisis ke UI
      } else {
        this.view.renderSummary([]);
        showToast('Data nutrisi tidak ditemukan', 'info');
      }
    } catch (err) {
      showToast(err.message || 'Terjadi kesalahan saat analisa', 'error');
    }
  }

  // Fungsi untuk memuat riwayat analisa dari API
  async loadHistory() {
    try {
      const data = await FetchAPI.getHistory(); // Gunakan FetchAPI untuk mengambil riwayat

      if (!data.history || data.history.length === 0) {
        this.view.renderHistory([]); // Tampilkan pesan jika tidak ada riwayat
        return;
      }

      this.view.renderHistory(data.history); // Render riwayat ke UI
    } catch (error) {
      showToast('Gagal memuat riwayat analisa', 'error');
    }
  }
}
