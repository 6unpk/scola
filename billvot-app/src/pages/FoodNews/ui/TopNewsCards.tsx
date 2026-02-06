import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "../../../styles";
import { articleService, Article, popularArticleService, PopularArticle } from "@app/api/rest/services";

const TopNewsContainer = styled("div", {
  margin: "0 16px 20px 16px",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0px 1px 8px 2px #00000014",
  backgroundColor: "white",
});

const SectionTitle = styled("h3", {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1F2937",
  margin: "0 0 16px 0",
});

const TopNewsCard = styled("div", {
  display: "flex",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid #F3F4F6",
  cursor: "pointer",

  "&:last-child": {
    borderBottom: "none",
  },

  "&:hover": {
    backgroundColor: "#F9FAFB",
  },
});

const NewsRank = styled("div", {
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: "bold",
  marginRight: "12px",
  flexShrink: 0,

  variants: {
    rank: {
      1: {
        backgroundColor: "#FEF3C7",
        color: "#D97706",
      },
      2: {
        backgroundColor: "#E5E7EB",
        color: "#6B7280",
      },
      3: {
        backgroundColor: "#FED7AA",
        color: "#EA580C",
      },
      default: {
        backgroundColor: "#F3F4F6",
        color: "#6B7280",
      },
    },
  },
});

const NewsContent = styled("div", {
  flex: 1,
});

const NewsTitle = styled("div", {
  fontSize: "14px",
  fontWeight: "500",
  color: "#1F2937",
  lineHeight: 1.4,
});

const TrendIndicator = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "12px",
  color: "#6B7280",
  marginLeft: "8px",

  variants: {
    trend: {
      up: {
        color: "#EF4444",
      },
      down: {
        color: "#3B82F6",
      },
    },
  },
});

function TopNewsCards() {
  const navigate = useNavigate();
  const [topArticles, setTopArticles] = useState<PopularArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 일간 인기 뉴스기사 로드 (TOP5)
  const loadTopArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await popularArticleService.getDailyPopularArticles({ page: 0, size: 5 });
      setTopArticles(response.result);
    } catch (err: unknown) {
      console.error("인기 뉴스기사 로드 중 오류:", err);
      setError("인기 뉴스기사를 불러오는데 실패했습니다.");
      setTopArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTopArticles();
  }, []);

  const getRankVariant = (rank: number) => {
    if (rank === 1) return 1;
    if (rank === 2) return 2;
    if (rank === 3) return 3;
    return "default" as const;
  };

  const getTrendIcon = () => {
    // TOP5는 항상 상승 트렌드로 표시 (PC와 동일)
    return "▲";
  };

  const getTrendVariant = () => {
    // TOP5는 항상 상승 트렌드로 표시 (PC와 동일)
    return "up" as const;
  };

  const handleNewsClick = (newsId: string) => {
    navigate(`/food-news/${newsId}`);
  };

  return (
    <TopNewsContainer>
      <SectionTitle>일간 TOP5</SectionTitle>
      
      {isLoading && (
        <div style={{ textAlign: "center", padding: "20px", color: "#6B7280" }}>
          인기 기사를 불러오는 중...
        </div>
      )}

      {error && (
        <div style={{ textAlign: "center", padding: "20px", color: "#EF4444" }}>
          {error}
        </div>
      )}

      {!isLoading && !error && topArticles.map((article, index) => (
        <TopNewsCard key={article.id} onClick={() => handleNewsClick(article.id)}>
          <NewsRank rank={getRankVariant(index + 1)}>{index + 1}</NewsRank>
          <NewsContent>
            <NewsTitle>{article.title}</NewsTitle>
          </NewsContent>
          <TrendIndicator trend={getTrendVariant()}>
            {getTrendIcon()}
          </TrendIndicator>
        </TopNewsCard>
      ))}

      {!isLoading && !error && topArticles.length === 0 && (
        <div style={{ textAlign: "center", padding: "20px", color: "#6B7280" }}>
          인기 기사가 없습니다
        </div>
      )}
    </TopNewsContainer>
  );
}

export default TopNewsCards;
