export interface Post {
  id: number;
  title: string;
  slug: string;
  body: string | null;
  excerpt: string | null;
  thumbnail: string | null;
  category: string | null;
  author_name: string;
  published_at: string | null;
  created_at: string;
  updated_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
}

export interface PostsResponse {
  meta: { total: number; page: number; per: number; total_pages: number };
  data: Post[];
}
