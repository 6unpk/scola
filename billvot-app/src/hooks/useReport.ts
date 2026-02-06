import { useState, useEffect } from "react";

import { useAuth } from "@app/hooks/api/useAuth";
import { declarationService, DeclarationCategory, DeclarationRequest } from "@app/api/rest/services";

interface UseReportReturn {
  reportPost: (postId: string, categoryId: string, content: string) => Promise<boolean>;
  reportComment: (commentId: string, categoryId: string, content: string) => Promise<boolean>;
  categories: DeclarationCategory[];
  isLoadingCategories: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useReport(): UseReportReturn {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<DeclarationCategory[]>([]);

  // 신고 카테고리 로드
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const data = await declarationService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error("신고 카테고리 로드 중 오류:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const reportPost = async (
    postId: string,
    categoryId: string,
    content: string,
  ): Promise<boolean> => {
    if (!user) {
      setError("로그인이 필요합니다.");
      return false;
    }

    if (!content.trim()) {
      setError("신고 내용을 입력해주세요.");
      return false;
    }

    if (!categoryId) {
      setError("신고 카테고리를 선택해주세요.");
      return false;
    }

    if (content.length > 100) {
      setError("신고 내용은 최대 100자까지 입력 가능합니다.");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: DeclarationRequest = {
        content: content.trim(),
        categoryId,
        communityPostId: postId,
      };
      await declarationService.createDeclaration(request);
      return true;
    } catch (err: any) {
      console.error("신고 처리 중 오류 발생:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "신고 처리에 실패했습니다.";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reportComment = async (
    commentId: string,
    categoryId: string,
    content: string,
  ): Promise<boolean> => {
    if (!user) {
      setError("로그인이 필요합니다.");
      return false;
    }

    if (!content.trim()) {
      setError("신고 내용을 입력해주세요.");
      return false;
    }

    if (!categoryId) {
      setError("신고 카테고리를 선택해주세요.");
      return false;
    }

    if (content.length > 100) {
      setError("신고 내용은 최대 100자까지 입력 가능합니다.");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: DeclarationRequest = {
        content: content.trim(),
        categoryId,
        communityCommentId: commentId,
      };
      await declarationService.createDeclaration(request);
      return true;
    } catch (err: any) {
      console.error("신고 처리 중 오류 발생:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "신고 처리에 실패했습니다.";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reportPost,
    reportComment,
    categories,
    isLoadingCategories,
    isLoading,
    error,
  };
}
