export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Attendance {
  id: number;
  student_id: number;
  student_name: string;
  date: string;
  status: AttendanceStatus;
  note: string | null;
}
