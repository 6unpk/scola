import { useNavigate } from "react-router-dom";

import { styled } from "@app/styles";
import PageHeader from "@app/components/PageHeader";
import ListItem from "@app/pages/MyInfo/ui/ListItem";

import { useMyLikedArticles } from "../hook/useMyLikedArticles";

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

function MyLikedArticleListPage() {
  const navigate = useNavigate();
  const { articles, comments, isLoading, error, hasNextPage, loadMore } =
    useMyLikedArticles();

  const handleBack = () => {
    navigate(-1);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMore();
    }
  };

  return (
    <Container>
      <PageHeader
        title="좋아요한 게시글"
        leftButton={{ icon: "back", onClick: handleBack }}
      />
      <Content onScroll={handleScroll}>
        {isLoading ? (
          <EmptyState>로딩 중...</EmptyState>
        ) : error ? (
          <EmptyState>{error}</EmptyState>
        ) : articles.length === 0 && comments.length === 0 ? (
          <EmptyState>아직 좋아요한 게시글이 없습니다.</EmptyState>
        ) : (
          <>
            {articles.map((article) => (
              <ListItem
                key={article.id}
                message={`아티클: ${article.articleId}`}
                time={article.createdAt}
                isRead={true}
                onClick={() => navigate(`/article/${article.articleId}`)}
              />
            ))}
            {comments.map((comment) => (
              <ListItem
                key={comment.id}
                message={`댓글: ${comment.commentId}`}
                time={comment.createdAt}
                isRead={true}
                onClick={() => {}}
              />
            ))}
          </>
        )}
      </Content>
    </Container>
  );
}

export default MyLikedArticleListPage;
