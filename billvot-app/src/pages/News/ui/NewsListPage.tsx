import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@app/styles";
import { useInfiniteNews } from "@app/hooks/api";
import ArrowBack from "@app/assets/arrow_back.svg?react";
import LogoBillvot from "@app/assets/billvot.svg?react";

const PageContainer = styled("div", {
  width: "100%",
  height: "100vh",
  backgroundColor: "$cg20",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const Header = styled("header", {
  width: "100%",
  height: "48px",
  backgroundColor: "$white",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
  boxSizing: "border-box",
  flexShrink: 0,
  position: "relative",
});

const HeaderLeft = styled("div", {
  display: "flex",
  alignItems: "center",
});

const HeaderCenter = styled("div", {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
});

const HeaderRight = styled("div", {
  display: "flex",
  alignItems: "center",
});

const BackButton = styled("button", {
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "11px",
  marginLeft: "-11px",
});

const BackIcon = styled(ArrowBack, {
  width: "24px",
  height: "24px",
  fill: "$cg900",
});

const HeaderTitle = styled("h1", {
  fontSize: "16px",
  fontWeight: 600,
  color: "$cg900",
  margin: 0,
});

const LogoImage = styled(LogoBillvot, {
  height: "20px",
  width: "auto",
});

const ContentContainer = styled("div", {
  flex: 1,
  padding: "16px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const NewsCard = styled("div", {
  backgroundColor: "$white",
  borderRadius: "12px",
  padding: "12px",
  cursor: "pointer",
  display: "flex",
  gap: "12px",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  "&:active": {
    transform: "scale(0.98)",
  },
});

const NewsThumbnail = styled("div", {
  width: "80px",
  height: "80px",
  borderRadius: "8px",
  backgroundColor: "$cg100",
  flexShrink: 0,
  backgroundSize: "cover",
  backgroundPosition: "center",
});

const NewsContent = styled("div", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minWidth: 0,
});

const NewsTitle = styled("h2", {
  fontSize: "16px",
  fontWeight: 600,
  color: "$cg900",
  margin: 0,
  marginBottom: "8px",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  lineHeight: 1.4,
});

const NewsMeta = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "13px",
  color: "$cg500",
});

const NewsSource = styled("span", {
  fontWeight: 500,
});

const NewsDate = styled("span", {});

const LoadingText = styled("div", {
  textAlign: "center",
  padding: "20px",
  color: "$cg500",
  fontSize: "14px",
});

const EndText = styled("div", {
  textAlign: "center",
  padding: "20px",
  color: "$cg400",
  fontSize: "13px",
});

const LoadMoreTrigger = styled("div", {
  height: "20px",
});

function NewsListPage() {
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteNews();

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNewsClick = (url: string) => {
    window.open(url, "_blank");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
  };

  const allNews = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <PageContainer>
      <Header>
        <HeaderLeft>
          <BackButton onClick={handleBack}>
            <BackIcon />
          </BackButton>
        </HeaderLeft>
        <HeaderCenter>
          <HeaderTitle>오늘의 뉴스</HeaderTitle>
        </HeaderCenter>
        <HeaderRight>
          <LogoImage />
        </HeaderRight>
      </Header>

      <ContentContainer>
        {isLoading && <LoadingText>로딩 중...</LoadingText>}

        {allNews.map((news) => (
          <NewsCard key={news.id} onClick={() => handleNewsClick(news.url)}>
            {news.image_url && (
              <NewsThumbnail css={{ backgroundImage: `url(${news.image_url})` }} />
            )}
            <NewsContent>
              <NewsTitle>{news.title}</NewsTitle>
              <NewsMeta>
                <NewsSource>{news.source}</NewsSource>
                <span>·</span>
                <NewsDate>{formatDate(news.created_at)}</NewsDate>
              </NewsMeta>
            </NewsContent>
          </NewsCard>
        ))}

        {isFetchingNextPage && <LoadingText>더 불러오는 중...</LoadingText>}

        {!hasNextPage && allNews.length > 0 && (
          <EndText>모든 뉴스를 불러왔습니다</EndText>
        )}

        <LoadMoreTrigger ref={loadMoreRef} />
      </ContentContainer>
    </PageContainer>
  );
}

export default NewsListPage;
