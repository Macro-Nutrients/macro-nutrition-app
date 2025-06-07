// src/scripts/utils/auth.js
export function requireAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.hash = '/login';
    return false;
  }
  return true;
}

export function isUserLoggedIn() {
  return !!localStorage.getItem('token');
}

export function logout() {
  localStorage.removeItem('token');
  // bisa tambah cleanup lain kalau perlu
}