import api from '@/lib/api';
import { SUGGESTION_POOL } from '@/data/home';

// 의도적인 검색(엔터/추천어 클릭)만 기록. 실패는 조용히 무시.
export function recordSearch(term: string) {
  const t = term.trim();
  if (!t) return;
  api.post('/search_queries', { term: t }).catch(() => {});
}

export async function fetchPopularSearches(limit = 8): Promise<string[]> {
  try {
    const res = await api.get('/popular_searches', { params: { limit } });
    return (res.data?.data as string[]) ?? [];
  } catch {
    return [];
  }
}

// 실제 인기 검색어 + 하드코딩 풀을 섞어 최종 노출 목록 생성.
// 실제 검색어를 우선하되 최대 maxReal개까지만 써서 하드코딩 몇 개는 항상 유지.
export function mergeSuggestions(
  real: string[],
  hardcoded: string[],
  size = 6,
  maxReal = 4,
): string[] {
  const merged: string[] = [];
  for (const t of real.slice(0, maxReal)) {
    if (!merged.includes(t)) merged.push(t);
  }
  for (const t of hardcoded) {
    if (merged.length >= size) break;
    if (!merged.includes(t)) merged.push(t);
  }
  return merged.slice(0, size);
}

export function shuffledPool(): string[] {
  return [...SUGGESTION_POOL].sort(() => Math.random() - 0.5);
}
