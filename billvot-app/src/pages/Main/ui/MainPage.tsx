import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@app/styles";
import MainHeader from "@app/components/MainHeader";
import VotingCard from "@app/components/VotingCard";
import NewsCard from "@app/components/NewsCard";
import SectionHeader from "@app/components/SectionHeader";
import ChevronLeft from "@app/assets/chevron_left.svg?react";
import ChevronRight from "@app/assets/chevron_right.svg?react";
import { useBills, useNews } from "@app/hooks/api";

const PageContainer = styled("div", {
  width: "100%",
  height: "100vh",
  backgroundColor: "$cg20",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const ContentContainer = styled("div", {
  flex: 1,
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  overflowY: "auto",
  paddingBottom: "32px",
});

const VotingSection = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const CarouselWrapper = styled("div", {
  overflow: "hidden",
  width: "100%",
});

const VotingCardsContainer = styled("div", {
  display: "flex",
  transition: "transform 0.4s ease-in-out",
});

const CarouselSlide = styled("div", {
  minWidth: "100%",
  width: "100%",
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const PaginationContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  padding: "8px 0",
});

const PaginationButton = styled("button", {
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
});

const PaginationIcon = styled("div", {
  width: "24px",
  height: "24px",
  color: "$cg500",
  "& svg": {
    width: "100%",
    height: "100%",
  },
});

const DotContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "16px",
});

const Dot = styled("div", {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: "$cg300",

  variants: {
    active: {
      true: {
        backgroundColor: "$cg900",
      },
    },
  },
});

const NewsSection = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const NewsCardsContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const LoadingText = styled("div", {
  textAlign: "center",
  padding: "40px",
  color: "$cg500",
  fontSize: "14px",
});

// 배열을 n개씩 그룹으로 나누는 함수
const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

function MainPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const { data: bills, isLoading } = useBills();
  const { data: news } = useNews();

  // API 데이터를 프론트엔드 형식으로 변환
  const votingData = useMemo(() => {
    if (!bills || bills.length === 0) return [];
    return bills.map((bill) => ({
      id: bill.id,
      title: bill.title,
      proposer: bill.author,
      proposedDate: bill.proposed_date || bill.created_at.split("T")[0],
      billNumber: bill.bill_number || "-",
      session: bill.session || "제22대",
      agreePercent: bill.agree_percent,
      disagreePercent: bill.disagree_percent,
      isPopular: bill.total_votes >= 10,
    }));
  }, [bills]);

  const CARDS_PER_PAGE = 3;
  const votingPages = chunkArray(votingData, CARDS_PER_PAGE);
  const totalPages = votingPages.length;

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  }, [totalPages]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  // 6초마다 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      handleNextPage();
    }, 6000);

    return () => clearInterval(interval);
  }, [handleNextPage]);

  const handleMoreVoting = () => {
    navigate("/bill-voting");
  };

  const handleMoreNews = () => {
    navigate("/news");
  };

  const handleVotingCardClick = (id: number) => {
    navigate(`/bill-voting/${id}`);
  };

  const handleNewsClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <PageContainer>
      <MainHeader />
      <ContentContainer>
        <VotingSection>
          <SectionHeader title="오늘의 빌보팅" onMoreClick={handleMoreVoting} />
          {isLoading ? (
            <LoadingText>법안을 불러오는 중...</LoadingText>
          ) : (
            <CarouselWrapper>
              <VotingCardsContainer css={{ transform: `translateX(-${currentPage * 100}%)` }}>
                {votingPages.map((pageItems, pageIndex) => (
                  <CarouselSlide key={pageIndex}>
                    {pageItems.map((item) => (
                      <VotingCard
                        key={item.id}
                        title={item.title}
                        proposer={item.proposer}
                        proposedDate={item.proposedDate}
                        billNumber={item.billNumber}
                        session={item.session}
                        agreePercent={item.agreePercent}
                        disagreePercent={item.disagreePercent}
                        isPopular={item.isPopular}
                                                onClick={() => handleVotingCardClick(item.id)}
                      />
                    ))}
                  </CarouselSlide>
                ))}
              </VotingCardsContainer>
            </CarouselWrapper>
          )}
          <PaginationContainer>
            <PaginationButton onClick={handlePrevPage}>
              <PaginationIcon>
                <ChevronLeft />
              </PaginationIcon>
            </PaginationButton>
            <DotContainer>
              {Array.from({ length: totalPages }).map((_, index) => (
                <Dot key={index} active={index === currentPage} />
              ))}
            </DotContainer>
            <PaginationButton onClick={handleNextPage}>
              <PaginationIcon>
                <ChevronRight />
              </PaginationIcon>
            </PaginationButton>
          </PaginationContainer>
        </VotingSection>

        <NewsSection>
          <SectionHeader title="오늘의 뉴스" onMoreClick={handleMoreNews} />
          <NewsCardsContainer>
            {news?.data?.map((item) => (
              <NewsCard
                key={item.id}
                title={item.title}
                date={item.source}
                thumbnailUrl={item.image_url || undefined}
                onClick={() => handleNewsClick(item.url)}
              />
            ))}
          </NewsCardsContainer>
        </NewsSection>
      </ContentContainer>
    </PageContainer>
  );
}

export default MainPage;
