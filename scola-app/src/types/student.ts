export interface Student {
  id: number;
  name: string;
  birth_date: string | null;
  gender: string | null;
  school: string | null;
  grade: string | null;
  phone: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  parent_relationship: string | null;
  enrollment_date: string | null;
  status: 'active' | 'inactive' | 'pending';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type StudentFormData = Omit<Student, 'id' | 'created_at' | 'updated_at'>;
