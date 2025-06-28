// API Configuration based on environment
const getApiBaseUrl = () => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    return 'http://localhost:5001';
  }
  
  // Check for custom API URL in environment
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default production URL (replace with your actual production URL)
  return 'https://api.flexiride.co';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to build API endpoints
export const buildApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    VERIFY_EMAIL: '/api/auth/verify-email',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    PROFILE: '/api/auth/profile',
  },
  CARS: {
    LIST: '/api/cars',
    DETAIL: (id: string) => `/api/cars/${id}`,
    MY_CARS: '/api/cars/my-cars',
    CREATE: '/api/cars',
    UPDATE: (id: string) => `/api/cars/${id}`,
    DELETE: (id: string) => `/api/cars/${id}`,
  },
  BOOKINGS: {
    LIST: '/api/bookings',
    CREATE: '/api/bookings',
    UPDATE: (id: string) => `/api/bookings/${id}`,
    DELETE: (id: string) => `/api/bookings/${id}`,
  },
  ADMIN: {
    USERS: '/api/admin/users',
    CARS: '/api/admin/cars',
    BOOKINGS: '/api/admin/bookings',
  },
}; 