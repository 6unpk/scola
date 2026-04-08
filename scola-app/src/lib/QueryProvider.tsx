'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5분 — 같은 페이지 재방문 시 캐시 재사용
            gcTime: 10 * 60 * 1000,   // 10분 — 메모리에서 제거 유예
            retry: 1,
            refetchOnWindowFocus: false, // 탭 전환마다 재요청 방지
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
