// src/scripts/pages/login/login-presenter.js
import { StoryAPI } from '../../data/api.js';
import { subscribeToPush } from '../../utils/push.js';

export default class LoginPresenter {
  constructor({ view }) {
    this.view = view;
  }

  async login(credentials) {
    this.view.showLoading();
    try {
      const res = await StoryAPI.login(credentials);
      if (res.error) {
        this.view.showError(res.message);
      } else {
        // sukses
        this.view.loginSuccess();
        await subscribeToPush();
      }
    } catch (err) {
      this.view.showError('Login gagal. ' + err.message);
    } finally {
      this.view.hideLoading();
    }
  }
}