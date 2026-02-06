import { useState, useCallback } from "react";

interface UseCommentLikeReturn {
  isLiking: boolean;
  likeComment: (commentId: number) => Promise<boolean>;
  unlikeComment: (commentId: number) => Promise<boolean>;
  toggleLike: (commentId: number, isLiked: boolean) => Promise<boolean>;
}

export function useCommentLike(): UseCommentLikeReturn {
  const [isLiking, setIsLiking] = useState(false);

  const likeComment = useCallback(
    async (commentId: number): Promise<boolean> => {
      setIsLiking(true);

      try {
        return new Promise<boolean>((resolve, reject) => {
          LikeCommentMutation.commit(
            environment,
            commentId,
            (response) => {
              if (response.likeComment) {
                resolve(true);
              } else {
                reject(new Error("좋아요 실패"));
              }
            },
            (error) => {
              console.error("댓글 좋아요 중 오류:", error);
              reject(error);
            },
          );
        });
      } catch (error) {
        console.error("댓글 좋아요 중 오류 발생:", error);
        return false;
      } finally {
        setIsLiking(false);
      }
    },
    [],
  );

  const unlikeComment = useCallback(
    async (commentId: number): Promise<boolean> => {
      setIsLiking(true);

      try {
        return new Promise<boolean>((resolve, reject) => {
          UnlikeCommentMutation.commit(
            environment,
            commentId,
            (response) => {
              if (response.unlikeComment) {
                resolve(true);
              } else {
                reject(new Error("좋아요 취소 실패"));
              }
            },
            (error) => {
              console.error("댓글 좋아요 취소 중 오류:", error);
              reject(error);
            },
          );
        });
      } catch (error) {
        console.error("댓글 좋아요 취소 중 오류 발생:", error);
        return false;
      } finally {
        setIsLiking(false);
      }
    },
    [],
  );

  const toggleLike = useCallback(
    async (commentId: number, isLiked: boolean): Promise<boolean> => {
      if (isLiking) return false;

      try {
        if (isLiked) {
          return await unlikeComment(commentId);
        } else {
          return await likeComment(commentId);
        }
      } catch (error) {
        console.error("댓글 좋아요 토글 중 오류 발생:", error);
        return false;
      }
    },
    [isLiking, likeComment, unlikeComment],
  );

  return {
    isLiking,
    likeComment,
    unlikeComment,
    toggleLike,
  };
}
