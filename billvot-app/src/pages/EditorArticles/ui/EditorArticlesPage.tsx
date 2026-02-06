import { useState, useEffect, useCallback } from "react";

import { useNavigate, useParams } from "react-router-dom";

import DefaultHeader from "@app/components/DefaultHeader";
import ReporterInfo from "@app/components/ReporterInfo";
import ArticleTabs from "@app/components/ArticleTabs";
import ArticleList from "@app/components/ArticleList";
import { styled } from "@app/styles";
import { fooditService } from "@app/api/rest/services";
import { Foodit } from "@app/api/rest/types";
import { cleanHtmlContent } from "@app/utils/date";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const FixedContent = styled("div", {
  position: "sticky",
  top: "66px", // DefaultHeader 높이만큼
  backgroundColor: "white",
  zIndex: 10,
});

const ScrollableContent = styled("div", {
  flex: 1,
  overflowY: "auto",
  marginBottom: "80px",
});

const LoadingContainer = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
  fontSize: "16px",
  color: "#6B7280",
});

const ErrorContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
  fontSize: "16px",
  color: "#EF4444",
  gap: "12px",
  padding: "20px",
  textAlign: "center",
});

const EmptyContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
  fontSize: "16px",
  color: "#6B7280",
  gap: "12px",
  padding: "20px",
  textAlign: "center",
});

const RetryButton = styled("button", {
  padding: "8px 16px",
  backgroundColor: "#963535",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "14px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#7A2A2A",
  },
});


function EditorArticlesPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const authorId = params.id;
  const [activeTab, setActiveTab] = useState("ALL");

  console.log("EditorArticlesPage 렌더링, params:", params);
  console.log("EditorArticlesPage 렌더링, authorId:", authorId);
  const [author, setAuthor] = useState<{
    id: string;
    username: string;
    name: string;
    email: string;
    profileImageUrl: string;
    description: string;
    hashtags: string[];
    role: string;
    enabled: boolean;
    createdAt: string;
    lastLoginAt: string;
    totalFoodits: number;
    totalViews: number;
    totalBookmarks: number;
  } | null>(null);
  const [articles, setArticles] = useState<Foodit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 동적으로 카테고리 탭 생성
  const tabs = ["ALL", ...Array.from(new Set(articles.map(a => a.categoryName).filter(Boolean)))].filter(Boolean) as string[];

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleArticleClick = (id: string) => {
    navigate(`/article/${id}`);
  };

  // 작성자 정보 로드
  const loadAuthor = useCallback(async () => {
    if (!authorId) {
      console.log("authorId가 없습니다:", authorId);
      setError("작성자 ID가 없습니다.");
      setIsLoading(false);
      return;
    }

    console.log("작성자 정보 로드 시작, authorId:", authorId);
    try {
      const response = await fooditService.getAuthor(authorId);
      console.log("작성자 정보 로드 성공:", response);
      setAuthor(response);
    } catch (err: unknown) {
      console.error("작성자 정보 로드 중 오류:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "작성자 정보를 불러오는데 실패했습니다.";
      setError(errorMessage);
    }
  }, [authorId]);

  // 작성자 푸딧 목록 로드
  const loadAuthorPosts = useCallback(async () => {
    if (!authorId) {
      console.log("authorId가 없어서 푸딧 로드를 건너뜁니다:", authorId);
      return;
    }

    console.log("작성자 푸딧 로드 시작, authorId:", authorId);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fooditService.getAuthorPostsList(authorId);
      console.log("작성자 푸딧 로드 성공:", response);
      setArticles(response);
    } catch (err: unknown) {
      console.error("작성자 푸딧 로드 중 오류:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "작성자 푸딧을 불러오는데 실패했습니다.";
      setError(errorMessage);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }, [authorId]);

  useEffect(() => {
    console.log("EditorArticlesPage useEffect 실행, authorId:", authorId);
    loadAuthor();
    loadAuthorPosts();
  }, [authorId, loadAuthor, loadAuthorPosts]);

  // 푸딧을 ArticleList 컴포넌트에 맞는 형태로 변환
  const convertToArticleListFormat = (foodits: Foodit[]) => {
    return foodits.map((foodit) => ({
      id: foodit.id,
      category: foodit.categoryName || "ALL",
      title: cleanHtmlContent(foodit.title, false), // 리스트에서는 줄바꿈 제거
      description: (() => {
        const cleaned = cleanHtmlContent(foodit.content, false);
        return cleaned.length > 50 ? cleaned.substring(0, 50) + "..." : cleaned;
      })(),
      author: foodit.authorName,
      authorProfileImageUrl: foodit.authorProfileImageUrl,
      date: new Date(foodit.createdAt)
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\.$/, ""), // 
      image:
        foodit.thumbnailUrl ||
        `https://picsum.photos/120/160?random=${foodit.id}`,
    }));
  };

  const getFilteredArticles = () => {
    const convertedArticles = convertToArticleListFormat(articles);
    if (activeTab === "ALL") {
      return convertedArticles;
    }
    return convertedArticles.filter(
      (article) => article.category === activeTab,
    );
  };

  return (
    <Container>
      <DefaultHeader
        title="에디터 기사"
        leftButton={{ icon: "back", onClick: handleBack }}
      />

      {/* 고정 영역: 에디터 정보 + 탭 */}
      <FixedContent>
        {author && (
          <ReporterInfo
            mediaName={author.role === "EDITOR" ? "FOODDITOR" : ""}
            reporterName={author.name}
            description={author.description}
            contact={author.email || `총 ${author.totalFoodits}개의 푸딧 작성`}
            thumbnailUrl={author.profileImageUrl}
            additionalInfo={author.hashtags || []}
          />
        )}
        <ArticleTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={handleTabClick}
        />
      </FixedContent>

      {/* 스크롤 영역: 기사 리스트만 */}
      <ScrollableContent>
        {isLoading && (
          <LoadingContainer>푸디터를 불러오는 중...</LoadingContainer>
        )}

        {error && (
          <ErrorContainer>
            <div>{error}</div>
            <div
              style={{
                fontSize: "12px",
                color: "#9CA3AF",
                marginTop: "8px",
              }}
            >
              authorId: {authorId || "없음"}
            </div>
            <RetryButton
              onClick={() => {
                console.log("다시 시도 버튼 클릭, authorId:", authorId);
                loadAuthor();
                loadAuthorPosts();
              }}
            >
              다시 시도
            </RetryButton>
          </ErrorContainer>
        )}

        {!isLoading && !error && (
          <ArticleList
            articles={getFilteredArticles()}
            onArticleClick={handleArticleClick}
          />
        )}

        {!isLoading && !error && getFilteredArticles().length === 0 && (
          <EmptyContainer>
            <div>해당 카테고리에 푸디터가 없습니다.</div>
          </EmptyContainer>
        )}
      </ScrollableContent>
    </Container>
  );
}

export default EditorArticlesPage;
