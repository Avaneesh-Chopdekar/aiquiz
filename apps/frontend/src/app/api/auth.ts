import api from '.';
import { SignupBody } from '../types/auth';

export const login = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const signup = async (body: SignupBody) => {
  const res = await api.post('/users', body);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};
