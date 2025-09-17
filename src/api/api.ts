import axios from 'axios';
import { errorToast } from '../utils/toast';

// Get API base URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.exampalgh.com/api/v1';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout for all requests
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Default error message
    let errorMessage = 'An unexpected error occurred. Please try again later.';
    
    // Network errors
    if (!error.response) {
      errorMessage = 'Network error. Please check your connection.';
      errorToast(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }
    
    // Server errors with response
    if (error.response) {
      const { status } = error.response;
      
      // Handle based on status code
      switch (status) {
        case 400:
          errorMessage = 'Invalid request. Please check your data.';
          break;
        case 401:
          errorMessage = 'Authentication required. Please sign in.';
          // Redirect to login page
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        case 422:
          errorMessage = 'Validation error. Please check your inputs.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
        case 502:
        case 503:
          errorMessage = 'Server error. Our team has been notified.';
          break;
      }
      
      // Get specific message from API if available
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      // Display error toast
      errorToast(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

export default api;
