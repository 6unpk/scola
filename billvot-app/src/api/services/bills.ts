import { restClient } from "../rest/client";

export type Bill = {
  id: number;
  title: string;
  content: string;
  author: string;
  bill_number: string | null;
  proposed_date: string | null;
  session: string | null;
  process_step: string | null;
  committee: string | null;
  external_url: string | null;
  agree_count: number;
  disagree_count: number;
  agree_percent: number;
  disagree_percent: number;
  total_votes: number;
  created_at: string;
  updated_at: string;
};

export type CreateBillParams = {
  title: string;
  description: string;
};

export type UpdateBillParams = Partial<CreateBillParams>;

export type VoteType = "agree" | "disagree";

export type VoteResponse = {
  status: { code: number; message: string };
  data: {
    vote_type: VoteType;
    agree_count: number;
    disagree_count: number;
    agree_percent: number;
    disagree_percent: number;
  };
};

export type VoteStatusResponse = {
  agree_count: number;
  disagree_count: number;
  agree_percent: number;
  disagree_percent: number;
  total_votes: number;
  user_vote: VoteType | null;
};

export const billsService = {
  // 법안 목록 조회
  getAll: async (): Promise<Bill[]> => {
    const response = await restClient.get<Bill[]>("/votes");
    return response.data;
  },

  // 법안 상세 조회
  getById: async (id: number): Promise<Bill> => {
    const response = await restClient.get<Bill>(`/votes/${id}`);
    return response.data;
  },

  // 법안 생성
  create: async (params: CreateBillParams): Promise<Bill> => {
    const response = await restClient.post<Bill>("/votes", { vote: params });
    return response.data;
  },

  // 법안 수정
  update: async (id: number, params: UpdateBillParams): Promise<Bill> => {
    const response = await restClient.patch<Bill>(`/votes/${id}`, { vote: params });
    return response.data;
  },

  // 법안 삭제
  delete: async (id: number): Promise<void> => {
    await restClient.delete(`/votes/${id}`);
  },

  // 투표하기
  vote: async (billId: number, voteType: VoteType, userId?: string): Promise<VoteResponse> => {
    const response = await restClient.post<VoteResponse>(`/votes/${billId}/bill_votes`, {
      vote_type: voteType,
      user_id: userId,
    });
    return response.data;
  },

  // 투표 상태 조회
  getVoteStatus: async (billId: number, userId?: string): Promise<VoteStatusResponse> => {
    const response = await restClient.get<VoteStatusResponse>(
      `/votes/${billId}/bill_votes/status`,
      { params: { user_id: userId } }
    );
    return response.data;
  },

  // 법안 검색
  search: async (query: string): Promise<Bill[]> => {
    const response = await restClient.get<Bill[]>("/votes/search", {
      params: { q: query },
    });
    return response.data;
  },
};
