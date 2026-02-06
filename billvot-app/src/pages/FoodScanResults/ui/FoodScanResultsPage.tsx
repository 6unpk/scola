import { useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import DefaultHeader from "../../../components/DefaultHeader";
import { styled } from "../../../styles";
import { FoodScanResult, foodScanService } from "../../../api/rest/services";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const SearchResults = styled("div", {
  flex: 1,
  padding: "20px",
  overflowY: "scroll",
  marginBottom: "80px",
});

const SearchResultCard = styled("div", {
  border: "1px solid $cg300",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "12px",
  cursor: "pointer",
  transition: "all 0.2s ease",

  "&:hover": {
    backgroundColor: "$cg50",
  },

  variants: {
    selected: {
      true: {
        border: "2px solid $primary",
        backgroundColor: "$primary50",
      },
    },
  },
});

const ProductName = styled("div", {
  fontSize: "16px",
  fontWeight: "bold",
  color: "$cg900",
  marginBottom: "4px",
});

const CompanyName = styled("div", {
  fontSize: "14px",
  color: "$cg600",
});

const NoResultsText = styled("div", {
  textAlign: "center",
  color: "$cg600",
  fontSize: "14px",
  padding: "20px",
});

function FoodScanResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // URL state에서 스캔 결과와 scanId 가져오기
  const scanResults = location.state?.scanResults as
    | FoodScanResult[]
    | undefined;
  const scanId = location.state?.scanId as string | undefined;

  console.log("FoodScanResultsPage - scanResults:", scanResults);
  console.log("FoodScanResultsPage - scanId:", scanId);

  const handleBack = () => {
    navigate(-1);
  };

  const handleResultClick = async (result: FoodScanResult) => {
    setSelectedResult(result.id);

    // scanId가 있는 경우에만 PUT API 호출
    if (scanId) {
      try {
        setIsUpdating(true);
        // 선택한 식품 업데이트
        await foodScanService.updateSelectedFood(scanId, result.id);
        console.log("선택한 식품 업데이트 성공:", result.id);
      } catch (error) {
        console.error("선택한 식품 업데이트 실패:", error);
        alert("식품 선택 중 오류가 발생했습니다. 다시 시도해주세요.");
        setIsUpdating(false);
        return;
      } finally {
        setIsUpdating(false);
      }
    }

    // AI 생성된 결과인지 확인
    if (result.id.startsWith('ai-')) {
      // AI 생성 결과인 경우 전체 스캔 데이터를 함께 전달
      // scanResults에서 해당 결과를 찾아서 전체 데이터 구조 생성
      const fullScanData = {
        searchResults: scanResults,
        // 기타 필요한 스캔 데이터 필드들 추가
      };

      navigate(`/food-detail/${result.id}`, {
        state: {
          scanData: fullScanData,
          isAiGenerated: true
        }
      });
    } else {
      // 일반 결과인 경우 ID만 전달
      navigate(`/food-detail/${result.id}`);
    }
  };

  if (!scanResults || scanResults.length === 0) {
    return (
      <Container>
        <DefaultHeader
          title="스캔 결과"
          leftButton={{ icon: "arrow_back", onClick: handleBack }}
        />
        <SearchResults>
          <NoResultsText>스캔 결과가 없습니다.</NoResultsText>
        </SearchResults>
      </Container>
    );
  }

  // 스코어 순으로 정렬
  const sortedResults = [...scanResults].sort((a, b) => b.score - a.score);

  return (
    <Container>
      <DefaultHeader
        title={`스캔 결과 (${scanResults.length}개 발견)`}
        leftButton={{ icon: "arrow_back", onClick: handleBack }}
      />

      <SearchResults>
        {sortedResults.map((result) => (
          <SearchResultCard
            key={result.id}
            selected={selectedResult === result.id}
            onClick={() => !isUpdating && handleResultClick(result)}
            css={{
              opacity: isUpdating ? 0.6 : 1,
              cursor: isUpdating ? "not-allowed" : "pointer",
            }}
          >
            <ProductName>{result.productName}</ProductName>
            <CompanyName>{result.businessName}</CompanyName>
          </SearchResultCard>
        ))}
      </SearchResults>
    </Container>
  );
}

export default FoodScanResultsPage;
