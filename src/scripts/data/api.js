import CONFIG from '../config.js';

const BASE = CONFIG.BASE_URL;

/**
 * Generic request helper
 */
async function request(path, options = {}) {
  // Salin options supaya header bisa diubah
  const newOptions = { ...options };
  newOptions.headers = newOptions.headers || {};

  // Cek apakah body itu FormData
  const isFormData = newOptions.body instanceof FormData;

  if (!isFormData) {
    // Kalau bukan FormData, pastikan header Content-Type ada
    newOptions.headers['Content-Type'] = newOptions.headers['Content-Type'] || 'application/json';
  } else {
    // Kalau FormData, jangan set Content-Type sama sekali
    // karena fetch akan set otomatis beserta boundary
    if ('Content-Type' in newOptions.headers) {
      delete newOptions.headers['Content-Type'];
    }
  }

  const response = await fetch(`${BASE}${path}`, newOptions);
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.message || `HTTP ${response.status}`);
  }
  return json;
}



export const FetchAPI = {
  // Register new user
  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  login: async (payload) => {
  const data = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!data.error) {
      // Sesuaikan dengan response dari backend
      localStorage.setItem('token', data.result.token);
    }
    return data;
  },
    //untuk login
  async analyze(formData) {
    const token = localStorage.getItem('token');
    const headers = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return await request('/inference/predict', {
      method: 'POST',
      body: formData,
      headers,
    });
  },
  // Fungsi untuk mengambil riwayat analisa
    // Ambil riwayat prediksi
  // Ambil riwayat prediksi
  async getHistory() {
    const token = localStorage.getItem('token');
    const headers = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return await request('/inference/history', {
      method: 'GET',
      headers,
    });
  },
    // Fetch Analyse Image untuk image free bukan login
    analyzes: async (payload) => {
    // payload should be a FormData object for file upload
    return await request('/inference/predict', {
      method: 'POST',
      body: payload,
    });    
  },

  async getDetailPredict(id) {
    const token = localStorage.getItem('token');
    const headers = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return await request(`/inference/${id}`, {
      method: 'GET',
      headers,
    });
  },

  // Push subscription
  subscribePush: (payload) => {
    const token = localStorage.getItem('token') || '';
    return request('/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  // Unsubscribe
  unsubscribePush: (payload) => {
    const token = localStorage.getItem('token') || '';
    return request('/notifications/subscribe', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },

  // Helper: get token
  getToken: () => localStorage.getItem('token'),

};