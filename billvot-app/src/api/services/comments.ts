import { restClient } from "../rest/client";

export interface Comment {
  id: number;
  content: string;
  nickname: string;
  user_id: number | null;
  likes_count: number;
  created_at: string;
  replies?: Comment[];
}

export interface CreateCommentParams {
  content: string;
  nickname: string;
  user_id?: number;
  parent_id?: number;
}

export const commentsService = {
  // 댓글 목록 조회
  getByBillId: async (billId: number): Promise<Comment[]> => {
    const response = await restClient.get<Comment[]>(`/votes/${billId}/comments`);
    return response.data;
  },

  // 댓글 작성
  create: async (billId: number, params: CreateCommentParams): Promise<Comment> => {
    const response = await restClient.post<Comment>(`/votes/${billId}/comments`, params);
    return response.data;
  },

  // 댓글 수정
  update: async (billId: number, commentId: number, content: string): Promise<Comment> => {
    const response = await restClient.patch<Comment>(`/votes/${billId}/comments/${commentId}`, { content });
    return response.data;
  },

  // 댓글 삭제
  delete: async (billId: number, commentId: number): Promise<void> => {
    await restClient.delete(`/votes/${billId}/comments/${commentId}`);
  },

  // 좋아요
  like: async (billId: number, commentId: number): Promise<{ likes_count: number }> => {
    const response = await restClient.post<{ likes_count: number }>(`/votes/${billId}/comments/${commentId}/like`);
    return response.data;
  },
};
