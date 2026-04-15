// Placeholder: API service files will be created in Phase 3
// This file will contain Axios instance configuration

/*
 * WHY a centralized API service?
 * Instead of writing axios.get("http://localhost:8080/api/doctors")
 * in every component, we create ONE configured Axios instance
 * with the base URL, headers, and interceptors already set up.
 * 
 * This follows the DRY principle (Don't Repeat Yourself).
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // Vite proxy forwards this to http://localhost:8080/api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — will add JWT token to admin requests (Phase 6)
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

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized, redirect to login (Phase 6)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
