import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Lesson, LessonFormData } from '@/types/lesson';

const KEYS = { all: ['lessons'] as const };

export function useLessons() {
  return useQuery({
    queryKey: KEYS.all,
    queryFn: async () => {
      const { data } = await api.get('/lessons');
      return data.data as Lesson[];
    },
  });
}

export function useCreateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lesson: Partial<LessonFormData>) => {
      const { data } = await api.post('/lessons', { lesson });
      return data.data as Lesson;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...lesson }: Partial<LessonFormData> & { id: number }) => {
      const { data } = await api.patch(`/lessons/${id}`, { lesson });
      return data.data as Lesson;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useDeleteLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/lessons/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useEnrollStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ lessonId, studentId }: { lessonId: number; studentId: number }) => {
      await api.post(`/lessons/${lessonId}/enroll`, { student_id: studentId });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUnenrollStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ lessonId, studentId }: { lessonId: number; studentId: number }) => {
      await api.delete(`/lessons/${lessonId}/unenroll`, { data: { student_id: studentId } });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}
