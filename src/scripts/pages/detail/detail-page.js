import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { StoryAPI } from '../../data/api.js';
import DetailPresenter from './detail-presenter.js';
import { IdbHelper } from '../../utils/idb.js'; // Pastikan path sesuai
import { subscribeToPush, isSubscribedToPush } from '../../utils/push.js'; // Menambahkan push subscription

export default class DetailPage {
  constructor({ id }) {
    this.presenter = new DetailPresenter({ view: this, id });
    this.id = id; // Inisialisasi ID cerita
    this.story = {}; // Inisialisasi objek cerita
  }

  // Render halaman detail
  async render() {
    return `
      <section class="container">
        <button id="btn-back">← Kembali</button>
        <div id="loading-container"></div>
        <div id="detail-content"></div>
        <button id="btn-like" style="display: none;">Suka Cerita</button>
      </section>
    `;
  }

  // Setelah render, setup event listener
  async afterRender() {
    document.getElementById('btn-back').addEventListener('click', () => history.back());

    await this.presenter.showDetail();

    // Handle Like button click
    document.getElementById('btn-like').addEventListener('click', this.handleLike.bind(this));

    // Pastikan user sudah subscribe push notification
    const isSubscribed = await isSubscribedToPush();
    if (!isSubscribed) {
      // Jika belum subscribe, lakukan subscribe
      await subscribeToPush();
    }
  }

  // Menambahkan cerita ke yang disukai
  async handleLike() {
    const storyToLike = {
      id: this.id,
      name: this.story.name,
      description: this.story.description,
      photoUrl: this.story.photoUrl,
      lat: this.story.lat,
      lon: this.story.lon,
    };

    // Tambahkan cerita ke cerita yang disukai di IndexedDB
    try {
      await IdbHelper.addLikedStory(storyToLike);
      alert('Cerita berhasil disukai!');

      // Kirim notifikasi setelah cerita disukai
      this.sendPushNotification(storyToLike);
    } catch (err) {
      console.error('Gagal menyukai cerita:', err);
    }
  }

  // Kirim notifikasi push setelah cerita dilike
  async sendPushNotification(story) {
    const notificationPayload = {
      title: 'Cerita Anda Disukai!',
      body: `${story.name} telah disukai oleh pengguna lain.`,
      icon: story.photoUrl || '/images/logo.png', // Gunakan foto cerita sebagai icon
    };
  }

  // Menampilkan loading
  showLoading() {
    document.getElementById('loading-container').innerHTML = `<div class="loader"></div>`;
  }

  // Menyembunyikan loading
  hideLoading() {
    document.getElementById('loading-container').innerHTML = '';
  }

  // Render detail cerita
  renderDetail(story) {
    this.presenter.story = story; // Menyimpan cerita di presenter untuk digunakan nanti
    this.story = story; // Menyimpan objek cerita untuk digunakan dalam metode lain

    document.getElementById('detail-content').innerHTML = `
      <h1>${story.name}</h1>
      <div class="detail-image-container">
        <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" class="detail-image"/>
      </div>
      <p>${story.description}</p>
      <p><small>Provinsi: ${story.province || 'Tidak diketahui'}</small></p>
      <p><small>Latitude: ${story.lat || 'Tidak diketahui'}</small></p>
      <p><small>Longitude: ${story.lon || 'Tidak diketahui'}</small></p>
      <div id="map-detail" style="height:300px; margin:1rem 0;"></div>
    `;

    // Tampilkan tombol Like
    document.getElementById('btn-like').style.display = 'block';

    // Inisialisasi peta dan marker
    const map = L.map('map-detail').setView([story.lat, story.lon], 5);
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
    L.control.layers({ OSM: osm, Topo: topo }).addTo(map);
    L.marker([story.lat, story.lon]).addTo(map);
  }

  // Render pesan error jika gagal memuat cerita
  renderError(msg) {
    document.getElementById('detail-content').innerHTML = `<p>${msg}</p>`;
  }
}