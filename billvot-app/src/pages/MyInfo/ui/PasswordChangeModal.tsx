import { useState } from "react";

import { styled } from "@app/styles";
import { BaseModal } from "@app/components/Modal";
import BaseInput from "@app/components/BaseInput";
import DefaultButton from "@app/components/DefaultButton";
import { authService } from "@app/api/rest/services";

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

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  css?: CSS;
}

function PasswordChangeModal({
  isOpen,
  onClose,
  css,
}: PasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validatePassword = (password: string) => {
    // 8자 이상, 특수문자 포함
    const passwordRegex = /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = async () => {
    setError(null);

    if (!currentPassword) {
      alert("이전 비밀번호를 입력해주세요.");
      return;
    }
    if (!newPassword) {
      alert("새 비밀번호를 입력해주세요.");
      return;
    }
    if (!validatePassword(newPassword)) {
      alert("새 비밀번호는 특수문자를 포함하여 8자 이상이어야 합니다.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
      });
      
      alert("비밀번호가 성공적으로 변경되었습니다.");
      onClose();
    } catch (error: any) {
      console.error("비밀번호 변경 중 오류:", error);
      const errorMessage = error?.response?.data?.message || "비밀번호 변경에 실패했습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <Title>비밀번호 변경</Title>
      <ModalContent css={css}>
        <div>
          <Description>이전 비밀번호 입력</Description>
          <BaseInput
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="이전 비밀번호를 입력해주세요"
          />
        </div>
        <div>
          <Description>새 비밀번호 입력</Description>
          <BaseInput
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="영문, 숫자, 특수기호를 활용한 8자 이상"
          />
        </div>
        <div>
          <Description>새 비밀번호 확인</Description>
          <BaseInput
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="새 비밀번호를 다시 입력해주세요"
          />
        </div>
        <DefaultButton onClick={handlePasswordChange} disabled={isLoading}>
          {isLoading ? "변경 중..." : "비밀번호 변경하기"}
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

export default PasswordChangeModal;
