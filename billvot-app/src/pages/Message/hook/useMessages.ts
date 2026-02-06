import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { route } from "@app/pages/route";
import { useAuth } from "@app/hooks/api/useAuth";

interface UseMessagesReturn {
  messages: any[]; // TODO: 타입 정의
  isLoading: boolean;
  error: string | null;
  handleMessageClick: (otherUserName: string) => void;
  formatDate: (dateString: string) => string;
}

export function useMessages(): UseMessagesReturn {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]); // TODO: 타입 정정
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error("Unauthorized");
      }

      // const response = await GetSimpleMessagesQuery.fetch(environment, {
      //   input: {
      //     limit: 20,
      //   },
      // }).toPromise();

      // if (response?.getMySimpleMessage) {
      //   setMessages(response.getMySimpleMessage.edges.map((edge) => edge.node));
      // }
    } catch (err) {
      console.error("쪽지 목록 조회 중 오류 발생:", err);
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        alert("로그인이 필요합니다.");
        navigate(route.LOGIN);
        return;
      }
      setError("쪽지 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate, user]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleMessageClick = useCallback((otherUserName: string) => {
    // TODO: 쪽지 상세 페이지로 이동
    console.log("대화 상대:", otherUserName);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
  }, []);

  return {
    messages,
    isLoading,
    error,
    handleMessageClick,
    formatDate,
  };
}
