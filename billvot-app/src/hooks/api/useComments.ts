import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsService, type Comment, type CreateCommentParams } from "@app/api/services";

// 댓글 목록 조회
export const useComments = (billId: number) => {
  return useQuery<Comment[]>({
    queryKey: ["comments", billId],
    queryFn: () => commentsService.getByBillId(billId),
    enabled: !!billId,
  });
};

// 댓글 작성
export const useCreateComment = (billId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateCommentParams) => commentsService.create(billId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", billId] });
    },
  });
};

// 댓글 수정
export const useUpdateComment = (billId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      commentsService.update(billId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", billId] });
    },
  });
};

// 댓글 삭제
export const useDeleteComment = (billId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => commentsService.delete(billId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", billId] });
    },
  });
};

// 좋아요
export const useLikeComment = (billId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => commentsService.like(billId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", billId] });
    },
  });
};
