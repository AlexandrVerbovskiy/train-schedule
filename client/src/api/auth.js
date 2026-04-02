import apiClient from '../utils/client';

export const login = (email, password) => 
  apiClient('/auth/login', { body: { email, password } });

export const register = (email, password) => 
  apiClient('/auth/register', { body: { email, password } });

export const getMe = () => apiClient('/auth/me');
