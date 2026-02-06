import { useState, useEffect, useRef } from "react";

import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

import DefaultHeader from "../../../components/DefaultHeader";
import BaseInput from "../../../components/BaseInput";
import { styled } from "../../../styles";
import { foodSearchService, foodScanService, type Food } from "../../../api/rest/services";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const SearchContainer = styled("div", {
  padding: "20px",
});

const SearchResults = styled("div", {
  flex: 1,
  padding: "20px",
  marginBottom: "80px",
  overflowY: "scroll",
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

const LoadingText = styled("div", {
  textAlign: "center",
  color: "$cg600",
  fontSize: "14px",
  padding: "20px",
});

const NoResultsText = styled("div", {
  textAlign: "center",
  color: "$cg600",
  fontSize: "14px",
  padding: "20px",
});

const ErrorText = styled("div", {
  textAlign: "center",
  color: "$danger",
  fontSize: "14px",
  padding: "20px",
});

const LoadMoreTrigger = styled("div", {
  height: "1px",
  width: "100%",
});

function FoodSearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL 파라미터에서 검색어 가져오기 (뒤로가기 시 자동 복원)
  const queryFromUrl = searchParams.get("q") || "";
  // location.state에서 초기 검색어 가져오기 (다른 페이지에서 넘어올 때)
  const initialQueryFromState = (location.state as { initialQuery?: string })?.initialQuery || "";

  // URL 파라미터 우선, 없으면 state에서 가져옴
  const initialQuery = queryFromUrl || initialQueryFromState;

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const currentSearchQuery = useRef("");
  const isFirstMount = useRef(true);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSearch = async (value: string, pageNum: number = 0) => {
    if (!value.trim()) {
      setSearchResults([]);
      setError(null);
      setHasMore(true);
      setPage(0);
      return;
    }

    if (pageNum === 0) {
    setIsLoading(true);
      currentSearchQuery.current = value;
    } else {
      setIsLoadingMore(true);
    }
    
    setError(null);

    try {
      const response = await foodSearchService.searchFoodsFuzzy(value, pageNum, 20);
      
      if (pageNum === 0) {
      setSearchResults(response.result);
      } else {
        setSearchResults(prev => [...prev, ...response.result]);
      }

      setHasMore(response.result.length === 20);
      setPage(pageNum);

      if (response.result.length === 0 && pageNum === 0) {
        setError("검색 결과가 없습니다.");
      }
    } catch (err: any) {
      console.error("음식 검색 중 오류 발생:", err);
      setError(err.response?.data?.message || "검색 중 오류가 발생했습니다.");
      if (pageNum === 0) {
      setSearchResults([]);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!isLoadingMore && hasMore && currentSearchQuery.current) {
      handleSearch(currentSearchQuery.current, page + 1);
    }
  };

  // URL 파라미터(queryFromUrl)가 변경되면 검색어 동기화 (뒤로가기 시)
  useEffect(() => {
    if (queryFromUrl && queryFromUrl !== searchQuery) {
      setSearchQuery(queryFromUrl);
      currentSearchQuery.current = queryFromUrl;
      handleSearch(queryFromUrl, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryFromUrl]);

  // 첫 마운트 시 initialQuery가 있으면 검색 실행
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      if (initialQuery.trim() && !queryFromUrl) {
        // state에서 온 initialQuery가 있고 URL에는 없으면 URL 업데이트
        setSearchParams({ q: initialQuery }, { replace: true });
        currentSearchQuery.current = initialQuery;
        handleSearch(initialQuery, 0);
      } else if (queryFromUrl) {
        // URL에 이미 있으면 검색 실행
        currentSearchQuery.current = queryFromUrl;
        handleSearch(queryFromUrl, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 사용자 입력에 의한 검색 (디바운스 적용)
  useEffect(() => {
    // 첫 마운트나 URL 동기화 시에는 스킵
    if (isFirstMount.current) {
      return;
    }

    // URL과 같으면 이미 처리됨
    if (searchQuery === queryFromUrl) {
      return;
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setError(null);
      setPage(0);
      setHasMore(true);
      currentSearchQuery.current = "";
      setSearchParams({}, { replace: true });
      return;
    }

    const timeoutId = setTimeout(() => {
      // URL 파라미터 업데이트 (뒤로가기 시 복원용)
      setSearchParams({ q: searchQuery }, { replace: true });
      handleSearch(searchQuery, 0);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery, queryFromUrl, setSearchParams]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, isLoadingMore, isLoading, page]);

  const handleResultClick = async (food: Food) => {
    setSelectedResult(food.id);

    try {
      // 수동 검색으로 선택한 식품을 분석 기록으로 저장
      await foodScanService.manualSelection(
        food.id,
        food.productName,
        searchQuery
      );
    } catch (error) {
      console.error("수동 선택 기록 저장 실패:", error);
      // 에러가 발생해도 상세 페이지로 이동은 계속 진행
    }

    // 상세 페이지로 이동 (검색어는 URL 파라미터에 이미 저장됨)
    navigate(`/food-detail/${food.id}`);
  };

  return (
    <Container>
      <DefaultHeader
        title="Food Scanner_Food Typing Search"
        leftButton={{ icon: "arrow_back", onClick: handleBack }}
      />

      <SearchContainer>
        <BaseInput
          placeholder="정확한 상품명을 입력해 주세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(searchQuery);
            }
          }}
        />
      </SearchContainer>

      <SearchResults>
        {isLoading && <LoadingText>검색 중...</LoadingText>}

        {error && <ErrorText>{error}</ErrorText>}

        {!isLoading && !error && searchResults.length === 0 && searchQuery && (
          <NoResultsText>검색 결과가 없습니다.</NoResultsText>
        )}

        {searchResults.map((food) => (
            <SearchResultCard
              key={food.id}
              selected={selectedResult === food.id}
              onClick={() => handleResultClick(food)}
            >
              <ProductName>{food.productName}</ProductName>
              <CompanyName>{food.businessName}</CompanyName>
            </SearchResultCard>
          ))}

        {searchResults.length > 0 && hasMore && (
          <LoadMoreTrigger ref={loadMoreRef} />
        )}

        {isLoadingMore && <LoadingText>더 불러오는 중...</LoadingText>}

        {!hasMore && searchResults.length > 0 && (
          <NoResultsText>모든 결과를 불러왔습니다.</NoResultsText>
        )}
      </SearchResults>
    </Container>
  );
}

export default FoodSearchPage;
