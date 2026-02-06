import { useState } from "react";

import { styled } from "@app/styles";
import { useAuthStore } from "@app/store/useAuthStore";
import { useCommunityCommentCreate } from "@app/hooks/useCommunityComments";
import Send from "@app/assets/send.svg?react";

import BaseInput from "./BaseInput";

const Container = styled("div", {
  width: "100%",
  background: "white",
  boxSizing: "border-box",
  padding: "4px",
});

const InputContainer = styled("div", {
  display: "flex",
  alignItems: "center",
});

const SendButton = styled("span", {
  width: "46px",
  height: "46px",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",

  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  path: {
    fill: "#9CA3AF",
  },
});

const LoginPrompt = styled("div", {
  textAlign: "center",
  padding: "20px",
  color: "#6B7280",
  fontSize: "14px",
});

interface CommunityCommentInputProps {
  postId: string;
  parentCommentId?: string;
  onCommentCreated?: () => void;
  placeholder?: string;
}

function CommunityCommentInput({
  postId,
  parentCommentId,
  onCommentCreated,
  placeholder,
}: CommunityCommentInputProps) {
  const [content, setContent] = useState("");
  const { user, isAuthenticated, openLoginModal } = useAuthStore();
  const { createComment, loading: isSubmitting } = useCommunityCommentCreate();

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      openLoginModal();
      return;
    }

    if (!content.trim() || isSubmitting) return;

    try {
      await createComment(postId, content.trim(), parentCommentId);
      setContent("");
      onCommentCreated?.();
    } catch (error) {
      console.error("댓글 작성 중 오류:", error);
      alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <LoginPrompt>
          댓글을 작성하려면 로그인이 필요합니다.
        </LoginPrompt>
      </Container>
    );
  }

  return (
    <Container>
      <InputContainer>
        <BaseInput
          placeholder={placeholder || (parentCommentId ? "답글을 입력하세요" : "댓글을 입력하세요")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSubmitting}
        />
        <SendButton>
          <Send onClick={handleSubmit} />
        </SendButton>
      </InputContainer>
    </Container>
  );
}

export default CommunityCommentInput;
