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
  resultContainer.innerHTML = `
    <div class="flex flex-col">
          <div class="w-96 self-center">
            <img src="../../../public/images/Ayam Goreng_010.jpg" alt="Foto" class="p-4 h-48 md:h-72 lg:h-72 w-48 md:w-72 lg:w-full object-contain rounded-t-lg">
            <div class="py-4 px-2 bg-amber-50">
              <h5 class="text-lg md:text-xl font-bold uppercase text-center">${summary.facts.name}</h5>
              <p class="text-sm text-black text-center"><strong>Confidence:</strong> ${summary.confidence}</p>
              <hr class="my-2 border-t-2 border-gray-400">
              <div class="grid grid-cols-2 gap-4 py-4">
                <div class="flex flex-col items-center">
                  <p class="text-base font-bold text-black pb-2">GI</p>
                  <div class="w-10 h-10 flex items-center justify-center rounded-full ${summary.facts.gi > 50 ? 'outline-red-200' : 'outline-green-200'} outline-4 text-black text-lg font-bold">
                    ${summary.facts.gi || 0}
                  </div>
                </div>
                <div class="flex flex-col items-center">
                  <p class="text-base font-bold text-black pb-2">GL</p>
                  <div class="w-10 h-10 flex items-center justify-center rounded-full ${summary.facts.gl > 50 ? 'outline-red-200' : 'outline-green-200'} outline-4 text-black text-lg font-bold">
                    ${summary.facts.gl || 0}
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 text-sm pt-2 pb-4">
                <div>
                  <dt class="font-bold">Calories</dt>
                  <dd>${summary.facts.calories}</dd>
                </div>
                <div>
                  <dt class="font-bold">Carbs</dt>
                  <dd>${summary.facts.carbohydrates}</dd>
                </div>
                <div>
                  <dt class="font-bold">Fat</dt>
                  <dd>${summary.facts.fat}</dd>
                </div>
                <div>
                  <dt class="font-bold">Protein</dt>
                  <dd>${summary.facts.protein}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
  `;
}
}
