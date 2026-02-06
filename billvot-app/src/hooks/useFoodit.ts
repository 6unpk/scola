import { useState, useEffect } from "react";
import { fooditService, authService } from "@app/api/rest/services";
import { Foodit, FooditCategory } from "@app/api/rest/types";
import { useAuthStore } from "@app/store/useAuthStore";

// 푸딧 카테고리 훅
export function useFooditCategories() {
  const [categories, setCategories] = useState<FooditCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fooditService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "카테고리 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

// 푸딧 목록 훅
export function useFoodits(page: number = 0, size: number = 10) {
  const [foodits, setFoodits] = useState<Foodit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const { login } = useAuthStore();

  const fetchFoodits = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fooditService.getFoodits(page, size);
      setFoodits(response.result || []);
      setTotalPages(Math.ceil((response.total || 0) / size));
    } catch (err: any) {
      if (err?.response?.status === 401 && retryCount === 0) {
        try {
          console.log("401 에러 감지 - 토큰 갱신 시도");
          const { refreshToken: currentRefreshToken, token: currentToken } = useAuthStore.getState();
          if (!currentRefreshToken || !currentToken) {
            throw new Error("토큰이 없습니다");
          }
          const refreshResponse = await authService.refreshToken(currentRefreshToken, currentToken);
          login(refreshResponse.member, refreshResponse.accessToken, refreshResponse.refreshToken);
          console.log("토큰 갱신 성공 - 재시도");
          await fetchFoodits(1);
          return;
        } catch (refreshErr) {
          console.error("토큰 갱신 실패:", refreshErr);
          setError("로그인이 만료되었습니다. 다시 로그인해주세요.");
          useAuthStore.getState().logout();
        }
      } else {
        setError(err instanceof Error ? err.message : "푸딧 조회 실패");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodits();
  }, [page, size]);

  return {
    foodits,
    loading,
    error,
    totalPages,
    refetch: fetchFoodits,
  };
}

// 카테고리별 푸딧 훅
export function useFooditsByCategory(categoryId: string, page: number = 0, size: number = 10) {
  const [foodits, setFoodits] = useState<Foodit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchFoodits = async () => {
    if (!categoryId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fooditService.getFooditsByCategory(categoryId, page, size);
      setFoodits(response.result || []);
      setTotalPages(Math.ceil(response.total / size));
    } catch (err) {
      setError(err instanceof Error ? err.message : "카테고리 푸딧 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodits();
  }, [categoryId, page, size]);

  return {
    foodits,
    loading,
    error,
    totalPages,
    refetch: fetchFoodits,
  };
}

// 피처드 푸딧 훅
export function useFeaturedFoodits(page: number = 0, size: number = 10) {
  const [foodits, setFoodits] = useState<Foodit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const { login } = useAuthStore();

  const fetchFeaturedFoodits = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fooditService.getFeaturedFoodits(page, size);
      
      // response가 배열로 오는 경우 처리
      const fooditsArray = Array.isArray(response) ? response : (response.result || []);
      setFoodits(fooditsArray);
      
      // 배열로 오는 경우 totalPages 계산
      if (Array.isArray(response)) {
        setTotalPages(Math.ceil(fooditsArray.length / size));
      } else {
      setTotalPages(Math.ceil(response.total / size));
      }
      
      console.log("피처드 푸딧 로드 성공:", {
        count: fooditsArray.length,
        isArray: Array.isArray(response),
        data: fooditsArray
      });
    } catch (err: any) {
      if (err?.response?.status === 401 && retryCount === 0) {
        try {
          console.log("401 에러 감지 - 토큰 갱신 시도");
          const { refreshToken: currentRefreshToken, token: currentToken } = useAuthStore.getState();
          if (!currentRefreshToken || !currentToken) {
            throw new Error("토큰이 없습니다");
          }
          const refreshResponse = await authService.refreshToken(currentRefreshToken, currentToken);
          login(refreshResponse.member, refreshResponse.accessToken, refreshResponse.refreshToken);
          console.log("토큰 갱신 성공 - 재시도");
          await fetchFeaturedFoodits(1);
          return;
        } catch (refreshErr) {
          console.error("토큰 갱신 실패:", refreshErr);
          setError("로그인이 만료되었습니다. 다시 로그인해주세요.");
          useAuthStore.getState().logout();
        }
      } else {
        console.error("피처드 푸딧 조회 실패:", err);
        setError(err instanceof Error ? err.message : "피처드 푸딧 조회 실패");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedFoodits();
  }, [page, size]);

  return {
    foodits,
    loading,
    error,
    totalPages,
    refetch: fetchFeaturedFoodits,
  };
}

// 인기 푸딧 훅
export function usePopularFoodits(page: number = 0, size: number = 10) {
  const [foodits, setFoodits] = useState<Foodit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPopularFoodits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fooditService.getPopularFoodits(page, size);
      setFoodits(response.result || []);
      setTotalPages(Math.ceil(response.total / size));
    } catch (err) {
      setError(err instanceof Error ? err.message : "인기 푸딧 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularFoodits();
  }, [page, size]);

  return {
    foodits,
    loading,
    error,
    totalPages,
    refetch: fetchPopularFoodits,
  };
}

// 트렌딩 푸딧 훅
export function useTrendingFoodits(page: number = 0, size: number = 10) {
  const [foodits, setFoodits] = useState<Foodit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTrendingFoodits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fooditService.getTrendingFoodits(page, size);
      setFoodits(response.result || []);
      setTotalPages(Math.ceil(response.total / size));
    } catch (err) {
      setError(err instanceof Error ? err.message : "트렌딩 푸딧 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingFoodits();
  }, [page, size]);

  return {
    foodits,
    loading,
    error,
    totalPages,
    refetch: fetchTrendingFoodits,
  };
}

// 단일 푸딧 훅
export function useFoodit(fooditId: string) {
  const [foodit, setFoodit] = useState<Foodit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFoodit = async () => {
    if (!fooditId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // 현재 로그인한 사용자 ID 가져오기
      const authStorage = localStorage.getItem("auth-storage");
      let userId = undefined;
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          userId = parsed.state?.user?.id;
        } catch (e) {
          console.error("Auth storage 파싱 오류:", e);
        }
      }
      
      const data = await fooditService.getFoodit(fooditId, userId);
      setFoodit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "푸딧 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodit();
  }, [fooditId]);

  return {
    foodit,
    loading,
    error,
    refetch: fetchFoodit,
  };
}

// 푸딧 북마크 훅
export function useFooditBookmark() {
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleBookmark = async (fooditId: string) => {
    setIsBookmarking(true);
    setError(null);
    try {
      const response = await fooditService.toggleBookmark({ fooditId });
      return response; // 북마크 토글 응답 반환
    } catch (err) {
      setError("북마크 처리에 실패했습니다.");
      console.error("Failed to toggle foodit bookmark:", err);
      throw err;
    } finally {
      setIsBookmarking(false);
    }
  };

  return { toggleBookmark, isBookmarking, error };
}
