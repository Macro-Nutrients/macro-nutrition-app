import AddPresenter from './about-presenter.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default class AddPage {
  constructor() {
    this.stream = null;
    this.presenter = new AddPresenter({ view: this });
  }

  async render() {
    return `
      <section class="container">
        <h1>Tambah Cerita</h1>
        <form id="add-form">
          <label for="desc">Deskripsi</label>
          <textarea id="desc" required></textarea>

          <fieldset>
            <legend>Pilih Foto</legend>
            <button type="button" id="use-camera-button">Gunakan Kamera</button>
            <input id="photo" type="file" accept="image/*" required />
          </fieldset>

          <div id="camera-container" style="display:none; margin:1rem 0;">
            <video id="video" autoplay playsinline style="max-width:100%;"></video>
            <button type="button" id="capture-button">Ambil Foto</button>
            <button type="button" id="stop-camera-button">Matikan Kamera</button>
          </div>

          <div id="map" style="height:200px; margin:1rem 0;"></div>
          <input type="hidden" id="lat" />
          <input type="hidden" id="lon" />
          <label for="alt">Elevasi (m)</label>
          <input type="text" id="alt" readonly />

          <button type="submit">Kirim</button>
        </form>
        <div id="add-status"></div>
      </section>
    `;
  }

  async afterRender() {
    const map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    let marker;

    const stopCamera = () => {
      if (this.stream) {
        this.stream.getTracks().forEach((t) => t.stop());
        this.stream = null;
      }
      document.getElementById('camera-container').style.display = 'none';
      document.getElementById('photo').required = true;
    };

    map.on('click', ({ latlng }) => {
      const { lat, lng } = latlng;
      document.getElementById('lat').value = lat;
      document.getElementById('lon').value = lng;
      if (marker) marker.remove();
      marker = L.marker(latlng).addTo(map);

      this.presenter.fetchElevation(lat, lng);
    });

    const useCameraBtn    = document.getElementById('use-camera-button');
    const stopCameraBtn   = document.getElementById('stop-camera-button');
    const captureBtn      = document.getElementById('capture-button');
    const cameraContainer = document.getElementById('camera-container');
    const video           = document.getElementById('video');
    const photoInput      = document.getElementById('photo');

    useCameraBtn.addEventListener('click', async () => {
      if (!this.stream) {
        try {
          this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = this.stream;
        } catch (err) {
          return alert('Gagal mengakses kamera: ' + err.message);
        }
      }
      cameraContainer.style.display = 'block';
      photoInput.required = false;
    });

    captureBtn.addEventListener('click', () => {
      const canvas = document.createElement('canvas');
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-photo.png', { type: 'image/png' });
        const dt = new DataTransfer();
        dt.items.add(file);
        photoInput.files = dt.files;
      });
      stopCamera();
    });

    stopCameraBtn.addEventListener('click', stopCamera);
    window.addEventListener('hashchange', stopCamera);

    document.getElementById('add-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      stopCamera();

      const payload = {
        description: document.getElementById('desc').value,
        photo:       photoInput.files[0],
        lat:         document.getElementById('lat').value,
        lon:         document.getElementById('lon').value,
      };

      await this.presenter.submitStory(payload);
    });
  }

  showElevationLoading() {
    document.getElementById('alt').value = 'Memuat…';
  }
  showElevation(value) {
    document.getElementById('alt').value = value;
  }

  showSubmitting() {
    document.getElementById('add-status').textContent = 'Mengirim…';
  }
  showResult(msg) {
    document.getElementById('add-status').textContent = msg;
  }
}