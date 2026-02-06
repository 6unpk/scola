import { restClient } from "../rest/client";

export type NewsItem = {
  id: number;
  title: string;
  url: string;
  source: string;
  image_url: string | null;
  created_at: string;
};

export type NewsResponse = {
  data: NewsItem[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    has_more: boolean;
  };
};

export const newsService = {
  getAll: async (page: number = 1, perPage: number = 10): Promise<NewsResponse> => {
    const response = await restClient.get<NewsResponse>("/news", {
      params: { page, per_page: perPage },
    });
    return response.data;
  },
};
