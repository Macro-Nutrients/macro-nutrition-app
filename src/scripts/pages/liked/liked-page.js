// src/scripts/pages/liked/liked-page.js
import { IdbHelper } from '../../utils/idb.js';

export default class LikedPage {
  constructor() {
    this.stories = [];
  }

  async render() {
    return `
      <section class="container">
        <h1>Cerita yang Disukai</h1>
        <div id="liked-list" class="story-list">Loading...</div>
      </section>
    `;
  }

  async afterRender() {
    await this.loadLikedStories();
  }

  // Memuat cerita yang disukai dari IndexedDB
  async loadLikedStories() {
    this.stories = await IdbHelper.getLikedStories(); // Ambil cerita yang disukai dari IndexedDB dan urutkan berdasarkan waktu disukai
    this.renderList();
  }

  // Menampilkan daftar cerita yang disukai
  renderList() {
    const container = document.getElementById('liked-list');
    if (this.stories.length === 0) {
      container.innerHTML = '<p>Tidak ada cerita yang disukai.</p>';
      return;
    }
    container.innerHTML = this.stories
      .map(
        (s) => `
          <article class="story-card">
            <a href="#/detail/${s.id}">
              <div class="story-image-container">
                <img src="${s.photoUrl || ''}" alt="Foto oleh ${s.name}" class="story-image"/>
              </div>
              <h2>${s.name}</h2>
              <p>${s.description.slice(0, 100)}...</p>
              <p><small>Dibuat: ${s.formattedDate || '-'}</small></p>
              <p><small>Lokasi: ${s.lat || 0}, ${s.lon || 0}</small></p>
            </a>
            <button data-id="${s.id}" class="btn-remove-like">Hapus dari Suka</button>
          </article>
        `
      )
      .join('');

    // Menambahkan event listener untuk menghapus cerita yang disukai
    container.querySelectorAll('.btn-remove-like').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        
        // Menanyakan konfirmasi penghapusan
        const isConfirmed = window.confirm('Apakah Anda yakin ingin menghapus cerita ini dari daftar yang disukai?');
        if (isConfirmed) {
          await IdbHelper.removeLikedStory(id);  // Menghapus cerita dari liked stories
          alert('Cerita berhasil dihapus dari yang disukai!');
          await this.loadLikedStories();  // Refresh daftar cerita yang disukai
        }
      });
    });
  }
}