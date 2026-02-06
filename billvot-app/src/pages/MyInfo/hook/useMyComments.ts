import { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";

import { route } from "@app/pages/route";
import { useAuth } from "@app/hooks/api/useAuth";

interface UseMyCommentsReturn {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  hasNextPage: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useMyComments(): UseMyCommentsReturn {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<number | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error("Unauthorized");
      }

      // const response = await GetCommentsByUserQuery.fetch(environment, {
      //   userId: user.userId,
      //   limit: 20,
      // }).toPromise();

      // if (response?.commentsByUser) {
      //   setComments(response.commentsByUser.edges.map((edge) => edge.node));
      //   setHasNextPage(response.commentsByUser.pageInfo.hasNextPage);
      //   setEndCursor(response.commentsByUser.pageInfo.endCursor);
      // }
    } catch (err) {
      console.error("작성한 댓글 목록 조회 중 오류 발생:", err);
      if (err instanceof Error && err.message === "Unauthorized") {
        alert("로그인이 필요합니다.");
        navigate(route.LOGIN);
        return;
      }
      setError("댓글 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate, user]);

  const loadMore = useCallback(async () => {
    if (!hasNextPage || isLoading || !user || !endCursor) return;

    try {
      // const response = await GetCommentsByUserQuery.fetch(environment, {
      //   userId: user.userId,
      //   cursor: endCursor,
      //   limit: 20,
      // }).toPromise();
      // if (response?.commentsByUser) {
      //   setComments((prev) => [
      //     ...prev,
      //     ...response.commentsByUser.edges.map((edge) => edge.node),
      //   ]);
      //   setHasNextPage(response.commentsByUser.pageInfo.hasNextPage);
      //   setEndCursor(response.commentsByUser.pageInfo.endCursor);
      // }
    } catch (err) {
      console.error("추가 댓글 목록 조회 중 오류 발생:", err);
    }
  }, [hasNextPage, isLoading, user, endCursor]);

  const refresh = useCallback(() => {
    return fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    isLoading,
    error,
    hasNextPage,
    loadMore,
    refresh,
  };
}
