import { useState } from "react";

import { useAuth } from "@app/hooks/api/useAuth";

export function useSimpleMessage() {
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (receiverId: number, message: string) => {
    if (!user) {
      setError("로그인이 필요합니다.");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      await new Promise((resolve, reject) => {
        SendSimpleMessageMutation.commit(
          environment,
          {
            userId: user.userId,
            receiverId,
            message,
          },
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          },
        );
      });
    } catch (err) {
      setError("쪽지 전송에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendMessage,
    isSending,
    error,
  };
}
