import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData } from '../types/auth.types';
import { login as loginApi, register as registerApi } from '../api/auth.api';
import Loader from '../components/Loader';
import { setForceLogoutCallback } from '../utils/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  forceLogout?: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const response = await loginApi(credentials);
    const { accessToken, user: userData } = response;
    
    setToken(accessToken);
    setUser(userData);
    
    // Persist to localStorage
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  const register = async (data: RegisterData): Promise<void> => {
    const response = await registerApi(data);
    const { accessToken, user: userData } = response;
    
    setToken(accessToken);
    setUser(userData);
    
    // Persist to localStorage
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Note: Redirect is handled by the component calling logout
  };

  const forceLogout = (): void => {
    setUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Force redirect to login
    window.location.href = '/login';
  };

  // Register forceLogout with authService for axios interceptor
  useEffect(() => {
    setForceLogoutCallback(forceLogout);
  }, []);

  const isAuthenticated = !!token && !!user;

  // Don't render children until we've checked localStorage
  if (isLoading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout, forceLogout }}>
      {children}
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
