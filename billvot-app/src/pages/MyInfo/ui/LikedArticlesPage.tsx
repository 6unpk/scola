import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { styled } from "@app/styles";
import PageHeader from "@app/components/PageHeader";
import NotificationList, {
  NotificationItem,
} from "@app/components/NotificationList";
import { useAuthStore } from "@app/store/useAuthStore";
import { articleService, commentService } from "@app/api/rest/services";
import { ArticleLike, CommentLike } from "@app/api/rest/types";
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

function LikedArticlesPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikedData = async () => {
      if (!user?.id) {
        setError("사용자 정보를 찾을 수 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // 좋아요한 아티클과 댓글을 병렬로 조회
        const [likedArticlesResponse, likedCommentsResponse] = await Promise.all([
          articleService.getLikedArticlesByUser(user.id, 0, 10),
          commentService.getLikedCommentsByUser(user.id, 0, 10)
        ]);

        const transformedNotifications: NotificationItem[] = [];

        // 좋아요한 아티클 변환
        for (const articleLike of likedArticlesResponse.result) {
          try {
            const article = await articleService.getArticle(articleLike.articleId);
            transformedNotifications.push({
              id: articleLike.articleId,
              type: "article_like",
              category: "공감한 푸드뉴스",
              message: cleanHtmlContent(article.title, false),
              time: new Date(articleLike.createdAt).toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }).replace(/\./g, '.').replace(/,/g, ''),
            });
          } catch (err) {
            console.error(`아티클 ${articleLike.articleId} 조회 실패:`, err);
            // 실패한 경우 ID로 표시
            transformedNotifications.push({
              id: articleLike.articleId,
              type: "article_like",
              category: "공감한 푸드뉴스",
              message: `아티클을 불러올 수 없습니다`,
              time: new Date(articleLike.createdAt).toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }).replace(/\./g, '.').replace(/,/g, ''),
            });
          }
        }

        // 좋아요한 댓글 변환
        for (const commentLike of likedCommentsResponse.result) {
          try {
            const comment = await commentService.getComment(commentLike.commentId);
            transformedNotifications.push({
              id: commentLike.commentId,
              type: "comment_like",
              category: "공감한 댓글",
              message: cleanHtmlContent(comment.content, false),
              time: new Date(commentLike.createdAt).toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }).replace(/\./g, '.').replace(/,/g, ''),
            });
          } catch (err) {
            console.error(`댓글 ${commentLike.commentId} 조회 실패:`, err);
            // 실패한 경우 ID로 표시
            transformedNotifications.push({
              id: commentLike.commentId,
              type: "comment_like",
              category: "공감한 댓글",
              message: `댓글을 불러올 수 없습니다`,
              time: new Date(commentLike.createdAt).toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }).replace(/\./g, '.').replace(/,/g, ''),
            });
          }
        }

        // 시간순으로 정렬 (최신순)
        transformedNotifications.sort((a, b) => 
          new Date(b.time.replace(/\./g, '-')).getTime() - new Date(a.time.replace(/\./g, '-')).getTime()
        );

        setNotifications(transformedNotifications);
      } catch (err) {
        console.error("좋아요한 아티클/댓글 조회 실패:", err);
        setError("좋아요한 아티클과 댓글을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedData();
  }, [user?.id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleItemClick = (notification: NotificationItem) => {
    if (notification.type === "article_like") {
      // 아티클 상세 페이지로 이동
      navigate(`/article/${notification.id}`);
    } else if (notification.type === "comment_like") {
      // 댓글이 속한 아티클 페이지로 이동 (댓글 ID로 아티클을 찾아야 함)
      // 현재는 댓글 ID만 있으므로 일단 콘솔에 로그
      console.log("댓글 클릭:", notification);
      // TODO: 댓글 ID로 아티클을 찾는 API가 필요
    }
  };

  return (
    <Container>
      <PageHeader
        title="공감한 푸드뉴스"
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

export default LikedArticlesPage;
