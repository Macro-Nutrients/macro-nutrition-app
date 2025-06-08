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

  // Membuat grid untuk menampilkan 4 card per baris
  historyList.innerHTML = `
    <div class="grid grid-cols-3 gap-4">
      ${history.map(item => {
        const glValue = item.facts.gl || 0;
        const giValue = item.facts.gi || 0;
        const outlineClassGl = glValue > 50 ? 'outline-red-200' : 'outline-green-200';
        const outlineClassGi = giValue > 55 ? 'outline-red-200' : 'outline-green-200';
        return `
        <div class="">
          <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm relative">
            <div class="absolute top-2 left-2 z-10 bg-amber-300 text-xs font-semibold px-3 py-1 rounded shadow">
              Created: ${new Date(item.created_at).toLocaleString()}
            </div>
              <img src="../../../public/images/Ayam Goreng_010.jpg" alt="Foto" class="p-8 h-72 rounded-t-lg" >
              <div class="py-4 bg-amber-50">
                <div>
                  <h5 class="card-title text-lg font-bold uppercase">${item.facts.name}</h5>
                  <p class="text-sm text-black md:text-lg pb-2"><strong>Confidence:</strong> ${item.confidence}</p>
                </div>
                <hr class="pt-2 border-t-3 border-gray-400">
                <div class="grid grid-cols-2 max-w-full bg-amber-50 pt-3">
                  <div class="flex flex-col pb-4">
                        <p class="py-4 text-7xl font-bold text-black md:text-4xl sm:text-lg">GI</p>
                        <div class="flex items-center justify-center">
                          <div class="w-12 h-12 flex items-center justify-center rounded-full outline-[0.5em] ${outlineClassGi} text-black text-2xl font-bold">
                            ${item.facts.gi || 0}
                          </div>
                        </div>
                  </div>
                  <div class="flex flex-col pb-4">
                        <p class="py-4 text-7xl font-bold text-black md:text-4xl sm:text-lg">GL</p>
                        <div class="flex items-center justify-center">
                          <div class="w-12 h-12 flex items-center justify-center rounded-full outline-[0.5em]  ${outlineClassGl}  text-black text-2xl font-bold">
                            ${item.facts.gl || 0}
                          </div>
                        </div>
                  </div>
                </div>
                <div class="grid grid-cols-2 max-w-full bg-amber-50 pt-4">
                    <div class="flex flex-col pb-4">
                        <dt class="pb-4 text-lg font-bold text-black md:text-lg">Calories</dt>
                        <dd class="text-black text-lg">${item.facts.calories}</dd>
                    </div>
                    <div class="flex flex-col pb-4">
                        <dt class="pb-4 text-lg font-bold text-black md:text-lg">Carbohydrates</dt>
                        <dd class="text-black text-lg">${item.facts.carbohydrates}</dd>
                    </div>
                    <div class="flex flex-col pb-4">
                        <dt class="pb-4 text-lg font-bold text-black md:text-lg">Fat</dt>
                        <dd class="text-black text-lg">${item.facts.fat}</dd>
                    </div>
                    <div class="flex flex-col pb-4">
                        <dt class="pb-4 text-lg font-bold text-black md:text-lg">Protein</dt>
                        <dd class="text-black text-lg">${item.facts.protein}</dd>
                    </div>
                </div>
                <button  class="mt-4 focus:outline-none p-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm" onclick="viewHistoryDetail('${item.id}')">Lihat Detail</button>
              </div>
          </div>
        </div>
      `}).join('')}
    </div>
  `;
}
}
