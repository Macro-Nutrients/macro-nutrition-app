// src/scripts/routes/routes.js
import HomePage from '../pages/home/home-page.js';
import LoginPage from '../pages/login/login-page.js';
import RegisterPage from '../pages/register/register-page.js';

export default {
  '/register': RegisterPage,
  '/login':    LoginPage,
  '/':         HomePage,
};