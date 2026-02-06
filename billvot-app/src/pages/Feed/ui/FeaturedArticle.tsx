import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { styled } from "../../../styles";

const FeaturedArticleContainer = styled("div", {
  position: "relative",
  height: "517px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  padding: "20px",
  color: "white",
  cursor: "pointer",
  overflow: "hidden", // 애니메이션 중 내용이 넘치지 않도록
  willChange: "height, padding, background-color", // 성능 최적화

  variants: {
    scrolled: {
      true: {
        // variants는 유지하되 transition은 제거 (scrollProgress로 직접 제어)
      },
    },
  },
});

const FeaturedOverlay = styled("div", {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    "linear-gradient(rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.9) 100%)",
  willChange: "opacity",
});

const FeaturedContent = styled("div", {
  position: "relative",
  zIndex: 1,
});

const FeaturedTitleSection = styled("div", {
  position: "absolute",
  bottom: "52px",
});

const FeaturedCategory = styled("div", {
  fontSize: "18px",
  fontWeight: "500",
  marginBottom: "8px",
  color: "white",
  letterSpacing: "0.12em",
  willChange: "opacity, transform",
});

const FeaturedTitle = styled("h1", {
  fontSize: "36px",
  margin: "0 0 14px",
  lineHeight: 1.2,
  willChange: "font-size, margin, opacity",

  span: {
    fontWeight: "900",
  },
  variants: {
    scrolled: {
      true: {
        // scrollProgress로 직접 제어
      },
    },
  },
});

const FeaturedKeywords = styled("div", {
  display: "flex",
  gap: "8px",
  marginTop: "8px",
  willChange: "opacity, transform",
  overflow: "hidden",
  flexWrap: "nowrap",
});

const KeywordTag = styled("span", {
  backgroundColor: "transparent",
  border: "1px solid #E4EAF0",
  borderRadius: "9999px",
  padding: "4px 11px",
  fontSize: "12px",
  color: "white",
  fontFamily: "SUIT",
  fontWeight: 600,
  flexShrink: 0,
  whiteSpace: "nowrap",
});

const FeaturedMeta = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "12px",
  opacity: 0.9,
  willChange: "opacity, transform",
});

const AuthorInfo = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
  width: "60px",
  flexShrink: 0,
});

const AuthorName = styled("span", {
  fontSize: "12px",
  textAlign: "center",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "100%",
});

const DateInfo = styled("span", {
  fontSize: "14px",
  fontFamily: "Helvetica",
  fontWeight: "medium",
  letterSpacing: "-0.5px",
  alignSelf: "flex-end",
});

const AuthorAvatar = styled("div", {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  backgroundColor: "#6B7280",
  backgroundSize: "cover",
  backgroundPosition: "center",
});

interface FeaturedArticleProps {
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
  onClick: (id: string) => void;
  enableScrollHeader?: boolean;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

function FeaturedArticle({
  id,
  category,
  title,
  author,
  authorId,
  authorProfileImageUrl,
  date,
  image,
  keywords,
  onClick,
  enableScrollHeader = false,
  scrollContainerRef,
}: FeaturedArticleProps) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // <br> 태그를 개행 문자로 변환
  const processedTitle = title.replace(/<br\s*\/?>/gi, '\n');

  // OS별 fontWeight 분기 (Windows는 700, 그 외 900)
  const isWindows = typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('win');
  const titleFontWeight = isWindows ? 700 : 900;

  // 작성자 정보 클릭 핸들러
  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 요소의 onClick 이벤트 방지
    if (authorId) {
      navigate(`/editor-articles/${authorId}`);
    }
  };

  useEffect(() => {
    if (!enableScrollHeader || !scrollContainerRef?.current) return;

    const handleScroll = () => {
      const scrollTop = scrollContainerRef.current?.scrollTop || 0;
      const startScroll = 50; // 스크롤 시작 지점
      const endScroll = 450; // 완전히 축소되는 지점
      
      // 0에서 1 사이의 부드러운 진행률 계산
      const progress = Math.min(Math.max((scrollTop - startScroll) / (endScroll - startScroll), 0), 1);
      
      setIsScrolled(progress > 0.1); // 약간 스크롤하면 축소 시작
      setScrollProgress(progress);
    };

    const scrollContainer = scrollContainerRef.current;
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 초기 상태 설정

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [enableScrollHeader, scrollContainerRef]);
  // 스크롤 진행률에 따른 값 보간
  const interpolatedHeight = 517 - (517 - 100) * scrollProgress; // 517px -> 100px
  const interpolatedPaddingVertical = 20 - (20 - 12) * scrollProgress; // 20px -> 12px
  const interpolatedPaddingHorizontal = 20 - (20 - 16) * scrollProgress; // 20px -> 16px
  const interpolatedFontSize = 36 - (36 - 18) * scrollProgress; // 36px -> 18px
  const interpolatedMarginBottom = 8 - (8 - 2) * scrollProgress; // 8px -> 2px
  const interpolatedBgOpacity = 0.98 * scrollProgress; // 0 -> 0.98

  return (
    <FeaturedArticleContainer
      style={{
        backgroundImage: `url(${image})`,
        height: `${interpolatedHeight}px`,
        padding: `${interpolatedPaddingVertical}px ${interpolatedPaddingHorizontal}px`,
        backgroundColor: `rgba(0, 0, 0, ${interpolatedBgOpacity})`,
        backdropFilter: scrollProgress > 0.3 ? `blur(${scrollProgress * 20}px) saturate(${100 + scrollProgress * 80}%)` : 'none',
        boxShadow: scrollProgress > 0.5 ? `0 4px ${scrollProgress * 20}px rgba(0, 0, 0, ${scrollProgress * 0.3})` : 'none',
        justifyContent: scrollProgress > 0.5 ? 'center' : 'flex-end',
      }}
      onClick={() => onClick(id)}
      scrolled={isScrolled}
    >
      <FeaturedOverlay 
        style={{
          opacity: 1 - scrollProgress * 0.7, // 1 -> 0.3
        }}
      />
      <FeaturedContent>
        <FeaturedTitleSection
          style={{
            opacity: 1 - scrollProgress,
            display: scrollProgress > 0.8 ? 'none' : 'block',
          }}
        >
          <FeaturedCategory>
            {category}
          </FeaturedCategory>
          <FeaturedTitle
            scrolled={isScrolled}
            style={{
              fontSize: `${interpolatedFontSize}px`,
            }}
          >
            {processedTitle.split('\n').map((line, index) => (
              <span key={index} style={{ fontWeight: titleFontWeight }}>
                {line}
                {index < processedTitle.split('\n').length - 1 && <br />}
              </span>
            ))}
          </FeaturedTitle>
          {keywords && keywords.length > 0 && (
            <FeaturedKeywords>
              {keywords.slice(0, 3).map((keyword, index) => (
                <KeywordTag key={index}>#{keyword}</KeywordTag>
              ))}
            </FeaturedKeywords>
          )}
        </FeaturedTitleSection>
        <FeaturedMeta
          style={{
            opacity: Math.max(0.9 - scrollProgress, 0),
            transform: `translateY(${10 * scrollProgress}px)`,
            display: scrollProgress > 0.8 ? 'none' : 'flex',
          }}
        >
          <DateInfo>{date}</DateInfo>
          <AuthorInfo 
            onClick={handleAuthorClick}
            style={{ cursor: authorId ? 'pointer' : 'default' }}
          >
            <AuthorAvatar 
              style={{
                backgroundImage: authorProfileImageUrl 
                  ? `url(${authorProfileImageUrl})` 
                  : undefined
              }}
            />
            <AuthorName>{author}</AuthorName>
          </AuthorInfo>
        </FeaturedMeta>
      </FeaturedContent>
    </FeaturedArticleContainer>
  );
}

export default FeaturedArticle;
