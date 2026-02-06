import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { styled } from "@app/styles";
import BaseInput from "@app/components/BaseInput";
import BaseButton from "@app/components/BaseButton";
import PageHeader from "@app/components/PageHeader";
import { authService } from "@app/api/rest/services";

const FindEmailContainer = styled("div", {
  minHeight: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const FindEmailForm = styled("div", {
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

const ResultContainer = styled("div", {
  marginTop: "16px",
  padding: "16px",
  backgroundColor: "#f0fdf4",
  borderRadius: "8px",
  border: "1px solid #86efac",
});

const ResultLabel = styled("p", {
  fontSize: "12px",
  color: "#16a34a",
  fontWeight: "500",
  margin: "0 0 4px 0",
});

const ResultEmail = styled("p", {
  fontSize: "18px",
  color: "#166534",
  fontWeight: "600",
  margin: 0,
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

function FindEmailPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  const validatePhoneNumber = (phone: string) => {
    // 한국 전화번호 형식 검증 (010-xxxx-xxxx, 010xxxxxxxx 등)
    const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/;
    return phoneRegex.test(phone.replace(/-/g, ""));
  };

  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, "");

    // 자동으로 하이픈 추가
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    }
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleFindEmail = async () => {
    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }

    if (!phoneNumber.trim()) {
      setError("전화번호를 입력해주세요.");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError("올바른 전화번호 형식을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMaskedEmail("");

    try {
      const response = await authService.findEmail({
        name: name.trim(),
        phoneNumber: phoneNumber.replace(/-/g, ""),
      });

      setMaskedEmail(response.maskedEmail);
      setIsLoading(false);
    } catch (err: any) {
      console.error("이메일 찾기 실패:", err);

      // API 에러 메시지 처리
      const errorMessage =
        err?.response?.data?.message || "해당 정보로 가입된 계정을 찾을 수 없습니다.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <FindEmailContainer>
      <PageHeader
        title=""
        leftButton={{ icon: "back", onClick: () => navigate(-1) }}
      />
      <FindEmailForm>
        <FormTitle>아이디 찾기</FormTitle>
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
              label="전화번호"
              placeholder="010-0000-0000"
              value={phoneNumber}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                setPhoneNumber(formatted);
                if (error) {
                  setError("");
                }
              }}
              height="48px"
              disabled={isLoading}
              maxLength={13}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {maskedEmail && (
              <ResultContainer>
                <ResultLabel>가입하신 이메일 주소</ResultLabel>
                <ResultEmail>{maskedEmail}</ResultEmail>
              </ResultContainer>
            )}
          </div>
        </InputGroup>

        <NextButton
          width="100%"
          height={48}
          onClick={handleFindEmail}
          disabled={!name || !phoneNumber || isLoading}
        >
          {isLoading ? "확인 중..." : "아이디 찾기"}
        </NextButton>
      </FindEmailForm>
    </FindEmailContainer>
  );
}

export default FindEmailPage;
