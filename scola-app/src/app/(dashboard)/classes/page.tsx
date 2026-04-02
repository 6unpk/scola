'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { Plus, Trash2, UserPlus, X } from 'lucide-react';

import Button from '@/components/ui/Button';
import { Input, Label, FieldGroup } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Dialog, { DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/Dialog';

import {
  useLessons,
  useCreateLesson,
  useDeleteLesson,
  useEnrollStudent,
  useUnenrollStudent,
} from '@/hooks/api/useLessons';
import { useStudents } from '@/hooks/api/useStudents';

import type { Lesson } from '@/types/lesson';
import type { Student } from '@/types/student';

import api from '@/lib/api';

// ─── Constants ───────────────────────────────────────────────────────────────

const DAY_OPTIONS = [
  { value: 'mon', label: '월' },
  { value: 'tue', label: '화' },
  { value: 'wed', label: '수' },
  { value: 'thu', label: '목' },
  { value: 'fri', label: '금' },
  { value: 'sat', label: '토' },
  { value: 'sun', label: '일' },
] as const;

type DayValue = (typeof DAY_OPTIONS)[number]['value'];

function formatDays(days: string[]): string {
  const map: Record<string, string> = {
    mon: '월',
    tue: '화',
    wed: '수',
    thu: '목',
    fri: '금',
    sat: '토',
    sun: '일',
  };
  return days.map((d) => map[d] ?? d).join(', ');
}

function formatTime(time: string): string {
  if (!time) return '';
  // ISO datetime (e.g. "2000-01-01T13:37:00.000Z") → "13:37"
  // Already HH:MM → return as-is
  const match = time.match(/T(\d{2}):(\d{2})/);
  if (match) return `${match[1]}:${match[2]}`;
  return time.slice(0, 5);
}

// ─── Styled Components ────────────────────────────────────────────────────────

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray900};
`;

const ClassGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SubjectRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const ScheduleText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-top: 4px;
`;

const StudentSection = styled.div`
  margin-top: 12px;
`;

const StudentSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StudentSectionTitle = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray600};
`;

const StudentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StudentItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.gray50};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray700};
`;

const RemoveButton = styled.button`
  padding: 2px;
  color: ${({ theme }) => theme.colors.gray400};
  border-radius: ${({ theme }) => theme.radius.sm};
  display: flex;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
    background: ${({ theme }) => theme.colors.dangerLight};
  }
`;

const EmptyStudents = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray400};
  text-align: center;
  padding: 8px 0;
`;

const DayCheckboxGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const DayCheckboxLabel = styled.label<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ $checked, theme }) => ($checked ? theme.colors.primary : theme.colors.gray200)};
  background: ${({ $checked, theme }) => ($checked ? theme.colors.primaryLight : theme.colors.white)};
  color: ${({ $checked, theme }) => ($checked ? theme.colors.primary : theme.colors.gray600)};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  input {
    display: none;
  }
`;

const TimeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const AvailableStudentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 300px;
  overflow-y: auto;
`;

const AvailableStudentItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray700};

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }
`;

const StudentName = styled.span`
  font-weight: 500;
`;

const StudentPhone = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray400};
  margin-left: 6px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 0;
  color: ${({ theme }) => theme.colors.gray400};

  p {
    font-size: 15px;
    margin-bottom: 16px;
  }
`;

// ─── Enrolled Students Hook ───────────────────────────────────────────────────

function useLessonStudents(lessonId: number) {
  return useQuery({
    queryKey: ['lesson-students', lessonId],
    queryFn: async () => {
      const { data } = await api.get(`/lessons/${lessonId}/students`);
      return data.data as Student[];
    },
    enabled: !!lessonId,
  });
}

// ─── Enroll Student Dialog ────────────────────────────────────────────────────

function EnrollDialog({
  lesson,
  open,
  onClose,
}: {
  lesson: Lesson;
  open: boolean;
  onClose: () => void;
}) {
  const { data: allStudents = [] } = useStudents();
  const { data: enrolledStudents = [] } = useLessonStudents(lesson.id);
  const enrollStudent = useEnrollStudent();
  const unenrollStudent = useUnenrollStudent();

  const enrolledIds = new Set(enrolledStudents.map((s) => s.id));
  const availableStudents = allStudents.filter((s) => !enrolledIds.has(s.id));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="480px">
      <DialogHeader>
        <DialogTitle>학생 관리 — {lesson.subject ?? lesson.name}</DialogTitle>
      </DialogHeader>

      <DialogBody>
        {enrolledStudents.length > 0 && (
          <StudentSection>
            <StudentSectionTitle>수강 중인 학생 ({enrolledStudents.length}명)</StudentSectionTitle>
            <StudentList style={{ marginTop: 8 }}>
              {enrolledStudents.map((student) => (
                <StudentItem key={student.id}>
                  <span>
                    <StudentName>{student.name}</StudentName>
                    {student.phone && <StudentPhone>{student.phone}</StudentPhone>}
                  </span>
                  <RemoveButton
                    onClick={() =>
                      unenrollStudent.mutate({ lessonId: lesson.id, studentId: student.id })
                    }
                    disabled={unenrollStudent.isPending}
                    title="수강 취소"
                  >
                    <X size={14} />
                  </RemoveButton>
                </StudentItem>
              ))}
            </StudentList>
          </StudentSection>
        )}

        <StudentSection>
          <StudentSectionTitle>
            추가 가능한 학생 ({availableStudents.length}명)
          </StudentSectionTitle>
          {availableStudents.length === 0 ? (
            <EmptyStudents>추가할 수 있는 학생이 없습니다.</EmptyStudents>
          ) : (
            <AvailableStudentList style={{ marginTop: 8 }}>
              {availableStudents.map((student) => (
                <AvailableStudentItem key={student.id}>
                  <span>
                    <StudentName>{student.name}</StudentName>
                    {student.phone && <StudentPhone>{student.phone}</StudentPhone>}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      enrollStudent.mutate({ lessonId: lesson.id, studentId: student.id })
                    }
                    disabled={enrollStudent.isPending}
                  >
                    <UserPlus size={14} />
                    추가
                  </Button>
                </AvailableStudentItem>
              ))}
            </AvailableStudentList>
          )}
        </StudentSection>
      </DialogBody>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          닫기
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

// ─── Class Card ───────────────────────────────────────────────────────────────

function ClassCard({ lesson }: { lesson: Lesson }) {
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const deleteLesson = useDeleteLesson();
  const { data: enrolledStudents = [] } = useLessonStudents(lesson.id);
  const unenrollStudent = useUnenrollStudent();

  return (
    <>
      <Card>
        <CardHeader>
          <SubjectRow>
            <CardTitle>{lesson.subject ?? '과목 없음'}</CardTitle>
            <CardActions>
              <Button
                variant="ghost"
                size="icon"
                title="클래스 삭제"
                onClick={() => {
                  if (confirm(`"${lesson.subject ?? lesson.name}" 클래스를 삭제하시겠습니까?`)) {
                    deleteLesson.mutate(lesson.id);
                  }
                }}
                disabled={deleteLesson.isPending}
              >
                <Trash2 size={16} />
              </Button>
            </CardActions>
          </SubjectRow>
          <CardDescription>{lesson.name}</CardDescription>
          <ScheduleText>
            {formatDays(lesson.days_of_week)} · {formatTime(lesson.start_time)}–{formatTime(lesson.end_time)}
          </ScheduleText>
        </CardHeader>

        <CardContent>
          <StudentSection>
            <StudentSectionHeader>
              <StudentSectionTitle>
                수강생{' '}
                <Badge variant="default">{enrolledStudents.length}명</Badge>
              </StudentSectionTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEnrollDialogOpen(true)}
              >
                <UserPlus size={14} />
                학생 추가
              </Button>
            </StudentSectionHeader>

            {enrolledStudents.length === 0 ? (
              <EmptyStudents>수강생이 없습니다.</EmptyStudents>
            ) : (
              <StudentList>
                {enrolledStudents.map((student) => (
                  <StudentItem key={student.id}>
                    <span>{student.name}</span>
                    <RemoveButton
                      onClick={() =>
                        unenrollStudent.mutate({ lessonId: lesson.id, studentId: student.id })
                      }
                      disabled={unenrollStudent.isPending}
                      title="수강 취소"
                    >
                      <X size={14} />
                    </RemoveButton>
                  </StudentItem>
                ))}
              </StudentList>
            )}
          </StudentSection>
        </CardContent>
      </Card>

      <EnrollDialog
        lesson={lesson}
        open={enrollDialogOpen}
        onClose={() => setEnrollDialogOpen(false)}
      />
    </>
  );
}

// ─── Create Class Dialog ──────────────────────────────────────────────────────

const DEFAULT_FORM = {
  name: '',
  subject: '',
  days_of_week: [] as DayValue[],
  start_time: '',
  end_time: '',
  notes: '',
};

function CreateClassDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const createLesson = useCreateLesson();

  const toggleDay = (day: DayValue) => {
    setForm((prev) => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter((d) => d !== day)
        : [...prev.days_of_week, day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.days_of_week.length || !form.start_time || !form.end_time) return;

    await createLesson.mutateAsync({
      name: form.name,
      subject: form.subject || null,
      days_of_week: form.days_of_week,
      start_time: form.start_time,
      end_time: form.end_time,
      notes: form.notes || null,
      status: 'active',
    });

    setForm(DEFAULT_FORM);
    onClose();
  };

  const handleClose = () => {
    setForm(DEFAULT_FORM);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="520px">
      <DialogHeader>
        <DialogTitle>새 클래스 추가</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <DialogBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FieldGroup>
              <Label htmlFor="lesson-name">학원명 *</Label>
              <Input
                id="lesson-name"
                placeholder="예: 스콜라 수학학원"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="lesson-subject">과목</Label>
              <Input
                id="lesson-subject"
                placeholder="예: 수학, 영어, 과학"
                value={form.subject}
                onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              />
            </FieldGroup>

            <FieldGroup>
              <Label>수업 요일 *</Label>
              <DayCheckboxGrid>
                {DAY_OPTIONS.map((day) => {
                  const checked = form.days_of_week.includes(day.value);
                  return (
                    <DayCheckboxLabel key={day.value} $checked={checked}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleDay(day.value)}
                      />
                      {day.label}
                    </DayCheckboxLabel>
                  );
                })}
              </DayCheckboxGrid>
            </FieldGroup>

            <TimeRow>
              <FieldGroup>
                <Label htmlFor="start-time">시작 시간 *</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={form.start_time}
                  onChange={(e) => setForm((p) => ({ ...p, start_time: e.target.value }))}
                  required
                />
              </FieldGroup>
              <FieldGroup>
                <Label htmlFor="end-time">종료 시간 *</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={form.end_time}
                  onChange={(e) => setForm((p) => ({ ...p, end_time: e.target.value }))}
                  required
                />
              </FieldGroup>
            </TimeRow>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" type="button" onClick={handleClose}>
            취소
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={
              createLesson.isPending ||
              !form.name ||
              form.days_of_week.length === 0 ||
              !form.start_time ||
              !form.end_time
            }
          >
            {createLesson.isPending ? '추가 중...' : '클래스 추가'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClassesPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { data: lessons = [], isLoading } = useLessons();

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>클래스 관리</PageTitle>
        <Button variant="primary" onClick={() => setCreateDialogOpen(true)}>
          <Plus size={16} />
          새 클래스 추가
        </Button>
      </PageHeader>

      {isLoading ? (
        <EmptyState>
          <p>로딩 중...</p>
        </EmptyState>
      ) : lessons.length === 0 ? (
        <EmptyState>
          <p>등록된 클래스가 없습니다.</p>
          <Button variant="primary" onClick={() => setCreateDialogOpen(true)}>
            <Plus size={16} />
            첫 클래스 추가하기
          </Button>
        </EmptyState>
      ) : (
        <ClassGrid>
          {lessons.map((lesson) => (
            <ClassCard key={lesson.id} lesson={lesson} />
          ))}
        </ClassGrid>
      )}

      <CreateClassDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </PageWrapper>
  );
}
