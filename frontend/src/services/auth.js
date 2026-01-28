import api from './api';
import { storageService } from './storage';

export const authService = {
  sendOTP: async (email) => {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
  },

  verifyOTP: async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  login: async (email, otp) => {
    const response = await api.post('/auth/login', { email, otp });
    if (response.data.token) {
      storageService.setToken(response.data.token);
      storageService.setUser(response.data.user);
    }
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    if (response.data.token) {
      storageService.setToken(response.data.token);
      storageService.setUser(response.data.user);
    }
    return response.data;
  },

  logout: () => {
    storageService.removeToken();
    storageService.removeUser();
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    if (response.data.user) {
      storageService.setUser(response.data.user);
    }
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
