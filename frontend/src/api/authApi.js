import api from './axios';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const getUserProfile = async () => {
  const { data } = await api.get('/auth/profile');
  return data;
};
