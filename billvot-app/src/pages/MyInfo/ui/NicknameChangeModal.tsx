import { useState } from "react";

import { styled } from "@app/styles";
import { BaseModal } from "@app/components/Modal";
import BaseInput from "@app/components/BaseInput";
import DefaultButton from "@app/components/DefaultButton";
import { useAuth } from "@app/hooks/api/useAuth";
import { useUserUpdate } from "@app/hooks/useUserUpdate";
import { useAuthStore } from "@app/store/useAuthStore";

import type { CSS } from "@stitches/react";

const ModalContent = styled("div", {
  padding: "20px 16px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const Title = styled("div", {
  fontSize: "18px",
  fontWeight: "bold",
  textAlign: "center",
  padding: "12px 12px 8px 12px",
});

const Description = styled("div", {
  fontSize: "14px",
  color: "$cg500",
  marginBottom: "8px",
});

interface NicknameChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  css?: CSS;
}

function NicknameChangeModal({
  isOpen,
  onClose,
  css,
}: NicknameChangeModalProps) {
  const [nickname, setNickname] = useState("");
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const { updateUser, isLoading, error } = useUserUpdate();

  const handleNicknameChange = async () => {
    if (!nickname.trim()) {
      alert("새로 사용할 닉네임을 입력해주세요.");
      return;
    }

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const updatedUser = await updateUser({
        name: user.name || user.nickname || "",
        nickname: nickname.trim(),
        avoidIngredients: user.avoidIngredients || [],
        healthInfo: user.healthInfo || [],
      });

      if (updatedUser) {
        setUser(updatedUser);
        alert("닉네임이 성공적으로 변경되었습니다.");
        onClose();
      } else {
        alert("닉네임 변경에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("닉네임 변경 중 오류 발생:", error);
      alert("닉네임 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <Title>닉네임 변경</Title>
      <ModalContent css={css}>
        <div>
          <Description>새로 사용할 닉네임 입력</Description>
          <BaseInput
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="새로운 닉네임을 입력해주세요"
          />
        </div>
        <DefaultButton onClick={handleNicknameChange} disabled={isLoading}>
          {isLoading ? "변경 중..." : "닉네임 변경하기"}
        </DefaultButton>
        {error && (
          <div style={{ color: "#d93025", fontSize: "12px", textAlign: "center" }}>
            {error}
          </div>
        )}
      </ModalContent>
    </BaseModal>
  );
}

export default NicknameChangeModal;
