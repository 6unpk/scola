import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  billsService,
  Bill,
  CreateBillParams,
  UpdateBillParams,
  VoteType,
  VoteStatusResponse,
} from "@app/api/services";

export const BILLS_QUERY_KEY = ["bills"];
export const BILLS_SEARCH_QUERY_KEY = ["billsSearch"];
export const VOTE_STATUS_QUERY_KEY = ["voteStatus"];

import { useAuthStore } from "@app/store/useAuthStore";

// 법안 목록 조회
export const useBills = () => {
  return useQuery<Bill[], Error>({
    queryKey: BILLS_QUERY_KEY,
    queryFn: billsService.getAll,
  });
};

// 법안 상세 조회
export const useBill = (id: number) => {
  return useQuery<Bill, Error>({
    queryKey: [...BILLS_QUERY_KEY, id],
    queryFn: () => billsService.getById(id),
    enabled: !!id,
  });
};

// 법안 생성
export const useCreateBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateBillParams) => billsService.create(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLS_QUERY_KEY });
    },
  });
};

// 법안 수정
export const useUpdateBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, params }: { id: number; params: UpdateBillParams }) =>
      billsService.update(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLS_QUERY_KEY });
    },
  });
};

// 법안 삭제
export const useDeleteBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => billsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLS_QUERY_KEY });
    },
  });
};

// 투표 상태 조회
export const useVoteStatus = (billId: number) => {
  const userId = useAuthStore.getState().user?.id;

  return useQuery<VoteStatusResponse, Error>({
    queryKey: [...VOTE_STATUS_QUERY_KEY, billId, userId],
    queryFn: () => billsService.getVoteStatus(billId, userId?.toString()),
    enabled: !!billId,
  });
};

// 투표하기
export const useVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ billId, voteType }: { billId: number; voteType: VoteType }) => {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        throw new Error("로그인이 필요합니다.");
      }
      return billsService.vote(billId, voteType, userId.toString());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...VOTE_STATUS_QUERY_KEY, variables.billId] });
      queryClient.invalidateQueries({ queryKey: [...BILLS_QUERY_KEY, variables.billId] });
      queryClient.invalidateQueries({ queryKey: BILLS_QUERY_KEY });
    },
  });
};

// 법안 검색
export const useSearchBills = (query: string) => {
  return useQuery<Bill[], Error>({
    queryKey: [...BILLS_SEARCH_QUERY_KEY, query],
    queryFn: () => billsService.search(query),
    enabled: query.length > 0,
  });
};
