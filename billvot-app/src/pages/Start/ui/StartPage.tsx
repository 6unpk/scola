import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import Apple from "@app/assets/apple.png";
import Google from "@app/assets/google.png";
import SocialLoginButton from "@app/components/BaseButton";
import LogoSection from "@app/components/LogoSection";
import { route } from "@app/pages/route";
import PageHeader from "@app/components/PageHeader";
import { useAuth } from "@app/hooks/api/useAuth";

import { SignInWithApple } from "@capacitor-community/apple-sign-in";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { Capacitor } from "@capacitor/core";

import {
  LogoWrap,
  SignUpContainer,
  ButtonsWrap,
  SocialLoginButtonContainer,
  SocialLoginIcon,
  LogoTitle,
  LogoTitleText,
  LoginOrSignUpText,
} from "./container";

function StartPage() {
  const navigate = useNavigate();
  const { handleGoogleLogin, handleAppleLogin, user } = useAuth();

  const appleSignInOption = {
    clientId: "com.orionx.app",
    redirectURI: "https://teamorionx.com",
    scope: "email%20name",
    state: "secret",
    nonce: "nonce",
  };

  useEffect(() => {
    if (user) {
      navigate(route.FEED);
    }
  }, [user]);

  const handleAppleSignIn = async () => {
    try {
      const result = await SignInWithApple.authorize(appleSignInOption);
      const {
        response: { identityToken },
      } = result;

      if (identityToken) {
        handleAppleLogin(identityToken);
      } else {
        console.error("애플 로그인: 인증 토큰을 받지 못했습니다.");
      }
    } catch (error) {
      console.error("애플 로그인 오류:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const {
        authentication: { idToken },
      } = await GoogleAuth.signIn();

      if (idToken) {
        handleGoogleLogin(idToken);
      } else {
        console.error("구글 로그인: 인증 토큰을 받지 못했습니다.");
      }
    } catch (error) {
      console.error("구글 로그인 오류:", error);
    }
  };

  return (
    <SignUpContainer>
      <PageHeader title="" css={{ backgroundColor: "$background" }} />
      <LogoWrap>
        <LogoSection />
        <LogoTitle>
          <LogoTitleText>
            {"사장님들이 연결된 하나의 자리, 오리온X"}
          </LogoTitleText>
        </LogoTitle>
      </LogoWrap>
      <ButtonsWrap>
        <SocialLoginButton
          height={41}
          onClick={handleGoogleSignIn}
          css={{
            width: "calc(100% - 32px)",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            border: "none",
            borderRadius: "28px",
            backgroundColor: "rgba(255, 255, 255, 0.24)",
            color: "#fff",
            fontSize: "14px",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "28px",
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
          }}
        >
          <SocialLoginIcon src={Google as unknown as string} />
          <SocialLoginButtonContainer>
            {"지금 구글로그인 하기"}
          </SocialLoginButtonContainer>
        </SocialLoginButton>
        {Capacitor.getPlatform() === "ios" && (
          <SocialLoginButton
            id={"appleid-signin"}
            data-type="sign in"
            height={41}
            onClick={handleAppleSignIn}
            css={{
              width: "calc(100% - 32px)",
              marginTop: "12px",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.24)",
              border: "1px solid #000",
              borderRadius: "28px",
              color: "#000",
              fontWeight: 500,
              fontSize: "14px",
            }}
          >
            <SocialLoginIcon src={Apple as unknown as string} />
            <SocialLoginButtonContainer>
              {"지금 애플로그인 하기"}
            </SocialLoginButtonContainer>
          </SocialLoginButton>
        )}
        <LoginOrSignUpText>
          이메일로 <u onClick={() => navigate(route.LOGIN)}>로그인</u> 또는{" "}
          <u onClick={() => navigate(route.SIGNUP)}>회원가입</u> 하기
        </LoginOrSignUpText>
      </ButtonsWrap>
    </SignUpContainer>
  );
}

export default StartPage;
