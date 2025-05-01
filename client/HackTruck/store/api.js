import axios from 'axios';

// Create axios instance with base URL according to the API documentation
const api = axios.create({
  // If you're in development, you might want to use a local URL
  // baseURL: 'http://localhost:3000', 
  
  // For production, use the domain specified in the API documentation
  // baseURL: 'https://your-api-domain.com',
  
  // Using your existing domain since it's likely the correct one for your specific setup
  baseURL: 'https://api.iqballfarhan.web.id',
  
  // Include credentials for CORS if needed
  withCredentials: true,
});

// Interceptor to add authorization token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;