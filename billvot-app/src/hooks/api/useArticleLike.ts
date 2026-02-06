import { useState } from "react";
import { articleService } from "@app/api/rest/services";
import { useAuth } from "./useAuth";
import { useAuthStore } from "@app/store/useAuthStore";

interface UseArticleLikeReturn {
  toggleLike: (articleId: string) => Promise<{ isLiked: boolean; likeCount: number } | null>;
  isLoading: boolean;
  error: string | null;
}

export function useArticleLike(): UseArticleLikeReturn {
  const { user } = useAuth();
  const { openLoginModal } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleLike = async (articleId: string) => {
    if (!user) {
      openLoginModal();
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await articleService.toggleLike(articleId);
      return result;
    } catch (err: unknown) {
      console.error("좋아요 처리 중 오류 발생:", err);
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "좋아요 처리에 실패했습니다."
          : "좋아요 처리에 실패했습니다.";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    toggleLike,
    isLoading,
    error,
  };
}
