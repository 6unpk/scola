import { useState, useEffect, useCallback, useMemo } from "react";
import { articleService } from "@app/api/rest/services";
import { Article } from "@app/api/rest/types";
import { useAuthStore } from "@app/store/useAuthStore";

interface UseArticlesProps {
  selectedTopicIds?: number[];
  isPopular?: boolean;
}

interface UseArticlesReturn {
  articles: Article[];
  isLoading: boolean;
  hasNextPage: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useArticles({
  selectedTopicIds,
  isPopular = false,
}: UseArticlesProps = {}): UseArticlesReturn {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const { blockedUsersIds } = useAuthStore();

  const filterBlockedUserArticles = useMemo(
    () => (articles: Article[]) => {
      return articles.filter(
        (article) => !blockedUsersIds.includes(article.user.userId),
      );
    },
    [blockedUsersIds],
  );

  const fetchArticles = useCallback(
    async (page = 0) => {
      try {
        setIsLoading(true);

        let response;

        if (isPopular) {
          // 인기 기사 조회 - REST API 문서에 없어서 일반 기사로 대체
          response = await articleService.getArticles(page, 10);
        } else {
          // 일반 기사 조회
          response = await articleService.getArticles(page, 10);
        }

        if (response) {
          const newArticles = response.content;
          const filteredArticles = filterBlockedUserArticles(newArticles);

          if (page === 0) {
            setArticles(filteredArticles);
          } else {
            setArticles((prev) => [...prev, ...filteredArticles]);
          }

          setHasNextPage(response.offset + response.limit < response.total);
          setCurrentPage(page);
        }
      } catch (error) {
        console.error("게시글을 불러오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedTopicIds, isPopular, filterBlockedUserArticles],
  );

  const loadMore = useCallback(async () => {
    if (!hasNextPage || isLoading) return;
    await fetchArticles(currentPage + 1);
  }, [hasNextPage, isLoading, currentPage, fetchArticles]);

  const refresh = useCallback(async () => {
    setCurrentPage(0);
    await fetchArticles(0);
  }, [fetchArticles]);

  useEffect(() => {
    fetchArticles(0);
  }, [fetchArticles]);

  return {
    articles,
    isLoading,
    hasNextPage,
    loadMore,
    refresh,
  };
}
