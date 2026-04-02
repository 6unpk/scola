export interface Lesson {
  id: number;
  name: string;
  subject: string | null;
  days_of_week: string[];
  start_time: string;
  end_time: string;
  status: 'active' | 'inactive';
  notes: string | null;
  student_count: number;
  created_at: string;
  updated_at: string;
}

export type LessonFormData = Omit<Lesson, 'id' | 'student_count' | 'created_at' | 'updated_at'>;
