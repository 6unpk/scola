import { useNavigate } from "react-router-dom";

import { styled } from "@app/styles";
import PageHeader from "@app/components/PageHeader";
import ListItem from "@app/pages/MyInfo/ui/ListItem";
import { route } from "@app/pages/route";

import { useNotices } from "../hook/useNotices";

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

function NoticePage() {
  const navigate = useNavigate();
  const { notices, isLoading, error, hasNextPage, loadMore } = useNotices();

  const handleBack = () => {
    navigate(-1);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMore();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  // 렌더링 컨텐츠 결정
  const renderContent = () => {
    if (isLoading) {
      return <EmptyState>로딩 중...</EmptyState>;
    }

    if (error) {
      return <EmptyState>{error}</EmptyState>;
    }

    if (notices.length === 0) {
      return <EmptyState>공지사항이 없습니다.</EmptyState>;
    }

    return (
      <Content onScroll={handleScroll}>
        {notices.map((notice) => (
          <ListItem
            key={notice.noticeId}
            message={`[공지] ${notice.title}`}
            time={formatDate(notice.createdAt)}
            isRead={true}
            onClick={() => {
              // 공지사항 상세 페이지로 이동
              navigate(route.NOTICE_DETAIL(notice.noticeId));
            }}
          />
        ))}
      </Content>
    );
  };

  return (
    <Container>
      <PageHeader
        title="공지사항"
        leftButton={{ icon: "back", onClick: handleBack }}
      />
      {renderContent()}
    </Container>
  );
}

export default NoticePage;
