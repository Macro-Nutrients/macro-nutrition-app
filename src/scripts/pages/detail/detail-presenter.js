import { FetchAPI } from '../../data/api.js';
import { showToast } from '../../utils/toast.js';

export default class DetailPresenter {
  constructor({ view }) {
    this.view = view;
  }

  async init() {
    // Cek apakah user sudah login
    // if (!requireAuth()) {
    //   showToast('Silakan login terlebih dahulu', 'error');
    //   window.location.hash = '/login';
    //   return;
    // }

    // this._bindEvents(); // Bind event pada form dan input file

    // get id dari URL hash, misal: #/detail/123
    const hash = window.location.hash;
    const id = hash.split('/')[2];

    if (!id) {
      showToast('ID tidak ditemukan', 'error');
      window.location.hash = '/';
      return;
    }

    await this.loadDetail(id); // Muat riwayat analisa
  }

  // _bindEvents() {
  //   // Bind event pada form dan input file
  //   document.getElementById('history-list').addEventListener('click', (event) => {
  //     if (event.target.classList.contains('history-detail-btn')) {
  //       const id = event.target.getAttribute('data-id');
  //       if (id) {
  //         window.location.hash = `/detail/${id}`;
  //       }
  //     }
  //   });
  // }

  async loadDetail(id) {
    try {
      this.view.showLoading();
      const data = await FetchAPI.getDetailPredict(id);
      this.view.hideLoading();

      if (data.error) {
        showToast(data.message, 'error');
        return;
      }

      console.log(data.result)

      this.view.renderSummary(data.result);
    } catch (error) {
      console.error('Error fetching detail:', error);
      this.view.hideLoading();
      showToast('Gagal memuat detail analisa', 'error');
    }
  }
}
