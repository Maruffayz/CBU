import { create } from 'zustand';
import { User } from '@/types';

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  setUser: (user) => {
    set({ user });
    if (user?.token) {
      localStorage.setItem('token', user.token);
    }
  },
  logout: () => {
    set({ user: null });
    localStorage.removeItem('token');
  },
  isAuthenticated: () => !!get().user,
}));
