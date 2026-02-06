import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { styled } from "@app/styles";
import PageHeader from "@app/components/PageHeader";
import NotificationList, {
  NotificationItem,
} from "@app/components/NotificationList";
import { useAuthStore } from "@app/store/useAuthStore";
import { communityService } from "@app/api/rest/services";
import { CommunityPost, CommunityComment } from "@app/api/rest/types";
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

function CommunityPostsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunityData = async () => {
      if (!user?.id) {
        setError("사용자 정보를 찾을 수 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // 사용자가 작성한 커뮤니티 글과 댓글을 병렬로 조회
        const [userPostsResponse, userCommentsResponse] = await Promise.all([
          communityService.getPostsByAuthor(user.id, 0, 10),
          // 사용자별 댓글 조회 API가 없으므로 일단 빈 배열로 처리
          Promise.resolve({ result: [] as CommunityComment[] }),
        ]);

        const transformedNotifications: NotificationItem[] = [];

        // 작성한 커뮤니티 글 변환
        userPostsResponse.result.forEach((post: CommunityPost) => {
          transformedNotifications.push({
            id: post.id, // UUID 문자열 그대로 사용
            type: "community_post",
            category: "작성한 글",
            message: cleanHtmlContent(post.title, false),
            time: new Date(post.createdAt)
              .toLocaleString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
              .replace(/\./g, ".")
              .replace(/,/g, ""),
          });
        });

        // 작성한 댓글 변환 (API가 구현되면 활성화)
        userCommentsResponse.result.forEach((comment: CommunityComment) => {
          const cleanContent = cleanHtmlContent(comment.content, false);
          transformedNotifications.push({
            id: comment.id, // UUID 문자열 그대로 사용
            type: "community_comment",
            category: "작성한 댓글",
            message:
              cleanContent.length > 50
                ? cleanContent.substring(0, 50) + "..."
                : cleanContent,
            time: new Date(comment.createdAt)
              .toLocaleString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
              .replace(/\./g, ".")
              .replace(/,/g, ""),
          });
        });

        // 시간순으로 정렬 (최신순)
        transformedNotifications.sort(
          (a, b) =>
            new Date(b.time.replace(/\./g, "-")).getTime() -
            new Date(a.time.replace(/\./g, "-")).getTime(),
        );

        setNotifications(transformedNotifications);
      } catch (err) {
        console.error("커뮤니티 작성글/댓글 조회 실패:", err);
        setError("커뮤니티 작성글을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunityData();
  }, [user?.id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleItemClick = (notification: NotificationItem) => {
    if (notification.type === "community_post") {
      // 커뮤니티 글 상세 페이지로 이동
      navigate(`/community/${notification.id}`);
    } else if (notification.type === "community_comment") {
      // 댓글이 속한 커뮤니티 글 페이지로 이동
      // 현재는 댓글 ID만 있으므로 일단 콘솔에 로그
      console.log("커뮤니티 댓글 클릭:", notification);
      // TODO: 댓글 ID로 커뮤니티 글을 찾는 API가 필요
    }
  };

  return (
    <Container>
      <PageHeader
        title="커뮤니티 작성글"
        leftButton={{ icon: "back", onClick: handleBack }}
      />
      <Content>
        {isLoading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>로딩 중...</div>
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

export default CommunityPostsPage;
