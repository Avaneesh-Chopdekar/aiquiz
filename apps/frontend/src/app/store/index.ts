import {
  getCurrentUser,
  login as apiLogin,
  logout as apiLogout,
} from '../api/auth';
import { AuthStatus, UserResponse } from '../types/auth';
import { create } from 'zustand';

interface AuthStore {
  user: UserResponse | null;
  status: AuthStatus;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ ok: boolean }>;
  logout: () => Promise<{ ok: boolean }>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  status: 'unknown',

  refreshUser: async () => {
    try {
      const user = await getCurrentUser();
      set({ user: user, status: 'authenticated' });
    } catch {
      set({ user: null, status: 'unauthenticated' });
    }
  },

  login: async (email, password): Promise<{ ok: boolean }> => {
    const response = await apiLogin(email, password);
    await useAuthStore.getState().refreshUser();
    return response;
  },

  logout: async () => {
    try {
      const response = await apiLogout();
      return response;
    } finally {
      set({ user: null, status: 'unauthenticated' });
    }
  },
}));
