'use client';

import { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Clock } from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

import { useLessons } from '@/hooks/api/useLessons';
import { useAttendances, useUpsertAttendance } from '@/hooks/api/useAttendances';

import type { Lesson } from '@/types/lesson';
import type { AttendanceStatus } from '@/types/attendance';

// ─── Constants ───────────────────────────────────────────────────────────────

const DAY_MAP: Record<number, string> = {
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
};

const DAY_SHORT: Record<number, string> = {
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
};

const ATTENDANCE_BUTTONS: {
  status: AttendanceStatus;
  label: string;
  variant: 'success' | 'warning' | 'danger' | 'info';
}[] = [
  { status: 'present', label: '출석', variant: 'success' },
  { status: 'late', label: '지각', variant: 'warning' },
  { status: 'absent', label: '결석', variant: 'danger' },
  { status: 'excused', label: '사유결석', variant: 'info' },
];

// ─── Styled Components ────────────────────────────────────────────────────────

const PageWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: 20px;
`;

// Week navigation

const WeekNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const MonthLabel = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray800};
`;

const NavButtons = styled.div`
  display: flex;
  gap: 4px;
`;

// Day strip

const DayStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 24px;
`;

const DayCard = styled.button<{ $isToday: boolean; $isSelected: boolean; $isSunday: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 4px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid transparent;
  gap: 4px;
  cursor: pointer;
  transition: all 0.15s ease;

  ${({ $isSelected, theme }) =>
    $isSelected &&
    css`
      background: ${theme.colors.primary};
      border-color: ${theme.colors.primary};
    `}

  ${({ $isToday, $isSelected, theme }) =>
    $isToday &&
    !$isSelected &&
    css`
      background: ${theme.colors.primaryLight};
      border-color: ${theme.colors.primary};
    `}

  ${({ $isToday, $isSelected, theme }) =>
    !$isToday &&
    !$isSelected &&
    css`
      background: ${theme.colors.white};
      border-color: ${theme.colors.gray200};
      &:hover {
        background: ${theme.colors.gray50};
        border-color: ${theme.colors.gray300};
      }
    `}
`;

const DayName = styled.span<{ $isSelected: boolean; $isSunday: boolean }>`
  font-size: 11px;
  font-weight: 500;
  color: ${({ $isSelected, $isSunday, theme }) => {
    if ($isSelected) return theme.colors.white;
    if ($isSunday) return '#EF4444';
    return theme.colors.gray500;
  }};
`;

const DayNumber = styled.span<{ $isSelected: boolean; $isToday: boolean }>`
  font-size: 16px;
  font-weight: ${({ $isToday }) => ($isToday ? '700' : '500')};
  color: ${({ $isSelected, $isToday, theme }) => {
    if ($isSelected) return theme.colors.white;
    if ($isToday) return theme.colors.primary;
    return theme.colors.gray800;
  }};
`;

// Lesson cards

const LessonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LessonCard = styled(Card)`
  overflow: visible;
`;

const LessonCardHeader = styled(CardHeader)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }
`;

const LessonHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LessonTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LessonSubject = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray900};
`;

const LessonMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray500};
`;

const LessonHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray100};
  margin: 0 20px;
`;

// Attendance panel

const AttendancePanel = styled.div`
  padding: 12px 0;
`;

const StudentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  gap: 12px;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
  }
`;

const StudentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const StudentName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray800};
  white-space: nowrap;
`;

const AttendanceButtons = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
`;

const AttendanceBtn = styled.button<{ $active: boolean; $variant: string }>`
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  ${({ $active, $variant, theme }) => {
    const styles = {
      success: {
        activeBackground: theme.colors.success,
        activeColor: theme.colors.white,
        activeBorder: theme.colors.success,
        idleBackground: theme.colors.successLight,
        idleColor: '#15803D',
        idleBorder: '#BBF7D0',
      },
      warning: {
        activeBackground: theme.colors.warning,
        activeColor: theme.colors.white,
        activeBorder: theme.colors.warning,
        idleBackground: theme.colors.warningLight,
        idleColor: '#A16207',
        idleBorder: '#FEF08A',
      },
      danger: {
        activeBackground: theme.colors.danger,
        activeColor: theme.colors.white,
        activeBorder: theme.colors.danger,
        idleBackground: theme.colors.dangerLight,
        idleColor: '#B91C1C',
        idleBorder: '#FECACA',
      },
      info: {
        activeBackground: theme.colors.primary,
        activeColor: theme.colors.white,
        activeBorder: theme.colors.primary,
        idleBackground: theme.colors.primaryLight,
        idleColor: theme.colors.primaryDark,
        idleBorder: '#BFDBFE',
      },
    };

    const s = styles[$variant as keyof typeof styles] ?? styles.info;

    if ($active) {
      return css`
        background: ${s.activeBackground};
        color: ${s.activeColor};
        border-color: ${s.activeBorder};
      `;
    }
    return css`
      background: ${s.idleBackground};
      color: ${s.idleColor};
      border-color: ${s.idleBorder};
      opacity: 0.6;
      &:hover {
        opacity: 1;
      }
    `;
  }}
`;

const EmptyAttendance = styled.div`
  padding: 24px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray400};
  font-size: 14px;
`;

const EmptyLessons = styled.div`
  text-align: center;
  padding: 48px 0;
  color: ${({ theme }) => theme.colors.gray400};
  font-size: 15px;
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseTimeStr(time: string): { h: number; m: number } {
  const isoMatch = time.match(/T(\d{2}):(\d{2})/);
  if (isoMatch) return { h: Number(isoMatch[1]), m: Number(isoMatch[2]) };
  const [h, m] = time.split(':').map(Number);
  return { h, m };
}

function formatTime(time: string): string {
  const { h, m } = parseTimeStr(time);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function isAfterEndTime(endTime: string): boolean {
  const { h, m } = parseTimeStr(endTime);
  const now = new Date();
  const end = new Date();
  end.setHours(h, m, 0, 0);
  return now > end;
}

function formatDayRange(days: string[]): string {
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

// ─── Lesson Attendance Panel ──────────────────────────────────────────────────

function LessonAttendancePanel({
  lesson,
  date,
}: {
  lesson: Lesson;
  date: string;
}) {
  const { data: attendances = [], isLoading } = useAttendances(lesson.id, date);
  const upsertAttendance = useUpsertAttendance();

  const getStudentStatus = (studentId: number): AttendanceStatus | null => {
    const record = attendances.find((a) => a.student_id === studentId);
    return record?.status ?? null;
  };

  // Build student list from attendances (enrolled students come from attendance records
  // seeded by the backend, or show loaded attendance records)
  const students = attendances.map((a) => ({ id: a.student_id, name: a.student_name }));

  if (isLoading) {
    return <EmptyAttendance>로딩 중...</EmptyAttendance>;
  }

  if (students.length === 0) {
    return <EmptyAttendance>수강생이 없습니다.</EmptyAttendance>;
  }

  return (
    <AttendancePanel>
      {students.map((student) => {
        const currentStatus = getStudentStatus(student.id);
        return (
          <StudentRow key={student.id}>
            <StudentInfo>
              <StudentName>{student.name}</StudentName>
              {currentStatus && (
                <Badge
                  variant={
                    currentStatus === 'present'
                      ? 'success'
                      : currentStatus === 'late'
                      ? 'warning'
                      : currentStatus === 'absent'
                      ? 'danger'
                      : 'info'
                  }
                >
                  {currentStatus === 'present'
                    ? '출석'
                    : currentStatus === 'late'
                    ? '지각'
                    : currentStatus === 'absent'
                    ? '결석'
                    : '사유결석'}
                </Badge>
              )}
            </StudentInfo>
            <AttendanceButtons>
              {ATTENDANCE_BUTTONS.map((btn) => (
                <AttendanceBtn
                  key={btn.status}
                  $active={currentStatus === btn.status}
                  $variant={btn.variant}
                  onClick={() =>
                    upsertAttendance.mutate({
                      lessonId: lesson.id,
                      studentId: student.id,
                      date,
                      status: btn.status,
                    })
                  }
                  disabled={upsertAttendance.isPending}
                >
                  {btn.label}
                </AttendanceBtn>
              ))}
            </AttendanceButtons>
          </StudentRow>
        );
      })}
    </AttendancePanel>
  );
}

// ─── Expandable Lesson Card ───────────────────────────────────────────────────

function LessonAttendanceCard({
  lesson,
  date,
}: {
  lesson: Lesson;
  date: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const afterClass = isAfterEndTime(lesson.end_time);

  return (
    <LessonCard>
      <LessonCardHeader onClick={() => setExpanded((p) => !p)}>
        <LessonHeaderLeft>
          <LessonTitleRow>
            <LessonSubject>{lesson.subject ?? lesson.name}</LessonSubject>
            <Badge variant={afterClass ? 'default' : 'info'}>
              {afterClass ? '강의 후' : '강의 전'}
            </Badge>
          </LessonTitleRow>
          <LessonMeta>
            <span>{lesson.name}</span>
            <span>·</span>
            <span>{formatDayRange(lesson.days_of_week)}</span>
            <span>·</span>
            <Clock size={12} />
            <span>
              {formatTime(lesson.start_time)}–{formatTime(lesson.end_time)}
            </span>
            {lesson.student_count > 0 && (
              <>
                <span>·</span>
                <span>{lesson.student_count}명</span>
              </>
            )}
          </LessonMeta>
        </LessonHeaderLeft>
        <LessonHeaderRight>
          {expanded ? <ChevronUp size={18} color="#6B7280" /> : <ChevronDown size={18} color="#6B7280" />}
        </LessonHeaderRight>
      </LessonCardHeader>

      {expanded && (
        <>
          <Divider />
          <LessonAttendancePanel lesson={lesson} date={date} />
        </>
      )}
    </LessonCard>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AttendancePage() {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const { data: lessons = [] } = useLessons();

  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Build full 7-day week starting Monday, padding with previous/next week days for Sun
  // eachDayOfInterval mon-sun gives 7 days (mon=1..sun=7 if weekStartsOn:1, sun wraps)
  // Actually weekStartsOn:1 means mon..sun, but we want mon-sun visible including sunday.
  // Let's recalculate to include Sunday properly:
  const fullWeek = (() => {
    const mon = startOfWeek(weekStart, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      return d;
    });
  })();

  const selectedDayKey = DAY_MAP[selectedDate.getDay()];
  const filteredLessons = lessons.filter((l) => l.days_of_week.includes(selectedDayKey));
  const dateString = format(selectedDate, 'yyyy-MM-dd');

  // Month label: derive from selected date or week
  const monthLabel = format(selectedDate, 'yyyy년 M월', { locale: ko });

  return (
    <PageWrapper>
      <PageTitle>출결 관리</PageTitle>

      {/* Week navigation */}
      <WeekNav>
        <MonthLabel>{monthLabel}</MonthLabel>
        <NavButtons>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const prev = subWeeks(weekStart, 1);
              setWeekStart(startOfWeek(prev, { weekStartsOn: 1 }));
            }}
            title="이전 주"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              setWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
              setSelectedDate(today);
            }}
          >
            오늘
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const next = addWeeks(weekStart, 1);
              setWeekStart(startOfWeek(next, { weekStartsOn: 1 }));
            }}
            title="다음 주"
          >
            <ChevronRight size={16} />
          </Button>
        </NavButtons>
      </WeekNav>

      {/* 7-day strip */}
      <DayStrip>
        {fullWeek.map((day) => {
          const dayOfWeek = day.getDay(); // 0=sun, 1=mon...
          const isSunday = dayOfWeek === 0;
          const selected = isSameDay(day, selectedDate);
          const today = isToday(day);

          return (
            <DayCard
              key={day.toISOString()}
              $isToday={today}
              $isSelected={selected}
              $isSunday={isSunday}
              onClick={() => setSelectedDate(day)}
            >
              <DayName $isSelected={selected} $isSunday={isSunday}>
                {DAY_SHORT[dayOfWeek]}
              </DayName>
              <DayNumber $isSelected={selected} $isToday={today}>
                {format(day, 'd')}
              </DayNumber>
            </DayCard>
          );
        })}
      </DayStrip>

      {/* Lessons for selected day */}
      {filteredLessons.length === 0 ? (
        <EmptyLessons>
          {format(selectedDate, 'M월 d일 (E)', { locale: ko })}에 예정된 클래스가 없습니다.
        </EmptyLessons>
      ) : (
        <LessonList>
          {filteredLessons.map((lesson) => (
            <LessonAttendanceCard
              key={lesson.id}
              lesson={lesson}
              date={dateString}
            />
          ))}
        </LessonList>
      )}
    </PageWrapper>
  );
}
