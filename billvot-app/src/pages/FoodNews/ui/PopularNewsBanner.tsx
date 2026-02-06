import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { styled } from "../../../styles";
import { articleService, Article } from "../../../api/rest/services";
import { cleanHtmlContent } from "../../../utils/date";

const BannerContainer = styled("div", {
  position: "relative",
  width: "calc(100% - 32px)", // 좌우 margin 16px씩 제외
  aspectRatio: "288 / 358", // 288:358 비율 유지
  margin: "0 16px 20px 16px",
  borderRadius: "12px",
  overflow: "hidden",
});

const BannerSlide = styled("div", {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  padding: "20px",
  color: "white",
  opacity: 0,
  transition: "opacity 0.5s ease-in-out",
  cursor: "pointer",

  variants: {
    active: {
      true: {
        opacity: 1,
      },
    },
  },
});

const BannerOverlay = styled("div", {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
});

const BannerContent = styled("div", {
  position: "relative",
  zIndex: 1,
});

const BannerCategory = styled("div", {
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "8px",
  color: "#A7F3D0",
});

const BannerTitle = styled("h2", {
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0 0 8px 0",
  lineHeight: 1.3,
  whiteSpace: "pre-line", // 개행 문자를 실제 개행으로 표시
});

const BannerMeta = styled("div", {
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
  gap: "8px",
  fontSize: "14px",
  opacity: 0.9,
});

const BannerIndicators = styled("div", {
  position: "absolute",
  bottom: "16px",
  left: "20px",
  right: "20px",
  display: "flex",
  gap: "4px",
  zIndex: 2,
});

const Indicator = styled("div", {
  flex: 1,
  height: "3px",
  borderRadius: "2px",
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  transition: "background-color 0.3s ease",

  variants: {
    active: {
      true: {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      },
    },
  },
});

function PopularNewsBanner() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bannerArticles, setBannerArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 터치 이벤트 상태
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // 피처드 뉴스기사 로드 (배너용)
  const loadBannerArticles = async () => {
    const TARGET_COUNT = 5;
    setIsLoading(true);
    setError(null);
    try {
      const response = await articleService.getFeaturedArticles();

      // 피처드 뉴스가 5개 미만이면 최신 기사로 나머지 채우기
      if (response.length < TARGET_COUNT) {
        const needed = TARGET_COUNT - response.length;
        const fallbackResponse = await articleService.getArticles(0, needed + 5); // 여유분 포함
        // 이미 있는 피처드 기사 ID 제외
        const existingIds = new Set(response.map((a) => a.id));
        const additionalArticles = fallbackResponse.result
          .filter((a) => !existingIds.has(a.id))
          .slice(0, needed);
        setBannerArticles([...response, ...additionalArticles]);
      } else {
        setBannerArticles(response);
      }
    } catch (err: unknown) {
      console.error("배너 뉴스기사 로드 중 오류:", err);
      // 에러 시에도 최신 기사로 fallback 시도
      try {
        const fallbackResponse = await articleService.getArticles(0, TARGET_COUNT);
        setBannerArticles(fallbackResponse.result);
        setError(null);
      } catch {
        setError("배너 뉴스기사를 불러오는데 실패했습니다.");
        setBannerArticles([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBannerArticles();
  }, []);

  useEffect(() => {
    if (bannerArticles.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerArticles.length);
      }, 4000); // 4초마다 슬라이드 변경

      return () => clearInterval(timer);
    }
  }, [bannerArticles.length]);

  const handleBannerClick = (newsId: string) => {
    navigate(`/food-news/${newsId}`);
  };

  // 제목에서 <br> 태그를 개행으로 변환하는 함수
  const processTitle = (title: string) => {
    return cleanHtmlContent(title, true); // 개행 보존
  };

  // 터치 시작
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  // 터치 이동
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // 터치 종료 - 스와이프 감지
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && bannerArticles.length > 1) {
      // 왼쪽으로 스와이프 - 다음 슬라이드
      setCurrentSlide((prev) => (prev + 1) % bannerArticles.length);
    }
    if (isRightSwipe && bannerArticles.length > 1) {
      // 오른쪽으로 스와이프 - 이전 슬라이드
      setCurrentSlide((prev) => (prev - 1 + bannerArticles.length) % bannerArticles.length);
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\.$/, ""); // 
  };

  if (isLoading) {
    return (
      <BannerContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#6B7280",
          }}
        >
          인기 뉴스기사를 불러오는 중...
        </div>
      </BannerContainer>
    );
  }

  if (error) {
    return (
      <BannerContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#EF4444",
          }}
        >
          {error}
        </div>
      </BannerContainer>
    );
  }

  if (bannerArticles.length === 0) {
    return (
      <BannerContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#6B7280",
          }}
        >
          인기 뉴스기사가 없습니다.
        </div>
      </BannerContainer>
    );
  }

  return (
    <BannerContainer
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {bannerArticles.map((article, index) => (
        <BannerSlide
          key={article.id}
          active={index === currentSlide}
          style={{
            backgroundImage: `url(${article.thumbnailUrl || `https://picsum.photos/400/280?random=${article.id}`})`,
          }}
          onClick={() => handleBannerClick(article.id)}
        >
          <BannerOverlay />
          <BannerContent>
            <BannerCategory>{article.categoryName}</BannerCategory>
            <BannerTitle>{processTitle(article.title)}</BannerTitle>
            <BannerMeta>
              <span>{formatDate(article.createdAt)}</span>
              {/* <span>{article.authorNickname}</span> */}
            </BannerMeta>
          </BannerContent>
        </BannerSlide>
      ))}

      <BannerIndicators>
        {bannerArticles.map((_, index) => (
          <Indicator
            key={index}
            active={index === currentSlide}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </BannerIndicators>
    </BannerContainer>
  );
}

export default PopularNewsBanner;
