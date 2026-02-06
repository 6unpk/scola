import { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";

import { route } from "@app/pages/route";
import { useAuth } from "@app/hooks/api/useAuth";
import { formatDate } from "@app/utils/date";

interface UseMyArticlesReturn {
  articles: any[]; // TODO: 타입 정의
  isLoading: boolean;
  error: string | null;
  handleArticleClick: (id: number) => void;
}

export function useMyArticles(): UseMyArticlesReturn {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [articles, setArticles] = useState<any[]>([]); // TODO: 타입 정의
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error("Unauthorized");
      }

      // const response = await GetArticlesByUserQuery.fetch(environment, {
      //   userId: user.userId,
      //   limit: 20,
      // }).toPromise();

      // if (response?.articlesByUser) {
      //   setArticles(response.articlesByUser.edges.map((edge) => edge.node));
      // }
    } catch (err) {
      console.error("작성 글 목록 조회 중 오류 발생:", err);
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        alert("로그인이 필요합니다.");
        navigate(route.LOGIN);
        return;
      }
      setError("작성 글 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate, user]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleArticleClick = useCallback(
    (id: number) => {
      navigate(route.ARTICLE_DETAIL(id));
    },
    [navigate],
  );

  return {
    articles,
    isLoading,
    error,
    handleArticleClick,
  };
}
