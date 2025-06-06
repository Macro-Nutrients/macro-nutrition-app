import routes from '../routes/routes.js';
import { getActiveRoute, getRouteParams } from '../routes/url-parser.js';
import { subscribeToPush, unsubscribeFromPush, isSubscribedToPush } from '../utils/push.js';

export default class App {
  constructor({ content, drawerButton, navigationDrawer }) {
    this.content = content;
    this.drawerButton = drawerButton;
    this.navigationDrawer = navigationDrawer;
    this._setupDrawer();
    this._setupNotificationToggle();
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

  // Fungsi untuk memeriksa langganan notifikasi dan memperbarui teks tombol
  async _setupNotificationToggle() {
    const btn = document.querySelector('#notif-toggle-btn');
    if (!btn) return;

    // Fungsi untuk memperbarui teks tombol sesuai status langganan
    const updateButton = async () => {
      const subscribed = await isSubscribedToPush(); // Mengecek status langganan notifikasi
      btn.textContent = subscribed ? '🔕 Matikan Notifikasi' : '🔔 Aktifkan Notifikasi'; // Sesuaikan teks tombol
    };

    await updateButton(); // Perbarui status tombol ketika halaman pertama kali dimuat

    // Menambahkan event listener untuk mengubah status langganan notifikasi
    btn.addEventListener('click', async () => {
      try {
        const subscribed = await isSubscribedToPush();
        if (subscribed) {
          // Jika sudah berlangganan, batalkan langganan
          await unsubscribeFromPush();
        } else {
          // Jika belum berlangganan, langganan notifikasi
          await subscribeToPush();
        }
        await updateButton(); // Perbarui status tombol setelah langganan berhasil diubah
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
      document.startViewTransition(async () => {
        this.content.innerHTML = await page.render();
        await page.afterRender();
      });
    } else {
      this.content.innerHTML = await page.render();
      await page.afterRender();
    }
  }
}