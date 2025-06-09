import HomePresenter from './home-presenter.js';

export default class HomePage {
  constructor() {
    this.presenter = new HomePresenter({ view: this });
  }

  async render() {
    return `
      <section class="container text-center">
        <h1 class="text-4xl text-bold font-bold py-2">Macro Nutrition Facts</h1>

        <div id="loading-container"></div>

        <div id="result" class="result">
        
          <!-- Riwayat Prediksi -->
          <div id="history-container" class="mt-4">
            <h3 class="text-2xl text-bold">Riwayat Analisa</h3>
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
    <div class="grid grid-flow-row grid-rows-3 gap-4">
      <div class="col-span-2 mx-auto">
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

  historyList.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      ${history.map(item => {
        const glValue = item.facts.gl || 0;
        const giValue = item.facts.gi || 0;
        const outlineClassGl = glValue > 50 ? 'outline-red-200' : 'outline-green-200';
        const outlineClassGi = giValue > 55 ? 'outline-red-200' : 'outline-green-200';
        return `
        <div>
          <div class="w-full bg-white border border-gray-200 rounded-lg shadow-sm relative">
            <div class="absolute top-2 left-2 z-10 bg-amber-300 text-xs font-semibold px-2 py-1 rounded shadow">
              Created: ${new Date(item.created_at).toLocaleString()}
            </div>
            <img src="../../../public/images/Ayam Goreng_010.jpg" alt="Foto" class="p-4 h-48 md:h-72 rounded-t-lg object-cover w-full">
            <div class="py-4 px-2 bg-amber-50">
              <h5 class="text-lg md:text-xl font-bold uppercase text-center">${item.facts.name}</h5>
              <p class="text-sm text-black text-center"><strong>Confidence:</strong> ${item.confidence}</p>
              <hr class="my-2 border-t-2 border-gray-400">
              <div class="grid grid-cols-2 gap-4 py-4">
                <div class="flex flex-col items-center">
                  <p class="text-base font-bold text-black pb-2">GI</p>
                  <div class="w-10 h-10 flex items-center justify-center rounded-full ${outlineClassGi} outline-4 text-black text-lg font-bold">
                    ${item.facts.gi || 0}
                  </div>
                </div>
                <div class="flex flex-col items-center">
                  <p class="text-base font-bold text-black pb-2">GL</p>
                  <div class="w-10 h-10 flex items-center justify-center rounded-full ${outlineClassGl} outline-4 text-black text-lg font-bold">
                    ${item.facts.gl || 0}
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 text-sm pt-2 pb-4">
                <div>
                  <dt class="font-bold">Calories</dt>
                  <dd>${item.facts.calories}</dd>
                </div>
                <div>
                  <dt class="font-bold">Carbs</dt>
                  <dd>${item.facts.carbohydrates}</dd>
                </div>
                <div>
                  <dt class="font-bold">Fat</dt>
                  <dd>${item.facts.fat}</dd>
                </div>
                <div>
                  <dt class="font-bold">Protein</dt>
                  <dd>${item.facts.protein}</dd>
                </div>
              </div>
              <div class="mt-4 text-center">
                <button type="button" class="px-3 py-2 text-white bg-green-700 hover:bg-green-800 rounded-lg text-sm history-detail-btn" data-id="${item.id}">
                  Lihat Detail
                </button>
              </div>
            </div>
          </div>
        </div>
        `;
      }).join('')}
    </div>
  `;
}


}
