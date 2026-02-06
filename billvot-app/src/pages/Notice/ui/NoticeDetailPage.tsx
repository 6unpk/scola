import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { styled } from "@app/styles";
import DefaultHeader from "@app/components/DefaultHeader";
import { noticeService } from "@app/api/rest/services";
import { Notice } from "@app/api/rest/types";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const ScrollableContent = styled("div", {
  flex: 1,
  overflowY: "auto",
});

const Content = styled("div", {
  backgroundColor: "white",
});

const NoticeContent = styled("div", {
  padding: "16px",
  display: "flex",
  backgroundColor: "white",
  flexDirection: "column",
  gap: "16px",
});

const Title = styled("h1", {
  fontSize: "18px",
  fontWeight: "bold",
  color: "$cg900",
  margin: "0",
});

const InfoContainer = styled("div", {
  fontSize: "14px",
  color: "$cg600",
  display: "flex",
  gap: "8px",
});

const MainContent = styled("div", {
  fontSize: "14px",
  color: "$cg900",
  lineHeight: "1.5",
  whiteSpace: "pre-wrap",
});

function NoticeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotice = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        console.log("공지사항 ID:", id);
        const noticeData = await noticeService.getNotice(id);
        setNotice(noticeData);
      } catch (error) {
        console.error("공지사항을 불러오는데 실패했습니다:", error);
        setError("공지사항을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  if (isLoading) {
    return (
      <Container>
        <DefaultHeader title="로딩 중..." />
        <div>로딩 중...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <DefaultHeader title="오류" />
        <div>{error}</div>
      </Container>
    );
  }

  if (!notice) {
    return (
      <Container>
        <DefaultHeader title="오류" />
        <div>공지사항을 찾을 수 없습니다.</div>
      </Container>
    );
  }

  return (
    <Container>
      <DefaultHeader title="공지사항" onBackClick={() => navigate(-1)} />
      <ScrollableContent>
        <Content>
          <NoticeContent>
            <Title>{notice.title}</Title>
            <InfoContainer>
              <span>{new Date(notice.createdAt).toLocaleString()}</span>
            </InfoContainer>
            <MainContent>{notice.content}</MainContent>
          </NoticeContent>
        </Content>
      </ScrollableContent>
    </Container>
  );
}

export default NoticeDetailPage;
