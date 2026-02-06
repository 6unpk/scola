import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: number;
  email: string;
  nickname?: string;
  profileImage?: string;
};

export type BlockedUser = {
  id: number;
  nickname: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoginModalOpen: boolean;
  blockedUsers: BlockedUser[];
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  setBlockedUsers: (users: BlockedUser[]) => void;
  addBlockedUser: (user: BlockedUser) => void;
  removeBlockedUser: (userId: number) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoginModalOpen: false,
      blockedUsers: [],
      setAuth: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
      openLoginModal: () => set({ isLoginModalOpen: true }),
      closeLoginModal: () => set({ isLoginModalOpen: false }),
      setBlockedUsers: (users) => set({ blockedUsers: users }),
      addBlockedUser: (user) =>
        set((state) => ({ blockedUsers: [...state.blockedUsers, user] })),
      removeBlockedUser: (userId) =>
        set((state) => ({
          blockedUsers: state.blockedUsers.filter((u) => u.id !== userId),
        })),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        blockedUsers: state.blockedUsers,
      }),
    }
  )
);
