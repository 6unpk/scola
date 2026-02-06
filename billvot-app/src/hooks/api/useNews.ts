import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { newsService, NewsItem, NewsResponse } from "@app/api/services/news";

export const useNews = () => {
  return useQuery<NewsResponse>({
    queryKey: ["news"],
    queryFn: () => newsService.getAll(1, 5),
  });
};

export const useInfiniteNews = () => {
  return useInfiniteQuery<NewsResponse>({
    queryKey: ["news", "infinite"],
    queryFn: ({ pageParam = 1 }) => newsService.getAll(pageParam as number, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.has_more) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
  });
};
