import api from '.';
import { SignupSchema } from '../types/auth';

export const login = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

type SignupBody = Omit<SignupSchema, 'confirmPassword'>;

export const signup = async (body: SignupBody) => {
  const res = await api.post('/users', body);
  return res.data;
};
