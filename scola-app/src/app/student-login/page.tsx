'use client';

import { useState } from 'react';
import styled from 'styled-components';
import {
  BookOpen,
  Phone,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input, Label, FieldGroup } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

/* ─────────────── Mock data ─────────────── */

const MOCK_STUDENTS: Record<string, { name: string; phone: string; school: string; grade: string }> = {
  '홍길동|010-1234-5678': { name: '홍길동', phone: '010-1234-5678', school: '한국중학교', grade: '중2' },
  '김민지|010-9876-5432': { name: '김민지', phone: '010-9876-5432', school: '서울고등학교', grade: '고1' },
};

type AttendanceStatus = 'present' | 'absent' | 'late';

interface AttendanceRecord {
  date: string;
  lesson: string;
  status: AttendanceStatus;
}

const MOCK_RECORDS: AttendanceRecord[] = [
  { date: '2026-04-02', lesson: '수학 기초', status: 'present' },
  { date: '2026-03-28', lesson: '수학 기초', status: 'late' },
  { date: '2026-03-26', lesson: '수학 기초', status: 'present' },
  { date: '2026-03-21', lesson: '수학 기초', status: 'absent' },
  { date: '2026-03-19', lesson: '수학 기초', status: 'present' },
  { date: '2026-03-14', lesson: '수학 기초', status: 'present' },
  { date: '2026-03-12', lesson: '수학 기초', status: 'present' },
  { date: '2026-03-07', lesson: '수학 기초', status: 'absent' },
];

/* ─────────────── Styles ─────────────── */

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(160deg, #EFF6FF 0%, #F9FAFB 60%);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
`;

const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const LogoName = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray900};
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  box-shadow: ${({ theme }) => theme.shadow.md};
`;

const LoginCardHeader = styled.div`
  padding: 24px 24px 0;
`;

const LoginTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray900};
`;

const LoginSub = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-top: 4px;
`;

const LoginForm = styled.form`
  padding: 20px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
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

/* ─── Dashboard styles ─── */

const DashboardWrapper = styled.div`
  width: 100%;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DashHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
`;

const WelcomeText = styled.div``;

const WelcomeName = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray900};
`;

const WelcomeSub = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-top: 2px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const StatCard = styled(Card)`
  padding: 16px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray900};
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-top: 4px;
`;

const StatIcon = styled.div<{ $color: string }>`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  color: ${({ $color }) => $color};
`;

const RecordsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RecordRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const RecordLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const RecordDate = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray800};
  display: flex;
  align-items: center;
  gap: 5px;
`;

const RecordLesson = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray500};
`;

function statusConfig(status: AttendanceStatus): { label: string; variant: 'success' | 'danger' | 'warning' } {
  if (status === 'present') return { label: '출석', variant: 'success' };
  if (status === 'absent') return { label: '결석', variant: 'danger' };
  return { label: '지각', variant: 'warning' };
}

/* ─────────────── Component ─────────────── */

export default function StudentLoginPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggedInStudent, setLoggedInStudent] = useState<{
    name: string;
    phone: string;
    school: string;
    grade: string;
  } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const key = `${name.trim()}|${phone.trim()}`;
    const student = MOCK_STUDENTS[key];
    if (student) {
      setLoggedInStudent(student);
      setLoginError('');
    } else {
      setLoginError('이름 또는 전화번호가 일치하지 않습니다.');
    }
  };

  const handleLogout = () => {
    setLoggedInStudent(null);
    setName('');
    setPhone('');
  };

  const present = MOCK_RECORDS.filter((r) => r.status === 'present').length;
  const absent = MOCK_RECORDS.filter((r) => r.status === 'absent').length;
  const late = MOCK_RECORDS.filter((r) => r.status === 'late').length;

  return (
    <PageWrapper>
      <TopLogo>
        <LogoIcon>
          <BookOpen size={20} />
        </LogoIcon>
        <LogoName>Scola</LogoName>
      </TopLogo>

      {!loggedInStudent ? (
        <LoginCard>
          <LoginCardHeader>
            <LoginTitle>출결 조회</LoginTitle>
            <LoginSub>이름과 전화번호를 입력하면 출석 현황을 확인할 수 있습니다.</LoginSub>
          </LoginCardHeader>
          <LoginForm onSubmit={handleLogin}>
            {loginError && (
              <ErrorBox>
                <AlertCircle size={15} />
                {loginError}
              </ErrorBox>
            )}
            <FieldGroup>
              <Label htmlFor="sl-name">이름</Label>
              <div style={{ position: 'relative' }}>
                <User
                  size={15}
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9CA3AF',
                    pointerEvents: 'none',
                  }}
                />
                <Input
                  id="sl-name"
                  style={{ paddingLeft: 32 }}
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="sl-phone">전화번호</Label>
              <div style={{ position: 'relative' }}>
                <Phone
                  size={15}
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9CA3AF',
                    pointerEvents: 'none',
                  }}
                />
                <Input
                  id="sl-phone"
                  style={{ paddingLeft: 32 }}
                  placeholder="010-0000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </FieldGroup>
            <Button type="submit" fullWidth size="lg">
              조회하기
            </Button>
          </LoginForm>
        </LoginCard>
      ) : (
        <DashboardWrapper>
          <DashHeader>
            <WelcomeText>
              <WelcomeName>{loggedInStudent.name} 학생</WelcomeName>
              <WelcomeSub>
                {loggedInStudent.school} · {loggedInStudent.grade}
              </WelcomeSub>
            </WelcomeText>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={14} />
              로그아웃
            </Button>
          </DashHeader>

          <StatsGrid>
            <StatCard>
              <StatIcon $color="#22C55E">
                <CheckCircle2 size={22} />
              </StatIcon>
              <StatValue>{present}</StatValue>
              <StatLabel>출석</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon $color="#EF4444">
                <XCircle size={22} />
              </StatIcon>
              <StatValue>{absent}</StatValue>
              <StatLabel>결석</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon $color="#EAB308">
                <Clock size={22} />
              </StatIcon>
              <StatValue>{late}</StatValue>
              <StatLabel>지각</StatLabel>
            </StatCard>
          </StatsGrid>

          <Card>
            <CardHeader>
              <CardTitle>출결 기록</CardTitle>
            </CardHeader>
            <CardContent>
              <RecordsList>
                {MOCK_RECORDS.map((record, i) => {
                  const { label, variant } = statusConfig(record.status);
                  return (
                    <RecordRow key={i}>
                      <RecordLeft>
                        <RecordDate>
                          <Calendar size={13} />
                          {record.date}
                        </RecordDate>
                        <RecordLesson>{record.lesson}</RecordLesson>
                      </RecordLeft>
                      <Badge variant={variant}>{label}</Badge>
                    </RecordRow>
                  );
                })}
              </RecordsList>
            </CardContent>
          </Card>
        </DashboardWrapper>
      )}
    </PageWrapper>
  );
}
