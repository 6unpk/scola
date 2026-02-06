import { useState, useEffect } from "react";
import { styled } from "@app/styles";
import { articleService } from "@app/api/rest/services";
import type { Article } from "@app/api/rest/types";

const SectionContainer = styled("div", {
  width: "100%",
  minHeight: "300px",
  backgroundColor: "#E8FDBB",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px 0",
  boxSizing: "border-box",
});

const NewsGrid = styled("div", {
  width: "100%",
  maxWidth: "600px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: "0 16px",
  boxSizing: "border-box",
});

const NewsCard = styled("div", {
  backgroundColor: "#09593314",
  border: "1px solid #15D278",
  borderRadius: "12px",
  padding: "12px",
  display: "flex",
  gap: "12px",
  cursor: "pointer",
  transition: "transform 0.2s",
  boxSizing: "border-box",
  
  "&:active": {
    transform: "scale(0.98)"
  }
});

const NewsImage = styled("div", {
  width: "80px",
  height: "80px",
  minWidth: "80px",
  borderRadius: "8px",
  overflow: "hidden",
  flexShrink: 0,
  backgroundColor: "#1F2937",
  
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block"
  }
});

const NewsContent = styled("div", {
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  paddingTop: "4px",
  overflow: "hidden"
});

const NewsCategory = styled("div", {
  fontFamily: "Helvetica",
  fontWeight: 700,
  fontSize: "11px",
  lineHeight: "13.8px",
  color: "#095933",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
});

const NewsTitle = styled("div", {
  fontFamily: "Helvetica",
  fontWeight: 700,
  fontSize: "14px",
  lineHeight: "16px",
  color: "#12161A",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  wordBreak: "break-word"
});

const NewsDate = styled("div", {
  fontFamily: "Helvetica",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "13.8px",
  color: "#12161A",
  marginTop: "auto",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
});

const LoadingSpinner = styled("div", {
  width: "32px",
  height: "32px",
  border: "3px solid rgba(48, 83, 45, 0.2)",
  borderTop: "3px solid #30532D",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",

  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" }
  }
});

interface BreakingNewsSectionProps {
  onNewsClick: (id: string) => void;
}

export default function BreakingNewsSection({ onNewsClick }: BreakingNewsSectionProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      const TARGET_COUNT = 8;
      try {
        setIsLoading(true);
        const response = await articleService.getMainArticles();

        // 메인 기사가 8개 미만이면 최신 기사로 나머지 채우기
        if (response.length < TARGET_COUNT) {
          const needed = TARGET_COUNT - response.length;
          const fallbackResponse = await articleService.getArticles(0, needed + 5); // 여유분 포함
          // 이미 있는 메인 기사 ID 제외
          const existingIds = new Set(response.map((a) => a.id));
          const additionalArticles = fallbackResponse.result
            .filter((a) => !existingIds.has(a.id))
            .slice(0, needed);
          setArticles([...response, ...additionalArticles]);
        } else {
          setArticles(response);
        }
      } catch (error) {
        console.error("메인 기사 로드 중 오류:", error);
        // 에러 시에도 최신 기사로 fallback 시도
        try {
          const fallbackResponse = await articleService.getArticles(0, TARGET_COUNT);
          setArticles(fallbackResponse.result);
        } catch {
          setArticles([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  const cleanHtmlContent = (html: string): string => {
    return html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString)
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, ".")
      .replace(/\.$/, "");
  };

  if (isLoading) {
    return (
      <SectionContainer>
        <LoadingSpinner />
      </SectionContainer>
    );
  }

  // 데이터가 없으면 섹션을 렌더링하지 않음
  if (articles.length === 0) {
    return null;
  }

  return (
    <SectionContainer>
      <NewsGrid>
        {articles.map((article) => (
          <NewsCard key={article.id} onClick={() => onNewsClick(article.id)}>
            <NewsImage>
              {article.thumbnailUrl && (
                <img src={article.thumbnailUrl} alt={cleanHtmlContent(article.title)} />
              )}
            </NewsImage>
            <NewsContent>
              <NewsCategory>{article.categoryName}</NewsCategory>
              <NewsTitle>{cleanHtmlContent(article.title)}</NewsTitle>
              <NewsDate>{formatDate(article.createdAt)}</NewsDate>
            </NewsContent>
          </NewsCard>
        ))}
      </NewsGrid>
    </SectionContainer>
  );
}

