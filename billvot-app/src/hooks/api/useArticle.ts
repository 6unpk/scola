import { useState, useEffect } from "react";
import { articleService } from "@app/api/rest/services";
import { Article } from "@app/api/rest/types";

interface UseArticleReturn {
  article: Article | null;
  isLoading: boolean;
  error: string | null;
}

export function useArticle(id: string | undefined): UseArticleReturn {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const articleData = await articleService.getArticle(Number(id));
        setArticle(articleData);
      } catch (err: any) {
        console.error("기사를 불러오는데 실패했습니다:", err);
        setError(
          err.response?.data?.message || "기사를 불러오는데 실패했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  return {
    article,
    isLoading,
    error,
  };
}
