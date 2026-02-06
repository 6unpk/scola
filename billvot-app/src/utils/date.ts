/**
 * 날짜 문자열을 yyyy.MM.dd 형식으로 포맷팅합니다.
 * @param dateString ISO 형식 날짜 문자열 (예: "2023-04-15T09:30:00Z")
 * @returns 포맷팅된 날짜 문자열 (예: "2023.04.15")
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) {
    return dateString;
  }

  const year = date.getFullYear();
  // getMonth()는 0부터 시작하므로 1을 더함
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

/**
 * 날짜 문자열을 yyyy.MM.dd HH:mm 형식으로 포맷팅합니다.
 * @param dateString ISO 형식 날짜 문자열
 * @returns 포맷팅된 날짜 및 시간 문자열
 */
export function formatDateTime(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) {
    return dateString;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

/**
 * 현재 날짜로부터 얼마나 지났는지 표시합니다.
 * @param dateString ISO 형식 날짜 문자열
 * @returns "방금 전", "n분 전", "n시간 전", "n일 전" 등의 문자열
 */
export function formatRelativeTime(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) {
    return dateString;
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "방금 전";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }

  // 7일 이상이면 날짜 형식으로 표시
  return formatDate(dateString);
}

/**
 * HTML 태그를 제거하고 내용을 정리합니다.
 * @param html HTML 문자열
 * @param preserveLineBreaks 줄바꿈을 보존할지 여부 (기본값: false)
 * @returns 정리된 텍스트 문자열
 */
export function cleanHtmlContent(html: string, preserveLineBreaks = false): string {
  if (!html) return "";
  
  let cleaned = html;
  
  // <br> 태그 처리
  if (preserveLineBreaks) {
    cleaned = cleaned.replace(/<br\s*\/?>/gi, "___LINEBREAK___");
  } else {
    cleaned = cleaned.replace(/<br\s*\/?>/gi, " ");
  }
  
  // HTML 태그 제거
  cleaned = cleaned.replace(/<[^>]*>/g, "");
  
  // HTML 엔티티 디코딩
  cleaned = cleaned
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  // 연속된 공백을 하나로 정리
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  
  // 줄바꿈 복원
  if (preserveLineBreaks) {
    cleaned = cleaned.replace(/___LINEBREAK___/g, "\n");
  }
  
  return cleaned;
}
