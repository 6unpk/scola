import { useState, useEffect } from "react";
import { communityService } from "@app/api/rest/services";
import { CommunityPost, CommunityCategory } from "@app/api/rest/types";
import { PageableResponse } from "@app/api/rest/client";
import { useAuthStore } from "@app/store/useAuthStore";
import { filterBlockedArticles } from "@app/utils/blockUserFilter";

export const useCommunityPosts = (page = 0, size = 10) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: PageableResponse<CommunityPost> = await communityService.getPosts(page, size);
      const allPosts = response.result || [];
      // 차단된 사용자의 게시글 필터링
      const filteredPosts = filterBlockedArticles(allPosts);
      setPosts(filteredPosts);
      setTotalPages(Math.ceil((response.total || 0) / size));
      setTotalElements(response.total || 0);
    } catch (err: any) {
      setError(err.message || "게시글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, size]);

  return { posts, loading, error, totalPages, totalElements, refetch: fetchPosts };
};

export const useCommunityPostsByCategory = (categoryId: string, page = 0, size = 10) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchPosts = async () => {
    if (!categoryId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response: PageableResponse<CommunityPost> = await communityService.getPostsByCategory(categoryId, page, size);
      const allPosts = response.result || [];
      // 차단된 사용자의 게시글 필터링
      const filteredPosts = filterBlockedArticles(allPosts);
      setPosts(filteredPosts);
      setTotalPages(Math.ceil((response.total || 0) / size));
      setTotalElements(response.total || 0);
    } catch (err: any) {
      setError(err.message || "게시글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [categoryId, page, size]);

  return { posts, loading, error, totalPages, totalElements, refetch: fetchPosts };
};

export const useCommunityCategories = () => {
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityService.getCategories();
      setCategories(response);
    } catch (err: any) {
      setError(err.message || "카테고리를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
};

export const useCommunityPost = (postId: string) => {
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    if (!postId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await communityService.getPost(postId);
      setPost(response);
    } catch (err: any) {
      setError(err.message || "게시글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  return { post, loading, error, refetch: fetchPost };
};

export const useCommunityPostLike = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, openLoginModal } = useAuthStore();

  const toggleLike = async (postId: string) => {
    if (!user) {
      openLoginModal();
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      await communityService.togglePostLike({ postId });
      return true;
    } catch (err: any) {
      setError(err.message || "좋아요 처리에 실패했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { toggleLike, loading, error };
};
