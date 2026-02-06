import { useNavigate } from "react-router-dom";

import { styled } from "@app/styles";
import PageHeader from "@app/components/PageHeader";
import ListItem from "@app/pages/MyInfo/ui/ListItem";

import { useMyComments } from "../hook/useMyComments";

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

function MyCommentListPage() {
  const navigate = useNavigate();
  const { comments, isLoading, error, hasNextPage, loadMore } = useMyComments();

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

  return (
    <Container>
      <PageHeader
        title="작성한 댓글"
        leftButton={{ icon: "back", onClick: handleBack }}
      />
      <Content onScroll={handleScroll}>
        {isLoading ? (
          <EmptyState>로딩 중...</EmptyState>
        ) : error ? (
          <EmptyState>{error}</EmptyState>
        ) : comments.length === 0 ? (
          <EmptyState>아직 작성한 댓글이 없습니다.</EmptyState>
        ) : (
          comments.map((comment) => (
            <ListItem
              key={comment.commentId}
              message={comment.content}
              time={formatDate(comment.createdAt)}
              isRead={true}
              onClick={() => {
                // TODO: 댓글이 작성된 게시글로 이동하는 기능 구현
              }}
            />
          ))
        )}
      </Content>
    </Container>
  );
}

export default MyCommentListPage;
