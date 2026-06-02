import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const form = document.getElementById('loginForm');
const message = document.getElementById('loginMessage');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      message.textContent = 'Email dan password harus diisi.';
      message.className = 'form-message error';
      return;
    }

    message.textContent = 'Memproses...';
    message.className = 'form-message';

    try {
      await signInWithEmailAndPassword(auth, email, password);
      message.textContent = 'Berhasil masuk! Mengalihkan...';
      message.className = 'form-message success';
      setTimeout(() => (window.location.href = 'dashboard.html'), 800);
    } catch (err) {
      console.error(err);
      let errorText = 'Email atau password salah.';
      if (err.code === 'auth/user-not-found') {
        errorText = 'Akun tidak ditemukan. Pastikan email sudah terdaftar.';
      } else if (err.code === 'auth/wrong-password') {
        errorText = 'Password salah. Coba lagi dengan benar.';
      } else if (err.code === 'auth/invalid-email') {
        errorText = 'Format email tidak valid.';
      } else if (err.code === 'auth/network-request-failed') {
        errorText = 'Gagal terhubung. Periksa jaringan internet Anda.';
      }
      message.textContent = `${errorText} (${err.code})`;
      message.className = 'form-message error';
    }
  });
}

// Auto redirect jika sudah login
onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname.endsWith('login.html')) {
    window.location.href = 'dashboard.html';
  }
});

export async function logout() {
  await signOut(auth);
  window.location.href = 'login.html';
}

// Toggle show/hide password di form login
window.togglePassword = function () {
  const pass = document.getElementById('password');
  const btn = document.querySelector('.toggle-pass-btn');
  if (!pass) return;
  if (pass.type === 'password') {
    pass.type = 'text';
    if (btn) btn.textContent = '🙈';
  } else {
    pass.type = 'password';
    if (btn) btn.textContent = '👁️';
  }
};
