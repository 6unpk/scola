import { useNavigate } from "react-router-dom";

import { styled } from "@app/styles";
import PageHeader from "@app/components/PageHeader";
import NotificationItem from "@app/pages/Notification/ui/NotificationItem";

import { useNotifications } from "../hook/useNotifications";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const NotificationList = styled("div", {
  flex: 1,
  overflowY: "auto",
});

const EmptyState = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  color: "$cg400",
  fontSize: "14px",
  gap: "8px",
});

function NotificationPage() {
  const navigate = useNavigate();
  const {
    notifications,
    isLoading,
    error,
    handleNotificationClick,
    formatDate,
  } = useNotifications();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container>
      <PageHeader
        title="알림"
        leftButton={{ icon: "back", onClick: handleBack }}
      />
      <NotificationList>
        {isLoading ? (
          <EmptyState>로딩 중...</EmptyState>
        ) : error ? (
          <EmptyState>{error}</EmptyState>
        ) : notifications.length === 0 ? (
          <EmptyState>알림이 없습니다.</EmptyState>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.notificationId}
              message={notification.content}
              time={formatDate(notification.createdAt)}
              isRead={notification.isRead}
              onClick={() => {
                handleNotificationClick(notification.notificationId);
              }}
            />
          ))
        )}
      </NotificationList>
    </Container>
  );
}

export default NotificationPage;
