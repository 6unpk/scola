'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { BookOpen, Mail, Lock, User, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input, Label, FieldGroup } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { useRegister } from '@/hooks/api/useAuth';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1D4ED8 0%, #3B82F6 50%, #60A5FA 100%);
  padding: 16px;
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
`;

const LogoArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
`;

const LogoIcon = styled.div`
  width: 52px;
  height: 52px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.white};
`;

const AppName = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray900};
  letter-spacing: -0.3px;
`;

const AppSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-top: 4px;
`;

const FormArea = styled(CardContent)`
  padding-top: 24px !important;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIconLeft = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray400};
  pointer-events: none;
  display: flex;
  align-items: center;
`;

const PaddedInput = styled(Input)`
  padding-left: 34px;
`;

const ErrorBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.dangerLight};
  border: 1px solid #FECACA;
  border-radius: ${({ theme }) => theme.radius.md};
  color: #B91C1C;
  font-size: 13px;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray100};
  margin: 4px 0;
`;

const FooterText = styled.p`
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray500};
  padding: 16px 0 8px;
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export default function RegisterPage() {
  const router = useRouter();
  const { mutate: register, isPending, error } = useRegister();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (password !== passwordConfirm) {
      setValidationError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      setValidationError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    register(
      { name, email, password },
      { onSuccess: () => router.replace('/attendance') }
    );
  };

  const errorMessage =
    validationError ||
    (error instanceof Error ? error.message : error ? '회원가입에 실패했습니다. 다시 시도해주세요.' : null);

  return (
    <PageWrapper>
      <RegisterCard>
        <LogoArea>
          <LogoIcon>
            <BookOpen size={26} />
          </LogoIcon>
          <AppName>Scola</AppName>
          <AppSubtitle>계정을 만들고 시작하세요</AppSubtitle>
        </LogoArea>

        <FormArea>
          <Form onSubmit={handleSubmit}>
            {errorMessage && (
              <ErrorBox>
                <AlertCircle size={15} />
                {errorMessage}
              </ErrorBox>
            )}

            <FieldGroup>
              <Label htmlFor="name">이름</Label>
              <InputWrapper>
                <InputIconLeft>
                  <User size={15} />
                </InputIconLeft>
                <PaddedInput
                  id="name"
                  type="text"
                  placeholder="강사 이름"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </InputWrapper>
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="email">이메일</Label>
              <InputWrapper>
                <InputIconLeft>
                  <Mail size={15} />
                </InputIconLeft>
                <PaddedInput
                  id="email"
                  type="email"
                  placeholder="teacher@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </InputWrapper>
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="password">비밀번호</Label>
              <InputWrapper>
                <InputIconLeft>
                  <Lock size={15} />
                </InputIconLeft>
                <PaddedInput
                  id="password"
                  type="password"
                  placeholder="6자 이상"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </InputWrapper>
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
              <InputWrapper>
                <InputIconLeft>
                  <Lock size={15} />
                </InputIconLeft>
                <PaddedInput
                  id="passwordConfirm"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </InputWrapper>
            </FieldGroup>

            <Button type="submit" fullWidth disabled={isPending} size="lg">
              {isPending ? '가입 중...' : '회원가입'}
            </Button>

            <Divider />

            <FooterText>
              이미 계정이 있으신가요?{' '}
              <StyledLink href="/login">로그인</StyledLink>
            </FooterText>
          </Form>
        </FormArea>
      </RegisterCard>
    </PageWrapper>
  );
}
