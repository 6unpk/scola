'use client';

import { useState, useMemo } from 'react';
import styled from 'styled-components';
import {
  Search,
  UserPlus,
  Phone,
  GraduationCap,
  User,
  Building2,
  Loader2,
  Users,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input, Textarea, Label, FieldGroup } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Dialog, { DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/Dialog';
import Select from '@/components/ui/Select';
import { useStudents, useCreateStudent } from '@/hooks/api/useStudents';
import type { Student, StudentFormData } from '@/types/student';

/* ─────────────── Layout ─────────────── */

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray900};
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SearchIconWrap = styled.div`
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray400};
  pointer-events: none;
  display: flex;
`;

const SearchInput = styled(Input)`
  padding-left: 36px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

/* ─────────────── Student Card ─────────────── */

const StudentCard = styled(Card)`
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.md};
    transform: translateY(-1px);
  }
`;

const CardHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 16px 8px;
`;

const StudentName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray900};
`;

const CardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 16px 16px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray500};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.gray400};
`;

const EmptyIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
  opacity: 0.4;
`;

const EmptyText = styled.p`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray500};
`;

const EmptySub = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray400};
  margin-top: 4px;
`;

const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${({ theme }) => theme.colors.gray400};
`;

/* ─────────────── Detail Dialog ─────────────── */

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 20px;
`;

const DetailField = styled.div``;

const DetailLabel = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray400};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 3px;
`;

const DetailValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray800};
`;

const SectionDivider = styled.div`
  grid-column: 1 / -1;
  height: 1px;
  background: ${({ theme }) => theme.colors.gray100};
  margin: 4px 0;
`;

const SectionLabel = styled.div`
  grid-column: 1 / -1;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray500};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const NotesBlock = styled.div`
  grid-column: 1 / -1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray700};
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 10px 12px;
  white-space: pre-wrap;
`;

/* ─────────────── Create Dialog Form ─────────────── */

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
`;

const FullRow = styled.div`
  grid-column: 1 / -1;
`;

const FormSectionLabel = styled.div`
  grid-column: 1 / -1;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray500};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
`;

const ErrorText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 2px;
`;

/* ─────────────── Helpers ─────────────── */

function statusBadgeVariant(status: Student['status']) {
  if (status === 'active') return 'success';
  if (status === 'inactive') return 'danger';
  return 'warning';
}

function statusLabel(status: Student['status']) {
  if (status === 'active') return '재원';
  if (status === 'inactive') return '퇴원';
  return '대기';
}

const EMPTY_FORM: Partial<StudentFormData> = {
  name: '',
  school: '',
  grade: '',
  phone: '',
  parent_name: '',
  parent_phone: '',
  parent_relationship: '',
  enrollment_date: '',
  status: 'active',
  notes: '',
};

/* ─────────────── Page Component ─────────────── */

export default function StudentsPage() {
  const { data: students, isLoading } = useStudents();
  const { mutate: createStudent, isPending: isCreating } = useCreateStudent();

  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<Partial<StudentFormData>>(EMPTY_FORM);
  const [nameError, setNameError] = useState('');

  const filtered = useMemo(() => {
    if (!students) return [];
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.school ?? '').toLowerCase().includes(q) ||
        (s.phone ?? '').includes(q)
    );
  }, [students, search]);

  const handleField = (field: keyof StudentFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'name') setNameError('');
  };

  const handleCreate = () => {
    if (!form.name?.trim()) {
      setNameError('이름은 필수 항목입니다.');
      return;
    }
    createStudent(form, {
      onSuccess: () => {
        setShowCreate(false);
        setForm(EMPTY_FORM);
      },
    });
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setNameError('');
    setShowCreate(true);
  };

  return (
    <>
      <PageHeader>
        <PageTitle>학생관리</PageTitle>
        <Button onClick={openCreate} size="md">
          <UserPlus size={16} />
          신규 학생 추가
        </Button>
      </PageHeader>

      <SearchBar>
        <SearchIconWrap>
          <Search size={16} />
        </SearchIconWrap>
        <SearchInput
          placeholder="이름, 학교, 전화번호로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBar>

      {isLoading ? (
        <LoadingWrap>
          <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
        </LoadingWrap>
      ) : filtered.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <Users size={48} />
          </EmptyIcon>
          <EmptyText>{search ? '검색 결과가 없습니다.' : '등록된 학생이 없습니다.'}</EmptyText>
          <EmptySub>
            {search ? '검색어를 변경해 보세요.' : '신규 학생 추가 버튼을 눌러 시작하세요.'}
          </EmptySub>
        </EmptyState>
      ) : (
        <Grid>
          {filtered.map((student) => (
            <StudentCard key={student.id} onClick={() => setSelectedStudent(student)}>
              <CardHeaderRow>
                <StudentName>{student.name}</StudentName>
                <Badge variant={statusBadgeVariant(student.status)}>
                  {statusLabel(student.status)}
                </Badge>
              </CardHeaderRow>
              <CardMeta>
                {student.school && (
                  <MetaRow>
                    <Building2 size={13} />
                    {student.school}
                    {student.grade ? ` · ${student.grade}` : ''}
                  </MetaRow>
                )}
                {student.phone && (
                  <MetaRow>
                    <Phone size={13} />
                    {student.phone}
                  </MetaRow>
                )}
                {student.parent_name && (
                  <MetaRow>
                    <User size={13} />
                    {student.parent_relationship ?? '보호자'} · {student.parent_name}
                  </MetaRow>
                )}
              </CardMeta>
            </StudentCard>
          ))}
        </Grid>
      )}

      {/* ─── Detail Dialog ─── */}
      <Dialog open={!!selectedStudent} onClose={() => setSelectedStudent(null)} maxWidth="560px">
        {selectedStudent && (
          <>
            <DialogHeader>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 32 }}>
                <DialogTitle>{selectedStudent.name}</DialogTitle>
                <Badge variant={statusBadgeVariant(selectedStudent.status)}>
                  {statusLabel(selectedStudent.status)}
                </Badge>
              </div>
            </DialogHeader>
            <DialogBody>
              <DetailGrid>
                <SectionLabel>기본 정보</SectionLabel>
                <DetailField>
                  <DetailLabel>학교</DetailLabel>
                  <DetailValue>{selectedStudent.school ?? '—'}</DetailValue>
                </DetailField>
                <DetailField>
                  <DetailLabel>학년</DetailLabel>
                  <DetailValue>{selectedStudent.grade ?? '—'}</DetailValue>
                </DetailField>
                <DetailField>
                  <DetailLabel>생년월일</DetailLabel>
                  <DetailValue>{selectedStudent.birth_date ?? '—'}</DetailValue>
                </DetailField>
                <DetailField>
                  <DetailLabel>성별</DetailLabel>
                  <DetailValue>{selectedStudent.gender ?? '—'}</DetailValue>
                </DetailField>
                <DetailField>
                  <DetailLabel>전화번호</DetailLabel>
                  <DetailValue>{selectedStudent.phone ?? '—'}</DetailValue>
                </DetailField>
                <DetailField>
                  <DetailLabel>등록일</DetailLabel>
                  <DetailValue>{selectedStudent.enrollment_date ?? '—'}</DetailValue>
                </DetailField>

                <SectionDivider />
                <SectionLabel>보호자 정보</SectionLabel>
                <DetailField>
                  <DetailLabel>보호자 이름</DetailLabel>
                  <DetailValue>{selectedStudent.parent_name ?? '—'}</DetailValue>
                </DetailField>
                <DetailField>
                  <DetailLabel>관계</DetailLabel>
                  <DetailValue>{selectedStudent.parent_relationship ?? '—'}</DetailValue>
                </DetailField>
                <DetailField style={{ gridColumn: '1 / -1' }}>
                  <DetailLabel>보호자 전화번호</DetailLabel>
                  <DetailValue>{selectedStudent.parent_phone ?? '—'}</DetailValue>
                </DetailField>

                {selectedStudent.notes && (
                  <>
                    <SectionDivider />
                    <SectionLabel>메모</SectionLabel>
                    <NotesBlock>{selectedStudent.notes}</NotesBlock>
                  </>
                )}
              </DetailGrid>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                닫기
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>

      {/* ─── Create Dialog ─── */}
      <Dialog open={showCreate} onClose={() => setShowCreate(false)} maxWidth="600px">
        <DialogHeader>
          <DialogTitle>신규 학생 추가</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <FormGrid>
            <FormSectionLabel>기본 정보</FormSectionLabel>

            <FullRow>
              <FieldGroup>
                <Label htmlFor="c-name">
                  이름 <span style={{ color: '#EF4444' }}>*</span>
                </Label>
                <Input
                  id="c-name"
                  placeholder="홍길동"
                  value={form.name ?? ''}
                  onChange={(e) => handleField('name', e.target.value)}
                />
                {nameError && <ErrorText>{nameError}</ErrorText>}
              </FieldGroup>
            </FullRow>

            <FieldGroup>
              <Label htmlFor="c-school">학교</Label>
              <Input
                id="c-school"
                placeholder="○○중학교"
                value={form.school ?? ''}
                onChange={(e) => handleField('school', e.target.value)}
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="c-grade">학년</Label>
              <Input
                id="c-grade"
                placeholder="중2"
                value={form.grade ?? ''}
                onChange={(e) => handleField('grade', e.target.value)}
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="c-phone">전화번호</Label>
              <Input
                id="c-phone"
                placeholder="010-0000-0000"
                value={form.phone ?? ''}
                onChange={(e) => handleField('phone', e.target.value)}
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="c-enrollment">등록일</Label>
              <Input
                id="c-enrollment"
                type="date"
                value={form.enrollment_date ?? ''}
                onChange={(e) => handleField('enrollment_date', e.target.value)}
              />
            </FieldGroup>

            <FullRow>
              <FieldGroup>
                <Label htmlFor="c-status">상태</Label>
                <Select
                  id="c-status"
                  value={form.status ?? 'active'}
                  onChange={(e) => handleField('status', e.target.value)}
                >
                  <option value="active">재원</option>
                  <option value="inactive">퇴원</option>
                  <option value="pending">대기</option>
                </Select>
              </FieldGroup>
            </FullRow>

            <FormSectionLabel style={{ marginTop: 4 }}>보호자 정보</FormSectionLabel>

            <FieldGroup>
              <Label htmlFor="c-pname">보호자 이름</Label>
              <Input
                id="c-pname"
                placeholder="홍부모"
                value={form.parent_name ?? ''}
                onChange={(e) => handleField('parent_name', e.target.value)}
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="c-prel">관계</Label>
              <Input
                id="c-prel"
                placeholder="어머니"
                value={form.parent_relationship ?? ''}
                onChange={(e) => handleField('parent_relationship', e.target.value)}
              />
            </FieldGroup>

            <FullRow>
              <FieldGroup>
                <Label htmlFor="c-pphone">보호자 전화번호</Label>
                <Input
                  id="c-pphone"
                  placeholder="010-0000-0000"
                  value={form.parent_phone ?? ''}
                  onChange={(e) => handleField('parent_phone', e.target.value)}
                />
              </FieldGroup>
            </FullRow>

            <FullRow>
              <FieldGroup>
                <Label htmlFor="c-notes">메모</Label>
                <Textarea
                  id="c-notes"
                  placeholder="특이사항, 요청사항 등"
                  value={form.notes ?? ''}
                  onChange={(e) => handleField('notes', e.target.value)}
                />
              </FieldGroup>
            </FullRow>
          </FormGrid>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCreate(false)} disabled={isCreating}>
            취소
          </Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? '저장 중...' : '학생 추가'}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
