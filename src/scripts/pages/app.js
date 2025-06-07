// src/scripts/app.js
import routes from '../routes/routes.js';
import { getActiveRoute, getRouteParams } from '../routes/url-parser.js';
import { subscribeToPush, unsubscribeFromPush, isSubscribedToPush } from '../utils/push.js';
import { initNavigation } from '../components/navigation.js';

export default class App {
  constructor({ content, drawerButton, navigationDrawer }) {
    this.content = content;
    this.drawerButton = drawerButton;
    this.navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this._setupNotificationToggle();

    // Inisialisasi navigasi dinamis (login/logout dan link analisa)
    initNavigation();
  }

  _setupDrawer() {
    this.drawerButton.addEventListener('click', () => {
      this.navigationDrawer.classList.toggle('open');
    });
    document.body.addEventListener('click', (e) => {
      if (
        !this.navigationDrawer.contains(e.target) &&
        !this.drawerButton.contains(e.target)
      ) {
        this.navigationDrawer.classList.remove('open');
      }
    });
  }

  async _setupNotificationToggle() {
    const btn = document.querySelector('#notif-toggle-btn');
    if (!btn) return;

    const updateButton = async () => {
      const subscribed = await isSubscribedToPush();
      btn.textContent = subscribed ? '🔕 Matikan Notifikasi' : '🔔 Aktifkan Notifikasi';
    };

    await updateButton();

    btn.addEventListener('click', async () => {
      try {
        const subscribed = await isSubscribedToPush();
        if (subscribed) {
          await unsubscribeFromPush();
        } else {
          await subscribeToPush();
        }
        await updateButton();
      } catch (err) {
        console.error('Gagal toggle notifikasi:', err);
      }
    });
  }

  async renderPage() {
    const routeKey = getActiveRoute();
    const params = getRouteParams();
    const Page = routes[routeKey];
    if (!Page) {
      this.content.innerHTML = '<p>Halaman tidak ditemukan</p>';
      return;
    }
    const page = new Page(params);

    if (document.startViewTransition) {
      await document.startViewTransition(async () => {
        this.content.innerHTML = await page.render();
        await page.afterRender();
      });
    } else {
      this.content.innerHTML = await page.render();
      await page.afterRender();
    }
  }
}