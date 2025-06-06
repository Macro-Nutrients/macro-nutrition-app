// src/scripts/index.js

// CSS imports
import '../styles/styles.css';

// Halaman utama SPA
import App from './pages/app.js';

// API helper (pastikan ada method logout)
import { StoryAPI } from './data/api.js';

// (Opsional) hanya jika pakai vite-plugin-ssr
import { reload } from 'vite-plugin-ssr/client/router';

//kebutuhan test
import { IdbHelper } from '../scripts/utils/idb.js'

let app; // <-- pindahkan ke sini supaya bisa diakses oleh helper

document.addEventListener('DOMContentLoaded', async () => {
  // Inisialisasi App SPA
  app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  // Render halaman pertama kali dan bind logout/login
  await renderAndBind();

  // Setiap hash change, re-render + bind ulang
  window.addEventListener('hashchange', renderAndBind);

  // Skip to content
  document.querySelector('.skip-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    const main = document.getElementById('main-content');
    main.setAttribute('tabindex', '-1');
    main.focus();
  });
});

/**
 * Render page & update nav auth item & bind logout
 */
async function renderAndBind() {
  // 1) Render SPA page
  await app.renderPage();

  // 2) Update tombol Login/Keluar di nav
  updateAuthNav();

  // 3) Pasang event listener untuk Logout (jika ada)
  bindLogout();
}

/**
 * Isi <li id="auth-item"> dengan Login atau Keluar
 */
function updateAuthNav() {
  const authItem = document.getElementById('auth-item');
  const token    = localStorage.getItem('token');

  authItem.innerHTML = ''; // kosongkan dulu

  if (token) {
    // Jika sudah login → tombol Keluar
    const btn = document.createElement('button');
    btn.id = 'logout-btn';
    btn.className = 'logout-button';
    btn.textContent = 'Keluar';
    authItem.appendChild(btn);
  } else {
    // Jika belum login → link Masuk
    const link = document.createElement('a');
    link.href = '#/login';
    link.id = 'login-btn';
    link.textContent = 'Masuk';
    authItem.appendChild(link);
  }
}

/**
 * Pasang listener pada tombol Logout
 */
function bindLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (!logoutBtn) return;

  // Hilangkan listener lama dengan clone trick
  const freshBtn = logoutBtn.cloneNode(true);
  logoutBtn.replaceWith(freshBtn);

  freshBtn.addEventListener('click', async () => {
    // 1. Hapus token
    StoryAPI.logout();

    // 2. Reload penuh (SSR) atau fallback
    try {
      await reload();
    } catch {
      window.location.reload();
    }

    // 3. Arahkan ke login
    window.location.hash = '/login';
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js') // pastikan path-nya sesuai file sw.js
      .then((reg) => {
        console.log('Service worker terdaftar:', reg);
      })
      .catch((err) => {
        console.error('SW registration failed:', err);
      });
  });
}

// Buat fungsi test dan pasang ke window supaya bisa dipanggil dari console
window.testAddStory = async () => {
  await IdbHelper.putStory({
    id: 'test-' + Date.now(),
    name: 'User Test',
    description: 'Ini cerita test',
  });
  const allStories = await IdbHelper.getAllStories();
  console.log(allStories);
};

window.addEventListener('online', async () => {
  console.log('Online kembali, sinkronisasi cerita offline...');
  await StoryAPI.syncOfflineStories();
});