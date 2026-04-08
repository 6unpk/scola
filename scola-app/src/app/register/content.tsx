'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useRegister } from '@/hooks/api/useAuth';
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

const AgreementBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AgreementRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray700};
`;

const AgreementCheck = styled.span<{ $checked: boolean }>`
  flex-shrink: 0;
  width: 17px;
  height: 17px;
  border-radius: 4px;
  border: 2px solid ${({ $checked, theme }) => $checked ? theme.colors.dark : theme.colors.gray300};
  background: ${({ $checked, theme }) => $checked ? theme.colors.dark : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 11px;
  transition: all 0.1s;
`;

const AgreementLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  font-weight: 600;
  margin-left: 2px;
`;

export default function RegisterPage() {
  const router = useRouter();
  const { mutate: register, isPending, error } = useRegister();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [validationError, setValidationError] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (password !== passwordConfirm) { setValidationError('비밀번호가 일치하지 않습니다.'); return; }
    if (password.length < 6)          { setValidationError('비밀번호는 6자 이상이어야 합니다.'); return; }
    if (!agreePrivacy || !agreeTerms) { setValidationError('약관에 동의해주세요.'); return; }

    register({ name, email, password, password_confirmation: passwordConfirm }, { onSuccess: () => router.replace('/') });
  };

  const errorMessage = validationError || (error instanceof Error ? error.message : null);

  return (
    <Page>
      <Navbar />
      <Body>
      <FormWrap>
          <FormTitle>회원가입</FormTitle>
          <FormSub>계정을 만들고 시작하세요.</FormSub>

          <Form onSubmit={handleSubmit}>
            {errorMessage && (
              <ErrorBox><AlertCircle size={15} />{errorMessage}</ErrorBox>
            )}

            <FieldGroup>
              <Label htmlFor="name">닉네임</Label>
              <InputWrap>
                <InputIcon><User size={15} /></InputIcon>
                <StyledInput id="name" type="text" placeholder="닉네임을 입력하세요" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
              </InputWrap>
            </FieldGroup>

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
                <StyledInput id="password" type="password" placeholder="6자 이상" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
              </InputWrap>
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
              <InputWrap>
                <InputIcon><Lock size={15} /></InputIcon>
                <StyledInput id="passwordConfirm" type="password" placeholder="비밀번호를 다시 입력하세요" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required autoComplete="new-password" />
              </InputWrap>
            </FieldGroup>

            <AgreementBox>
              <AgreementRow>
                <input type="checkbox" style={{ display: 'none' }} checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} />
                <AgreementCheck $checked={agreePrivacy} onClick={() => setAgreePrivacy((v) => !v)}>
                  {agreePrivacy && '✓'}
                </AgreementCheck>
                <span>
                  <AgreementLink href="/privacy" target="_blank">개인정보처리방침</AgreementLink>에 동의합니다 <span style={{ color: '#A62121', fontWeight: 700 }}>(필수)</span>
                </span>
              </AgreementRow>
              <AgreementRow>
                <input type="checkbox" style={{ display: 'none' }} checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                <AgreementCheck $checked={agreeTerms} onClick={() => setAgreeTerms((v) => !v)}>
                  {agreeTerms && '✓'}
                </AgreementCheck>
                <span>
                  <AgreementLink href="/terms" target="_blank">이용약관</AgreementLink>에 동의합니다 <span style={{ color: '#A62121', fontWeight: 700 }}>(필수)</span>
                </span>
              </AgreementRow>
            </AgreementBox>

            <SubmitBtn type="submit" disabled={isPending || !agreePrivacy || !agreeTerms}>
              {isPending ? '가입 중...' : '회원가입'}
            </SubmitBtn>

            <Divider />

            <FooterText>
              이미 계정이 있으신가요?{' '}
              <StyledLink href="/login">로그인</StyledLink>
            </FooterText>
          </Form>
      </FormWrap>
      </Body>
    </Page>
  );
}
