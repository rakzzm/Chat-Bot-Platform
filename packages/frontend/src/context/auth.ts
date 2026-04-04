import { create } from 'zustand';
import { login as apiLogin, register as apiRegister, clearAuthToken } from '../lib/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  login: async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    set({ user: data.user, token: data.token });
  },

  register: async (email: string, password: string, name: string) => {
    const data = await apiRegister(email, password, name);
    set({ user: data.user, token: data.token });
  },

  logout: () => {
    set({ user: null, token: null });
    clearAuthToken();
  },
}));
