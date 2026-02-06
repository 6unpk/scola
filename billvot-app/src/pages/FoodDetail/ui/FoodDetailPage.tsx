import { useState, useEffect, useCallback } from "react";

import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Browser } from "@capacitor/browser";

import DefaultHeader from "../../../components/DefaultHeader";
import { styled } from "../../../styles";
import { foodSearchService } from "../../../api/rest/services";
import { restClient } from "../../../api/rest/client";

// 타입 정의
interface FoodDetailResponse {
  id: string;
  productName: string;
  businessName: string;
  productType: string;
  rawMaterials: string;
  reportNumber: string;
  score: number;
  ingredients: Array<{
    ingredientName: string;
    ingredientType: string;
    risk: string;
    mentionedOrganizations?: string;
    relatedDisease?: string;
    content?: string;
    isAllergen?: boolean;
  }>;
}

interface IngredientClassification {
  ingredient: string;
  category: string;
}

interface RiskClassification {
  ingredient: string;
  riskLevel: string;
}

import AnalysisTableComponent from "./AnalysisTable";
import FilterSection from "./FilterSection";
import ProductHeaderComponent from "./ProductHeader";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const ScrollContainer = styled("div", {
  flex: 1,
  overflowY: "auto",
  padding: "20px",
  paddingBottom: "calc(20px + env(safe-area-inset-bottom))", // SafeArea 하단 여백 추가
});

const AllergenSection = styled("div", {
  marginTop: "30px",
  marginBottom: "30px",
});

const InfoSection = styled("div", {
  marginTop: "30px",
  marginBottom: "80px",
});

const InfoTitle = styled("h3", {
  fontSize: "18px",
  fontWeight: "bold",
  color: "$cg900",
  marginBottom: "8px",
});

const InfoText = styled("p", {
  fontSize: "14px",
  color: "$cg600",
  lineHeight: 1.5,
  margin: 0,
});

const LoadingContainer = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
  fontSize: "16px",
  color: "$cg600",
});

const ErrorContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
  fontSize: "16px",
  color: "$danger",
  gap: "12px",
});

const RetryButton = styled("button", {
  padding: "8px 16px",
  backgroundColor: "$primary",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "14px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "$primaryDark",
  },
});

const ModalOverlay = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "20px",
});

const ModalContent = styled("div", {
  backgroundColor: "white",
  borderRadius: "12px",
  padding: "24px",
  maxWidth: "500px",
  width: "100%",
  maxHeight: "80vh",
  overflowY: "auto",
  overflowX: "hidden",
  wordBreak: "break-word",
  overflowWrap: "break-word",
});

const ModalHeader = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
});

const ModalTitle = styled("h3", {
  fontSize: "18px",
  fontWeight: "bold",
  color: "$cg900",
  margin: 0,
  wordBreak: "break-word",
  overflowWrap: "break-word",
  flex: 1,
  paddingRight: "12px",
});

const CloseButton = styled("button", {
  backgroundColor: "transparent",
  border: "none",
  fontSize: "24px",
  color: "$cg600",
  cursor: "pointer",
  padding: "4px",
  lineHeight: 1,
  "&:hover": {
    color: "$cg900",
  },
});

const ModalBody = styled("div", {
  fontSize: "14px",
  color: "$cg700",
  lineHeight: 1.6,
  whiteSpace: "pre-line",
  wordBreak: "break-word",
  overflowWrap: "break-word",
  wordWrap: "break-word",
  maxWidth: "100%",
});

const ModalLink = styled("a", {
  color: "#4285F4",
  textDecoration: "underline",
  cursor: "pointer",
  wordBreak: "break-all",
  "&:hover": {
    color: "#1a73e8",
  },
});

function FoodDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const [selectedFilters, setSelectedFilters] = useState({
    safety: ["전체"],
    usage: ["전체"],
    organization: ["전체"],
  });

  const [foodDetail, setFoodDetail] = useState<FoodDetailResponse | null>(null);
  const [ingredientClassifications, setIngredientClassifications] = useState<
    IngredientClassification[]
  >([]);
  const [riskClassifications, setRiskClassifications] = useState<
    RiskClassification[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClassifying, setIsClassifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI 생성 결과인지 확인
  const isAiGenerated = location.state?.isAiGenerated || false;
  const scanData = location.state?.scanData;

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (isAiGenerated && scanData) {
        // AI 생성 결과인 경우
        if (
          !scanData ||
          !scanData.searchResults ||
          scanData.searchResults.length === 0
        ) {
          setError("AI 생성 데이터를 찾을 수 없습니다.");
          setIsLoading(false);
          return;
        }

        try {
          setIsLoading(true);
          setError(null);

          // AI 생성 결과에서 첫 번째 결과 사용
          const aiResult = scanData.searchResults[0];

          // AI 결과를 FoodDetailResponse 형태로 변환
          const detailData: FoodDetailResponse = {
            id: aiResult.id,
            productName: aiResult.productName,
            businessName: aiResult.businessName,
            productType: aiResult.productType,
            rawMaterials: aiResult.rawMaterials,
            reportNumber: aiResult.reportNumber,
            score: aiResult.score,
            ingredients: aiResult.ingredients.map((ingredient: any) => ({
              ingredientName: ingredient.ingredientName,
              ingredientType: ingredient.ingredientType,
              risk: ingredient.risk,
              mentionedOrganizations: ingredient.mentionedOrganizations,
              relatedDisease: ingredient.relatedDisease,
            })),
          };

          setFoodDetail(detailData);

          // AI 영양성분 분석 API를 비동기로 호출 (페이지 로딩을 블로킹하지 않음)
          try {
            setIsClassifying(true);
            console.log("AI 영양성분 분석 API 호출 시작:", {
              productName: detailData.productName,
              businessName: detailData.businessName,
            });

            const response = await restClient.post("/foods/nutrition/analyze", {
              brand: detailData.businessName,
              productName: detailData.productName,
            });

            console.log("AI 영양성분 분석 API 응답:", response.data);

            // 응답 데이터에서 성분과 분류 정보 추출
            const classifications =
              response.data.ingredientClassifications || [];
            const riskClassificationsData =
              response.data.riskClassification?.riskClassifications || [];

            setIngredientClassifications(classifications);
            setRiskClassifications(riskClassificationsData);

            console.log("AI 영양성분 데이터:", {
              classifications,
              riskClassifications: riskClassificationsData,
            });
          } catch (err: unknown) {
            console.error("AI 영양성분 분석 중 오류:", err);
            // 분석 실패해도 메인 기능은 계속 동작하도록 에러를 무시
          } finally {
            setIsClassifying(false);
          }
        } catch (err: unknown) {
          console.error("AI 생성 데이터 처리 중 오류:", err);
          setError("AI 생성 데이터를 처리하는데 실패했습니다.");
        } finally {
          setIsLoading(false);
        }
      } else {
        // 일반 결과인 경우
        if (!id) {
          setError("음식 ID가 없습니다.");
          setIsLoading(false);
          return;
        }

        try {
          setIsLoading(true);
          setError(null);

          // 음식 상세 정보 가져오기
          const detailData = await foodSearchService.getFoodDetail(id);

          setFoodDetail(detailData as FoodDetailResponse);

          // 영양성분 분류 API를 비동기로 호출 (페이지 로딩을 블로킹하지 않음)
          const ingredientNames = detailData.ingredients.map(
            (ingredient) => ingredient.ingredientName,
          );

          if (ingredientNames.length > 0) {
            try {
              setIsClassifying(true);
              console.log("영양성분 분류 API 호출 시작:", ingredientNames);

              const response = await restClient.post(
                "/foodscan/classify-ingredients",
                {
                  ingredients: ingredientNames,
                },
              );

              console.log("영양성분 분류 API 응답:", response.data);
              setIngredientClassifications(response.data.classifications);
            } catch (err: unknown) {
              console.error("영양성분 분류 중 오류:", err);
              // 분류 실패해도 메인 기능은 계속 동작하도록 에러를 무시
            } finally {
              setIsClassifying(false);
            }
          }
        } catch (err: unknown) {
          console.error("음식 상세 정보 로드 중 오류:", err);
          const errorMessage =
            err instanceof Error && "response" in err
              ? (err as { response?: { data?: { message?: string } } }).response
                  ?.data?.message || "음식 정보를 불러오는데 실패했습니다."
              : "음식 정보를 불러오는데 실패했습니다.";
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [id, isAiGenerated, scanData]);

  const handleFilterClick = (
    category: keyof typeof selectedFilters,
    filter: string,
  ) => {
    setSelectedFilters((prev) => {
      const currentFilters = prev[category];

      if (filter === "전체") {
        // '전체' 클릭 시 모든 다른 필터 해제
        return {
          ...prev,
          [category]: ["전체"],
        };
      } else {
        // 다른 필터 클릭 시
        let newFilters;
        if (currentFilters.includes(filter)) {
          // 이미 선택된 필터 해제
          newFilters = currentFilters.filter((f: string) => f !== filter);
          // 모든 필터가 해제되면 '전체' 선택
          if (
            newFilters.length === 0 ||
            (newFilters.length === 1 && newFilters[0] === "전체")
          ) {
            newFilters = ["전체"];
          }
        } else {
          // 새 필터 추가하고 '전체' 해제
          newFilters = [
            ...currentFilters.filter((f: string) => f !== "전체"),
            filter,
          ];
        }

        return {
          ...prev,
          [category]: newFilters,
        };
      }
    });
  };

  const [selectedIngredient, setSelectedIngredient] = useState<{
    name: string;
    content: string;
  } | null>(null);

  // 필터링된 데이터 반환
  const getFilteredAnalysisData = () => {
    const data = getAnalysisData();

    // 안전등급 필터 적용
    if (!selectedFilters.safety.includes("전체")) {
      return data.filter((item) => selectedFilters.safety.includes(item.risk));
    }

    return data;
  };

  const handleSelectAll = () => {
    setSelectedFilters({
      safety: ["전체"],
      usage: ["전체"],
      organization: ["전체"],
    });
  };

  // API 데이터를 원래 순서대로 반환 (그룹화 안 함)
  const getAnalysisData = () => {
    const orderedData: Array<{
      name: string;
      usage: string;
      organizations: string[];
      relatedDisease: string | null;
      risk: string;
      content?: string;
    }> = [];

    // AI 생성 결과인 경우 원본 데이터의 모든 성분을 표시
    if (isAiGenerated && foodDetail) {
      foodDetail.ingredients.forEach((ingredient: any) => {
        const ingredientName = ingredient.ingredientName;

        // 영양성분 분류 결과에서 해당 성분의 카테고리 찾기
        const classification = ingredientClassifications.find(
          (classification) =>
            classification.ingredient.toLowerCase().trim() ===
            ingredientName.toLowerCase().trim(),
        );

        // 위험도 분류에서 해당 성분의 위험도 찾기
        const riskClassification = riskClassifications.find(
          (risk) =>
            risk.ingredient.toLowerCase().trim() ===
            ingredientName.toLowerCase().trim(),
        );

        // ingredientType이 있으면 우선 사용, 없으면 AI 분류 결과 사용
        const usageText = ingredient.ingredientType
          ? ingredient.ingredientType
          : classification
          ? classification.category
          : isClassifying
          ? "분류 중..."
          : "미상";

        // 원본 데이터의 위험도를 우선 사용, 없으면 분류 결과 사용
        const riskLevel =
          ingredient.risk || riskClassification?.riskLevel || "미상";

        orderedData.push({
          name: ingredientName,
          usage: usageText,
          organizations: [],
          relatedDisease: null,
          risk: riskLevel,
          content: undefined,
        });
      });
    }
    // 일반 결과인 경우 기존 로직 사용
    else if (foodDetail?.ingredients) {
      foodDetail.ingredients.forEach((ingredient: any) => {
        const riskCategory = ingredient.risk;

        // 영양성분 분류 결과에서 해당 성분의 카테고리 찾기 (대소문자 무시)
        const classification = ingredientClassifications.find(
          (classification) =>
            classification.ingredient.toLowerCase().trim() ===
            ingredient.ingredientName.toLowerCase().trim(),
        );

        // ingredientType이 있으면 우선 사용, 없으면 AI 분류 결과 사용
        const usageText = ingredient.ingredientType
          ? ingredient.ingredientType
          : classification
          ? classification.category
          : isClassifying
          ? "분류 중..."
          : "미상";

        // 위험도를 표준화
        let standardRisk = "보통";
        if (riskCategory === "경고") {
          standardRisk = "경고";
        } else if (riskCategory === "주의") {
          standardRisk = "주의";
        } else if (riskCategory === "특정인 피해야 함") {
          standardRisk = "경고";
        } else if (riskCategory === "미상") {
          standardRisk = "미상";
        }

        orderedData.push({
          name: ingredient.ingredientName,
          usage: usageText,
          organizations: ingredient.mentionedOrganizations
            ? ingredient.mentionedOrganizations
                .split(',')
                .map((org: string) => org.trim())
                .filter((org: string) => org.length > 0)
            : [],
          relatedDisease: ingredient.relatedDisease,
          risk: standardRisk,
          content: ingredient.content,
        });
      });
    }

    return orderedData;
  };

  const analysisData = getAnalysisData();

  // 알레르기 성분 필터링
  const getAllergenIngredients = () => {
    if (!foodDetail?.ingredients) return [];
    
    return foodDetail.ingredients
      .filter((ingredient) => ingredient.isAllergen === true)
      .map((ingredient) => ingredient.ingredientName);
  };

  const allergenIngredients = getAllergenIngredients();

  // 텍스트에서 URL을 찾아 클릭 가능한 링크로 변환하는 함수
  const renderContentWithLinks = (text: string) => {
    // URL 패턴 정규식
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlPattern);

    return parts.map((part, index) => {
      // URL인 경우 클릭 가능한 링크로 변환
      if (part.match(urlPattern)) {
        return (
          <ModalLink
            key={index}
            onClick={async (e) => {
              e.preventDefault();
              await Browser.open({ url: part });
            }}
          >
            {part}
          </ModalLink>
        );
      }
      // 일반 텍스트인 경우 그대로 반환
      return part;
    });
  };

  return (
    <Container>
      <DefaultHeader
        title="Food Scanner_Food Detail"
        leftButton={{ icon: "arrow_back", onClick: handleBack }}
      />

      <ScrollContainer>
        {isLoading && (
          <LoadingContainer>음식 정보를 불러오는 중...</LoadingContainer>
        )}

        {error && (
          <ErrorContainer>
            <div>{error}</div>
            <RetryButton onClick={() => window.location.reload()}>
              다시 시도
            </RetryButton>
          </ErrorContainer>
        )}

        {!isLoading && !error && foodDetail && (
          <>
            <ProductHeaderComponent
              productName={foodDetail.productName}
              companyName={foodDetail.businessName}
              safetyData={{
                safe: analysisData.filter((item) => item.risk === "보통")
                  .length,
                caution: analysisData.filter((item) => item.risk === "주의")
                  .length,
                danger: analysisData.filter((item) => item.risk === "경고")
                  .length,
                specific: 0,
                unknown: analysisData.filter((item) => item.risk === "미상")
                  .length,
              }}
            />

            <FilterSection
              selectedFilters={selectedFilters}
              onFilterClick={handleFilterClick}
              onSelectAll={handleSelectAll}
            />

            <AnalysisTableComponent
              analysisData={getFilteredAnalysisData()}
              isClassifying={isClassifying}
              onIngredientClick={(name, content) => {
                if (content) {
                  setSelectedIngredient({ name, content });
                }
              }}
            />

            <AllergenSection>
              <InfoTitle>알레르기 표기 권고</InfoTitle>
              <InfoText>
                {allergenIngredients.length === 0
                  ? "없음"
                  : allergenIngredients.join(", ")}
              </InfoText>
            </AllergenSection>

            <InfoSection>
              <InfoTitle>참고 정보</InfoTitle>
              <InfoText>
                해당 분석 정보는 EWG, CSPI, WHO, JECFA, EFSA, FDA 등 국제적
                기관의 DB를 기반으로 생성형 AI가 자동 도출한 결과로 데이터에
                일부 오류가 있을 수 있으며, FOOD SCANNER는 해당 결과에 대한
                책임을 지지 않습니다.
              </InfoText>
              <br />
              <InfoText>
                주의가 필요하거나 자주 드시는 식품 성분은 전문의 상담을 통해
                개인별, 상황별 적정 용량을 확인하시기를 권장합니다.
              </InfoText>
              <br />
              <InfoText>
                원재료 성분 등급이 보통, 미상으로 분류되었더라도 추후 외부기관의 분석
                결과에 따라 예고없이 주의 또는 경고로 변경될 수 있습니다. 또한,
                식품 업데이트는 정기적으로 진행되며 원재료명 구성은 식품 업체의
                제품 리뉴얼 시기에 따라 일부 또는 전면 변경될 수 있습니다.
              </InfoText>
              <br />
              <InfoText>
              푸드스캐너 등급은 다음과 같이 분류됩니다.<br />
              보통 : 국제 기관에서 경고 및 제한 권고를 받지 않은 원재료 <br />
              주의 : 개인별 적정 섭취 허용량 확인 및 주의가 필요한 원재료<br />
              경고 : 국제 기관에서 사용 금지를 지정했거나 경고한 원재료<br />
              미상 : 여러 내용물 혼합으로 확인이 어렵거나 등급 보류인 원재료<br />
              알레르기 : 주요 알레르기 유발 가능 표기를 권고한 원재료<br />
              </InfoText>
            </InfoSection>
          </>
        )}
      </ScrollContainer>

      {selectedIngredient && (
        <ModalOverlay onClick={() => setSelectedIngredient(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{selectedIngredient.name}</ModalTitle>
              <CloseButton onClick={() => setSelectedIngredient(null)}>
                ×
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              {renderContentWithLinks(selectedIngredient.content)}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

export default FoodDetailPage;
