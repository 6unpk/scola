import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@app/styles";
import { motion } from "framer-motion";
import LogoBillvot from "@app/assets/billvot.svg?react";
import CloseIcon from "@app/assets/close.svg?react";
import { authService } from "@app/api/services/auth";
import { useAuthStore } from "@app/store/useAuthStore";

const PageContainer = styled(motion.div, {
  width: "100%",
  minHeight: "100vh",
  backgroundColor: "$cg20",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "0 24px",
  boxSizing: "border-box",
  position: "relative",
});

const CloseButton = styled(motion.button, {
  position: "absolute",
  top: "16px",
  right: "16px",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const CloseIconStyled = styled(CloseIcon, {
  width: "24px",
  height: "24px",
  fill: "$cg900",
});

const LogoSection = styled(motion.div, {
  marginTop: "80px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
});

const LogoImage = styled(LogoBillvot, {
  height: "40px",
  width: "auto",
});

const Subtitle = styled("p", {
  fontSize: "14px",
  fontWeight: 500,
  color: "$cg500",
  margin: 0,
});

const FormSection = styled(motion.div, {
  width: "100%",
  maxWidth: "400px",
  marginTop: "48px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
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

const LoginButton = styled(motion.button, {
  width: "100%",
  padding: "14px",
  backgroundColor: "#C4B5FD",
  border: "none",
  borderRadius: "8px",
  color: "$primary",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
  marginTop: "8px",
});

const SignUpLink = styled(motion.button, {
  background: "none",
  border: "none",
  color: "$cg700",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
  textDecoration: "underline",
  marginTop: "8px",
});

const ErrorText = styled("p", {
  color: "#EF4444",
  fontSize: "13px",
  fontWeight: 500,
  margin: 0,
  textAlign: "center",
});

const SocialSection = styled(motion.div, {
  width: "100%",
  maxWidth: "400px",
  marginTop: "auto",
  marginBottom: "48px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const SocialButton = styled(motion.button, {
  width: "100%",
  padding: "14px",
  backgroundColor: "$white",
  border: "2px solid transparent",
  borderRadius: "24px",
  fontSize: "14px",
  fontWeight: 500,
  color: "$cg900",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  position: "relative",

  variants: {
    provider: {
      google: {
        background: "linear-gradient($white, $white) padding-box, linear-gradient(90deg, #EA4335, #FBBC05, #34A853, #4285F4) border-box",
      },
      apple: {
        borderColor: "$cg900",
      },
    },
  },
});

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M19.8055 10.2275C19.8055 9.51805 19.7499 8.83527 19.6277 8.17969H10.2V12.0519H15.6011C15.3566 13.3019 14.6233 14.3602 13.5455 15.0602V17.5797H16.8033C18.7011 15.8352 19.8055 13.2691 19.8055 10.2275Z" fill="#4285F4"/>
    <path d="M10.2 20C12.9 20 15.1711 19.1039 16.8033 17.5797L13.5455 15.0602C12.6366 15.6602 11.4822 16.0219 10.2 16.0219C7.5955 16.0219 5.38217 14.263 4.58439 11.9008H1.22217V14.4914C2.84328 17.7586 6.26883 20 10.2 20Z" fill="#34A853"/>
    <path d="M4.58439 11.9008C4.37328 11.3008 4.25328 10.6602 4.25328 10C4.25328 9.33977 4.37328 8.69922 4.58439 8.09922V5.50859H1.22217C0.543277 6.85859 0.155499 8.38477 0.155499 10C0.155499 11.6152 0.543277 13.1414 1.22217 14.4914L4.58439 11.9008Z" fill="#FBBC05"/>
    <path d="M10.2 3.97812C11.6011 3.97812 12.8566 4.48203 13.8388 5.47266L16.8777 2.43359C15.1666 0.828125 12.8955 0 10.2 0C6.26883 0 2.84328 2.24141 1.22217 5.50859L4.58439 8.09922C5.38217 5.73703 7.5955 3.97812 10.2 3.97812Z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M14.4375 10.5312C14.4297 8.71094 15.5703 7.39844 17.8828 6.44531C16.6797 4.76562 14.8125 3.86719 12.3203 3.71094C9.96094 3.5625 7.39844 5.16406 6.42969 5.16406C5.40625 5.16406 3.11719 3.78125 1.33594 3.78125C-2.35156 3.84375 -6.25 6.50781 -6.25 10.8516C-6.25 12.1406 -6.00781 13.4766 -5.52344 14.8516C-4.875 16.6875 -2.61719 21.2578 0.265625 21.1719C1.92188 21.1328 3.09375 20.0078 5.24219 20.0078C7.32031 20.0078 8.40625 21.1719 10.2656 21.1719C13.1797 21.1328 15.2031 17.0234 15.8125 15.1797C11.9922 13.3516 14.4375 10.6094 14.4375 10.5312ZM11.6719 2.10156C13.1328 0.375 12.9844 -1.21094 12.9375 -1.71875C11.6562 -1.64844 10.1562 -0.859375 9.30469 0.117188C8.375 1.17188 7.82031 2.48438 7.9375 3.69531C9.32812 3.80469 10.6094 3.10156 11.6719 2.10156Z" transform="translate(6.25 1.71875)" fill="black"/>
  </svg>
);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await authService.login({ email, password });
      const { user, token } = response.data;
      setAuth(user, token);
      navigate("/", { replace: true });
    } catch (err: any) {
      const message = err.response?.data?.status?.message || "로그인에 실패했습니다.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handleGoogleLogin = () => {
    console.log("Google login");
    // TODO: Implement Google login
  };

  const handleAppleLogin = () => {
    console.log("Apple login");
    // TODO: Implement Apple login
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <PageContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <CloseButton
        onClick={handleClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <CloseIconStyled />
      </CloseButton>

      <LogoSection variants={itemVariants}>
        <LogoImage />
        <Subtitle>내가 참여하는 법안 선호도</Subtitle>
      </LogoSection>

      <FormSection variants={itemVariants}>
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isLoading && handleLogin()}
        />
        {error && <ErrorText>{error}</ErrorText>}
        <LoginButton
          onClick={handleLogin}
          whileHover={!isLoading ? { scale: 1.02 } : undefined}
          whileTap={!isLoading ? { scale: 0.98 } : undefined}
          css={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </LoginButton>
        <SignUpLink
          onClick={handleSignUpClick}
          whileTap={{ scale: 0.95 }}
        >
          회원가입
        </SignUpLink>
      </FormSection>

      <SocialSection variants={itemVariants}>
        <SocialButton
          provider="google"
          onClick={handleGoogleLogin}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <GoogleIcon />
          구글 로그인하기
        </SocialButton>
        {/* TODO: 애플 로그인 구현 후 활성화
        <SocialButton
          provider="apple"
          onClick={handleAppleLogin}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AppleIcon />
          애플 로그인하기
        </SocialButton>
        */}
      </SocialSection>
    </PageContainer>
  );
}

export default LoginPage;
