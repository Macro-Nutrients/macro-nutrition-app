import HomePresenter from './home-presenter.js';

export default class HomePage {
  constructor() {
    this.presenter = new HomePresenter({ view: this });
  }

  async render() {
    return `
      <section class="container text-center">
      <h1 class="text-center py-2">Macro Nutrition Facts</h1>
      <form id="analisa" class="box-shadow p-4 mb-4" style="max-width: 600px; margin: auto;">
        <p class="py-2">Silahkan masukkan gambar makanan anda</p>
        <input type="file" id="file-input" accept="image/*" />
        <div id="image-preview" class="image-preview mb-4"></div>
        <button type="submit" class="btn btn-primary mt-2 mx-auto my-auto" style="width: 100px">Analisa</button>
      </form>

      <br>
      <div id="loading-container"></div>
      <div id="result" class="result"></div>
      </section>
    `;

  }

  async afterRender() {
    // Add event listener for image preview
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          this.showImagePreview(file);
        }
      });
    }

    document.getElementById('analisa').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fileInput = document.getElementById('file-input');
      const file = fileInput.files[0];
      if (!file) {
        alert('Silakan pilih gambar terlebih dahulu.');
        return;
      }
      this.presenter.analyzeImage(file);

      this.showLoading();
      // try {
      //   const formData = new FormData();
      //   formData.append('image', file);

      //   const response = await fetch('https://api.example.com/analyse', {
      //     method: 'POST',
      //     body: formData,
      //   });

      //   if (!response.ok) {
      //     throw new Error('Gagal menganalisis gambar');
      //   }

      //   const data = await response.json();
      //   this.hideLoading();
      //   this.renderStories(data.facts);
      // } catch (error) {
      //   this.hideLoading();
      //   this.renderError(error.message);
      // }
    });

    await this.presenter.showStories();
  }

  showLoading() {
    document.getElementById('loading-container').innerHTML = `<div class="loader"></div>`;
  }

  hideLoading() {
    document.getElementById('loading-container').innerHTML = '';
  }

  renderStories(stories) {
    const container = document.getElementById('facts');
    container.innerHTML = stories
      .map(
        (s) => `
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
        `
      )
      .join('');
  }

  renderSummary(summary) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = `
      <h2>Hasil Analisis</h2>
      <ul>
        ${summary.map(item => `<li>${item.name}: ${item.value}</li>`).join('')}
      </ul>
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
      container.innerHTML = ''; // Clear previous content
      container.appendChild(img);
    };
    reader.readAsDataURL(file);
  }


  renderError(msg) {
    document.getElementById('story-list').innerHTML = `<p>${msg}<br>Silakan login atau coba lagi.</p>`;
  }
}