import { useNavigate } from "react-router-dom";
import { styled } from "@app/styles";
import MainHeader from "@app/components/MainHeader";
import VotingCard from "@app/components/VotingCard";
import { useBills } from "@app/hooks/api";
import { useMemo } from "react";

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
  gap: "24px",
  overflowY: "auto",
  paddingBottom: "32px",
});

const Section = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const SectionTitle = styled("h2", {
  fontSize: "20px",
  fontWeight: 700,
  color: "$cg900",
  margin: 0,
});

const VotingCardsContainer = styled("div", {
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

const EmptyText = styled("div", {
  textAlign: "center",
  padding: "40px",
  color: "$cg500",
  fontSize: "14px",
});

function BillVotingListPage() {
  const navigate = useNavigate();
  const { data: bills, isLoading } = useBills();

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

  // 인기 법안 (투표수 기준 상위 3개)
  const hotVotingData = useMemo(() => {
    return [...votingData]
      .sort((a, b) => (b.agreePercent + b.disagreePercent) - (a.agreePercent + a.disagreePercent))
      .slice(0, 3);
  }, [votingData]);

  // 최신 법안
  const recentVotingData = useMemo(() => {
    return votingData.slice(0, 10);
  }, [votingData]);

  const handleVotingCardClick = (id: number) => {
    navigate(`/bill-voting/${id}`);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <MainHeader />
        <ContentContainer>
          <LoadingText>로딩 중...</LoadingText>
        </ContentContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <MainHeader />
      <ContentContainer>
        {/* 화제의 빌보팅 섹션 */}
        <Section>
          <SectionTitle>화제의 빌보팅</SectionTitle>
          <VotingCardsContainer>
            {hotVotingData.length === 0 ? (
              <EmptyText>법안이 없습니다</EmptyText>
            ) : (
              hotVotingData.map((item) => (
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
              ))
            )}
          </VotingCardsContainer>
        </Section>

        {/* 최신 법안 섹션 */}
        <Section>
          <SectionTitle>최신 법안</SectionTitle>
          <VotingCardsContainer>
            {recentVotingData.length === 0 ? (
              <EmptyText>법안이 없습니다</EmptyText>
            ) : (
              recentVotingData.map((item) => (
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
              ))
            )}
          </VotingCardsContainer>
        </Section>
      </ContentContainer>
    </PageContainer>
  );
}

export default BillVotingListPage;
