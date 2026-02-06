import { useNavigate } from "react-router-dom";

import { styled } from "@app/styles";
import PageHeader from "@app/components/PageHeader";
import ArticleListItem from "@app/components/ArticleListItem";
import { formatDate } from "@app/utils/date";

import { useMyArticles } from "../hook/useMyArticles";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const ArticleList = styled("div", {
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

function MyArticleListPage() {
  const navigate = useNavigate();
  const { articles, isLoading, error, handleArticleClick } = useMyArticles();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container>
      <PageHeader
        title="작성글 목록"
        leftButton={{ icon: "back", onClick: handleBack }}
      />
      <ArticleList>
        {isLoading ? (
          <EmptyState>로딩 중...</EmptyState>
        ) : error ? (
          <EmptyState>{error}</EmptyState>
        ) : articles.length === 0 ? (
          <EmptyState>
            <div>작성글이 없습니다.</div>
          </EmptyState>
        ) : (
          articles.map((article) => (
            <ArticleListItem
              key={article.articleId}
              articleId={article.articleId}
              date={formatDate(article.createdAt)}
              author={article.user.name}
              title={article.title}
              content={article.content}
              images={article.images}
              categories={article.topic ? [article.topic.name] : []}
              imageCount={article.images.length}
              likeCount={article.likeCount}
              onClick={() => handleArticleClick(article.articleId)}
            />
          ))
        )}
      </ArticleList>
    </Container>
  );
}

export default MyArticleListPage;
