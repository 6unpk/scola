import { styled } from "@app/styles";

const NotificationItemContainer = styled("div", {
  borderBottom: "1px solid $cg100",
  boxSizing: "border-box",
  padding: "8px 16px 13px 16px",
  backgroundColor: "white",
  cursor: "pointer",
  transition: "background-color 0.2s ease",

  "&:hover": {
    backgroundColor: "$cg50",
  },

  variants: {
    isRead: {
      true: {
        backgroundColor: "$cg50",
      },
    },
  },
});

const NotificationContent = styled("div", {
  display: "flex",
  gap: "12px",
  alignItems: "flex-start",
});

const NotificationDot = styled("div", {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: "$primary",
  marginTop: "6px",

  variants: {
    isRead: {
      true: {
        display: "none",
      },
    },
  },
});

const TextContent = styled("div", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
});

const Message = styled("div", {
  margin: "0 0 4px 0",
  fontSize: "16px",
  color: "$cg900",
  lineHeight: "1.5",
});

const Time = styled("span", {
  fontSize: "8px",
  color: "$cg500",
});

interface NotificationItemProps {
  message: string;
  time: string;
  isRead?: boolean;
  onClick?: () => void;
}

function NotificationItem({
  message,
  time,
  isRead = false,
  onClick,
}: NotificationItemProps) {
  return (
    <NotificationItemContainer isRead={isRead} onClick={onClick}>
      <NotificationContent>
        <TextContent>
          <Message>{message}</Message>
          <Time>{time}</Time>
        </TextContent>
        <NotificationDot isRead={isRead} />
      </NotificationContent>
    </NotificationItemContainer>
  );
}

export default NotificationItem;
