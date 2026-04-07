'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useLogin } from '@/hooks/api/useAuth';
import Navbar from '@/components/layout/Navbar';

const Page = styled.div`
  min-height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
`;

const FormWrap = styled.div`
  width: 100%;
  max-width: 400px;
`;

const FormTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 6px;
`;

const FormSub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-bottom: 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.dark};
`;

const InputWrap = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray400};
  pointer-events: none;
  display: flex;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 11px 12px 11px 38px;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  background: white;
  outline: none;
  transition: border-color 0.15s;

  &::placeholder { color: ${({ theme }) => theme.colors.gray400}; }
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const ErrorBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.dangerLight};
  border: 2px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
  font-weight: 500;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 13px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 15px;
  font-weight: 700;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 4px;

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.primaryHover}; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray200};
  margin: 4px 0;
`;

const FooterText = styled.p`
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray500};
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  &:hover { text-decoration: underline; }
`;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/';
  const { mutate: login, isPending, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password }, { onSuccess: () => router.replace(redirect) });
  };

  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <Page>
      <Navbar />
      <Body>
      <FormWrap>
          <FormTitle>로그인</FormTitle>
          <FormSub>계정에 로그인하여 시작하세요.</FormSub>

          <Form onSubmit={handleSubmit}>
            {errorMessage && (
              <ErrorBox><AlertCircle size={15} />{errorMessage}</ErrorBox>
            )}

            <FieldGroup>
              <Label htmlFor="email">이메일</Label>
              <InputWrap>
                <InputIcon><Mail size={15} /></InputIcon>
                <StyledInput id="email" type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </InputWrap>
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="password">비밀번호</Label>
              <InputWrap>
                <InputIcon><Lock size={15} /></InputIcon>
                <StyledInput id="password" type="password" placeholder="비밀번호를 입력하세요" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
              </InputWrap>
            </FieldGroup>

            <SubmitBtn type="submit" disabled={isPending}>
              {isPending ? '로그인 중...' : '로그인'}
            </SubmitBtn>

            <Divider />

            <FooterText>
              계정이 없으신가요?{' '}
              <StyledLink href="/register">회원가입</StyledLink>
            </FooterText>
          </Form>
      </FormWrap>
      </Body>
    </Page>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
