import { useNavigate, useParams } from "react-router-dom";

import { styled } from "@app/styles";
import { useAuth } from "@app/hooks/api/useAuth";
import { route } from "@app/pages/route";

import dayjs from "dayjs";

import { useDirectMessages } from "../hook/useDirectMessages";

import MessageRoomHeader from "./MessageRoomHeader";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "$cg20",
  display: "flex",
  flexDirection: "column",
});

const Content = styled("div", {
  flex: 1,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  gap: "16px",
});

const MessageContainer = styled("div", {
  display: "flex",
  alignItems: "flex-end",
  gap: "8px",

  variants: {
    type: {
      sent: {
        flexDirection: "row-reverse",
      },
      received: {
        flexDirection: "row",
      },
    },
  },
});

const Message = styled("div", {
  maxWidth: "70%",
  padding: "12px 16px",
  borderRadius: "16px",
  fontSize: "14px",
  lineHeight: "1.5",
  color: "$cg900",
  backgroundColor: "white",

  variants: {
    type: {
      sent: {
        borderBottomRightRadius: "4px",
      },
      received: {
        borderBottomLeftRadius: "4px",
      },
    },
  },
});

const MessageTime = styled("div", {
  fontSize: "6px",
  color: "$cg500",
  flexShrink: 0,
});

const BottomButton = styled("button", {
  position: "fixed",
  bottom: "16px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "116px",
  padding: "16px 12px",
  borderRadius: "100px",
  border: "none",
  backgroundColor: "$background",
  color: "white",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.12)",

  "&:hover": {
    filter: "brightness(1.1)",
  },

  "&:active": {
    transform: "translateX(-50%) scale(0.98)",
  },
});

const LoadingState = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  color: "$cg400",
});

const ErrorState = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  color: "$error",
});

function MessageRoomPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id: userId } = useParams<{ id: string }>();
  const { messages, isLoading, error, hasNextPage, loadMore } =
    useDirectMessages(Number(userId));

  const handleBack = () => {
    navigate(-1);
  };

  const handleMore = () => {
    // TODO: 더보기 메뉴 구현
    console.log("더보기");
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasNextPage) {
      loadMore();
    }
  };

  if (isLoading) {
    return (
      <Container>
        <MessageRoomHeader title="로딩 중..." onBack={handleBack} />
        <LoadingState>메시지를 불러오는 중...</LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <MessageRoomHeader title="오류" onBack={handleBack} />
        <ErrorState>{error}</ErrorState>
      </Container>
    );
  }

  const otherUser =
    messages[0]?.sender.userId === user?.id
      ? messages[0]?.receiver
      : messages[0]?.sender;

  return (
    <Container>
      <MessageRoomHeader
        title={otherUser?.name || "알 수 없음"}
        onBack={handleBack}
        onMore={handleMore}
      />
      <Content onScroll={handleScroll}>
        {messages.map((message) => {
          const isSent = message.sender.userId === user?.id;
          return (
            <MessageContainer
              key={message.messageId}
              type={isSent ? "sent" : "received"}
            >
              <Message type={isSent ? "sent" : "received"}>
                {message.message}
              </Message>
              <MessageTime>
                {dayjs(message.createdAt).format("MM/DD/YYYY")}
                <br />
                {dayjs(message.createdAt).format("HH:mm")}
              </MessageTime>
            </MessageContainer>
          );
        })}
      </Content>
      <BottomButton
        onClick={() =>
          navigate(route.MESSAGE_SEND, {
            state: { receiverId: Number(userId) },
          })
        }
      >
        쪽지 답장 보내기
      </BottomButton>
    </Container>
  );
}

export default MessageRoomPage;
