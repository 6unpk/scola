import { useAuthStore } from "@app/store/useAuthStore";

interface UseBlockUserReturn {
  blockUser: (userId: number, nickname: string, reason?: string) => void;
  unblockUser: (userId: number) => void;
  isUserBlocked: (userId: number) => boolean;
  getBlockedUsers: () => import("@app/store/useAuthStore").BlockedUser[];
  blockedUsers: import("@app/store/useAuthStore").BlockedUser[];
}

export function useBlockUser(): UseBlockUserReturn {
  const { 
    blockUser, 
    unblockUser, 
    isUserBlocked, 
    getBlockedUsers, 
    blockedUsers 
  } = useAuthStore();

  return {
    blockUser,
    unblockUser,
    isUserBlocked,
    getBlockedUsers,
    blockedUsers,
  };
}
