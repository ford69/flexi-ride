import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';

// This is a placeholder for API calls
const api = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // Mock implementation - will be replaced with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: '1',
          name: 'John Doe',
          email,
          role: 'user' as const,
          createdAt: new Date().toISOString(),
        };
        resolve({ user: mockUser, token: 'mock-token' });
      }, 500);
    });
  },
  register: async (
    name: string,
    email: string,
    password: string,
    role: 'user' | 'owner'
  ): Promise<{ user: User; token: string }> => {
    // Mock implementation - will be replaced with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: '1',
          name,
          email,
          role,
          createdAt: new Date().toISOString(),
        };
        resolve({ user: mockUser, token: 'mock-token' });
      }, 500);
    });
  },
  logout: async (): Promise<void> => {
    // Mock implementation - will be replaced with actual API call
    return new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
  },
  getCurrentUser: async (): Promise<User | null> => {
    // Mock implementation - will be replaced with actual API call
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user' as const,
          createdAt: new Date().toISOString(),
        };
        resolve(mockUser);
      }, 500);
    });
  },
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'user' | 'owner') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await api.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Failed to authenticate');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user, token } = await api.login(email, password);
      localStorage.setItem('token', token);
      setUser(user);
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'user' | 'owner') => {
    setIsLoading(true);
    setError(null);
    try {
      const { user, token } = await api.register(name, email, password, role);
      localStorage.setItem('token', token);
      setUser(user);
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to register');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
      localStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};