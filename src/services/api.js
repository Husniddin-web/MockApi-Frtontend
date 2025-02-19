import axios from 'axios';
import { API_BASE_URL } from '../config';
import AuthService from './authService';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('accessToken');
    
    if (token && AuthService.isTokenExpired(token)) {
      try {
        const newToken = await AuthService.refreshToken();
        config.headers.Authorization = `Bearer ${newToken}`;
      } catch (error) {
        // Refresh token failed, redirect to login
        AuthService.logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await AuthService.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        AuthService.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api; 