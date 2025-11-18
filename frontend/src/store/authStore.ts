import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/models';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        localStorage.setItem('access_token', token);
        // Aseguramos que el objeto 'user' que se guarda es el que viene de la API,
        // que ya contiene el 'id'.
        set({ 
          user: user, token: token, isAuthenticated: true 
        });
      },
      logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
