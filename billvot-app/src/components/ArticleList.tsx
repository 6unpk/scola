import { styled } from "../styles";

const ArticleListContainer = styled("div", {
  padding: "20px 16px",
});

const ArticleItem = styled("div", {
  display: "flex",
  gap: "12px",
  marginBottom: "20px",
  cursor: "pointer",
  minHeight: "107px",
  alignItems: "stretch",
});

const ArticleImage = styled("div", {
  width: "80px",
  minHeight: "107px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  flexShrink: 0,
  alignSelf: "stretch",
});

const ArticleContent = styled("div", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
});

const ArticleCategory = styled("div", {
  fontSize: "10px",
  fontWeight: "bold",
  color: "#22C55E",
  marginBottom: "4px",
});

const ArticleTitle = styled("h3", {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#1F2937",
  margin: "0 0 4px 0",
  lineHeight: 1.3,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

const ArticleDescription = styled("p", {
  fontSize: "14px",
  color: "#6B7280",
  margin: "0 0 8px 0",
  lineHeight: 1.4,
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

const ArticleTopContent = styled("div", {
  display: "flex",
  flexDirection: "column",
});

const ArticleBottomContent = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "10px",
  color: "#9CA3AF",
  marginTop: "auto",
});

const EditorInfo = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "6px",
  flexShrink: 0, // 축소 방지
});

const EditorName = styled("span", {
  fontSize: "10px",
  color: "#9CA3AF",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "80px", // 최대 너비 제한
});

const DateInfo = styled("div", {
  fontSize: "10px",
  color: "#9CA3AF",
});

const SmallAvatar = styled("div", {
  width: "16px",
  height: "16px",
  borderRadius: "50%",
  backgroundColor: "#6B7280",
  backgroundSize: "cover",
  backgroundPosition: "center",
});


interface Article {
  id: string;
  category: string;
  title: string;
  description: string;
  author: string;
  authorProfileImageUrl?: string;
  date: string;
  image: string;
}

interface ArticleListProps {
  articles: Article[];
  onArticleClick: (id: string) => void;
}

function ArticleList({ articles, onArticleClick }: ArticleListProps) {
  return (
    <ArticleListContainer>
      {articles.map((article) => (
        <ArticleItem
          key={article.id}
          onClick={() => onArticleClick(article.id)}
        >
          <ArticleImage style={{ backgroundImage: `url(${article.image})` }} />
          <ArticleContent>
            <ArticleTopContent>
              <ArticleCategory>{article.category}</ArticleCategory>
              <ArticleTitle>{article.title}</ArticleTitle>
              <ArticleDescription>{article.description}</ArticleDescription>
            </ArticleTopContent>
            <ArticleBottomContent>
              <EditorInfo>
                <SmallAvatar 
                  style={{
                    backgroundImage: article.authorProfileImageUrl 
                      ? `url(${article.authorProfileImageUrl})` 
                      : undefined
                  }}
                />
                <EditorName>{article.author}</EditorName>
              </EditorInfo>
              <DateInfo>{article.date}</DateInfo>
            </ArticleBottomContent>
          </ArticleContent>
        </ArticleItem>
      ))}
    </ArticleListContainer>
  );
}

export default ArticleList;
export type { Article };
