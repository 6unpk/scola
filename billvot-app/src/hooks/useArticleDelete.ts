import { useState, useCallback } from "react";

import { useNavigate } from "react-router-dom";

import { articleService } from "@app/api/rest/services";
import { route } from "@app/pages/route";

interface UseArticleDeleteReturn {
  deleteArticle: (articleId: number) => Promise<boolean>;
  isDeleting: boolean;
  deleteError: string | null;
}

export function useArticleDelete(): UseArticleDeleteReturn {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteArticle = useCallback(
    async (articleId: number): Promise<boolean> => {
      if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
        return false;
      }

      setIsDeleting(true);
      setDeleteError(null);

      try {
        await articleService.deleteArticle(articleId);
        // 삭제 성공 시 홈으로 이동
        navigate(route.FEED, { replace: true });
        return true;
      } catch (err) {
        setDeleteError("게시글 삭제 중 오류가 발생했습니다.");
        console.error("게시글 삭제 중 오류:", err);
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [navigate],
  );

  return {
    deleteArticle,
    isDeleting,
    deleteError,
  };
}
