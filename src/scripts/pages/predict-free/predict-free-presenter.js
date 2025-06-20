import { FetchAPI } from "../../data/api";
import { showToast } from '../../utils/toast.js';
export default class PredictsPresenter {
  constructor({ view }) {
    this.view = view;
  }
  
async analyzesImage(file) {
  this.view.showLoading();

  try {
    if (!navigator.onLine) throw new Error('Offline');

    const formData = new FormData();
    formData.append('image', file);

    const res = await FetchAPI.analyzes(formData);

    if (res.error) {
      showToast('Gagal memprediksi gambar!', 'error');
      throw new Error(res.message);
    } 

    const result = res.result || {};
    if (!result.label || !result.confidence) {
      showToast('Hasil analisis tidak lengkap!', 'error');
      throw new Error('Hasil analisis tidak lengkap');
    }

    this.view.renderSummary([
      { name: 'Label', value: result.label },
      { name: 'Confidence', value: result.confidence.toFixed(2) },
      ...Object.entries(result.facts || {}).map(([key, value]) => ({ name: key, value })),
    ]);

    showToast('Gambar berhasil dianalisis!', 'success');

  } catch (error) {
    showToast('Gagal menganalisis gambar: ' + error.message, 'error');
    this.view.renderError('Gagal menganalisis gambar: ' + error.message);
  } finally {
    this.view.hideLoading();
  }
}

}