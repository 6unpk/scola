import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@app/styles";
import { motion } from "framer-motion";
import ArrowBack from "@app/assets/arrow_back.svg?react";
import LogoBillvot from "@app/assets/billvot.svg?react";
import { useNotifications, useMarkNotificationRead, formatNotificationDate } from "@app/hooks/api";
import { useAuthStore } from "@app/store/useAuthStore";

const PageContainer = styled(motion.div, {
  width: "100%",
  minHeight: "100vh",
  backgroundColor: "$white",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
});

const Header = styled("header", {
  width: "100%",
  height: "48px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
  boxSizing: "border-box",
  flexShrink: 0,
});

const BackButton = styled(motion.button, {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "8px",
  marginLeft: "-8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const BackIcon = styled(ArrowBack, {
  width: "24px",
  height: "24px",
  fill: "$cg900",
});

const LogoImage = styled(LogoBillvot, {
  height: "20px",
  width: "auto",
});

const ContentContainer = styled("div", {
  flex: 1,
  padding: "16px 24px",
  display: "flex",
  flexDirection: "column",
});

const PageTitle = styled(motion.h1, {
  fontSize: "20px",
  fontWeight: 700,
  color: "$cg900",
  margin: "0 0 24px 0",
});

const NotificationList = styled(motion.div, {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

const NotificationItem = styled(motion.div, {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  cursor: "pointer",
});

const NotificationTitle = styled("p", {
  fontSize: "14px",
  fontWeight: 500,
  color: "$cg900",
  margin: 0,
});

const NotificationTime = styled("span", {
  fontSize: "12px",
  fontWeight: 400,
  color: "$cg500",
});

const EmptyState = styled(motion.div, {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  color: "$cg500",
});

const EmptyText = styled("p", {
  fontSize: "14px",
  fontWeight: 500,
  margin: 0,
});

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

function NotificationsPage() {
  const navigate = useNavigate();
  const { user, openLoginModal } = useAuthStore();
  const { data: notificationsData, isLoading } = useNotifications(user?.id);
  const { mutate: markRead } = useMarkNotificationRead();

  useEffect(() => {
    if (!user) {
      openLoginModal();
      navigate(-1);
    }
  }, [user, openLoginModal, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNotificationClick = (notification: { id: number; is_read: boolean }) => {
    if (!notification.is_read) {
      markRead(notification.id);
    }
  };

  const notifications = notificationsData?.data ?? [];
  const hasNotifications = notifications.length > 0;

  return (
    <PageContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Header>
        <BackButton
          onClick={handleBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <BackIcon />
        </BackButton>
        <LogoImage />
      </Header>

      <ContentContainer>
        <PageTitle variants={itemVariants}>알림</PageTitle>

        {isLoading ? (
          <EmptyState variants={itemVariants}>
            <EmptyText>로딩 중...</EmptyText>
          </EmptyState>
        ) : hasNotifications ? (
          <NotificationList>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                variants={itemVariants}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNotificationClick(notification)}
                css={{ opacity: notification.is_read ? 0.6 : 1 }}
              >
                <NotificationTitle>{notification.message}</NotificationTitle>
                <NotificationTime>{formatNotificationDate(notification.created_at)}</NotificationTime>
              </NotificationItem>
            ))}
          </NotificationList>
        ) : (
          <EmptyState variants={itemVariants}>
            <EmptyText>알림이 없습니다</EmptyText>
          </EmptyState>
        )}
      </ContentContainer>
    </PageContainer>
  );
}

export default NotificationsPage;
