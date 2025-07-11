import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';
import { User } from '../types';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'user' | 'owner') => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(buildApiUrl(API_ENDPOINTS.AUTH.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify({ ...data, isVerified: data.isVerified ?? false }));
      localStorage.setItem('token', data.token);
      setUser({ ...data, isVerified: data.isVerified ?? false });
    } catch (err) {
      setError('Invalid email or password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'user' | 'owner') => {
    console.log('🧪 Registering:', { name, email, password, role }); // 👈 Add this

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(buildApiUrl(API_ENDPOINTS.AUTH.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) throw new Error('Registration failed');
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify({ ...data, isVerified: data.isVerified ?? false }));
      localStorage.setItem('token', data.token);
      setUser({ ...data, isVerified: data.isVerified ?? false });
    } catch (err) {
      setError('Failed to register');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    setUser,
  }), [user, isLoading, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Named export using function declaration (stable for Fast Refresh)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
