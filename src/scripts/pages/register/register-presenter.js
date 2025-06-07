// src/scripts/pages/register/register-presenter.js
import { FetchAPI } from '../../data/api.js';

export default class RegisterPresenter {
  constructor({ view }) {
    this.view = view;
  }

  async register(payload) {
    this.view.showLoading();
    try {
      const res = await FetchAPI.register(payload);
      if (res.error) {
        this.view.showError(res.message);
      } else {
        this.view.registerSuccess();
      }
    } catch (err) {
      this.view.showError('Gagal mendaftar. ' + err.message);
    } finally {
      this.view.hideLoading();
    }
  }
}