import { useAuthStore } from "@app/store/useAuthStore";

/**
 * 차단된 사용자의 콘텐츠를 필터링하는 유틸리티 함수들
 */

/**
 * 게시글 목록에서 차단된 사용자의 게시글을 필터링
 */
export function filterBlockedArticles<T extends { authorId?: number; userId?: number }>(
  articles: T[]
): T[] {
  const { isUserBlocked } = useAuthStore.getState();
  
  return articles.filter(article => {
    const userId = article.authorId || article.userId;
    return !userId || !isUserBlocked(userId);
  });
}

/**
 * 댓글 목록에서 차단된 사용자의 댓글을 필터링
 */
export function filterBlockedComments<T extends { authorId?: number; userId?: number }>(
  comments: T[]
): T[] {
  const { isUserBlocked } = useAuthStore.getState();
  
  return comments.filter(comment => {
    const userId = comment.authorId || comment.userId;
    return !userId || !isUserBlocked(userId);
  });
}

/**
 * 사용자 목록에서 차단된 사용자를 필터링
 */
export function filterBlockedUsers<T extends { id: number; userId?: number }>(
  users: T[]
): T[] {
  const { isUserBlocked } = useAuthStore.getState();
  
  return users.filter(user => {
    const userId = user.id || user.userId;
    return !userId || !isUserBlocked(userId);
  });
}

/**
 * 특정 사용자가 차단되었는지 확인
 */
export function isUserBlocked(userId: number): boolean {
  const { isUserBlocked } = useAuthStore.getState();
  return isUserBlocked(userId);
}

/**
 * 차단된 사용자의 닉네임을 "차단된 사용자"로 마스킹
 */
export function maskBlockedUserNickname(userId: number, originalNickname: string): string {
  if (isUserBlocked(userId)) {
    return "차단된 사용자";
  }
  return originalNickname;
}

/**
 * 차단된 사용자의 콘텐츠를 숨기거나 마스킹
 */
export function maskBlockedUserContent(userId: number, originalContent: string): string {
  if (isUserBlocked(userId)) {
    return "차단된 사용자의 콘텐츠입니다.";
  }
  return originalContent;
}
