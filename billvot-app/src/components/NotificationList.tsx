import { styled } from "@app/styles";
import SidebarNoti from "@app/assets/sidebar-noti.svg";
import SidebarComment from "@app/assets/sidebar-comment.svg";
import SidebarArticle from "@app/assets/sidebar-article.svg";
import SidebarLike from "@app/assets/sidebar-like.svg";
import SidebarLikeComment from "@app/assets/sidebar-like-comment.svg";
import { cleanHtmlContent } from "@app/utils/date";

const NotificationListContainer = styled("div", {
  padding: "0",
  maxHeight: "calc(100dvh - 120px)",
  overflowY: "auto",
});

const NotificationItem = styled("div", {
  minHeight: "65px", // 54px * 1.2 = 64.8px ≈ 65px
  padding: "14px 24px", // 12px * 1.2 = 14.4px ≈ 14px, 20px * 1.2 = 24px
  borderBottom: "1px solid #F3F4F6",
  display: "flex",
  alignItems: "flex-start",
  gap: "14px", // 12px * 1.2 = 14.4px ≈ 14px
  cursor: "pointer",
  transition: "background-color 0.2s ease",

  "&:hover": {
    backgroundColor: "#F9FAFB",
  },

  "&:last-child": {
    borderBottom: "none",
  },
});

const NotificationIcon = styled("div", {
  width: "38px", // 32px * 1.2 = 38.4px ≈ 38px
  height: "38px", // 32px * 1.2 = 38.4px ≈ 38px
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  backgroundColor: "#DCFCE7",
  marginTop: "2px",
});

const IconImage = styled("img", {
  width: "19px", // 16px * 1.2 = 19.2px ≈ 19px
  height: "19px", // 16px * 1.2 = 19.2px ≈ 19px
});

const NotificationContent = styled("div", {
  flex: 1,
});

const NotificationCategory = styled("div", {
  fontSize: "12px", // 10px * 1.2 = 12px
  fontWeight: "bold",
  color: "#6B7280",
  marginBottom: "2px",
});

const NotificationMessage = styled("div", {
  fontSize: "14px", // 12px * 1.2 = 14.4px ≈ 14px
  color: "#1F2937",
  lineHeight: 1.3,
  marginBottom: "2px",
  wordWrap: "break-word",
  overflowWrap: "break-word",
  hyphens: "auto",
});

const NotificationTime = styled("div", {
  fontSize: "12px", // 10px * 1.2 = 12px
  color: "#9CA3AF",
});

export interface NotificationItem {
  id: string;
  type:
    | "general"
    | "comment"
    | "article_like"
    | "comment_like"
    | "reply"
    | "foodit_like"
    | "community_post"
    | "community_comment"
    | "notice";
  category: string;
  message: string;
  time: string;
}

interface NotificationListProps {
  notifications: NotificationItem[];
  onItemClick?: (notification: NotificationItem) => void;
}

function NotificationList({
  notifications,
  onItemClick,
}: NotificationListProps) {
  const getIconForType = (type: string) => {
    switch (type) {
      case "general":
        return SidebarNoti;
      case "comment":
        return SidebarComment;
      case "article_like":
        return SidebarArticle;
      case "comment_like":
        return SidebarLike;
      case "reply":
        return SidebarLikeComment;
      case "foodit_like":
        return SidebarLike;
      case "community_post":
        return SidebarArticle;
      case "community_comment":
        return SidebarComment;
      case "notice":
        return SidebarNoti; // 공지사항은 일반 알림 아이콘 사용
      default:
        return SidebarNoti;
    }
  };

  return (
    <NotificationListContainer>
      {notifications.length === 0 ? (
        <div style={{ 
          padding: "40px 20px", 
          textAlign: "center", 
          color: "#6B7280",
          fontSize: "14px"
        }}>
          기록이 없습니다
        </div>
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            onClick={() => onItemClick?.(notification)}
          >
            <NotificationIcon>
              <IconImage
                src={getIconForType(notification.type)}
                alt={notification.type}
              />
            </NotificationIcon>
            <NotificationContent>
              <NotificationCategory>{notification.category}</NotificationCategory>
              <NotificationMessage>{cleanHtmlContent(notification.message, false)}</NotificationMessage>
              <NotificationTime>{notification.time}</NotificationTime>
            </NotificationContent>
          </NotificationItem>
        ))
      )}
    </NotificationListContainer>
  );
}

export default NotificationList;
