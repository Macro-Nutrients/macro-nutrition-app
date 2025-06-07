import { showToast } from '../../utils/toast.js';
import HomePresenter from './home-presenter.js';

export default class HomePage {
  constructor() {
    this.presenter = new HomePresenter({ view: this });
  }

  async render() {
    return `
      <section class="container text-center">
        <h1 class="text-center py-2">Macro Nutrition Facts</h1>

        <div id="loading-container"></div>

        <div id="result" class="result">
        
          <!-- Riwayat Prediksi -->
          <div id="history-container" class="mt-4">
            <h3>Riwayat Analisa</h3>
            <br>
            <div id="history-list" class="list-group">
              <!-- Riwayat akan ditampilkan disini -->
            </div>
          </div>
          
        </div>
      </section>
    `;
  }

  async afterRender() {
    await this.presenter.init(); // Delegasikan logika ke presenter
  }

  showLoading() {
    document.getElementById('loading-container').innerHTML = `<div class="loader"></div>`;
  }

  hideLoading() {
    document.getElementById('loading-container').innerHTML = '';
  }

renderSummary(summary) {
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = `
    <div class="row">
      <div class="col-12">
        <div class="card mx-auto mt-4 p-3 shadow" style="max-width: 500px;">
          <h3 class="mb-3 text-center text-success">Hasil Analisis</h3>
          <ul class="list-group list-group-flush">
            ${summary.map(item => `
              <li class="list-group-item">
                <strong>${item.name}</strong>: ${item.value}
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;
}


  showImagePreview(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target.result;
      img.alt = 'Preview Gambar';
      img.style.maxWidth = '100%';
      img.style.borderRadius = '8px';
      img.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

      const container = document.getElementById('image-preview');
      container.innerHTML = '';
      container.appendChild(img);
    };
    reader.readAsDataURL(file);
  }

  // Fungsi untuk merender riwayat analisa
renderHistory(history) {
  const historyList = document.getElementById('history-list');
  if (history.length === 0) {
    historyList.innerHTML = '<p class="text-muted">Belum ada riwayat analisa.</p>';
    return;
  }

  // Membuat grid untuk menampilkan 4 card per baris
  historyList.innerHTML = `
    <div class="row">
      ${history.map(item => `
        <div class="col-md-3 mb-3">
          <div class="card shadow">
            <div class="card-body">
              <h5 class="card-title"><strong>Label:</strong> ${item.label}</h5>
              <div>
                <strong>Fakta:</strong>
                <ul>
                  <li><strong>Calories:</strong> ${item.facts.calories}</li>
                  <li><strong>Carbohydrates:</strong> ${item.facts.carbohydrates}</li>
                  <li><strong>Fat:</strong> ${item.facts.fat}</li>
                  <li><strong>Protein:</strong> ${item.facts.protein}</li>
                </ul>
              </div>
              <div><strong>Confidence:</strong> ${item.confidence}</div>
              <div><strong>Created At:</strong> ${new Date(item.created_at).toLocaleString()}</div>
              <button class="btn btn-info mt-3" onclick="viewHistoryDetail('${item.id}')">Lihat Detail</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
}
