import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import DefaultHeader from "@app/components/DefaultHeader";
import { styled } from "@app/styles";
import { ingredientService, Ingredient } from "@app/api/rest/services";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const HeaderContainer = styled("div", {
  position: "sticky",
  top: 0,
  zIndex: 10,
  backgroundColor: "white",
});

const ScrollableContent = styled("div", {
  flex: 1,
  overflowY: "auto",
  paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
});

const HeroSection = styled("div", {
  backgroundColor: "#013D21",
  padding: "40px 16px",
  textAlign: "center",
});

const IngredientName = styled("div", {
  fontFamily: "Pretendard",
  fontWeight: 700,
  fontSize: "24px",
  lineHeight: "1.193359375em",
  color: "#15D278",
  marginBottom: "8px",
});

const EnglishName = styled("div", {
  fontFamily: "Pretendard",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "1.4",
  color: "rgba(21, 210, 120, 0.7)",
  marginBottom: "16px",
});

const BadgesContainer = styled("div", {
  display: "flex",
  justifyContent: "center",
  gap: "8px",
  flexWrap: "wrap",
});

const Badge = styled("span", {
  padding: "6px 12px",
  borderRadius: "40px",
  fontFamily: "Pretendard",
  fontSize: "12px",
  fontWeight: 600,
  lineHeight: "1.193359375em",
});

const ContentSection = styled("div", {
  backgroundColor: "#FFFFFF",
  padding: "20px 16px",
  minHeight: "200px",
});

const HtmlContent = styled("div", {
  fontFamily: "Pretendard",
  fontSize: "14px",
  fontWeight: 400,
  lineHeight: "1.6",
  color: "#12161A",

  // 모바일 브라우저의 자동 폰트 조정 방지 (에디터 스타일 유지)
  WebkitTextSizeAdjust: "100%",
  MozTextSizeAdjust: "100%",
  msTextSizeAdjust: "100%",

  "& img": {
    maxWidth: "100%",
    height: "auto",
    display: "block",
    margin: "16px 0",
  },

  "& figure": {
    margin: "16px 0",
    "& img": {
      maxWidth: "100%",
      height: "auto",
    },
  },

  "& hr": {
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    margin: "20px 0",
    border: "none",
    borderTop: "1px solid #E5E7EB",
  },

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
});

function FoodWikiDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const loadIngredient = async () => {
      if (!id) {
        setError("성분 ID가 없습니다.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await ingredientService.getIngredientDetail(id);
        setIngredient(data);
      } catch (err) {
        console.error("성분 상세 정보 로드 중 오류:", err);
        setError("성분 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadIngredient();
  }, [id]);

  const getRiskStyle = (risk: string) => {
    switch (risk) {
      case "HIGH":
        return { backgroundColor: "#FEE2E2", color: "#DC2626", label: "높음" };
      case "MEDIUM":
        return { backgroundColor: "#FEF3C7", color: "#D97706", label: "중간" };
      case "LOW":
        return { backgroundColor: "#D1FAE5", color: "#059669", label: "낮음" };
      default:
        return {
          backgroundColor: "#F3F4F6",
          color: "#6B7280",
          label: "알 수 없음",
        };
    }
  };

  return (
    <Container>
      <HeaderContainer>
        <DefaultHeader
          onBack={handleBack}
          css={{
            backgroundColor: "white",
            "& svg": {
              fill: "#000000 !important",
            },
          }}
        />
      </HeaderContainer>

      <ScrollableContent>
        {isLoading ? (
          <LoadingContainer>성분 정보를 불러오는 중...</LoadingContainer>
        ) : error || !ingredient ? (
          <ErrorContainer>
            <div>{error || "성분을 찾을 수 없습니다."}</div>
            <button
              onClick={handleBack}
              style={{
                padding: "8px 16px",
                backgroundColor: "#15D278",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              돌아가기
            </button>
          </ErrorContainer>
        ) : (
          <>
            <HeroSection>
              <IngredientName>{ingredient.ingredientName}</IngredientName>
              {ingredient.englishName && (
                <EnglishName>{ingredient.englishName}</EnglishName>
              )}

              <BadgesContainer>
                {ingredient.ingredientType && (
                  <Badge
                    style={{
                      backgroundColor: "rgba(21, 210, 120, 0.16)",
                      border: "1px solid #15D278",
                      color: "#15D278",
                    }}
                  >
                    {ingredient.ingredientType}
                  </Badge>
                )}

                <Badge
                  style={{
                    backgroundColor: getRiskStyle(ingredient.risk)
                      .backgroundColor,
                    color: getRiskStyle(ingredient.risk).color,
                  }}
                >
                  위험도: {getRiskStyle(ingredient.risk).label}
                </Badge>
              </BadgesContainer>
            </HeroSection>

            <ContentSection>
              {ingredient.content ? (
                <HtmlContent
                  dangerouslySetInnerHTML={{ __html: ingredient.content }}
                />
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "#6B7280",
                    fontSize: "14px",
                  }}
                >
                  상세 정보가 없습니다.
                </div>
              )}
            </ContentSection>
          </>
        )}
      </ScrollableContent>
    </Container>
  );
}

export default FoodWikiDetailPage;
