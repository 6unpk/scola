import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@app/styles";
import { motion } from "framer-motion";
import LogoBillvot from "@app/assets/billvot.svg?react";
import ArrowBack from "@app/assets/arrow_back.svg?react";
import ChevronRight from "@app/assets/chevron_right.svg?react";
import { authService } from "@app/api/services/auth";
import { useAuthStore } from "@app/store/useAuthStore";

const PageContainer = styled(motion.div, {
  width: "100%",
  minHeight: "100vh",
  backgroundColor: "$white",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
});

const Header = styled("header", {
  width: "100%",
  height: "48px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
  boxSizing: "border-box",
  flexShrink: 0,
});

const BackButton = styled(motion.button, {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "8px",
  marginLeft: "-8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const BackIcon = styled(ArrowBack, {
  width: "24px",
  height: "24px",
  fill: "$cg900",
});

const LogoImage = styled(LogoBillvot, {
  height: "20px",
  width: "auto",
});

const ContentContainer = styled("div", {
  flex: 1,
  padding: "16px 24px",
  display: "flex",
  flexDirection: "column",
});

const Title = styled(motion.h1, {
  fontSize: "20px",
  fontWeight: 700,
  color: "$cg900",
  margin: "0 0 24px 0",
});

const FormSection = styled(motion.div, {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  flex: 1,
});

const InputGroup = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const Label = styled("label", {
  fontSize: "14px",
  fontWeight: 500,
  color: "$cg900",
});

const Input = styled("input", {
  width: "100%",
  padding: "12px 0",
  border: "none",
  borderBottom: "1px solid $cg300",
  backgroundColor: "transparent",
  fontSize: "14px",
  color: "$cg900",
  outline: "none",
  boxSizing: "border-box",

  "&::placeholder": {
    color: "$cg500",
  },

  "&:focus": {
    borderBottomColor: "$primary",
  },
});

const ErrorText = styled("span", {
  fontSize: "12px",
  color: "#F52F31",
});

const AgreementSection = styled(motion.div, {
  marginTop: "auto",
  paddingTop: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const CheckboxRow = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const CheckboxLabel = styled("label", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  fontSize: "14px",
  color: "$cg900",
});

const CheckboxWrapper = styled("div", {
  width: "20px",
  height: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
});

const CheckIcon = ({ checked }: { checked: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M4 10L8 14L16 6"
      stroke={checked ? "#7D5CFD" : "#98A5B3"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowButton = styled("button", {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ArrowIcon = styled(ChevronRight, {
  width: "20px",
  height: "20px",
  fill: "$cg500",
});

const SubmitButton = styled(motion.button, {
  width: "100%",
  padding: "14px",
  backgroundColor: "#C4B5FD",
  border: "none",
  borderRadius: "8px",
  color: "$primary",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
  marginTop: "16px",
  marginBottom: "24px",

  "&:disabled": {
    backgroundColor: "$cg100",
    color: "$cg500",
    cursor: "not-allowed",
  },
});

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

function SignUpPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // 약관 동의 상태
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const handleAgreeAll = () => {
    const newValue = !agreeAll;
    setAgreeAll(newValue);
    setAgreeTerms(newValue);
    setAgreePrivacy(newValue);
  };

  const handleAgreeTerms = () => {
    const newValue = !agreeTerms;
    setAgreeTerms(newValue);
    if (!newValue) setAgreeAll(false);
    else if (agreePrivacy) setAgreeAll(true);
  };

  const handleAgreePrivacy = () => {
    const newValue = !agreePrivacy;
    setAgreePrivacy(newValue);
    if (!newValue) setAgreeAll(false);
    else if (agreeTerms) setAgreeAll(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다.";
    }

    if (!passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호 확인을 입력해주세요.";
    } else if (password !== passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    if (!nickname.trim()) {
      newErrors.nickname = "닉네임을 입력해주세요.";
    }

    if (!agreeTerms || !agreePrivacy) {
      newErrors.agreement = "필수 약관에 동의해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authService.signUp({
        email,
        password,
        password_confirmation: passwordConfirm,
        name: nickname,
      });
      const { user, token } = response.data;
      setAuth(user, token);
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error("SignUp error:", error);
      const errorMessages = error.response?.data?.errors;
      if (errorMessages && Array.isArray(errorMessages)) {
        setErrors({ general: errorMessages.join(", ") });
      } else {
        setErrors({ general: "회원가입에 실패했습니다. 다시 시도해주세요." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isFormValid = email && password && passwordConfirm && nickname && agreeTerms && agreePrivacy;

  return (
    <PageContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Header>
        <BackButton
          onClick={handleBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <BackIcon />
        </BackButton>
        <LogoImage />
      </Header>

      <ContentContainer>
        <Title variants={itemVariants}>회원가입</Title>

        <FormSection variants={itemVariants}>
          <InputGroup>
            <Label>이메일</Label>
            <Input
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
            />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label>비밀번호</Label>
            <Input
              type="password"
              placeholder="비밀번호(영문, 숫자, 특수기호 포함)을 입력해주세요."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
              }}
            />
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label>비밀번호 확인</Label>
            <Input
              type="password"
              placeholder="동일한 비밀번호를 입력해주세요."
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                if (errors.passwordConfirm) setErrors((prev) => ({ ...prev, passwordConfirm: "" }));
              }}
            />
            {errors.passwordConfirm && <ErrorText>{errors.passwordConfirm}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label>닉네임</Label>
            <Input
              type="text"
              placeholder="사용할 닉네임을 입력해주세요"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (errors.nickname) setErrors((prev) => ({ ...prev, nickname: "" }));
              }}
            />
            {errors.nickname && <ErrorText>{errors.nickname}</ErrorText>}
          </InputGroup>

          <AgreementSection variants={itemVariants}>
            <CheckboxLabel onClick={handleAgreeAll}>
              <CheckboxWrapper>
                <CheckIcon checked={agreeAll} />
              </CheckboxWrapper>
              전체 동의
            </CheckboxLabel>

            <CheckboxRow>
              <CheckboxLabel onClick={handleAgreeTerms}>
                <CheckboxWrapper>
                  <CheckIcon checked={agreeTerms} />
                </CheckboxWrapper>
                서비스 이용약관 (필수)
              </CheckboxLabel>
              <ArrowButton>
                <ArrowIcon />
              </ArrowButton>
            </CheckboxRow>

            <CheckboxRow>
              <CheckboxLabel onClick={handleAgreePrivacy}>
                <CheckboxWrapper>
                  <CheckIcon checked={agreePrivacy} />
                </CheckboxWrapper>
                개인정보수집/이용 동의 (필수)
              </CheckboxLabel>
              <ArrowButton>
                <ArrowIcon />
              </ArrowButton>
            </CheckboxRow>

            {errors.agreement && <ErrorText>{errors.agreement}</ErrorText>}
            {errors.general && <ErrorText>{errors.general}</ErrorText>}
          </AgreementSection>

          <SubmitButton
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            whileHover={isFormValid ? { scale: 1.02 } : undefined}
            whileTap={isFormValid ? { scale: 0.98 } : undefined}
          >
            {isLoading ? "가입 중..." : "회원가입 완료"}
          </SubmitButton>
        </FormSection>
      </ContentContainer>
    </PageContainer>
  );
}

export default SignUpPage;
