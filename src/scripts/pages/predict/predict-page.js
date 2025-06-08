import { showToast } from '../../utils/toast.js';
import PredictPresenter from './predict-presenter.js';

export default class PredictPage {
  constructor() {
    this.presenter = new PredictPresenter({ view: this });
  }

  async render() {
    return `
      <section class="container text-center">
        <h1 class="text-center py-2">Macro Nutrition Facts</h1>
        <form id="analisa" class="box-shadow p-4 mb-4" style="max-width: 600px; margin: auto;">
          <p class="py-2">Silahkan masukkan gambar makanan anda</p>
          <input type="file" id="file-input" name="image" accept="image/*" />
          <div id="image-preview" class="flex justify-center items-center mb-4"></div>
          <button type="submit" class="btn btn-primary mt-2 mx-auto my-auto" style="width: 100px">Analisa</button>
        </form>

        <br>
        <div id="loading-container"></div>
        <div id="result" class="result"></div>
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

  renderStories(stories) {
    const container = document.getElementById('facts');
    if (!container) return;

    container.innerHTML = stories
      .map((s) => `
        <article class="story-card">
          <a href="#/detail/${s.id}">
            <div class="story-image-container">
              <img src="${s.photoUrl || ''}" alt="Foto oleh ${s.name}" class="story-image"/>
            </div>
            <h2>${s.name}</h2>
            <p>${s.description.slice(0, 100)}…</p>
            <p><small>Dibuat: ${s.formattedDate || '-'}</small></p>
            <p><small>Lokasi: ${s.lat || 0}, ${s.lon || 0}</small></p>
          </a>
        </article>
      `).join('');
  }

renderSummary(summary) {
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = `
    <div class="card mx-auto mt-4 p-3 shadow" style="max-width: 500px;">
      <h3 class="mb-3 text-center text-success">Hasil Analisis</h3>
      <ul class="list-group list-group-flush">
        ${summary.map(item => `
          <li class="list-group-item d-flex justify-content-between">
            <strong>${item.name}</strong>
            <span>${item.value}</span>
          </li>
        `).join('')}
      </ul>
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
      img.style.alignContent= 'center';
      img.style.borderRadius = '8px';
      img.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

      const container = document.getElementById('image-preview');
      container.innerHTML = '';
      container.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
}