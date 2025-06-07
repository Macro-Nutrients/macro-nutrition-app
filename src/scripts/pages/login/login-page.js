import LoginPresenter from './login-presenter.js';
import { showToast } from '../../utils/toast.js'; 
export default class LoginPage {
  constructor() {
    this.presenter = new LoginPresenter({ view: this });
  }

  async render() {
    return `
      <section class="container auth-container">
        <div class="auth-inner">
          <h1>Login</h1>
          <img class="logo" src="https://assets.cdn.dicoding.com/original/commons/certificate_logo.png" alt="Logo" />
          <form id="login-form" class="auth-form">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" placeholder="Masukkan email" required />

            <label for="password">Password</label>
            <div class="password-wrapper">
              <input id="password" name="password" type="password" placeholder="Masukkan password" required />
              <button type="button" class="toggle-password" aria-label="Tampilkan Password">👁️</button>
            </div>

            <button type="submit">Masuk</button>
          </form>

          <div class="auth-switch">
            <button type="button" id="to-register">Belum punya akun? Daftar di sini</button>
          </div>

          <div id="login-status"></div>
          <div id="spinner" class="spinner hidden"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    document.body.classList.add('login-page');

    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = e.target.email.value.trim();
      const password = e.target.password.value;
      this.presenter.login({ email, password });
    });

    const toggleBtn = document.querySelector('.toggle-password');
    toggleBtn.addEventListener('click', () => {
      const input = document.getElementById('password');
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      toggleBtn.textContent = isText ? '👁️' : '🙈';
    });

    document.getElementById('to-register').addEventListener('click', () => {
      if (document.startViewTransition) {
        document.startViewTransition(() => location.hash = '/register');
      } else {
        location.hash = '/register';
      }
    });

    window.addEventListener('hashchange', () => {
      document.body.classList.remove('login-page');
    });
  }

  // View API for Presenter:
  showLoading() {
    document.getElementById('spinner').classList.remove('hidden');
    showToast('Memproses login…', 'success');
  }
  hideLoading() {
    document.getElementById('spinner').classList.add('hidden');
  }
  showError(msg) {
    this.hideLoading();
    showToast(`Error: ${msg}`, 'error');
  }
  loginSuccess() {
    this.hideLoading();
    showToast('Berhasil login! Mengalihkan…', 'success');
    setTimeout(() => {
      location.hash = '/';
    }, 2000);
  }
}