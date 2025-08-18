import api from '.';
import { SignupBody, UserResponse } from '../types/auth';

export const login = async (email: string, password: string) => {
  const res = await api.post<{ ok: boolean }>('/auth/login', {
    email,
    password,
  });
  return res.data;
};

export const signup = async (body: SignupBody) => {
  const res = await api.post('/users', body);
  return res;
};

export const getCurrentUser = async () => {
  const res = await api.get<UserResponse>('/auth/me');
  return res.data;
};

export const logout = async () => {
  const res = await api.post<{ ok: boolean }>('/auth/logout');
  return res.data;
};
