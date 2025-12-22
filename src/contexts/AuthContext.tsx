import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '@/services';
import type { User, LoginCredentials } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Restore session from localStorage on app load
  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser && authService.isAuthenticated()) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const loginData = await authService.login(credentials);
      if (!loginData.accessToken) {
        throw new Error('No token received from server');
      }
      authService.setAuthData(loginData.accessToken, loginData.refreshToken, credentials.username);
      setUser({ username: credentials.username });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoggingOut(true);
    // Brief animation before wiping state - feels better than instant logout
    setTimeout(() => {
      authService.logout();
      setUser(null);
      setIsLoggingOut(false);
    }, 300);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: isLoading || isLoggingOut,
        login,
        logout,
        error,
      }}
    >
      <div className={isLoggingOut ? 'animate-[fadeOut_0.3s_ease-in]' : ''}>
        {children}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
