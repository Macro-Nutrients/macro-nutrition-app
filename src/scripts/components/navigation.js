// src/scripts/components/navigation.js
import { isUserLoggedIn, logout } from '../utils/auth.js';


export function initNavigation() {
  const analisaLink = document.getElementById('analisa-link');
  const authItem = document.getElementById('auth-item');

  if (!analisaLink || !authItem) return;

  function updateAnalisaLink() {
    if (isUserLoggedIn()) {
      analisaLink.setAttribute('href', '#/predict');
    } else {
      analisaLink.setAttribute('href', '#/predicts');
    }
  }

  function updateAuthItem() {
    if (isUserLoggedIn()) {
      authItem.innerHTML = `<button id="logout-btn">Logout</button>`;
      document.getElementById('logout-btn').addEventListener('click', () => {
        logout();
        updateAnalisaLink();
        updateAuthItem();
        location.hash = '/login';  // redirect ke login setelah logout
      });
    } else {
      authItem.innerHTML = `<a href="#/login">Login</a>`;
    }
  }

  // Update saat load dan setiap hash change
  window.addEventListener('load', () => {
    updateAnalisaLink();
    updateAuthItem();
  });
  window.addEventListener('hashchange', () => {
    updateAnalisaLink();
    updateAuthItem();
  });
}