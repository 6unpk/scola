import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { styled } from "@app/styles";
import BaseInput from "@app/components/BaseInput";
import BaseButton from "@app/components/BaseButton";
import PageHeader from "@app/components/PageHeader";
import { restClient } from "@app/api/rest/services";

interface TempPasswordRequest {
  email: string;
  name: string;
}

const FindPasswordContainer = styled("div", {
  minHeight: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const FindPasswordForm = styled("div", {
  flex: 1,
  padding: "24px 16px",
  display: "flex",
  flexDirection: "column",
  minHeight: "calc(100dvh - 120px)", // 헤더 높이 고려
});

const FormTitle = styled("h1", {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#000",
  margin: "0 0 8px 0",
});

const FormSubtitle = styled("p", {
  fontSize: "16px",
  color: "#000",
  margin: "0 0 32px 0",
});

const InputGroup = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  marginBottom: "32px",
});

const ErrorMessage = styled("p", {
  fontSize: "12px",
  color: "#ff4444",
  margin: "4px 0 0 0",
});

const SuccessMessage = styled("p", {
  fontSize: "12px",
  color: "#15D278",
  margin: "4px 0 0 0",
});

const NextButton = styled(BaseButton, {
  backgroundColor: "rgba(21, 210, 120, 0.16)",
  color: "#15D278",
  border: "1px solid #15D278",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "500",
  marginTop: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "sticky",
  bottom: "16px",
  zIndex: 10,

  "&:hover": {
    backgroundColor: "rgba(21, 210, 120, 0.24)",
  },

  "&:disabled": {
    backgroundColor: "#f0f0f0",
    color: "#999",
    border: "1px solid #f0f0f0",
  },
});

const BackToLoginLink = styled("div", {
  textAlign: "center",
  marginTop: "16px",
  fontSize: "14px",
  color: "#5f6368",

  "& a": {
    color: "#5f6368",
    textDecoration: "underline",
    cursor: "pointer",

    "&:hover": {
      textDecoration: "underline",
    },
  },
});

function FindPasswordPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFindPassword = async () => {
    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }

    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }

    if (!validateEmail(email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await restClient.post("/auth/temp-password", {
        email: email.trim(),
        name: name.trim(),
      });
      
      setSuccess(response.data.message);
      setIsLoading(false);
      
      // 카운트다운 시작
      setCountdown(3);
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            navigate("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (err: any) {
      console.error("임시 비밀번호 발급 실패:", err);
      
      // API 에러 메시지 처리
      const errorMessage = err?.response?.data?.message || "임시 비밀번호 발급에 실패했습니다.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <FindPasswordContainer>
      <PageHeader
        title=""
        leftButton={{ icon: "back", onClick: () => navigate(-1) }}
      />
      <FindPasswordForm>
        <FormTitle>새 비밀번호 받기</FormTitle>
        <FormSubtitle>가입정보 확인</FormSubtitle>

        <InputGroup>
          <div>
            <BaseInput
              label="이름"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) {
                  setError("");
                }
              }}
              height="48px"
              disabled={isLoading}
            />
          </div>

          <div>
            <BaseInput
              label="이메일"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) {
                  setError("");
                }
              }}
              height="48px"
              disabled={isLoading}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && (
              <SuccessMessage>
                {success}
                {countdown > 0 && ` (${countdown}초 후 로그인 페이지로 이동합니다)`}
              </SuccessMessage>
            )}
          </div>
        </InputGroup>

        <NextButton
          width="100%"
          height={48}
          onClick={handleFindPassword}
          disabled={!name || !email || isLoading}
        >
          {isLoading ? "전송 중..." : "임시 비밀번호 받기"}
        </NextButton>
      </FindPasswordForm>
    </FindPasswordContainer>
  );
}

export default FindPasswordPage;
