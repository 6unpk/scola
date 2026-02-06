import { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";

import { route } from "@app/pages/route";
import { useAuth } from "@app/hooks/api/useAuth";

interface UseDirectMessagesReturn {
  messages: any[]; // TODO: 타입 정의
  isLoading: boolean;
  error: string | null;
  hasNextPage: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useDirectMessages(
  otherUserId: number,
): UseDirectMessagesReturn {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]); // TODO: 타입 정의
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<number | null>(null);

  const fetchMessages = useCallback(
    async (cursor?: number) => {
      if (!user) {
        setError("로그인이 필요합니다.");
        navigate(route.LOGIN);
        return;
      }

      try {
        // setError(null);
        // const response = await GetDirectMessagesQuery.fetch(environment, {
        //   input: {
        //     otherUserId,
        //     cursor,
        //     limit: 20,
        //   },
        // }).toPromise();
        // if (response?.getDirectMessages) {
        //   const { edges, pageInfo } = response.getDirectMessages;
        //   const newMessages = edges.map((edge) => edge.node);
        //   if (cursor) {
        //     setMessages((prev) => [...prev, ...newMessages]);
        //   } else {
        //     setMessages(newMessages);
        //   }
        //   setHasNextPage(pageInfo.hasNextPage);
        //   setEndCursor(pageInfo.endCursor);
        // }
      } catch (err) {
        console.error("메시지를 불러오는데 실패했습니다:", err);
        setError("메시지를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    },
    [user, otherUserId, navigate],
  );

  const loadMore = useCallback(async () => {
    if (hasNextPage && endCursor) {
      await fetchMessages(endCursor);
    }
  }, [hasNextPage, endCursor, fetchMessages]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    return fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    hasNextPage,
    loadMore,
    refresh,
  };
}
