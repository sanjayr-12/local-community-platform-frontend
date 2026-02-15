import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  picture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  hasHydrated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      hasHydrated: false,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
