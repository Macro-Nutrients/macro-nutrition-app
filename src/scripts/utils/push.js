import { VAPID_PUBLIC_KEY } from '../config.js'; // Public Key VAPID yang diberikan
import { StoryAPI } from '../data/api.js';

// Fungsi untuk mengonversi base64 ke Uint8Array
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
};

// Fungsi untuk subscribe ke push notification
export const subscribeToPush = async () => {
  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  const plainSubscription = subscription.toJSON();

  if (!plainSubscription.endpoint || !plainSubscription.keys?.p256dh || !plainSubscription.keys?.auth) {
    console.error('Data push subscription tidak valid:', plainSubscription);
    throw new Error('Push subscription tidak lengkap.');
  }

  const token = localStorage.getItem('token');

  await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint: plainSubscription.endpoint,
      keys: {
        p256dh: plainSubscription.keys.p256dh,
        auth: plainSubscription.keys.auth,
      }
    }),
  });

  console.log('Push Subscription berhasil.');
};

// Fungsi untuk mengecek apakah sudah subscribe
export const isSubscribedToPush = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  return !!subscription;
};

// Fungsi untuk unsubscribe dari push notification
export const unsubscribeFromPush = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    const plainSubscription = subscription.toJSON();

    await subscription.unsubscribe();

    if (!plainSubscription.endpoint) {
      console.error('Endpoint kosong saat unsubscribe');
      throw new Error('Data unsubscribe tidak valid.');
    }

    const token = StoryAPI.getToken();

    await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: plainSubscription.endpoint,
      }),
    });

    console.log('Unsubscribed dari push notification.');
  }
};