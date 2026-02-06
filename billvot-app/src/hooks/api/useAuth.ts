import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

import { authService, AuthResponse } from "@app/api/rest/services";
import { route } from "@app/pages/route";
import { useAuthStore, User } from "@app/store/useAuthStore";
import { removeFcmToken, sendFcmTokenToServer } from "@app/utils/fcmToken";

interface UseAuthReturn {
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  handleLogin: () => Promise<void>;
  handleGoogleLogin: (idToken: string) => Promise<void>;
  handleAppleLogin: (idToken: string) => Promise<void>;
  user: User | null;
  error: string | null;
  isLoading: boolean;
  logout: () => void;
  fetchUser: () => Promise<void>;
  withdrawal: () => Promise<void>;
  updateUserName: (name: string) => void;
}

function getClientType(): "web" | "ios" | "android" {
  const platform = Capacitor.getPlatform();
  if (platform === "ios") return "ios";
  // Android도 web으로 전송
  return "web";
}

export function useAuth(): UseAuthReturn {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, login, logout: logoutStore, setUser, token } = useAuthStore();

  const handleAuthResponse = (response: AuthResponse, isFirstLogin = false) => {
    const { accessToken: token, refreshToken, member: userResponse } = response;
    console.log("handleAuthResponse 호출됨:", { token, refreshToken, userResponse });
    
    login(userResponse, token, refreshToken);

    navigate(route.FEED, {
      state: {
        isFirstLogin: isFirstLogin,
      },
    });
    sendFcmTokenToServer({ userId: userResponse.id });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });
      handleAuthResponse(response);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "로그인에 실패했습니다.";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (idToken: string) => {
    if (!idToken) {
      setError("구글 로그인에 실패했습니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.oauth2Login({
        idToken: idToken,
        provider: "google",
        client: getClientType(),
      });
      handleAuthResponse(response);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "구글 로그인에 실패했습니다.";
      setError(errorMessage);
      console.error("Google login error:", err);
      // 에러를 다시 throw하여 상위 컴포넌트에서 처리할 수 있도록 함
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async (idToken: string) => {
    if (!idToken) {
      setError("애플 로그인에 실패했습니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.oauth2Login({
        idToken: idToken,
        provider: "apple",
        client: getClientType(),
      });
      handleAuthResponse(response);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "애플 로그인에 실패했습니다.";
      setError(errorMessage);
      console.error("Apple login error:", err);
      // 에러를 다시 throw하여 상위 컴포넌트에서 처리할 수 있도록 함
      throw err;
    } finally {
      setIsLoading(false);
    }
  };


  const logout = () => {
    if (user) {
      removeFcmToken({ userId: user.id });
    }
    logoutStore();
  };

  const fetchUser = async () => {
    if (!user) return;

    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (err) {
      console.error("사용자 정보를 가져오는데 실패했습니다:", err);
    }
  };

  const withdrawal = async () => {
    setIsLoading(true);
    try {
      // 회원탈퇴 API가 REST 문서에 없어서 임시로 구현
      // 실제 API 엔드포인트가 확정되면 수정 필요
      await authService.getMe(); // 임시로 다른 API 호출
      logout();
    } catch (err) {
      console.error("회원탈퇴 중 오류 발생:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserName = (name: string) => {
    if (!user) return;
    setUser({ ...user, name });
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    handleLogin,
    handleGoogleLogin,
    handleAppleLogin,
    user,
    error,
    isLoading,
    logout,
    fetchUser,
    updateUserName,
    withdrawal,
  };
}
