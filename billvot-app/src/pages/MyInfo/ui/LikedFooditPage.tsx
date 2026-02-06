import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { styled } from "@app/styles";
import PageHeader from "@app/components/PageHeader";
import NotificationList, {
  NotificationItem,
} from "@app/components/NotificationList";
import { useAuthStore } from "@app/store/useAuthStore";
import { fooditService } from "@app/api/rest/services";
import { Foodit } from "@app/api/rest/types";
import { cleanHtmlContent } from "@app/utils/date";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const Content = styled("div", {
  flex: 1,
  overflowY: "auto",
});

function LikedFooditPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikedFoodits = async () => {
      if (!user?.id) {
        setError("사용자 정보를 찾을 수 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // 사용자가 북마크한 푸딧 목록 조회
        const response = await fooditService.getUserBookmarks(user.id, 0, 20);
        
        // API 응답을 NotificationItem 형태로 변환
        const transformedNotifications: NotificationItem[] = response.result.map((item: any) => ({
          id: item.foodit.id, // UUID 문자열 그대로 사용
          type: "foodit_like",
          category: "좋아하는 푸디터",
          message: `${cleanHtmlContent(item.foodit.title, false)} - ${item.foodit.description ? cleanHtmlContent(item.foodit.description, false).substring(0, 30) : ''}...`,
          time: new Date(item.createdAt).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }).replace(/\./g, '.').replace(/,/g, ''),
        }));

        setNotifications(transformedNotifications);
      } catch (err) {
        console.error("좋아하는 푸디터 조회 실패:", err);
        setError("좋아하는 푸디터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedFoodits();
  }, [user?.id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleItemClick = (notification: NotificationItem) => {
    // 푸딧 상세 페이지로 이동
    navigate(`/article/${notification.id}`);
  };

  return (
    <Container>
      <PageHeader
        title="좋아하는 푸디터"
        leftButton={{ icon: "back", onClick: handleBack }}
      />
      <Content>
        {isLoading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            로딩 중...
          </div>
        ) : error ? (
          <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
            {error}
          </div>
        ) : (
          <NotificationList
            notifications={notifications}
            onItemClick={handleItemClick}
          />
        )}
      </Content>
    </Container>
  );
}

export default LikedFooditPage;
