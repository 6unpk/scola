import { useEffect, useState } from "react";
import { noticeService } from "@app/api/rest/services";
import { Notice } from "@app/api/rest/types";

export const useNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 공지사항 가져오기
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const noticesData = await noticeService.getNoticesList();
        setNotices(noticesData || []);
      } catch (err: any) {
        console.error("Error fetching notices:", err);
        setError(
          err.response?.data?.message ||
            "공지사항을 불러오는 중 오류가 발생했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // 더 불러오는 기능 (페이지네이션)
  const loadMore = async () => {
    // 현재는 리스트로 모든 데이터를 가져오므로 빈 함수
    // 필요시 페이징 API를 사용하여 구현
  };

  return {
    notices,
    isLoading,
    error,
    loadMore,
    hasNextPage: false, // 리스트 API 사용으로 페이지네이션 없음
  };
};
