// Utility functions for authentication

export const checkTokenExpiration = (token: string): boolean => {
  try {
    // Decode the JWT token (without verification)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token has expired
    return payload.exp < currentTime;
  } catch (error) {
    // If token is malformed, consider it expired
    return true;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getStoredUser = (): any => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}; 