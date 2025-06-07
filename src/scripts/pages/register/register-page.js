import RegisterPresenter from './register-presenter.js';
import { showToast } from '../../utils/toast.js'; 
export default class RegisterPage {
  constructor() {
    this.presenter = new RegisterPresenter({ view: this });
  }

  async render() {
    return `
      <section class="container auth-container">
        <div class="auth-inner">
          <h1>Register</h1>
          <img class="logo" src="https://assets.cdn.dicoding.com/original/commons/certificate_logo.png" alt="Logo" />
          <form id="register-form" class="auth-form">
            <label for="name">Nama</label>
            <input id="name" name="name" type="text" placeholder="Masukkan nama lengkap" required />

            <label for="email">Email</label>
            <input id="email" name="email" type="email" placeholder="Masukkan email" required />

            <label for="password">Password</label>
            <div class="password-wrapper">
              <input id="password" name="password" type="password" placeholder="Masukkan password" minlength="8" required />
              <button type="button" class="toggle-password" aria-label="Tampilkan Password">👁️</button>
            </div>

            <button type="submit">Daftar</button>
          </form>

          <div class="auth-switch">
            <button type="button" id="to-login">Sudah punya akun? Masuk di sini</button>
          </div>

          <div id="register-status"></div>
          <div id="spinner" class="spinner hidden"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    document.body.classList.add('login-page');

    document.getElementById('register-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = e.target.name.value.trim();
      const email = e.target.email.value.trim();
      const password = e.target.password.value;
      this.presenter.register({ username, email, password });
    });

    const toggleBtn = document.querySelector('.toggle-password');
    toggleBtn.addEventListener('click', () => {
      const input = document.getElementById('password');
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      toggleBtn.textContent = isText ? '👁️' : '🙈';
    });

    document.getElementById('to-login').addEventListener('click', () => {
      if (document.startViewTransition) {
        document.startViewTransition(() => location.hash = '/login');
      } else {
        location.hash = '/login';
      }
    });

    window.addEventListener('hashchange', () => {
      document.body.classList.remove('login-page');
    });
  }

  // View API for Presenter:
  showLoading() {
    document.getElementById('spinner').classList.remove('hidden');
    showToast('Memproses pendaftaran…', 'success');
  }
  hideLoading() {
    document.getElementById('spinner').classList.add('hidden');
  }
  showError(msg) {
    this.hideLoading();
    showToast(`Error: ${msg}`, 'error');
  }
  registerSuccess() {
    this.hideLoading();
    showToast('Berhasil daftar! Mengalihkan ke login…', 'success');
    setTimeout(() => {
      location.hash = '/login';
    }, 3000);
  }
}