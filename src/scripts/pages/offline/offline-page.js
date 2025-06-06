// import OfflinePresenter from './offline-presenter.js';

// export default class OfflinePage {
//   async render() {
//     return `
//     <section class="container">
//         <h2>Cerita Offline</h2>
//             <button id="add-test-story">Tambah Cerita Test</button>
//         <div id="offline-stories-list">Loading...</div>
//     </section>
//     `;
//   }

//   async afterRender() {
//     const presenter = new OfflinePresenter();
//     await presenter.init();
//   }
// }

import { StoryAPI } from '../../data/api.js';

export default class OfflinePage {
  constructor() {
    this.stories = [];
  }

  async render() {
    return `
      <section class="container">
        <h1>Cerita Offline</h1>
        <div id="offline-list"></div>
      </section>
    `;
  }

  async afterRender() {
    await this.loadOfflineStories();
  }

  async loadOfflineStories() {
    this.stories = await StoryAPI.getOfflineStories();
    this.renderList();
  }

  renderList() {
    const container = document.getElementById('offline-list');
    if (this.stories.length === 0) {
      container.innerHTML = '<p>Tidak ada cerita offline.</p>';
      return;
    }
    container.innerHTML = this.stories
      .map(
        (s) => `
        <article class="story-card">
          <h2>${s.description.slice(0, 20)}...</h2>
          <p><small>Dibuat: ${new Date(s.createdAt).toLocaleString()}</small></p>
          <button data-id="${s.id}" class="btn-delete">Hapus</button>
        </article>
      `
      )
      .join('');

    container.querySelectorAll('.btn-delete').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = Number(e.target.dataset.id);
        await StoryAPI.deleteOfflineStory(id);
        alert('Cerita berhasil dihapus offline!');
        await this.loadOfflineStories();
      });
    });
  }
}
