import { useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import { styled } from "@app/styles";
import PageHeader from "@app/components/PageHeader";
import BaseTextArea from "@app/components/BaseTextArea";
import { useSimpleMessage } from "@app/hooks/useSimpleMessage";
import DefaultButton from "@app/components/DefaultButton";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const Content = styled("div", {
  flex: 1,
  padding: "24px 16px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const ByteCount = styled("span", {
  fontSize: "14px",
  color: "$cg500",
  textAlign: "right",
  marginTop: "8px",
});

function SendMessagePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendMessage, isSending, error } = useSimpleMessage();
  const [message, setMessage] = useState("");
  const maxBytes = 7000;

  const receiverId =
    location.state?.receiverId ||
    parseInt(new URLSearchParams(location.search).get("userId") || "-1", 10);

  const getByteLength = (str: string) => {
    return new Blob([str]).size;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    if (getByteLength(newMessage) <= maxBytes) {
      setMessage(newMessage);
    }
  };

  const handleSend = async () => {
    if (!receiverId) {
      alert("메시지를 받을 사용자가 지정되지 않았습니다.");
      return;
    }

    if (message.trim().length === 0) {
      alert("메시지를 입력해주세요.");
      return;
    }

    try {
      await sendMessage(receiverId, message);
      navigate(-1);
    } catch (err) {
      alert(error || "메시지 전송에 실패했습니다.");
    }
  };

  const currentBytes = getByteLength(message);

  const placeholderText = `전송할 쪽지를 입력해주세요.

오리온X를 통해 자영업자, 프리랜서 분들과
더 활발하게 소통해보세요!

상대방에게 상처를 주는 내용은
활동에 영향을 줄 수 있으니 참고해주세요.`;

  return (
    <Container>
      <PageHeader
        title="쪽지 입력하기"
        leftButton={{ icon: "back", onClick: handleBack }}
      />
      <Content>
        <BaseTextArea
          value={message}
          onChange={handleMessageChange}
          placeholder={placeholderText}
          css={{
            minHeight: "200px",
            fontSize: "12px",
            color: "$cg900",
            borderBottom: "none",
            padding: "12px",
            backgroundColor: "$cg50",
          }}
        />
        <ByteCount>
          {currentBytes}/{maxBytes} Bytes
        </ByteCount>
        <DefaultButton
          onClick={handleSend}
          css={{}}
          disabled={
            message.length === 0 || currentBytes > maxBytes || isSending
          }
        >
          {isSending ? "전송 중..." : "쪽지 전송하기"}
        </DefaultButton>
      </Content>
    </Container>
  );
}

export default SendMessagePage;
