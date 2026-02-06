import { styled } from "../styles";

const ArticleListContainer = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "0px",
  width: "100%",
});

const ArticleItem = styled("div", {
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
  height: "258px",
  backgroundColor: "#ecfdc4",
  overflow: "hidden",
  position: "relative",
});

const ArticleImage = styled("div", {
  width: "100%",
  height: "100%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "absolute",
  top: 0,
  left: 0,
});

const ArticleContent = styled("div", {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  height: "100%",
});

const ArticleCategory = styled("span", {
  fontSize: "14px",
  fontWeight: "500",
  color: "white",
  marginBottom: "8px",
  fontFamily: "Helvetica",
  letterSpacing: "12%",
});

const ArticleTitle = styled("h3", {
  fontSize: "19px",
  color: "white",
  margin: "0 0 12px 0",
  lineHeight: 1.2,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",

  span: {
    fontWeight: "900",
  },
});

const KeywordsContainer = styled("div", {
  display: "flex",
  gap: "8px",
  marginBottom: "4px",
  overflow: "hidden",
  flexWrap: "nowrap",
});

const ArticleTopContent = styled("div", {
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  bottom: "52px",
  left: "12px",
  right: "12px",
});

const ArticleBottomContent = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: "white",
  marginTop: "4px",
});

const EditorInfo = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  width: "fit-content",
  flexShrink: 0,
  cursor: "pointer",

  "&:hover": {
    opacity: 0.8,
  },
});

const EditorName = styled("span", {
  fontSize: "12px",
  color: "white",
  textAlign: "center",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontFamily: "Helvetica",
  fontWeight: "medium",
});

const DateInfo = styled("div", {
  fontSize: "12px",
  color: "white",
  fontFamily: "Helvetica",
  fontWeight: "medium",
  alignSelf: "flex-end",
});

const SmallAvatar = styled("div", {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  backgroundColor: "#D9D9D9",
  backgroundSize: "cover",
  backgroundPosition: "center",
});

const KeywordTag = styled("span", {
  backgroundColor: "transparent",
  border: "1px solid #E4EAF0",
  borderRadius: "9999px",
  padding: "3px 10px",
  fontSize: "11px",
  color: "white",
  fontFamily: "SUIT",
  fontWeight: 600,
  flexShrink: 0,
  whiteSpace: "nowrap",
});


interface Article {
  id: string;
  category: string;
  title: string;
  description: string;
  author: string;
  authorId?: string;
  authorProfileImageUrl?: string;
  date: string;
  image: string;
  keywords?: string[];
}

interface FeaturedArticleListProps {
  articles: Article[];
  onArticleClick: (id: string) => void;
  onProfileClick?: (authorId: string) => void;
}

function FeaturedArticleList({
  articles,
  onArticleClick,
  onProfileClick,
}: FeaturedArticleListProps) {
  // 4개 슬롯을 채우기 위해 빈 슬롯 추가
  const paddedArticles = [...articles];
  while (paddedArticles.length < 4) {
    paddedArticles.push(null);
  }

  return (
    <ArticleListContainer>
      {paddedArticles.map((article, index) => {
        if (!article) {
          // 빈 슬롯 - 배경색만 표시
          return (
            <ArticleItem key={`empty-${index}`}>
              {/* 빈 슬롯은 배경색만 표시 */}
            </ArticleItem>
          );
        }

        return (
        <ArticleItem
          key={article.id}
          onClick={() => onArticleClick(article.id)}
        >
          <ArticleImage style={{ backgroundImage: `url(${article.image})` }} />
          <ArticleContent>
            <ArticleTopContent>
              <ArticleCategory>{article.category}</ArticleCategory>
              <ArticleTitle>
                {article.title.replace(/<br\s*\/?>/gi, '\n').split('\n').map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < article.title.replace(/<br\s*\/?>/gi, '\n').split('\n').length - 1 && <br />}
                  </span>
                ))}
              </ArticleTitle>
                {article.keywords && article.keywords.length > 0 && (
                  <KeywordsContainer>
                    {article.keywords.slice(0, 1).map((keyword, idx) => (
                      <KeywordTag key={idx}>#{keyword}</KeywordTag>
                    ))}
                  </KeywordsContainer>
                )}
            </ArticleTopContent>
            <ArticleBottomContent>
              <DateInfo>{article.date}</DateInfo>
              <EditorInfo
                onClick={(e) => {
                  e.stopPropagation();
                  if (onProfileClick && article.authorId) {
                    onProfileClick(article.authorId);
                  }
                }}
              >
                  <SmallAvatar
                    style={{
                      backgroundImage: article.authorProfileImageUrl
                        ? `url(${article.authorProfileImageUrl})`
                        : undefined
                    }}
                  />
                <EditorName>{article.author}</EditorName>
              </EditorInfo>
            </ArticleBottomContent>
          </ArticleContent>
        </ArticleItem>
        );
      })}
    </ArticleListContainer>
  );
}

export default FeaturedArticleList;
export type { Article };
