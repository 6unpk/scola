import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

import { styled } from "@app/styles";
import Logo from "@app/assets/logo-primary.svg?react";
import Google from "@app/assets/google.png";
import Apple from "@app/assets/apple.png";

import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { SignInWithApple } from "@capacitor-community/apple-sign-in";

import { useAuth } from "../hooks/api/useAuth";
import { route } from "../pages/route";

import BaseModal from "./BaseModal";
import BaseInput from "./BaseInput";
import BaseButton from "./BaseButton";

// 로고 섹션
const LogoSection = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "12px",
});

const LogoImage = styled(Logo, {
  width: "60px",
  height: "60px",
  marginBottom: "16px",
});

const AppTitle = styled("h1", {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#2d5016",
  margin: "0 0 8px 0",
  letterSpacing: "0.5px",
});

const AppSlogan = styled("p", {
  fontSize: "14px",
  color: "#5a6c3d",
  margin: 0,
  textAlign: "center",
});

const SocialLoginIcon = styled("img", {
  width: "20px",
  height: "20px",
  marginRight: "8px",
});

const SocialLoginButtonContainer = styled("span", {
  display: "flex",
  alignItems: "center",
});

const ModalContent = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "8px 0",
});

const InputGroup = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const CheckboxContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "8px",
});

const Checkbox = styled("input", {
  width: "16px",
  height: "16px",
  cursor: "pointer",
});

const CheckboxLabel = styled("label", {
  fontSize: "14px",
  color: "#5f6368",
  cursor: "pointer",
  userSelect: "none",
});

const ButtonGroup = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const GoogleButton = styled(BaseButton, {
  width: "100%",
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "rgba(255, 255, 255, 0.24)",
  color: "#000",
  fontSize: "14px",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "8px",
    padding: "1.5px",
    background:
      "linear-gradient(90deg, #EB4132 0%, #FBBD00 34%, #30AA52 67.5%, #4086F4 100%)",
    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    maskComposite: "exclude",
    WebkitMask:
      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    pointerEvents: "none",
  },
});

const AppleButton = styled(BaseButton, {
  width: "100%",
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  border: "1px solid #000",
  borderRadius: "8px",
  backgroundColor: "#000",
  color: "#fff",
  fontSize: "14px",
});

const LoginButton = styled(BaseButton, {
  backgroundColor: "rgba(21, 210, 120, 0.16)",
  color: "#15D278",
  border: "1px solid #15D278",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "&:hover": {
    backgroundColor: "rgba(21, 210, 120, 0.24)",
  },

  "&:disabled": {
    backgroundColor: "#dadce0",
    color: "#9aa0a6",
    border: "1px solid #dadce0",
  },
});

const ErrorMessage = styled("div", {
  color: "#d93025",
  fontSize: "14px",
  textAlign: "center",
  marginTop: "8px",
});

const LoadingSpinner = styled("div", {
  width: "20px",
  height: "20px",
  border: "2px solid #f3f3f3",
  borderTop: "2px solid #1a73e8",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",

  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
});

const OrDivider = styled("div", {
  display: "flex",
  alignItems: "center",
  margin: "16px 0",

  "&::before": {
    content: '""',
    flex: 1,
    height: "1px",
    backgroundColor: "#dadce0",
  },

  "&::after": {
    content: '""',
    flex: 1,
    height: "1px",
    backgroundColor: "#dadce0",
  },
});

const OrText = styled("span", {
  padding: "0 16px",
  color: "#5f6368",
  fontSize: "14px",
});

const SignupLink = styled("div", {
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

const FindLinksContainer = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
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

  "& span": {
    color: "#5f6368",
  },
});

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const navigate = useNavigate();
  const {
    email,
    password,
    setEmail,
    setPassword,
    handleLogin,
    handleGoogleLogin,
    handleAppleLogin,
    user,
    isLoading,
    error,
  } = useAuth();

  const [rememberEmail, setRememberEmail] = useState(false);

  // 저장된 이메일 불러오기
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, [setEmail]);

  // 아이디 저장하기 체크박스 변경 처리
  const handleRememberEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setRememberEmail(checked);

    if (checked) {
      // 체크된 경우, 현재 이메일 저장
      if (email) {
        localStorage.setItem("savedEmail", email);
      }
    } else {
      // 체크 해제된 경우, 저장된 이메일 삭제
      localStorage.removeItem("savedEmail");
    }
  };

  // 로그인 성공 시 모달 닫기
  if (user && isOpen) {
    onClose();
  }

  const handleModalClose = () => {
    onClose();
  };

  const onEmailLogin = async () => {
    // 아이디 저장하기가 체크된 경우 이메일 저장
    if (rememberEmail && email) {
      localStorage.setItem("savedEmail", email);
    }
    await handleLogin();
  };

  const onGoogleLogin = async () => {
    console.log("onGoogleLogin 호출됨");
    
    const platform = Capacitor.getPlatform();
    const isWebBrowser = platform === 'web';
    console.log("Platform:", platform, "isWebBrowser:", isWebBrowser);
    
    if (!isWebBrowser) {
    try {
      const {
        authentication: { idToken },
      } = await GoogleAuth.signIn();

      console.log("GoogleAuth.signIn() 완료, idToken:", idToken);
      if (idToken) {
        try {
          await handleGoogleLogin(idToken);
          onClose();
        } catch (error: any) {
          console.log("Google login error:", error);
          
          const errorMessage = error?.response?.data?.message || error?.message || "";
          const isNewUser = 
            error?.status === 404 || 
            error?.response?.status === 404 ||
            errorMessage.includes("가입되지 않은 사용자") ||
            errorMessage.includes("OAuth2 가입을 먼저 진행해주세요");
          
          if (isNewUser) {
            console.log("신규 사용자로 판단, 회원가입 페이지로 이동");
            onClose();
            navigate("/signup/step2", { state: { idToken, provider: "google" } });
          } else {
            console.error("구글 로그인 실패:", error);
            throw error;
          }
        }
      } else {
        console.error("구글 로그인: 인증 토큰을 받지 못했습니다.");
      }
    } catch (error) {
      console.error("구글 로그인 오류:", error);
    }
    } else {
      console.log("웹 브라우저에서 구글 로그인 시도");
      try {
        await handleWebGoogleLogin();
      } catch (error) {
        console.error("웹 구글 로그인 오류:", error);
      }
    }
  };

  const handleWebGoogleLogin = async () => {
    const WEB_CLIENT_ID = "971660764142-spd7506j38af70vru2enup7epsqudcql.apps.googleusercontent.com";
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${WEB_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback')}&` +
      `response_type=id_token&` +
      `scope=openid%20email%20profile&` +
      `nonce=${Date.now()}`;
    
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      googleAuthUrl,
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      console.error("팝업이 차단되었습니다.");
      return;
    }

    const messageHandler = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS' && event.data.idToken) {
        window.removeEventListener('message', messageHandler);
        console.log("웹 구글 로그인 성공, idToken:", event.data.idToken);
        
        try {
          await handleGoogleLogin(event.data.idToken);
          onClose();
        } catch (error: any) {
          console.log("Google login error:", error);
          
          const errorMessage = error?.response?.data?.message || error?.message || "";
          const isNewUser = 
            error?.status === 404 || 
            error?.response?.status === 404 ||
            errorMessage.includes("가입되지 않은 사용자") ||
            errorMessage.includes("OAuth2 가입을 먼저 진행해주세요");
          
          if (isNewUser) {
            console.log("신규 사용자로 판단, 회원가입 페이지로 이동");
            onClose();
            navigate("/signup/step2", { state: { idToken: event.data.idToken, provider: "google" } });
          } else {
            console.error("구글 로그인 실패:", error);
          }
        }
      }
    };

    window.addEventListener('message', messageHandler);

    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        window.removeEventListener('message', messageHandler);
      }
    }, 1000);
  };

  const onAppleLogin = async () => {
    console.log("onAppleLogin 호출됨");

    const platform = Capacitor.getPlatform();
    console.log("Platform:", platform);

    // Apple Sign In은 iOS에서만 지원
    if (platform !== 'ios') {
      console.error("Apple Sign In은 iOS에서만 지원됩니다.");
      setError("Apple Sign In은 iOS에서만 지원됩니다.");
      return;
    }

    try {
      const result = await SignInWithApple.authorize({
        clientId: "com.prbridge.foodscanner",
        redirectURI: "https://foodscanner.kr",
        scopes: "email name",
        state: "secret",
        nonce: "nonce",
      });
      console.log("SignInWithApple.authorize() 완료, result:", result);

      if (result.response?.identityToken) {
        const idToken = result.response.identityToken;
        try {
          await handleAppleLogin(idToken);
          onClose();
        } catch (error: any) {
          console.log("Apple login error:", error);

          const errorMessage = error?.response?.data?.message || error?.message || "";
          const isNewUser =
            error?.status === 404 ||
            error?.response?.status === 404 ||
            errorMessage.includes("가입되지 않은 사용자") ||
            errorMessage.includes("OAuth2 가입을 먼저 진행해주세요");

          if (isNewUser) {
            console.log("신규 사용자로 판단, 회원가입 페이지로 이동");
            onClose();
            navigate("/signup/step2", { state: { idToken, provider: "apple" } });
          } else {
            console.error("애플 로그인 실패:", error);
            throw error;
          }
        }
      } else {
        console.error("애플 로그인: 인증 토큰을 받지 못했습니다.");
      }
    } catch (error) {
      console.error("애플 로그인 오류:", error);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleModalClose}
      title=""
      css={{ maxWidth: "400px" }}
    >
      <ModalContent>
        <LogoSection>
          <LogoImage />
          <AppTitle>FOOD SCANNER</AppTitle>
          <AppSlogan>건강한 식습관을 위한 첫 스캔</AppSlogan>
        </LogoSection>

        <InputGroup>
          <BaseInput
            type="email"
            height="38px"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            disabled={isLoading}
          />
          <BaseInput
            type="password"
            height="38px"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading && email && password) {
                onEmailLogin();
              }
            }}
            placeholder="비밀번호를 입력하세요"
            disabled={isLoading}
          />
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="rememberEmail"
              checked={rememberEmail}
              onChange={handleRememberEmailChange}
            />
            <CheckboxLabel htmlFor="rememberEmail">
              이메일 저장하기
            </CheckboxLabel>
          </CheckboxContainer>
        </InputGroup>

        <ButtonGroup>
          <LoginButton
            onClick={onEmailLogin}
            disabled={isLoading || !email || !password}
            width="100%"
            height={36}
          >
            {isLoading ? <LoadingSpinner /> : "로그인"}
          </LoginButton>
        </ButtonGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GoogleButton onClick={onGoogleLogin} disabled={isLoading} height={36}>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <SocialLoginIcon src={Google as unknown as string} />
              <SocialLoginButtonContainer>
                구글로 로그인하기
              </SocialLoginButtonContainer>
            </>
          )}
        </GoogleButton>

        {Capacitor.getPlatform() === 'ios' && (
          <AppleButton onClick={onAppleLogin} disabled={isLoading} height={36}>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <SocialLoginIcon src={Apple as unknown as string} />
                <SocialLoginButtonContainer>
                  Apple로 로그인하기
                </SocialLoginButtonContainer>
              </>
            )}
          </AppleButton>
        )}

        <FindLinksContainer>
          <a
            onClick={() => {
              onClose();
              navigate("/find-email");
            }}
          >
            아이디 찾기
          </a>
          <span>|</span>
          <a
            onClick={() => {
              onClose();
              navigate("/find-password");
            }}
          >
            비밀번호 찾기
          </a>
        </FindLinksContainer>

        <SignupLink>
          <a
            onClick={() => {
              onClose();
              navigate(route.SIGNUP);
            }}
          >
            푸드스캐너 회원가입
          </a>
        </SignupLink>
      </ModalContent>
    </BaseModal>
  );
};

export default LoginModal;
