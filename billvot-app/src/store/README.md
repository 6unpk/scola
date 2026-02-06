# Auth Store 사용 가이드

이 프로젝트는 하나의 통합된 auth 스토어를 사용합니다.

## useAuthStore.ts
- **파일**: `client/src/store/useAuthStore.ts`
- **localStorage 키**: `auth-storage`
- **사용처**: 전체 앱에서 통합 사용
  - `useAuth` 훅 (`client/src/hooks/api/useAuth.ts`)
  - `LoginModal` 컴포넌트
  - `App.tsx` (앱 초기화 및 라우트 보호)
  - `BottomTabBar.tsx` (로그인 체크)
  - `ProtectedRoute.tsx` (인증 보호)
  - `foodScanService.ts` (API 인증)
  
- **데이터 구조**:
  ```typescript
  {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    blockedUsersIds: number[];
  }
  ```

## 주요 메서드
- `login(user, token, refreshToken)`: 로그인 처리 (legacy, 호환성 유지)
- `setAuth({ user, token })`: 인증 상태 설정 (권장)
- `logout()` / `clearAuth()`: 로그아웃 처리
- `setLoading(boolean)`: 로딩 상태 설정
- `setError(string)`: 에러 메시지 설정
- `clearError()`: 에러 메시지 클리어

## 사용 예시
```typescript
// 컴포넌트에서
const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

// API 서비스에서
const { token } = useAuthStore.getState();
```

## 중요 변경사항 (2025-01-18)
1. **통합된 useAuth 훅**: `client/src/hooks/api/useAuth.ts`만 사용
2. **자동 상태 복원**: 앱 시작시 localStorage에서 인증 상태 자동 복원
3. **개선된 persist**: `onRehydrateStorage` 콜백으로 상태 일관성 보장
4. **강화된 인증 체크**: `ProtectedRoute`에서 user, token, isAuthenticated 모두 확인
