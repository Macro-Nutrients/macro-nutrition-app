import CONFIG from '../config.js';

const BASE = CONFIG.BASE_URL;

/**
 * Generic request helper
 */
async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, options);
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.message || `HTTP ${response.status}`);
  }
  return json;
}



export const FetchAPI = {
  // Register new user
  register: (payload) =>
    request('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  // Login user and store token
  login: async (payload) => {
    const data = await request('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!data.error) {
      localStorage.setItem('token', data.loginResult.token);
    }
    return data;
  },

  // Fetch Analyse Image
  analyze: async (payload) => {
    // payload should be a FormData object for file upload
    return await request('/predict', {
      method: 'POST',
      body: payload,
    });    
  },

  // // Fetch all stories
  // getStories: (opts = {}) => {
  //   const { page = 1, size = 20, location = 0 } = opts;
  //   const token = localStorage.getItem('token') || '';
  //   const params = new URLSearchParams({ page, size, location });
  //   return request(`/stories?${params}`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  // },

  // // Fetch detail of one story
  // getStoryDetail: (id) => {
  //   if (!id) return Promise.reject(new Error('Story ID is required'));
  //   const token = localStorage.getItem('token') || '';
  //   return request(`/stories/${id}`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  // },

  // elevation: async (lat, lon) => {
  //   const url = `https://api.opentopodata.org/v1/test-dataset?locations=${lat},${lon}`;
  //   const resp = await fetch(url);
  //   const data = await resp.json();
  //   return data.results?.[0]?.elevation ?? 0;
  // },

  // reverseGeocode: async (lat, lon) => {
  //   const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  //   const resp = await fetch(url, {
  //     headers: { 'User-Agent': 'DicodingStoryApp' },
  //   });
  //   const data = await resp.json();
  //   return data.address?.state ?? null;
  // },

  // // Add new story (authenticated)
  // addStory: (payload) => {
  //   const token = localStorage.getItem('token') || '';
  //   const form = new FormData();
  //   form.append('description', payload.description);
  //   form.append('photo', payload.photo);
  //   if (payload.lat != null && payload.lon != null) {
  //     form.append('lat', payload.lat);
  //     form.append('lon', payload.lon);
  //   }
  //   return request('/stories', {
  //     method: 'POST',
  //     headers: { Authorization: `Bearer ${token}` },
  //     body: form,
  //   });
  // },

  // // Add new story as guest (no auth)
  // addStoryGuest: (payload) => {
  //   const form = new FormData();
  //   form.append('description', payload.description);
  //   form.append('photo', payload.photo);
  //   if (payload.lat != null && payload.lon != null) {
  //     form.append('lat', payload.lat);
  //     form.append('lon', payload.lon);
  //   }
  //   return request('/stories/guest', {
  //     method: 'POST',
  //     body: form,
  //   });
  // },

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