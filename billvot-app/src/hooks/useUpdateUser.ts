import { useState } from "react";

import { useAuthStore } from "@app/store/useAuthStore";

interface UpdateUserInput {
  identificationImageUrl?: string;
  businessLicenseImageUrl?: string;
  businessLicenseNumber?: string;
}

interface UseUpdateUserReturn {
  updateUser: (input: UpdateUserInput) => Promise<boolean>;
  isUpdating: boolean;
  error: string | null;
}

export function useUpdateUser(): UseUpdateUserReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token, setAuth } = useAuthStore();

  const updateUser = async (input: UpdateUserInput): Promise<boolean> => {
    if (!user) {
      setError("로그인이 필요합니다.");
      return false;
    }

    setIsUpdating(true);
    setError(null);

    try {
      return new Promise((resolve, reject) => {
        UpdateUserMutation.commit(
          environment,
          {
            userId: user.userId,
            ...input,
          },
          (response) => {
            if (response.updateUser) {
              // 업데이트된 사용자 정보로 store 갱신
              setAuth({ user: response.updateUser, token: token || "" });
              resolve(true);
            } else {
              reject(new Error("사용자 정보 업데이트에 실패했습니다."));
            }
          },
          (err) => {
            reject(err);
          },
        );
      });
    } catch (err) {
      console.error("사용자 정보 업데이트 중 오류 발생:", err);
      setError("사용자 정보 업데이트에 실패했습니다.");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateUser,
    isUpdating,
    error,
  };
}
