import { checkTokenExpiration, clearAuthData } from './auth';

// Custom fetch wrapper that checks for session expiration
export const authenticatedFetch = async (
  url: string, 
  options: RequestInit = {},
  onSessionExpired?: () => void
): Promise<Response> => {
  // Get the current token
  const token = localStorage.getItem('token');
  
  // If there's a token, check if it's expired
  if (token && checkTokenExpiration(token)) {
    // Token is expired, clear auth data
    clearAuthData();
    
    // Call the session expired callback if provided
    if (onSessionExpired) {
      onSessionExpired();
    } else {
      // Default behavior: show alert
      alert('Your session has expired. Please log in again.');
    }
    
    // Return a rejected promise to prevent the API call
    throw new Error('Session expired');
  }
  
  // Add authorization header if token exists
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Make the API call
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // Check for 401 Unauthorized response
  if (response.status === 401) {
    clearAuthData();
    if (onSessionExpired) {
      onSessionExpired();
    } else {
      alert('Your session has expired. Please log in again.');
    }
    throw new Error('Session expired');
  }
  
  return response;
}; 