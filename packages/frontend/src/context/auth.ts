import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
}

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
    const { data } = await axios.post('/api/auth/login', { email, password });
    set({ user: data.user, token: data.token });
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  },

  register: async (email: string, password: string, name: string) => {
    const { data } = await axios.post('/api/auth/register', { email, password, name });
    set({ user: data.user, token: data.token });
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  },

  logout: () => {
    set({ user: null, token: null });
    delete axios.defaults.headers.common['Authorization'];
  },
}));
