import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// HTTP client for backend API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000, 
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('gscores_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gscores_token');
      localStorage.removeItem('gscores_refresh');
      localStorage.removeItem('gscores_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

