import { useState, useEffect } from "react";
import { communityService } from "@app/api/rest/services";
import { CommunityComment } from "@app/api/rest/types";
import { PageableResponse } from "@app/api/rest/client";
import { useAuthStore } from "@app/store/useAuthStore";
import { filterBlockedComments } from "@app/utils/blockUserFilter";

export const useCommunityComments = (postId: string, page = 0, size = 20) => {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchComments = async () => {
    if (!postId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response: PageableResponse<CommunityComment> = await communityService.getPostComments(postId, page, size);
      const allComments = response.result || [];
      // 차단된 사용자의 댓글 필터링
      const filteredComments = filterBlockedComments(allComments);
      setComments(filteredComments);
      setTotalPages(Math.ceil(response.total / response.limit) || 0);
      setTotalElements(response.total || 0);
    } catch (err: any) {
      setError(err.message || "댓글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId, page, size]);

  return { comments, loading, error, totalPages, totalElements, refetch: fetchComments };
};

export const useCommunityCommentCreate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createComment = async (postId: string, content: string, parentCommentId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityService.createComment({
        postId,
        content,
        parentCommentId,
      });
      return response;
    } catch (err: any) {
      setError(err.message || "댓글 작성에 실패했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createComment, loading, error };
};

export const useCommunityCommentUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateComment = async (commentId: string, content: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityService.updateComment(commentId, content);
      return response;
    } catch (err: any) {
      setError(err.message || "댓글 수정에 실패했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateComment, loading, error };
};

export const useCommunityCommentDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteComment = async (commentId: string) => {
    setLoading(true);
    setError(null);
    try {
      await communityService.deleteComment(commentId);
      return true;
    } catch (err: any) {
      setError(err.message || "댓글 삭제에 실패했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteComment, loading, error };
};

export const useCommunityCommentLike = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, openLoginModal } = useAuthStore();

  const toggleLike = async (commentId: string) => {
    if (!user) {
      openLoginModal();
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      await communityService.toggleCommentLike({ commentId });
      return true;
    } catch (err: any) {
      setError(err.message || "좋아요 처리에 실패했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { toggleLike, loading, error };
};
