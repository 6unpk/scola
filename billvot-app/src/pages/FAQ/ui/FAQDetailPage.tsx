import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { styled } from "@app/styles";
import PageHeader from "@app/components/PageHeader";
import { faqService, FAQ } from "@foodscanner/shared";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const ScrollableContent = styled("div", {
  flex: 1,
  overflowY: "auto",
});

const Content = styled("div", {
  backgroundColor: "white",
});

const FAQContent = styled("div", {
  padding: "20px 16px",
  display: "flex",
  backgroundColor: "white",
  flexDirection: "column",
  gap: "16px",
});

const Question = styled("h1", {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1F2937",
  margin: "0",
  lineHeight: "1.5",
});

const InfoContainer = styled("div", {
  fontSize: "12px",
  color: "#6B7280",
  paddingBottom: "8px",
  borderBottom: "1px solid #E5E7EB",
});

const Answer = styled("div", {
  fontSize: "16px",
  color: "#374151",
  lineHeight: "1.6",
  whiteSpace: "pre-line",
  wordBreak: "break-word",
});

const LoadingContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  color: "#9CA3AF",
  fontSize: "14px",
});

const ErrorContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  color: "#9CA3AF",
  fontSize: "14px",
  gap: "8px",
  padding: "40px 20px",
});

function FAQDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [faq, setFaq] = useState<FAQ | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQ = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await faqService.getFAQ(id);
        setFaq(response);
      } catch (err) {
        console.error("FAQ를 불러오는데 실패했습니다:", err);
        setError("FAQ를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQ();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  return (
    <Container>
      <PageHeader
        title="FAQ"
        leftButton={{ icon: "back", onClick: () => navigate(-1) }}
      />
      <ScrollableContent>
        {isLoading && (
          <LoadingContainer>로딩 중...</LoadingContainer>
        )}

        {error && (
          <ErrorContainer>
            <div>{error}</div>
          </ErrorContainer>
        )}

        {!isLoading && !error && faq && (
          <Content>
            <FAQContent>
              <Question>{faq.question}</Question>
              {faq.createdAt && (
                <InfoContainer>
                  <span>{formatDate(faq.createdAt)}</span>
                </InfoContainer>
              )}
              <Answer>{faq.answer}</Answer>
            </FAQContent>
          </Content>
        )}
      </ScrollableContent>
    </Container>
  );
}

export default FAQDetailPage;
