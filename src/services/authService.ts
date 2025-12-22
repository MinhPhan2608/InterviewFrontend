import apiClient from './apiClient';
import type { LoginCredentials, LoginData, ApiResponse } from '@/types';

export const authService = {
  // Login with username and password
  login: async (credentials: LoginCredentials): Promise<LoginData> => {
    const response = await apiClient.post<ApiResponse<LoginData>>('/auth/login', credentials);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Login failed');
    }
    return response.data.data;
  },

  // Logout - clear local storage
  logout: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  // Store auth data
  setAuthData: (accessToken: string, refreshToken: string, username: string): void => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify({ username }));
  },

  // Get stored user
  getUser: (): { username: string } | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
