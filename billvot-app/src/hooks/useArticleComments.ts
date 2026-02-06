import { useState, useEffect } from "react";
import { commentService } from "@app/api/rest/services";
import { Comment, ArticleCommentResponse } from "@app/api/rest/types";

// API 응답을 Comment 타입으로 변환하는 함수 (재귀적으로 childComments 처리)
const convertToComment = (response: ArticleCommentResponse): Comment => {
  return {
    commentId: response.id, // UUID를 그대로 사용
    originalId: response.id, // 원래 UUID 저장
    content: response.content,
    user: {
      id: response.userId,
      email: "",
      name: response.userNickname,
      nickname: response.userNickname,
      role: "일반",
      isOAuth2User: false,
    },
    createdAt: response.createdAt,
    updatedAt: response.createdAt, // API에 updatedAt이 없으므로 createdAt 사용
    replies: response.childComments.map(convertToComment), // 재귀적으로 대댓글 변환
    likeCount: response.likeCount,
    isLiked: false,
  };
};

export const useArticleComments = (articleId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    if (!articleId) return;
    
    console.log("댓글 로드 시작:", articleId);
    setLoading(true);
    setError(null);
    try {
      const response = await commentService.getArticleComments(articleId) as unknown as ArticleCommentResponse[];
      console.log("댓글 API 응답:", response);
      
      // API 응답을 Comment 타입으로 변환 (childComments 포함)
      const convertedComments: Comment[] = response.map(convertToComment);
      console.log("변환된 댓글:", convertedComments);
      
      setComments(convertedComments);
    } catch (err: unknown) {
      console.error("댓글 로드 중 오류:", err);
      setError("댓글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  return { comments, loading, error, refetch: fetchComments };
};

export const useArticleCommentCreate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createComment = async (articleId: string, content: string, parentCommentId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await commentService.createComment({
        articleId,
        content,
        parentCommentId,
      });
      return response;
    } catch (err: unknown) {
      console.error("댓글 작성 중 오류:", err);
      setError("댓글 작성에 실패했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createComment, loading, error };
};

export const useArticleCommentUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateComment = async (commentId: string, content: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await commentService.updateComment(commentId, { content });
      return response;
    } catch (err: unknown) {
      console.error("댓글 수정 중 오류:", err);
      setError("댓글 수정에 실패했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateComment, loading, error };
};

export const useArticleCommentDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteComment = async (commentId: string) => {
    setLoading(true);
    setError(null);
    try {
      await commentService.deleteComment(commentId);
      return true;
    } catch (err: unknown) {
      console.error("댓글 삭제 중 오류:", err);
      setError("댓글 삭제에 실패했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteComment, loading, error };
};
