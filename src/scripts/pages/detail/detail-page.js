import DetailPresenter from './detail-presenter.js';


export default class DetailPage {
  constructor() {
    this.presenter = new DetailPresenter({ view: this });
  }

  async render() {
    return `
      <section class="container text-center">
        <h1 class="text-4xl text-bold font-bold py-2">Macro Nutrition Facts</h1>

        <div id="loading-container"></div>

        <div id="result" class="result">
        
          <!-- Riwayat Prediksi -->
          <div id="history-container" class="mt-4">
            <h3 class="text-2xl text-bold">Riwayat Prediksi</h3>
            <br>
            <div id="loading-container"></div>
            <div id="result" class="result">
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

  // Confidence dalam persen
  const confidencePercent = summary.confidence.toFixed(2);

  resultContainer.innerHTML = `
    <div class="max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="w-full flex justify-center bg-gray-50 p-4">
        <img 
          src="${summary.image?.public_url || ''}" 
          alt="Foto ${summary.facts.name}" 
          style="max-width: 100%; height: auto; border-radius: 12px;"
          onerror="this.onerror=null; this.src='../../../public/images/default-image.jpg';"
        />
      </div>

      <div class="p-6 bg-amber-50">
        <h2 class="text-3xl font-extrabold text-center uppercase mb-2">${summary.facts.name}</h2>

        <div class="mb-4">
          <label class="block font-semibold mb-1 text-gray-700">Confidence</label>
          <div class="w-full bg-gray-300 rounded-full h-6 overflow-hidden">
            <div class="bg-green-500 h-6 rounded-full text-center text-white font-bold" style="width: ${confidencePercent}%;">
              ${confidencePercent}%
            </div>
          </div>
        </div>

        <hr class="my-4 border-gray-400">

        <div class="grid grid-cols-2 gap-6 text-gray-800 text-lg font-semibold">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🔥</span>
            <div>
              <dt>Calories</dt>
              <dd class="text-base font-normal">${summary.facts.calories}</dd>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-2xl">🍞</span>
            <div>
              <dt>Carbs</dt>
              <dd class="text-base font-normal">${summary.facts.carbohydrates}</dd>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-2xl">🥓</span>
            <div>
              <dt>Fat</dt>
              <dd class="text-base font-normal">${summary.facts.fat}</dd>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-2xl">🍗</span>
            <div>
              <dt>Protein</dt>
              <dd class="text-base font-normal">${summary.facts.protein}</dd>
            </div>
          </div>
        </div>

        <hr class="my-4 border-gray-400">

        <div class="flex justify-center gap-10 text-center">
          <div>
            <p class="text-sm font-bold mb-1">GI</p>
            <div class="inline-block w-12 h-12 rounded-full ${summary.facts.gi > 50 ? 'bg-red-300' : 'bg-green-300'} flex items-center justify-center font-bold text-lg text-black">
              ${summary.facts.gi || 0}
            </div>
          </div>
          <div>
            <p class="text-sm font-bold mb-1">GL</p>
            <div class="inline-block w-12 h-12 rounded-full ${summary.facts.gl > 50 ? 'bg-red-300' : 'bg-green-300'} flex items-center justify-center font-bold text-lg text-black">
              ${summary.facts.gl || 0}
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

}