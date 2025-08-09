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
import { checkTokenExpiration, clearAuthData, getStoredToken, getStoredUser } from '../utils/auth';

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
  handleSessionExpiration: () => void;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();
    
    if (token && storedUser) {
      // Check if token has expired
      if (checkTokenExpiration(token)) {
        // Token is expired, clear auth data
        clearAuthData();
        setUser(null);
        // Show session expiration alert
        if (typeof window !== 'undefined') {
          alert('Your session has expired. Please log in again.');
        }
      } else {
        setUser(storedUser);
      }
    }
    setIsLoading(false);
  }, []);

  // Periodic token expiration check
  useEffect(() => {
    if (!user) return;

    const checkExpiration = () => {
      const token = getStoredToken();
      if (token && checkTokenExpiration(token)) {
        handleSessionExpiration();
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkExpiration, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

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

  const handleSessionExpiration = () => {
    clearAuthData();
    setUser(null);
    if (typeof window !== 'undefined') {
      alert('Your session has expired. Please log in again.');
    }
  };

  const logout = async () => {
    clearAuthData();
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
    handleSessionExpiration,
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
