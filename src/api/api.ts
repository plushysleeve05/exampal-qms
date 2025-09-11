import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'https://api.exampalgh.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
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
    // Handle errors globally
    console.error('API Error:', error);
    
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token logic
      console.log('Authentication error, redirecting to login...');
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
