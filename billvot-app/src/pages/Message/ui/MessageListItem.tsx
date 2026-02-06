import { styled } from "@app/styles";
import Mail from "@app/assets/mail.svg";

const MessageListItemContainer = styled("div", {
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

const MessageContent = styled("div", {
  display: "flex",
  gap: "12px",
  alignItems: "flex-start",
});

const MessageDot = styled("div", {
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

const Icon = styled("img", {
  width: "24px",
  height: "24px",
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

interface MessageListItemProps {
  messageId: number;
  message: string;
  senderName: string;
  time: string;
  isRead?: boolean;
  onClick?: (messageId: number) => void;
}

function MessageListItem({
  messageId,
  message,
  senderName,
  time,
  isRead = false,
  onClick,
}: MessageListItemProps) {
  return (
    <MessageListItemContainer
      isRead={isRead}
      onClick={() => onClick?.(messageId)}
    >
      <MessageContent>
        <Icon src={Mail} />
        <TextContent>
          <Message>{`${senderName}: ${
            message.length > 10 ? message.slice(0, 10) + "..." : message
          }`}</Message>
          <Time>{time}</Time>
        </TextContent>
        <MessageDot isRead={isRead} />
      </MessageContent>
    </MessageListItemContainer>
  );
}

export default MessageListItem;
