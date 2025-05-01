import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.iqballfarhan.web.id',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AI recommendation function
export const getTruckRecommendation = async (weight) => {
  try {
    const response = await api.post('/api/ai/recommend', { weight });
    return response.data;
  } catch (error) {
    console.error('Error getting truck recommendation:', error);
    throw error;
  }
};

export default api;