import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Student, StudentFormData } from '@/types/student';

const KEYS = { all: ['students'] as const };

export function useStudents() {
  return useQuery({
    queryKey: KEYS.all,
    queryFn: async () => {
      const { data } = await api.get('/students');
      return data.data as Student[];
    },
  });
}

export function useStudent(id: number) {
  return useQuery({
    queryKey: [...KEYS.all, id],
    queryFn: async () => {
      const { data } = await api.get(`/students/${id}`);
      return data.data as Student;
    },
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (student: Partial<StudentFormData>) => {
      const { data } = await api.post('/students', { student });
      return data.data as Student;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...student }: Partial<StudentFormData> & { id: number }) => {
      const { data } = await api.patch(`/students/${id}`, { student });
      return data.data as Student;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/students/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}
