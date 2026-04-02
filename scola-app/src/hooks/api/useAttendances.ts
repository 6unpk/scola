import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Attendance, AttendanceStatus } from '@/types/attendance';

export function useAttendances(lessonId: number, date?: string) {
  return useQuery({
    queryKey: ['attendances', lessonId, date],
    queryFn: async () => {
      const params = date ? { date } : {};
      const { data } = await api.get(`/lessons/${lessonId}/attendances`, { params });
      return data.data as Attendance[];
    },
    enabled: !!lessonId,
  });
}

export function useUpsertAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      lessonId,
      studentId,
      date,
      status,
      note,
    }: {
      lessonId: number;
      studentId: number;
      date: string;
      status: AttendanceStatus;
      note?: string;
    }) => {
      const { data } = await api.post(`/lessons/${lessonId}/attendances/upsert`, {
        attendance: { student_id: studentId, date, status, note },
      });
      return data.data as Attendance;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attendances'] }),
  });
}

export function useBulkUpsertAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      lessonId,
      date,
      attendances,
    }: {
      lessonId: number;
      date: string;
      attendances: { student_id: number; status: AttendanceStatus; note?: string }[];
    }) => {
      const { data } = await api.post(`/lessons/${lessonId}/attendances/bulk_upsert`, {
        date,
        attendances,
      });
      return data.data as Attendance[];
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attendances'] }),
  });
}
