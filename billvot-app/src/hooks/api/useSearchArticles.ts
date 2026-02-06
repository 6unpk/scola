import { useState, useEffect, useCallback } from "react";
import { articleService } from "@app/api/rest/services";
import { Article } from "@app/api/rest/types";

interface UseSearchArticlesProps {
  keyword: string;
  type?: "ALL" | "ARTICLE" | "REALTY";
}

export const useSearchArticles = ({
  keyword,
  type = "ALL",
}: UseSearchArticlesProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const fetchSearchResults = useCallback(
    async (page = 0) => {
      if (!keyword) return;

      setIsLoading(true);
      try {
        setError(null);

        // REST API 문서에 검색 API가 없어서 일반 기사 조회로 대체
        // 실제로는 검색 파라미터를 포함한 API 호출이 필요
        const response = await articleService.getArticles(page, 10);

        if (response) {
          const newArticles = response.content;

          // 키워드로 필터링 (임시 구현)
          const filteredArticles = newArticles.filter(
            (article) =>
              article.title.toLowerCase().includes(keyword.toLowerCase()) ||
              article.content.toLowerCase().includes(keyword.toLowerCase()),
          );

          if (page === 0) {
            setArticles(filteredArticles);
          } else {
            setArticles((prev) => [...prev, ...filteredArticles]);
          }

          setHasNextPage(response.offset + response.limit < response.total);
          setCurrentPage(page);
        }
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error("검색 중 오류 발생:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [keyword, type],
  );

  useEffect(() => {
    if (keyword) {
      setCurrentPage(0);
      fetchSearchResults(0);
    } else {
      setArticles([]);
      setHasNextPage(false);
      setCurrentPage(0);
    }
  }, [fetchSearchResults, keyword]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isLoading) {
      fetchSearchResults(currentPage + 1);
    }
  }, [fetchSearchResults, hasNextPage, isLoading, currentPage]);

  const refresh = useCallback(() => {
    setArticles([]);
    setCurrentPage(0);
    fetchSearchResults(0);
  }, [fetchSearchResults]);

  return {
    articles,
    isLoading,
    hasNextPage,
    loadMore,
    refresh,
    error,
  };
};
