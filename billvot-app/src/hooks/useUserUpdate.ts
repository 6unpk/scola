import { useState } from "react";
import { authService, UpdateUserRequest } from "@app/api/rest/services";
import { User } from "@app/api/rest/types";

interface UseUserUpdateReturn {
  updateUser: (data: UpdateUserRequest) => Promise<User | null>;
  isLoading: boolean;
  error: string | null;
}

export function useUserUpdate(): UseUserUpdateReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (data: UpdateUserRequest): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await authService.updateMe(data);
      return updatedUser;
    } catch (err: unknown) {
      console.error("사용자 정보 업데이트 중 오류:", err);
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "사용자 정보 업데이트에 실패했습니다."
          : "사용자 정보 업데이트에 실패했습니다.";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateUser,
    isLoading,
    error,
  };
}
