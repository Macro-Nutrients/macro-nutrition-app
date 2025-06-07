// utils/toast.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showToast(message, type = "success") {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: type === "success" ? "#28a745" : "#dc3545",
    stopOnFocus: true,
  }).showToast();
}
