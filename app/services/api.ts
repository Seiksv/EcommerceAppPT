import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE_URL = 'https://fakestoreapi.com';
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      await AsyncStorage.setItem('userToken', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('userToken');
  },
};

export const productService = {
  getProducts: async (page = 1, limit = 10) => {
    const response = await api.get(`/products?page=${page}&limit=${limit}`);
    return response.data;
  },

  getProductById: async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (query: string) => {
    const response = await api.get(`/products`);
    return response.data.filter((product: any) => 
      product.title.toLowerCase().includes(query.toLowerCase())
    );
  },
};

export const userService = {
  getCurrentUser: async () => {
    const response = await api.get('/users/1');
    return response.data;
  },
};

export default api;