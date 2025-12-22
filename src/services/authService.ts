import apiClient from './apiClient';
import type { LoginCredentials, LoginData, ApiResponse } from '@/types';
import { API_ENDPOINTS } from '@/config/constants';

// Keys for storing auth data - prefixed to avoid collisions
const STORAGE_KEYS = {
  ACCESS: 'gscores_token',
  REFRESH: 'gscores_refresh',
  USER: 'gscores_user',
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginData> => {
    if (!credentials.username?.trim() || !credentials.password?.trim()) {
      throw new Error('Username and password are required');
    }

    const response = await apiClient.post<ApiResponse<LoginData>>(API_ENDPOINTS.LOGIN, credentials);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Login failed');
    }
    
    return response.data.data;
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS);
    localStorage.removeItem(STORAGE_KEYS.REFRESH);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS);
  },

  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS);
  },

  // Save tokens after successful login
  setAuthData: (accessToken: string, refreshToken: string, username: string): void => {
    localStorage.setItem(STORAGE_KEYS.ACCESS, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ username }));
  },

  getUser: (): { username: string } | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    if (!user) return null;
    
    try {
      return JSON.parse(user);
    } catch {
      localStorage.removeItem(STORAGE_KEYS.USER);
      return null;
    }
  },
};

export default authService;

