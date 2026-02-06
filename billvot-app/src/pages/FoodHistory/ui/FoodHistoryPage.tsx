import { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import DefaultHeader from "../../../components/DefaultHeader";
import { styled } from "../../../styles";
import { foodScanService, FoodScanResponse } from "../../../api/rest/services";
import { useAuth } from "../../../hooks/api/useAuth";

const Container = styled("div", {
  width: "100%",
  height: "100%",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const HeaderContainer = styled("div", {
  padding: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const PageTitle = styled("h1", {
  fontSize: "24px",
  fontWeight: "bold",
  color: "$cg900",
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const SubText = styled("span", {
  fontSize: "14px",
  fontWeight: "normal",
  color: "$cg400",
});

const DeleteAllButton = styled("button", {
  background: "none",
  border: "none",
  color: "$cg600",
  fontSize: "14px",
  textDecoration: "underline",
  cursor: "pointer",
});

const HistoryList = styled("div", {
  flex: 1,
  padding: "0 20px",
  overflowY: "auto",
  maxHeight: "calc(100dvh - 200px)", // 헤더와 타이틀 영역을 제외한 높이
});

const HistoryItem = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 0",
  borderBottom: "1px solid $cg100",
  cursor: "pointer",
  transition: "background-color 0.2s ease",

  "&:hover": {
    backgroundColor: "$cg50",
  },
});

const HistoryInfo = styled("div", {
  flex: 1,
});

const FoodName = styled("div", {
  fontSize: "16px",
  fontWeight: "bold",
  color: "$cg900",
  marginBottom: "4px",
});

const CompanyAndDate = styled("div", {
  fontSize: "14px",
  color: "$cg600",
});

const DeleteButton = styled("button", {
  background: "none",
  border: "none",
  color: "$cg400",
  fontSize: "18px",
  cursor: "pointer",
  padding: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "24px",
  height: "24px",
});

const LoadingText = styled("div", {
  textAlign: "center",
  color: "$cg600",
  fontSize: "14px",
  padding: "40px 20px",
});

const ErrorText = styled("div", {
  textAlign: "center",
  color: "$danger",
  fontSize: "14px",
  padding: "40px 20px",
});

const EmptyText = styled("div", {
  textAlign: "center",
  color: "$cg600",
  fontSize: "14px",
  padding: "40px 20px",
});

function FoodHistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [historyData, setHistoryData] = useState<FoodScanResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 스캔 기록 데이터 로드
  const loadHistoryData = async (pageNum: number = 0, append: boolean = false) => {
    if (!user?.id) {
      setError("로그인이 필요합니다.");
      setIsLoading(false);
      return;
    }

    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // 사용자의 스캔 결과 조회 (페이징)
      const response = await foodScanService.getFoodScansByUser(user.id, pageNum, 10);

      if (append) {
        setHistoryData(prev => [...prev, ...response.result]);
      } else {
        setHistoryData(response.result);
      }

      // 더 가져올 데이터가 있는지 확인
      setHasMore(response.result.length === 10);
    } catch (err: any) {
      console.error("스캔 기록 로드 실패:", err);
      setError(err.response?.data?.message || "데이터를 불러올 수 없습니다.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // 컴포넌트 마운트 시 및 사용자 변경 시 데이터 로드
  useEffect(() => {
    setPage(0);
    setHistoryData([]);
    setHasMore(true);
    loadHistoryData(0, false);
  }, [user?.id]);

  // 인피니트 스크롤 - IntersectionObserver
  useEffect(() => {
    if (!hasMore || isLoadingMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadHistoryData(nextPage, true);
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

  const handleBack = () => {
    navigate(-1);
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("모든 분석 기록을 삭제하시겠습니까?")) {
      return;
    }

    try {
      // 모든 스캔 기록 삭제 (개별 삭제 API를 순차적으로 호출)
      const deletePromises = historyData.map((item) =>
        foodScanService.deleteFoodScan(item.id),
      );

      await Promise.all(deletePromises);

      // 성공 시 로컬 상태 업데이트
      setHistoryData([]);
      alert("모든 분석 기록이 삭제되었습니다.");
    } catch (err: any) {
      console.error("전체 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleDeleteItem = async (id: string, event: React.MouseEvent) => {
    // 이벤트 전파 방지 (부모의 클릭 이벤트가 실행되지 않도록)
    event.stopPropagation();

    if (!window.confirm("이 분석 기록을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await foodScanService.deleteFoodScan(id);

      // 성공 시 로컬 상태에서 해당 항목 제거
      setHistoryData(historyData.filter((item) => item.id !== id));
      alert("분석 기록이 삭제되었습니다.");
    } catch (err: any) {
      console.error("개별 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleItemClick = (item: FoodScanResponse) => {
    // 성공적으로 스캔된 경우에만 상세 페이지로 이동
    if (item.scanStatus === "SUCCESS" && item.foodCode) {
      // AI 생성된 결과인지 확인
      if (item.foodCode.startsWith('ai-')) {
        // AI 생성 결과인 경우 전체 스캔 데이터를 함께 전달
        navigate(`/food-detail/${item.foodCode}`, {
          state: { 
            scanData: item,
            isAiGenerated: true 
          }
        });
      } else {
        // 일반 결과인 경우 ID만 전달
        navigate(`/food-detail/${item.foodCode}`);
      }
    } else {
      // 실패한 경우 알림
      alert("인식에 실패한 기록입니다. 상세 정보를 볼 수 없습니다.");
    }
  };

  return (
    <Container>
      <DefaultHeader
        title="Food Scanner_Food Analysis Record"
        leftButton={{ icon: "arrow_back", onClick: handleBack }}
      />

      <HeaderContainer>
        <PageTitle>
          푸드 분석 기록
          <SubText>(최근 30일 이내)</SubText>
        </PageTitle>
        <DeleteAllButton onClick={handleDeleteAll}>전체 삭제</DeleteAllButton>
      </HeaderContainer>

      <HistoryList>
        {isLoading && <LoadingText>분석 기록을 불러오는 중...</LoadingText>}

        {error && (
          <ErrorText>
            {error}
            <br />
            <button
              onClick={loadHistoryData}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              다시 시도
            </button>
          </ErrorText>
        )}

        {!isLoading && !error && historyData.length === 0 && (
          <EmptyText>분석 기록이 없습니다.</EmptyText>
        )}

        {!isLoading &&
          !error &&
          historyData.map((item) => (
            <HistoryItem key={item.id} onClick={() => handleItemClick(item)}>
              <HistoryInfo>
                <FoodName>{item.foodName || "인식 실패"}</FoodName>
                <CompanyAndDate>
                  {new Date(item.createdAt)
                    .toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                    .replace(/\.$/, "")}
                </CompanyAndDate>
              </HistoryInfo>
              <DeleteButton onClick={(e) => handleDeleteItem(item.id, e)}>
                ✕
              </DeleteButton>
            </HistoryItem>
          ))}

        {/* 인피니트 스크롤 트리거 */}
        {!isLoading && !error && hasMore && (
          <div ref={loadMoreRef} style={{ height: "20px" }} />
        )}

        {/* 로딩 더보기 표시 */}
        {isLoadingMore && (
          <LoadingText>더 불러오는 중...</LoadingText>
        )}

        {/* 모든 데이터 로드 완료 */}
        {!isLoading && !error && !hasMore && historyData.length > 0 && (
          <EmptyText>모든 기록을 불러왔습니다.</EmptyText>
        )}
      </HistoryList>
    </Container>
  );
}

export default FoodHistoryPage;
