import { useNavigate } from "react-router-dom";

import { styled } from "@app/styles";
import PageHeader from "@app/components/PageHeader";
import MessageListItem from "@app/pages/Message/ui/MessageListItem";

import { useMessages } from "../hook/useMessages";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "$cg20",
  display: "flex",
  flexDirection: "column",
});

const MessageList = styled("div", {
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

function MessageListPage() {
  const navigate = useNavigate();
  const { messages, isLoading, error, formatDate } = useMessages();

  const handleBack = () => {
    navigate(-1);
  };

  const handleMessageClick = (userId: number) => {
    navigate(`/message/${userId}`);
  };

  return (
    <Container>
      <PageHeader
        title="쪽지함"
        leftButton={{ icon: "back", onClick: handleBack }}
      />
      <MessageList>
        {isLoading ? (
          <EmptyState>로딩 중...</EmptyState>
        ) : error ? (
          <EmptyState>{error}</EmptyState>
        ) : messages.length === 0 ? (
          <EmptyState>쪽지가 없습니다.</EmptyState>
        ) : (
          messages.map((message) => (
            <MessageListItem
              key={message.updatedAt}
              messageId={message.lastMessage.messageId}
              message={message.lastMessage.message}
              senderName={message.otherUser.name}
              time={formatDate(message.lastMessage.createdAt)}
              isRead={message.lastMessage.isRead}
              onClick={(id) => handleMessageClick(message.otherUser.userId)}
            />
          ))
        )}
      </MessageList>
    </Container>
  );
}

export default MessageListPage;
