'use client';

import { useState } from 'react';
import styled from 'styled-components';
import {
  BookOpen,
  CheckCircle2,
  User,
  Phone,
  Building2,
  GraduationCap,
  Users,
  FileText,
  AlertCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input, Textarea, Label, FieldGroup } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';

/* ─────────────── Styles ─────────────── */

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(160deg, #EFF6FF 0%, #F9FAFB 60%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px 48px;
`;

const TopLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
`;

const LogoIcon = styled.div`
  width: 38px;
  height: 38px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const LogoName = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray900};
`;

const FormCard = styled(Card)`
  width: 100%;
  max-width: 480px;
  box-shadow: ${({ theme }) => theme.shadow.md};
  overflow: visible;
`;

const CardHeaderArea = styled.div`
  padding: 28px 28px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
  padding-bottom: 20px;
  margin-bottom: 0;
`;

const CardTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray900};
`;

const CardSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-top: 6px;
  line-height: 1.5;
`;

const FormBody = styled.form`
  padding: 24px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray500};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
`;

const SectionDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray100};
  margin: 4px 0;
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.danger};
`;

const InputWithIcon = styled.div`
  position: relative;
`;

const IconLeft = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray400};
  pointer-events: none;
  display: flex;
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

const FieldError = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
`;

/* ─── Success state ─── */

const SuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 28px 36px;
`;

const SuccessIconRing = styled.div`
  width: 72px;
  height: 72px;
  background: ${({ theme }) => theme.colors.successLight};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: #16A34A;
`;

const SuccessTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: 10px;
`;

const SuccessMessage = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray500};
  line-height: 1.6;
`;

/* ─────────────── Types ─────────────── */

interface FormState {
  name: string;
  school: string;
  phone: string;
  parent_name: string;
  parent_phone: string;
  notes: string;
}

interface FieldErrors {
  name?: string;
  phone?: string;
}

/* ─────────────── Component ─────────────── */

export default function StudentRegisterPage({ params }: { params: { token: string } }) {
  const [form, setForm] = useState<FormState>({
    name: '',
    school: '',
    phone: '',
    parent_name: '',
    parent_phone: '',
    notes: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field in fieldErrors) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!form.name.trim()) errors.name = '이름은 필수 항목입니다.';
    if (!form.phone.trim()) errors.phone = '전화번호는 필수 항목입니다.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await api.post(`/student_registrations/${params.token}`, {
        student: {
          name: form.name.trim(),
          school: form.school.trim() || null,
          phone: form.phone.trim(),
          parent_name: form.parent_name.trim() || null,
          parent_phone: form.parent_phone.trim() || null,
          notes: form.notes.trim() || null,
        },
      });
      setIsSuccess(true);
    } catch {
      setSubmitError('제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <TopLogo>
        <LogoIcon>
          <BookOpen size={20} />
        </LogoIcon>
        <LogoName>Scola</LogoName>
      </TopLogo>

      <FormCard>
        {isSuccess ? (
          <SuccessWrapper>
            <SuccessIconRing>
              <CheckCircle2 size={36} />
            </SuccessIconRing>
            <SuccessTitle>등록이 완료되었습니다!</SuccessTitle>
            <SuccessMessage>
              정보가 성공적으로 제출되었습니다.
              <br />
              선생님이 확인 후 연락 드릴 예정입니다.
              <br />
              감사합니다.
            </SuccessMessage>
          </SuccessWrapper>
        ) : (
          <>
            <CardHeaderArea>
              <CardTitle>학생 등록</CardTitle>
              <CardSubtitle>
                아래 양식을 작성하여 수강 신청을 완료해 주세요.
                <br />
                <RequiredMark>*</RequiredMark> 표시 항목은 필수입니다.
              </CardSubtitle>
            </CardHeaderArea>

            <FormBody onSubmit={handleSubmit} noValidate>
              {submitError && (
                <ErrorBox>
                  <AlertCircle size={15} />
                  {submitError}
                </ErrorBox>
              )}

              <SectionTitle>
                <User size={13} />
                학생 정보
              </SectionTitle>

              <FieldGroup>
                <Label htmlFor="r-name">
                  이름 <RequiredMark>*</RequiredMark>
                </Label>
                <InputWithIcon>
                  <IconLeft>
                    <User size={15} />
                  </IconLeft>
                  <PaddedInput
                    id="r-name"
                    placeholder="홍길동"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </InputWithIcon>
                {fieldErrors.name && <FieldError>{fieldErrors.name}</FieldError>}
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="r-phone">
                  전화번호 <RequiredMark>*</RequiredMark>
                </Label>
                <InputWithIcon>
                  <IconLeft>
                    <Phone size={15} />
                  </IconLeft>
                  <PaddedInput
                    id="r-phone"
                    type="tel"
                    placeholder="010-0000-0000"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </InputWithIcon>
                {fieldErrors.phone && <FieldError>{fieldErrors.phone}</FieldError>}
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="r-school">학교</Label>
                <InputWithIcon>
                  <IconLeft>
                    <Building2 size={15} />
                  </IconLeft>
                  <PaddedInput
                    id="r-school"
                    placeholder="○○중학교"
                    value={form.school}
                    onChange={(e) => handleChange('school', e.target.value)}
                  />
                </InputWithIcon>
              </FieldGroup>

              <SectionDivider />

              <SectionTitle>
                <Users size={13} />
                보호자 정보
              </SectionTitle>

              <FieldGroup>
                <Label htmlFor="r-pname">보호자 이름</Label>
                <InputWithIcon>
                  <IconLeft>
                    <User size={15} />
                  </IconLeft>
                  <PaddedInput
                    id="r-pname"
                    placeholder="홍부모"
                    value={form.parent_name}
                    onChange={(e) => handleChange('parent_name', e.target.value)}
                  />
                </InputWithIcon>
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="r-pphone">보호자 전화번호</Label>
                <InputWithIcon>
                  <IconLeft>
                    <Phone size={15} />
                  </IconLeft>
                  <PaddedInput
                    id="r-pphone"
                    type="tel"
                    placeholder="010-0000-0000"
                    value={form.parent_phone}
                    onChange={(e) => handleChange('parent_phone', e.target.value)}
                  />
                </InputWithIcon>
              </FieldGroup>

              <SectionDivider />

              <SectionTitle>
                <FileText size={13} />
                추가 정보
              </SectionTitle>

              <FieldGroup>
                <Label htmlFor="r-notes">요청사항 / 메모</Label>
                <Textarea
                  id="r-notes"
                  placeholder="알레르기, 특이사항, 요청사항 등을 자유롭게 적어주세요."
                  value={form.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                />
              </FieldGroup>

              <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
                {isSubmitting ? '제출 중...' : '등록 완료하기'}
              </Button>
            </FormBody>
          </>
        )}
      </FormCard>
    </PageWrapper>
  );
}
