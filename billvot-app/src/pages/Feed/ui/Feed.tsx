import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainHeader from "@app/components/MainHeader";
import FeaturedArticleList from "@app/components/FeaturedArticleList";
import BreakingNewsSection from "@app/components/BreakingNewsSection";
import { styled } from "@app/styles";
import { useFeaturedFoodits, useFoodits } from "@app/hooks/useFoodit";
import { cleanHtmlContent } from "@app/utils/date";
import { useAuthStore } from "@app/store/useAuthStore";

import { Capacitor } from "@capacitor/core";

import FeaturedArticle from "./FeaturedArticle";

const FeedContainer = styled("div", {
  width: "100%",
  height: "100%",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const FixedHeader = styled("div", {
  position: "absolute",
  backgroundColor: "transparent",
  width: "100%",
  zIndex: 10,
});

const ScrollableContent = styled("div", {
  flex: 1,
  overflowY: "auto",
});

const LoadingSpinner = styled("div", {
  width: "40px",
  height: "40px",
  border: "3px solid #f3f3f3",
  borderTop: "3px solid #38654f",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "40px auto",

  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
});

const LoadingContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
  color: "#6B7280",
  fontSize: "16px",
});

const ErrorContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
  color: "#EF4444",
  fontSize: "16px",
  gap: "16px",
});

const RetryButton = styled("button", {
  padding: "12px 24px",
  backgroundColor: "#15D278",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.2s ease",

  "&:hover": {
    backgroundColor: "#12B869",
  },

  "&:active": {
    transform: "scale(0.98)",
  },
});

const PaginationContainer = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  padding: "32px 16px",
  paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 40px)",
  backgroundColor: "#12161A",
});

const PageButton = styled("button", {
  padding: "8px 12px",
  backgroundColor: "transparent",
  border: "none",
  fontSize: "14px",
  fontWeight: "300",
  color: "white",
  cursor: "pointer",
  fontFamily: "SUIT",

  "&:hover": {
    color: "rgba(255, 255, 255, 0.8)",
  },

  variants: {
    active: {
      true: {
        color: "#aeff00",
        fontWeight: "700",
      },
    },
    disabled: {
      true: {
        color: "rgba(255, 255, 255, 0.4)",
        cursor: "not-allowed",
      },
    },
  },
});

function Feed() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(0);

  // Capacitor 앱인지 확인 (모바일 웹과 구분)
  const isCapacitor =
    Capacitor.getPlatform() === "ios" || Capacitor.getPlatform() === "android";

  // API 데이터 가져오기
  const {
    foodits: featuredFoodits,
    loading: isFeaturedLoading,
    error: featuredError,
    refetch: refetchFeatured,
  } = useFeaturedFoodits(0, 5);
  const {
    foodits: allFoodits,
    loading: isAllLoading,
    error: allError,
    totalPages,
    refetch: refetchAll,
  } = useFoodits(currentPage, 30);

  const isLoading = isFeaturedLoading || isAllLoading;
  const hasError = featuredError || allError;

  console.log("피드 데이터:", {
    featuredCount: featuredFoodits.length,
    allCount: allFoodits.length,
    isFeaturedLoading,
    isAllLoading,
    featuredError,
    allError,
  });

  // 푸딧을 Article 형태로 변환하는 함수
  const transformFooditToArticle = (foodit: any): ArticleData => ({
    id: foodit.id, // UUID 문자열 그대로 사용
    category: foodit.categoryName || "ALL",
    title: cleanHtmlContent(foodit.title, true), // 리스트에서는 줄바꿈 제거
    description: (() => {
      const cleaned = cleanHtmlContent(foodit.content, false); // 설명에서는 줄바꿈 제거
      return cleaned.length > 100 ? cleaned.substring(0, 100) + "..." : cleaned;
    })(),
    author: foodit.authorNickname,
    authorId: foodit.authorId,
    authorProfileImageUrl: foodit.authorProfileImageUrl,
    date: new Date(foodit.createdAt)
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\.$/, "")
      .replace(/\s+/g, ""), // 모든 공백 제거
    image:
      foodit.thumbnailUrl ||
      "https://picsum.photos/120/160?random=" + foodit.id,
    keywords: foodit.keywords || [],
  });

  // 일반 푸딧 변환
  const transformedAllFoodits = allFoodits.map(transformFooditToArticle);

  // 피처드 푸딧 변환 (최대 5개) - allFoodits에서 keywords 병합
  const transformedFeaturedFoodits = featuredFoodits.map((foodit) => {
    const transformed = transformFooditToArticle(foodit);
    // featuredFoodits에 keywords가 없으면 allFoodits에서 같은 ID 찾아서 keywords 가져오기
    if (!transformed.keywords || transformed.keywords.length === 0) {
      const matchingAll = allFoodits.find((f) => f.id === foodit.id);
      if (matchingAll?.keywords && matchingAll.keywords.length > 0) {
        transformed.keywords = matchingAll.keywords;
      }
    }
    return transformed;
  });

  // 피처드 ID를 제외한 일반 게시글 필터링 (중복 방지)
  const featuredIds = new Set(
    transformedFeaturedFoodits.map((article) => article.id),
  );
  const filteredAllFoodits = transformedAllFoodits.filter(
    (article) => !featuredIds.has(article.id),
  );

  // 타입 정의
  type ArticleData = {
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
  };

  type MixedArticle =
    | { type: "featured-big"; data: ArticleData }
    | { type: "featured-list"; data: ArticleData[] };

  // 빈 그리드 슬롯을 랜덤 기사로 채우는 함수
  const fillGridWithRandom = (gridArticles: ArticleData[], allArticles: ArticleData[]) => {
    // 이미 4개가 채워져 있으면 그대로 반환
    if (gridArticles.length >= 4) return gridArticles;

    // 빈 슬롯 수 계산
    const emptySlots = 4 - gridArticles.length;
    if (emptySlots <= 0) return gridArticles;

    // 현재 그리드에 있는 기사 ID 제외하고 랜덤 선택
    const gridIds = new Set(gridArticles.map(a => a.id));
    const availableArticles = allArticles.filter(a => !gridIds.has(a.id));

    // 사용 가능한 기사가 없으면 그대로 반환
    if (availableArticles.length === 0) return gridArticles;

    // 랜덤으로 섞어서 필요한 만큼 선택
    const shuffled = [...availableArticles].sort(() => Math.random() - 0.5);
    const fillerArticles = shuffled.slice(0, emptySlots);

    return [...gridArticles, ...fillerArticles];
  };

  // 피처드와 일반 게시글을 섹션으로 분배 (웹과 동일한 로직)
  const createSections = () => {
    const sections = [];
    let currentIndex = 0;

    // 전체 기사 목록 (랜덤 채우기용)
    const allArticlesForRandom = [...transformedFeaturedFoodits, ...filteredAllFoodits];

    console.log("섹션 생성 시작:", {
      featuredCount: transformedFeaturedFoodits.length,
      filteredCount: filteredAllFoodits.length,
    });

    // 1. 피처드 섹션들 생성 (최대 5개) - 그리드 영역에 일반 게시글 채우기
    transformedFeaturedFoodits.forEach((featured, index) => {
      let gridArticles = filteredAllFoodits.slice(
        currentIndex,
        currentIndex + 4,
      );
      currentIndex += gridArticles.length;

      // 빈 슬롯을 랜덤 기사로 채우기
      gridArticles = fillGridWithRandom(gridArticles, allArticlesForRandom);

      console.log(`피처드 섹션 ${index + 1}:`, {
        featuredId: featured.id,
        featuredTitle: featured.title,
        gridCount: gridArticles.length,
      });

      sections.push({
        type: "first",
        isFeatured: true,
        isFirstSection: index === 0,
        stickyData: featured,
        gridData: gridArticles,
      });
    });

    // 2. 남은 일반 게시글로 추가 섹션 생성 (1,4 패턴)
    while (currentIndex < filteredAllFoodits.length) {
      const stickyArticle = filteredAllFoodits[currentIndex];
      currentIndex++;

      let gridArticles = filteredAllFoodits.slice(
        currentIndex,
        currentIndex + 4,
      );
      currentIndex += gridArticles.length;

      // 빈 슬롯을 랜덤 기사로 채우기
      gridArticles = fillGridWithRandom(gridArticles, allArticlesForRandom);

      sections.push({
        type: "first",
        isFeatured: false,
        isFirstSection: false,
        stickyData: stickyArticle,
        gridData: gridArticles,
      });
    }

    console.log("섹션 생성 완료:", {
      totalSections: sections.length,
      featuredSections: sections.filter((s) => s.isFeatured).length,
      regularSections: sections.filter((s) => !s.isFeatured).length,
    });

    return sections;
  };

  const sections = createSections();

  const handleArticleClick = (id: string) => {
    navigate(`/article/${id}`, {});
  };

  const handleNewsClick = (id: string) => {
    navigate(`/food-news/${id}`, {});
  };

  const handleProfileClick = (authorId: string) => {
    navigate(`/editors/${authorId}`, {});
  };

  return (
    <FeedContainer>
      <FixedHeader>
        <MainHeader />
      </FixedHeader>
      <ScrollableContent
        // style={{ paddingBottom: isCapacitor ? "54px" : "0px" }}
      >
        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <div>피드를 불러오는 중...</div>
          </LoadingContainer>
        ) : hasError ? (
          <ErrorContainer>
            <div>{featuredError || allError}</div>
            <RetryButton
              onClick={() => {
                logout();
                if (featuredError) refetchFeatured();
                if (allError) refetchAll();
              }}
            >
              다시 시도
            </RetryButton>
          </ErrorContainer>
        ) : (
          <>
            {sections.map((section, sectionIndex) => (
              <div key={`section-${sectionIndex}`}>
                {/* 모든 섹션의 stickyData는 FeaturedArticle로 표시 */}
                {section.stickyData && (
                  <FeaturedArticle
                    id={section.stickyData.id}
                    category={section.stickyData.category}
                    title={section.stickyData.title}
                    description={section.stickyData.description}
                    author={section.stickyData.author}
                    authorId={section.stickyData.authorId}
                    authorProfileImageUrl={
                      section.stickyData.authorProfileImageUrl
                    }
                    date={section.stickyData.date}
                    image={section.stickyData.image}
                    keywords={section.stickyData.keywords}
                    onClick={handleArticleClick}
                    enableScrollHeader={section.isFirstSection}
                    scrollContainerRef={undefined}
                  />
                )}
                {/* 모든 섹션의 gridData는 FeaturedArticleList로 표시 */}
                {section.gridData.length > 0 && (
                  <FeaturedArticleList
                    articles={section.gridData}
                    onArticleClick={handleArticleClick}
                    onProfileClick={handleProfileClick}
                  />
                )}
                {sectionIndex === 0 && (
                  <BreakingNewsSection onNewsClick={handleNewsClick} />
                )}
              </div>
            ))}
            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <PaginationContainer>
                <PageButton
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                >
                  {"<"}
                </PageButton>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const startPage = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
                  const pageNum = startPage + i;
                  if (pageNum >= totalPages) return null;
                  return (
                    <PageButton
                      key={pageNum}
                      active={currentPage === pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum + 1}
                    </PageButton>
                  );
                })}
                <PageButton
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                >
                  {">"}
                </PageButton>
              </PaginationContainer>
            )}
          </>
        )}
      </ScrollableContent>
    </FeedContainer>
  );
}

export default Feed;
