import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { styled } from "../../../styles";
import { articleService, Article, ArticleCategory } from "../../../api/rest/services";
import { cleanHtmlContent } from "../../../utils/date";

const NewsFeedContainer = styled("div", {
  padding: "20px 16px",
});

const SectionTitle = styled("h3", {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1F2937",
  margin: "0 0 16px 0",
});

const TabContainer = styled("div", {
  display: "flex",
  gap: "24px",
  marginBottom: "20px",
  overflowX: "auto",
  paddingBottom: "4px",
  
  "&::-webkit-scrollbar": {
    height: "2px",
  },
  
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#F3F4F6",
  },
  
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#D1D5DB",
    borderRadius: "1px",
  },
});

const TabItem = styled("button", {
  background: "none",
  border: "none",
  fontSize: "14px",
  fontWeight: "500",
  color: "#6B7280",
  cursor: "pointer",
  padding: "0 0 12px 0",
  position: "relative",
  whiteSpace: "nowrap",
  flexShrink: 0,

  variants: {
    active: {
      true: {
        color: "#1F2937",
        fontWeight: "bold",
      },
    },
  },
});

const NewsCardList = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "19px", // 16px * 1.2 = 19.2px ≈ 19px
});

const NewsCard = styled("div", {
  display: "flex",
  gap: "14px", // 12px * 1.2 = 14.4px ≈ 14px
  cursor: "pointer",
  alignItems: "flex-start", // 상단 정렬로 변경

  "&:hover": {
    opacity: 0.8,
  },
});

const NewsImage = styled("div", {
  width: "96px", // 80px * 1.2 = 96px
  height: "96px", // 80px * 1.2 = 96px
  borderRadius: "10px", // 8px * 1.2 = 9.6px ≈ 10px
  backgroundSize: "cover",
  backgroundPosition: "center",
  flexShrink: 0,
});

const NewsContent = styled("div", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between", // 내용을 위아래로 분산
  minHeight: "96px", // 이미지 높이와 맞춤 (80px * 1.2 = 96px)
});

const NewsCategory = styled("div", {
  fontSize: "12px", // 10px * 1.2 = 12px
  fontWeight: "bold",
  color: "#22C55E",
  marginBottom: "5px", // 4px * 1.2 = 4.8px ≈ 5px
});

const NewsTitle = styled("h4", {
  fontSize: "17px", // 14px * 1.2 = 16.8px ≈ 17px
  fontWeight: "bold",
  color: "#1F2937",
  margin: "0 0 5px 0", // 4px * 1.2 = 4.8px ≈ 5px
  lineHeight: 1.3,
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  wordBreak: "break-word",
});

const NewsDescription = styled("p", {
  fontSize: "14px", // 12px * 1.2 = 14.4px ≈ 14px
  color: "#6B7280",
  margin: "0 0 10px 0", // 8px * 1.2 = 9.6px ≈ 10px
  lineHeight: 1.4,
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  wordBreak: "break-word",
});

const NewsDate = styled("div", {
  fontSize: "12px", // 10px * 1.2 = 12px
  color: "#9CA3AF",
  marginTop: "auto", // 하단으로 밀어내기
});

function NewsFeed() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("전체");
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 카테고리 데이터 로드
  const loadCategories = async () => {
    try {
      const response = await articleService.categories.getActiveCategories();
      setCategories(response);
    } catch (err: unknown) {
      console.error("카테고리 로드 중 오류:", err);
      setError("카테고리를 불러오는데 실패했습니다.");
    }
  };

  // 뉴스기사 데이터 로드
  const loadArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (activeTab === "전체") {
        // 전체 뉴스기사 (인기순)
        response = await articleService.getPopularArticles(0, 20);
      } else {
        // 특정 카테고리의 뉴스기사
        const selectedCategory = categories.find(cat => cat.name === activeTab);
        if (selectedCategory) {
          response = await articleService.getArticlesByCategory(selectedCategory.id, 0, 20);
        } else {
          response = await articleService.getPopularArticles(0, 20);
        }
      }
      setArticles(response.result);
    } catch (err: unknown) {
      console.error("뉴스기사 로드 중 오류:", err);
      setError("뉴스기사를 불러오는데 실패했습니다.");
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    loadCategories();
  }, []);

  // 카테고리나 탭 변경 시 뉴스기사 다시 로드
  useEffect(() => {
    if (categories.length > 0) {
      loadArticles();
    }
  }, [activeTab, categories]);

  const tabs = ["전체", ...categories.map(cat => cat.name)];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleNewsClick = (id: string) => {
    navigate(`/food-news/${id}`);
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\.$/, ""); // 
  };

  // 내용 요약 함수 - 개행 제거
  const getContentSummary = (content: string) => {
    const cleaned = cleanHtmlContent(content, false); // 개행 제거
    return cleaned.substring(0, 50) + "...";
  };

  return (
    <NewsFeedContainer>
      <TabContainer>
        {tabs.map((tab) => (
          <TabItem
            key={tab}
            active={activeTab === tab}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </TabItem>
        ))}
      </TabContainer>

      {isLoading && (
        <div style={{ textAlign: "center", padding: "20px", color: "#6B7280" }}>
          뉴스기사를 불러오는 중...
        </div>
      )}

      {error && (
        <div style={{ textAlign: "center", padding: "20px", color: "#EF4444" }}>
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <NewsCardList>
          {articles.map((article) => (
            <NewsCard key={article.id} onClick={() => handleNewsClick(article.id)}>
              <NewsImage 
                style={{ 
                  backgroundImage: `url(${article.thumbnailUrl || `https://picsum.photos/80/80?random=${article.id}`})` 
                }} 
              />
              <NewsContent>
                <NewsCategory style={{ color: article.categoryColor || "#22C55E" }}>
                  {article.categoryName}
                </NewsCategory>
                <NewsTitle>{cleanHtmlContent(article.title, true)}</NewsTitle>
                <NewsDescription>{getContentSummary(article.content)}</NewsDescription>
                <NewsDate>{formatDate(article.createdAt)}</NewsDate>
              </NewsContent>
            </NewsCard>
          ))}
        </NewsCardList>
      )}

      {!isLoading && !error && articles.length === 0 && (
        <div style={{ textAlign: "center", padding: "20px", color: "#6B7280" }}>
          해당 카테고리에 뉴스기사가 없습니다.
        </div>
      )}
    </NewsFeedContainer>
  );
}

export default NewsFeed;
