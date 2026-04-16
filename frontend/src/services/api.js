/**
 * ============================================================
 * CENTRALIZED AXIOS API SERVICE
 * ============================================================
 *
 * 🎓 WHY a centralized API service?
 * Instead of writing axios.get("http://localhost:8080/api/doctors")
 * in every component, we create ONE configured Axios instance
 * with the base URL, headers, and interceptors already set up.
 *
 * This follows the DRY principle (Don't Repeat Yourself).
 *
 * 🎓 INTERCEPTORS:
 * - REQUEST interceptor: Automatically attaches JWT token to every request
 * - RESPONSE interceptor: Catches 401 errors and redirects to login
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // Vite proxy forwards this to http://localhost:8080/api
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR — Attach JWT token to every request.
 *
 * 🎓 HOW IT WORKS:
 * 1. Before EVERY API call, this interceptor runs
 * 2. It checks localStorage for a stored JWT token
 * 3. If found, it adds "Authorization: Bearer <token>" header
 * 4. The backend JwtAuthenticationFilter reads this header
 *
 * This means components don't need to manually add auth headers.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR — Handle errors globally.
 *
 * 🎓 WHY HANDLE 401 GLOBALLY?
 * If ANY API call returns 401 (token expired or invalid),
 * we automatically clean up and redirect to login.
 * Without this, every component would need its own 401 handling.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid → force logout
      localStorage.removeItem('token');

      // Only redirect if we're on an admin page (not login page itself)
      if (window.location.pathname.startsWith('/admin') &&
          !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
