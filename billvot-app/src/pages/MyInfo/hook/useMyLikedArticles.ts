import { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";

import { route } from "@app/pages/route";
import { useAuth } from "@app/hooks/api/useAuth";
import { articleService, commentService } from "@app/api/rest/services";
import { ArticleLike, CommentLike } from "@app/api/rest/types";

interface UseMyLikedArticlesReturn {
  articles: ArticleLike[];
  comments: CommentLike[];
  isLoading: boolean;
  error: string | null;
  hasNextPage: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useMyLikedArticles(): UseMyLikedArticlesReturn {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [articles, setArticles] = useState<ArticleLike[]>([]);
  const [comments, setComments] = useState<CommentLike[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchLikedData = useCallback(async (page = 0) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error("Unauthorized");
      }

      // 좋아요한 아티클과 댓글을 병렬로 가져오기
      const [articlesResponse, commentsResponse] = await Promise.all([
        articleService.getLikedArticlesByUser(user.id, page, 10),
        commentService.getLikedCommentsByUser(user.id, page, 10),
      ]);

      if (page === 0) {
        setArticles(articlesResponse.result || []);
        setComments(commentsResponse.result || []);
      } else {
        setArticles((prev) => [...prev, ...(articlesResponse.result || [])]);
        setComments((prev) => [...prev, ...(commentsResponse.result || [])]);
      }

      // 다음 페이지가 있는지 확인 (아티클과 댓글 중 하나라도 더 있으면 true)
      const hasMoreArticles = !articlesResponse.last;
      const hasMoreComments = !commentsResponse.last;
      setHasNextPage(hasMoreArticles || hasMoreComments);
      setCurrentPage(page);
    } catch (err) {
      console.error("좋아요한 게시글 목록 조회 중 오류 발생:", err);
      if (err instanceof Error && err.message === "Unauthorized") {
        alert("로그인이 필요합니다.");
        navigate(route.LOGIN);
        return;
      }
      setError("게시글 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate, user]);

  const loadMore = useCallback(async () => {
    if (!hasNextPage || isLoading) return;
    await fetchLikedData(currentPage + 1);
  }, [hasNextPage, isLoading, currentPage, fetchLikedData]);

  const refresh = useCallback(async () => {
    setArticles([]);
    setComments([]);
    setCurrentPage(0);
    setHasNextPage(false);
    await fetchLikedData(0);
  }, [fetchLikedData]);

  useEffect(() => {
    fetchLikedData(0);
  }, [fetchLikedData]);

  return {
    articles,
    comments,
    isLoading,
    error,
    hasNextPage,
    loadMore,
    refresh,
  };
}
