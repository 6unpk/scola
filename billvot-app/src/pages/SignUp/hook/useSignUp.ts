import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import { route } from "@app/pages/route";
import { authService } from "@app/api/rest/services";
import { useAuthStore } from "@app/store/useAuthStore";

interface UseSignUpReturn {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone: string;
  allAgreed: boolean;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  isLoading: boolean;
  error: string | null;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setPasswordConfirm: (value: string) => void;
  setPhone: (value: string) => void;
  handleAllAgree: (event: ChangeEvent<HTMLInputElement>) => void;
  handleTermsAgree: (event: ChangeEvent<HTMLInputElement>) => void;
  handlePrivacyAgree: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSignUp: () => Promise<void>;
  clearError: () => void;
}

export function useSignUp(): UseSignUpReturn {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [allAgreed, setAllAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAllAgree = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setAllAgreed(checked);
    setTermsAgreed(checked);
    setPrivacyAgreed(checked);
  };

  const handleTermsAgree = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setTermsAgreed(checked);
    if (!checked) {
      setAllAgreed(false);
    } else if (checked && privacyAgreed) {
      setAllAgreed(true);
    }
  };

  const handlePrivacyAgree = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setPrivacyAgreed(checked);
    if (!checked) {
      setAllAgreed(false);
    } else if (checked && termsAgreed) {
      setAllAgreed(true);
    }
  };

  const handleSignUp = async () => {
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!termsAgreed || !privacyAgreed) {
      setError("필수 약관에 동의해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.signUp({
        name,
        email,
        password,
      });

      // 회원가입 성공 시 자동 로그인
      login(response.member, response.access_token, response.refresh_token);

      // 메인 페이지로 이동
      navigate(route.FEED);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "회원가입에 실패했습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    name,
    email,
    password,
    passwordConfirm,
    phone,
    allAgreed,
    termsAgreed,
    privacyAgreed,
    isLoading,
    error,
    setName,
    setEmail,
    setPassword,
    setPasswordConfirm,
    setPhone,
    handleAllAgree,
    handleTermsAgree,
    handlePrivacyAgree,
    handleSignUp,
    clearError,
  };
}
