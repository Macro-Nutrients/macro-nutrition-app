// src/scripts/routes/routes.js
import DetailPage from '../pages/detail/detail-page.js';
import HomePage from '../pages/home/home-page.js';
import LoginPage from '../pages/login/login-page.js';
import PredictsPage from '../pages/predict-free/predict-free-page.js';
import PredictPage from '../pages/predict/predict-page.js';
import RegisterPage from '../pages/register/register-page.js';

export default {
  '/register': RegisterPage,
  '/login':    LoginPage,
  '/':         HomePage,
  '/predict':  PredictPage,
  '/predicts': PredictsPage,
  '/detail/:id': DetailPage,
};