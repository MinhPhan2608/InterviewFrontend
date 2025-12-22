import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_ENDPOINTS } from '@/config/constants';

// HTTP client for backend API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000, 
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('gscores_refresh');
      
      if (!refreshToken) {
        localStorage.removeItem('gscores_token');
        localStorage.removeItem('gscores_refresh');
        localStorage.removeItem('gscores_user');
        window.location.href = '/login';
        return Promise.reject(error);
      }


      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            const retryConfig = { ...originalRequest };
            delete retryConfig._retry;
            retryConfig.headers.Authorization = `Bearer ${token}`;
            return apiClient(retryConfig);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint with refresh token
        const response = await axios.get(
          `${apiClient.defaults.baseURL}${API_ENDPOINTS.REFRESH}`,
          {
            headers: { Authorization: refreshToken },
          }
        );


        if (response.data.success && response.data.data?.accessToken) {
          const newToken = response.data.data.accessToken;
          localStorage.setItem('gscores_token', newToken);
          
  
          processQueue(null, newToken);
          const retryConfig = { ...originalRequest };
          delete retryConfig._retry;
          retryConfig.headers.Authorization = `Bearer ${newToken}`;
          
          return apiClient(retryConfig);
        } else {
          throw new Error('Invalid refresh response');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('gscores_token');
        localStorage.removeItem('gscores_refresh');
        localStorage.removeItem('gscores_user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;


