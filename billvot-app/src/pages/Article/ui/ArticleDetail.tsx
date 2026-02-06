import { useRef, useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import ReporterInfo from "@app/components/ReporterInfo";
import FeaturedArticle from "@app/pages/Feed/ui/FeaturedArticle";
import ArticleList, { Article } from "@app/components/ArticleList";
import { styled } from "@app/styles";
import { useFoodit, useFooditBookmark, useFoodits } from "@app/hooks/useFoodit";
import { fooditService } from "@app/api/rest/services";
import { cleanHtmlContent } from "@app/utils/date";

import ArticleHeader from "./ArticleHeader";

interface AuthorInfo {
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
}
const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
  position: "relative", // PageHeader 오버레이를 위해 필요
  fontFamily: "initial", // 전역 폰트 스타일 오버라이드
  fontWeight: "normal", // 전역 폰트 웨이트 오버라이드
  // "& *": {
  //   fontFamily: "inherit",
  //   fontWeight: "inherit",
  //   listStyle: "inherit",
  // },
  "& b, & strong": {
    fontWeight: "bolder !important",
  },
  "& i, & em": {
    fontStyle: "italic !important",
  },
});

const ScrollableContent = styled("div", {
  flex: 1,
  overflowY: "auto",
});

const ContentWrapper = styled("div", {
  // marginTop 제거 - PageHeader가 오버레이되므로 불필요
});

const ArticleContent = styled("div", {
  padding: "44px 16px 0px",
  lineHeight: 1.6,
  fontSize: "16px",
  color: "#1F2937",

  // 모바일 브라우저의 자동 폰트 조정 방지 (에디터 스타일 유지)
  WebkitTextSizeAdjust: "100%",
  MozTextSizeAdjust: "100%",
  msTextSizeAdjust: "100%",

  // p 태그 마진 제거
  "& p": {
    marginBlockStart: 0,
    marginBlockEnd: 0,
    margin: 0,
  },

  // 이미지 오버플로우 방지 및 비율 유지
  "& img": {
    maxWidth: "100%",
    height: "auto",
    display: "block",
    margin: "16px 0",
    objectFit: "contain", // 이미지 비율 유지
  },

  // figure 태그 처리 (에디터에서 이미지를 figure로 감싸는 경우)
  "& figure": {
    margin: "16px 0",
    "& img": {
      maxWidth: "100%",
      height: "auto",
      objectFit: "contain", // 이미지 비율 유지
    },
  },

  // ul, ol 리스트 스타일 복원
  "& ul": {
    listStyleType: "disc",
    paddingInlineStart: "20px",
    marginTop: "12px",
    marginBottom: "12px",
  },

  "& ol": {
    listStyleType: "decimal",
    paddingInlineStart: "20px",
    marginTop: "12px",
    marginBottom: "12px",
  },

  "& li": {
    marginBottom: "8px",
  },
});

const MoreArticlesSection = styled("div", {
  padding: "20px 0",
  paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 40px)",
  borderTop: "1px solid #F3F4F6",
});

const MoreArticlesTitle = styled("h2", {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1F2937",
  margin: "0 0 20px 0",
  padding: "0 16px",
});


function ArticleDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [author, setAuthor] = useState<AuthorInfo | null>(null);

  // API 데이터 가져오기
  const { foodit, loading, error } = useFoodit(id || "");
  const { foodits: moreFoodits } = useFoodits(0, 5);
  const { toggleBookmark } = useFooditBookmark();

  const handleBack = () => {
    navigate(-1);
  };

  const handleArticleClick = () => {
    // 현재 페이지이므로 아무것도 하지 않음
  };

  const handleMoreArticleClick = (articleId: string) => {
    navigate(`/article/${articleId}`);
  };

  const handleReporterClick = () => {
    console.log("ReporterInfo 클릭, foodit:", foodit);
    console.log("authorId:", foodit?.authorId);
    if (foodit?.authorId) {
      console.log("navigate to:", `/editor-articles/${foodit.authorId}`);
      navigate(`/editor-articles/${foodit.authorId}`);
    } else {
      console.log("authorId가 없어서 기본 경로로 이동");
      navigate("/editor-articles");
    }
  };

  const [localBookmarkState, setLocalBookmarkState] = useState<{
    isBookmarked: boolean;
    count: number;
  } | null>(null);

  // 로컬 북마크 상태 초기화 및 작성자 정보 로드
  useEffect(() => {
    if (foodit) {
      // 북마크 상태 초기화 - API 데이터를 우선 사용하되, 없으면 기본값 사용
      setLocalBookmarkState({
        isBookmarked: foodit.isBookmarkedByUser ?? false,
        count: foodit.bookmarkCount ?? 0,
      });

      // 작성자 정보 로드
      const loadAuthor = async () => {
        try {
          const authorResponse = await fooditService.getAuthor(foodit.authorId);
          setAuthor(authorResponse);
        } catch (authorError) {
          console.error("작성자 정보 로드 중 오류:", authorError);
          setAuthor(null);
        }
      };
      loadAuthor();
    }
  }, [foodit?.id]); // foodit.id만 의존성으로 사용

  const handleBookmarkClick = async () => {
    if (!foodit || !localBookmarkState) return;

    // Optimistic update - 즉시 UI 업데이트
    const newIsBookmarked = !localBookmarkState.isBookmarked;
    const newCount = newIsBookmarked
      ? localBookmarkState.count + 1
      : localBookmarkState.count - 1;

    setLocalBookmarkState({
      isBookmarked: newIsBookmarked,
      count: newCount,
    });

    try {
      const updatedFoodit = await toggleBookmark(foodit.id);
      // API 응답으로 실제 상태 업데이트
      setLocalBookmarkState({
        isBookmarked: updatedFoodit.isBookmarked ?? newIsBookmarked,
        count: updatedFoodit.bookmarkCount ?? newCount,
      });
    } catch (error) {
      console.error("북마크 실패:", error);
      // 실패 시 원래 상태로 되돌리기
      setLocalBookmarkState({
        isBookmarked: !newIsBookmarked,
        count: !newIsBookmarked ? newCount + 1 : newCount - 1,
      });
    }
  };

  // 스크롤 상태 관리
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const handleScroll = () => {
      const scrollTop = scrollContainerRef.current?.scrollTop || 0;
      setIsScrolled(scrollTop > 20); // 20px 이상 스크롤 시 블러 처리
    };

    const scrollContainer = scrollContainerRef.current;
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // API 데이터를 컴포넌트에서 사용하는 형태로 변환
  const articleData = foodit
    ? {
        id: foodit.id, // UUID 문자열 그대로 사용
        category: foodit.categoryName || "ALL",
        title: cleanHtmlContent(foodit.title, true), // 제목에서는 줄바꿈 보존
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
          "https://picsum.photos/400/240?random=" + foodit.id,
        content: foodit.content, // HTML 문자열 그대로 사용
        author: {
          name: author?.name || foodit.authorNickname,
          thumbnailUrl: author?.profileImageUrl || foodit.authorProfileImageUrl || "https://picsum.photos/48/48?random=" + foodit.authorId,
        },
        bookmarkCount: foodit.bookmarkCount,
        viewCount: foodit.viewCount,
        shareCount: foodit.shareCount,
        isBookmarked: foodit.isBookmarkedByUser,
      }
    : null;

  // HTML 태그를 제거하는 함수
  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  };

  // 더 많은 아티클 데이터 변환
  const moreArticles: Article[] = moreFoodits
    .filter((moreFoodit) => moreFoodit.id !== foodit?.id) // 현재 아티클 제외
    .slice(0, 5) // 최대 5개만 표시
    .map((moreFoodit) => ({
      id: moreFoodit.id,
      category: moreFoodit.categoryName || "ALL",
      title: cleanHtmlContent(moreFoodit.title, false), // 리스트에서는 줄바꿈 제거
      description: (() => {
        const cleaned = cleanHtmlContent(moreFoodit.content, false);
        return cleaned.length > 100 ? cleaned.substring(0, 100) + "..." : cleaned;
      })(),
      author: moreFoodit.authorNickname,
      authorProfileImageUrl: moreFoodit.authorProfileImageUrl,
      date: new Date(moreFoodit.createdAt)
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\.$/, "")
        .replace(/\s+/g, ""), // 모든 공백 제거
      image:
        moreFoodit.thumbnailUrl ||
        "https://picsum.photos/120/160?random=" + moreFoodit.id,
    }));

  // 로딩 상태
  if (loading) {
    return (
      <Container>
        <ArticleHeader
          title=""
          leftButton={{ icon: "back", onClick: handleBack, iconColor: "white" }}
          likeCount={0}
          onLikeClick={() => {
            // 로딩 중에는 아무것도 하지 않음
          }}
          onShareClick={() => {
            // 로딩 중에는 아무것도 하지 않음
          }}
          overlay={true}
          isScrolled={false}
        />
        <div style={{ textAlign: "center", padding: "40px" }}>
          게시글을 불러오는 중...
        </div>
      </Container>
    );
  }

  // 에러 상태
  if (error || !articleData) {
    return (
      <Container>
        <ArticleHeader
          title=""
          leftButton={{ icon: "back", onClick: handleBack, iconColor: "white" }}
          likeCount={0}
          isBookmarked={false}
          onLikeClick={() => {
            // 에러 상태에서는 아무것도 하지 않음
          }}
          onShareClick={() => {
            // 에러 상태에서는 아무것도 하지 않음
          }}
          overlay={true}
          isScrolled={false}
        />
        <div style={{ textAlign: "center", padding: "40px", color: "#6B7280" }}>
          {error || "게시글을 찾을 수 없습니다."}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* PageHeader - 뒤로가기 버튼 (오버레이) */}
      <ArticleHeader
        title=""
        leftButton={{ icon: "back", onClick: handleBack, iconColor: "white" }}
        likeCount={localBookmarkState?.count ?? foodit?.bookmarkCount ?? 0}
        isBookmarked={localBookmarkState?.isBookmarked ?? foodit?.isBookmarkedByUser ?? false}
        onLikeClick={handleBookmarkClick}
        onShareClick={() => {
          // 공유 기능은 아직 구현되지 않음
        }}
        overlay={true}
        isScrolled={isScrolled}
      />

      <ScrollableContent ref={scrollContainerRef}>
        <ContentWrapper>
          {/* FeaturedArticle - 스크롤 컨테이너 안에 포함 */}
          <FeaturedArticle
            id={articleData.id}
            category={articleData.category}
            title={articleData.title}
            description="MZ들이 선호하는 제로인기 알아보기..."
            author={articleData.author.name}
            authorId={foodit?.authorId}
            authorProfileImageUrl={articleData.author.thumbnailUrl}
            date={articleData.date}
            image={articleData.image}
            keywords={foodit?.keywords}
            onClick={handleArticleClick}
            enableScrollHeader={true}
            scrollContainerRef={scrollContainerRef}
          />
          {/* 아티클 내용 */}
          <ArticleContent>
            <div
              dangerouslySetInnerHTML={{ __html: articleData.content }}
              style={{
                lineHeight: "1.6",
                fontSize: "16px",
                color: "#1F2937",
              }}
            />
          </ArticleContent>

          {/* 작성자 정보 */}
          <ReporterInfo
            mediaName={author?.role === "EDITOR" ? "FOODDITOR" : ""}
            reporterName={articleData.author.name}
            description={author?.description || ""}
            contact={author?.email || ""}
            thumbnailUrl={articleData.author.thumbnailUrl}
            additionalInfo={author?.hashtags || []}
            onClick={handleReporterClick}
          />

          {/* 더 많은 아티클 섹션 */}
          <MoreArticlesSection>
            <MoreArticlesTitle>
              더 많은 아티클을 확인해 보세요
            </MoreArticlesTitle>
            <ArticleList
              articles={moreArticles}
              onArticleClick={handleMoreArticleClick}
            />
          </MoreArticlesSection>
        </ContentWrapper>
      </ScrollableContent>
    </Container>
  );
}

export default ArticleDetail;
