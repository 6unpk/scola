import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

// 서버 에러 → 사용자 친화적 메시지 변환
function parseAuthError(error: unknown): string {
  const msgs: string[] = (error as any)?.response?.data?.errors ?? [];
  const status = (error as any)?.response?.status;

  if (msgs.length > 0) {
    const msg = msgs.join(' ');
    if (msg.includes('already been taken') || msg.includes('이미 사용')) return '이미 사용 중인 이메일입니다.';
    if (msg.includes('too short') || msg.includes('짧'))         return '비밀번호는 6자 이상이어야 합니다.';
    if (msg.includes('invalid') || msg.includes('유효하지 않'))   return '유효하지 않은 이메일 형식입니다.';
    if (msg.includes("doesn't match") || msg.includes('일치'))   return '비밀번호가 일치하지 않습니다.';
    if (msg.includes("can't be blank"))                           return '필수 항목을 모두 입력해주세요.';
  }

  if (status === 401) return '이메일 또는 비밀번호가 올바르지 않습니다.';
  if (status === 422) return '입력 정보를 다시 확인해주세요.';
  if (status && status >= 500) return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  if (!(error as any)?.response) return '네트워크 연결을 확인해주세요.';

  return '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      try {
        const { data } = await api.post('/api/v1/users/sign_in', { user: { email, password } });
        return data.data;
      } catch (e) {
        throw new Error(parseAuthError(e));
      }
    },
    onSuccess: (data) => setAuth(data.user, data.token),
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async ({
      email, password, password_confirmation, name,
    }: { email: string; password: string; password_confirmation: string; name: string }) => {
      try {
        const { data } = await api.post('/api/v1/users', {
          user: { email, password, password_confirmation, name },
        });
        return data.data;
      } catch (e) {
        throw new Error(parseAuthError(e));
      }
    },
    onSuccess: (data) => setAuth(data.user, data.token),
  });
}
