import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import MainHeader from "@app/components/MainHeader";
import { styled } from "@app/styles";
import { useCommunityPosts, useCommunityPostsByCategory, useCommunityCategories, useCommunityPostLike } from "@app/hooks/useCommunity";
import { communityService } from "@app/api/rest/services";
import { filterBlockedArticles } from "@app/utils/blockUserFilter";
import { useAuthStore } from "@app/store/useAuthStore";

import CommunityPostList from "./CommunityPostList";

const CommunityContainer = styled("div", {
  width: "100%",
  height: "100%",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const FixedHeader = styled("div", {
  position: "absolute",
  backgroundColor: "white",
  width: "100%",
  zIndex: 10,
});

const CommunityHeader = styled("div", {
  position: "absolute",
  top: "62px",
  left: 0,
  right: 0,
  height: "48px",
  backgroundColor: "$secondary",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
  borderTop: "1px solid #E5E7EB",
  borderBottom: "1px solid #E5E7EB",
  zIndex: 5,
});

const CommunityTitle = styled("h1", {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1F2937",
  margin: 0,
  cursor: "pointer",
  userSelect: "none",
  
  "&:hover": {
    color: "#374151",
  },
});

const WriteButton = styled("button", {
  background: "none",
  border: "none",
  color: "#6B7280",
  fontSize: "14px",
  textDecoration: "underline",
  cursor: "pointer",
  padding: "4px 0",

  "&:hover": {
    color: "#374151",
  },
});

const ScrollableContent = styled("div", {
  flex: 1,
  overflowY: "auto",
  paddingTop: "104px", // 헤더 + 커뮤니티 헤더 높이만큼 여백
  paddingBottom: "calc(80px + env(safe-area-inset-bottom))", // 바텀바 높이 + SafeArea
});

const ContentWrapper = styled("div", {
  padding: "16px",
});


function CommunityPage() {
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(0); // API는 0부터 시작
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("전체");
  const [popularPosts, setPopularPosts] = useState<any[]>([]);

  // 카테고리 목록 가져오기
  const { categories, loading: categoriesLoading } = useCommunityCategories();

  // 게시글 데이터 가져오기
  const { 
    posts: allPosts, 
    loading: allPostsLoading, 
    totalPages: allTotalPages,
    refetch: refetchAllPosts
  } = useCommunityPosts(currentPage, 10);

  const { 
    posts: categoryPosts, 
    loading: categoryPostsLoading, 
    totalPages: categoryTotalPages,
    refetch: refetchCategoryPosts
  } = useCommunityPostsByCategory(selectedCategory && selectedCategory !== "popular" ? selectedCategory : "", currentPage, 10);

  // 인기글 데이터
  const [popularPostsList, setPopularPostsList] = useState<any[]>([]);
  const [popularPostsLoading, setPopularPostsLoading] = useState(false);
  const [popularPostsTotalPages, setPopularPostsTotalPages] = useState(0);

  // 인기글 가져오기 (페이지네이션)
  React.useEffect(() => {
    const fetchPopularPosts = async () => {
      if (selectedCategory !== "popular") return;
      
      setPopularPostsLoading(true);
      try {
        const response = await communityService.getPopularPosts(currentPage, 10);
        const allPopularPosts = response.result || [];
        // 차단된 사용자의 인기글 필터링
        const filteredPopularPosts = filterBlockedArticles(allPopularPosts);
        setPopularPostsList(filteredPopularPosts);
        setPopularPostsTotalPages(Math.ceil((response.total || 0) / 10));
      } catch (error) {
        console.error("인기글 조회 실패:", error);
        setPopularPostsList([]);
      } finally {
        setPopularPostsLoading(false);
      }
    };

    fetchPopularPosts();
  }, [currentPage, selectedCategory]);

  // 현재 표시할 데이터 결정 (인기글은 별도 처리)
  const isPopularCategory = selectedCategory === "popular";
  const posts = isPopularCategory ? popularPostsList : (selectedCategory ? categoryPosts : allPosts);
  const loading = isPopularCategory ? popularPostsLoading : (selectedCategory ? categoryPostsLoading : allPostsLoading);
  const totalPages = isPopularCategory ? popularPostsTotalPages : (selectedCategory ? categoryTotalPages : allTotalPages);
  const refetch = isPopularCategory ? () => {} : (selectedCategory ? refetchCategoryPosts : refetchAllPosts);

  // 좋아요 기능
  const { toggleLike } = useCommunityPostLike();

  // 인기글 가져오기 (상단 인기글 3개용)
  React.useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await communityService.getPopularPosts(0, 3);
        const allPopularPosts = response.result || [];
        // 차단된 사용자의 인기글 필터링
        const filteredPopularPosts = filterBlockedArticles(allPopularPosts);
        setPopularPosts(filteredPopularPosts);
      } catch (error) {
        console.error("인기글 조회 실패:", error);
      }
    };

    fetchPopularPosts();
  }, []);

  const handlePostClick = (postId: string) => {
    navigate(`/community/${postId}`);
  };

  const handleWriteClick = () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    navigate("/community/write");
  };

  const handleTitleClick = () => {
    // 커뮤니티 메인으로 이동 (현재 페이지 새로고침)
    navigate("/main/community", { replace: true });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // UI는 1부터 시작하지만 API는 0부터 시작
  };

  const handleCategoryChange = (categoryName: string) => {
    if (categoryName === "전체") {
      setSelectedCategory(null);
      setSelectedCategoryName("전체");
    } else if (categoryName === "인기글") {
      setSelectedCategory("popular");
      setSelectedCategoryName("인기글");
    } else {
      const category = categories.find(cat => cat.name === categoryName);
      if (category) {
        setSelectedCategory(category.id);
        setSelectedCategoryName(categoryName);
      }
    }
    setCurrentPage(0); // 카테고리 변경 시 첫 페이지로 이동
  };

  const handlePostLike = async (postId: string) => {
    try {
      await toggleLike(postId);
      // 게시글 목록 새로고침
      refetch();
    } catch (error) {
      console.error("좋아요 실패:", error);
    }
  };

  // 인기글 데이터 변환
  const transformedPopularPosts = popularPosts.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    author: post.authorNickname,
    date: new Date(post.createdAt).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\.$/, ''), // 
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    isLikedByUser: post.isLikedByUser,
    tags: [
      { text: "인기글", type: "editorsPick" as const },
      ...(post.categoryName ? [{ text: post.categoryName, type: "category" as const }] : []),
    ],
  }));

  // API 데이터를 컴포넌트에서 사용하는 형태로 변환
  const transformedPosts = posts.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    author: post.authorNickname,
    date: new Date(post.createdAt).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\.$/, ''), // 
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    isLikedByUser: post.isLikedByUser,
    tags: [
      ...(post.categoryName ? [{ text: post.categoryName, type: "category" as const }] : []),
      ...(post.likeCount > 10 ? [{ text: "BEST", type: "best" as const }] : []),
    ],
  }));

  // 인기글을 별도로 관리 (카테고리 칩으로 분리)
  const finalPosts = transformedPosts;

  // 카테고리 목록 생성 (전체 + 실제 카테고리들)
  const categoryNames = ["전체", ...categories.map(cat => cat.name)];

  return (
    <CommunityContainer>
      <FixedHeader>
        <MainHeader
          css={{
            backgroundColor: "white",
            "& svg": {
              fill: "#000000 !important",
            },
          }}
        />
      </FixedHeader>

      <CommunityHeader>
        <CommunityTitle onClick={handleTitleClick}>커뮤니티</CommunityTitle>
        <WriteButton onClick={handleWriteClick}>글쓰기</WriteButton>
      </CommunityHeader>

      <ScrollableContent>
        <ContentWrapper>
          <CommunityPostList
            posts={finalPosts}
            popularPosts={transformedPopularPosts}
            onPostClick={handlePostClick}
            onPostLike={handlePostLike}
            currentPage={currentPage + 1} // UI는 1부터 시작
            totalPages={totalPages}
            onPageChange={handlePageChange}
            selectedCategory={selectedCategoryName}
            onCategoryChange={handleCategoryChange}
            categories={categoryNames}
            loading={loading}
          />
        </ContentWrapper>
      </ScrollableContent>
    </CommunityContainer>
  );
}

export default CommunityPage;
