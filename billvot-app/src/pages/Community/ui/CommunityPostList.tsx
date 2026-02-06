import { useState, useEffect } from "react";

import { styled } from "@app/styles";

const PostListContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
});

const PostItem = styled("div", {
  minHeight: "67px",
  padding: "8px 0",
  backgroundColor: "white",
  cursor: "pointer",
  transition: "all 0.2s ease",
  borderBottom: "1px solid #F3F4F6",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",

  "&:last-child": {
    borderBottom: "none",
  },

  "&:hover": {
    backgroundColor: "#F9FAFB",
  },
});

const PostHeader = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginTop: "4px",
  marginBottom: "4px",
});

const PostTitle = styled("h3", {
  fontSize: "15px",
  fontWeight: "bold",
  color: "#1F2937",
  margin: 0,
  lineHeight: 1.3,
});

const PostDate = styled("span", {
  fontSize: "12px",
  color: "#6B7280",
  flexShrink: 0,
  marginLeft: "12px",
});

const PostContent = styled("p", {
  fontSize: "13px",
  color: "#4B5563",
  margin: "2px 0",
  lineHeight: 1.2,
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  flex: 1,
});

const PostFooter = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "4px",
});

const PostAuthor = styled("span", {
  fontSize: "12px",
  color: "#6B7280",
});

const PostStats = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "12px",
  color: "#6B7280",
});

const LikeButton = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  background: "none",
  border: "none",
  color: "#6B7280",
  fontSize: "12px",
  cursor: "pointer",
  padding: "2px 0",
  transition: "color 0.2s ease",

  "&:hover": {
    color: "#EF4444",
  },

  variants: {
    liked: {
      true: {
        color: "#EF4444",
      },
    },
  },
});

const TagContainer = styled("div", {
  display: "flex",
  gap: "4px",
  marginBottom: "2px",
});

const Tag = styled("span", {
  padding: "1px 6px",
  backgroundColor: "transparent",
  fontSize: "10px",
  borderRadius: "3px",
  border: "1px solid",

  variants: {
    type: {
      editorsPick: {
        color: "#34C759",
        borderColor: "#34C759",
      },
      best: {
        color: "#1A734E",
        borderColor: "#1A734E",
      },
      category: {
        color: "#8E8E93",
        borderColor: "#8E8E93",
      },
    },
  },
});

const CategoryTabsContainer = styled("div", {
  display: "flex",
  gap: "8px",
  margin: "16px 0",
  padding: "0 4px",
  overflowX: "auto", // 가로 스크롤 허용
  "&::-webkit-scrollbar": {
    display: "none", // 스크롤바 숨기기
  },
  scrollbarWidth: "none", // Firefox에서 스크롤바 숨기기
});

const CategoryTab = styled("button", {
  padding: "8px 16px",
  backgroundColor: "transparent",
  border: "1px solid",
  borderRadius: "20px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.2s ease",
  whiteSpace: "nowrap", // 텍스트 줄바꿈 방지
  flexShrink: 0, // 축소 방지

  variants: {
    active: {
      true: {
        color: "#000000",
        borderColor: "#000000",
      },
      false: {
        color: "#9CA3AF",
        borderColor: "#E5E7EB",
      },
    },
  },

  "&:hover": {
    backgroundColor: "#F9FAFB",
  },
});

const PaginationContainer = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "16px",
  marginTop: "24px",
  padding: "16px 0",
});

const PaginationButton = styled("button", {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  padding: "4px 8px",
  borderRadius: "4px",
  transition: "all 0.2s ease",

  variants: {
    type: {
      active: {
        color: "#1F2937",
        fontWeight: "500",
      },
      inactive: {
        color: "#9CA3AF",
        fontWeight: "400",
      },
      arrow: {
        color: "#1F2937",
        fontWeight: "500",
      },
    },
  },

  "&:hover": {
    backgroundColor: "#F3F4F6",
  },

  "&:disabled": {
    color: "#D1D5DB",
    cursor: "not-allowed",

    "&:hover": {
      backgroundColor: "transparent",
    },
  },
});

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  likeCount: number;
  commentCount: number;
  isLikedByUser: boolean;
  tags: Array<{
    text: string;
    type: "editorsPick" | "best" | "category";
  }>;
}

interface CommunityPostListProps {
  posts: CommunityPost[];
  popularPosts?: CommunityPost[];
  onPostClick: (postId: string) => void;
  onPostLike?: (postId: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  categories?: string[];
  loading?: boolean;
  showPagination?: boolean;
  showCategoryTabs?: boolean;
}

function CommunityPostList({
  posts,
  popularPosts = [],
  onPostClick,
  onPostLike,
  currentPage = 1,
  totalPages = 5,
  onPageChange,
  selectedCategory = "전체",
  onCategoryChange,
  categories = ["전체", "식단", "직구", "질병", "육아"],
  loading = false,
  showPagination = true,
  showCategoryTabs = true,
}: CommunityPostListProps) {
  const [localLikeStates, setLocalLikeStates] = useState<
    Record<string, { isLiked: boolean; count: number }>
  >({});

  // 로컬 좋아요 상태 초기화
  useEffect(() => {
    const newStates: Record<string, { isLiked: boolean; count: number }> = {};
    posts.forEach((post) => {
      newStates[post.id] = {
        isLiked: post.isLikedByUser,
        count: post.likeCount,
      };
    });
    setLocalLikeStates(newStates);
  }, [posts]);
  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleCategoryChange = (category: string) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  const handlePostLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 게시글 클릭 이벤트 방지

    const currentState = localLikeStates[postId];
    if (!currentState) return;

    // Optimistic update - 즉시 UI 업데이트
    const newIsLiked = !currentState.isLiked;
    const newCount = newIsLiked
      ? currentState.count + 1
      : currentState.count - 1;

    setLocalLikeStates((prev) => ({
      ...prev,
      [postId]: {
        isLiked: newIsLiked,
        count: newCount,
      },
    }));

    if (onPostLike) {
      onPostLike(postId);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationButton
          key={i}
          type={i === currentPage ? "active" : "inactive"}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PaginationButton>,
      );
    }
    return pages;
  };

  if (loading) {
    return (
      <PostListContainer>
        <div style={{ textAlign: "center", padding: "40px" }}>
          게시글을 불러오는 중...
        </div>
      </PostListContainer>
    );
  }

  // 현재 표시할 게시글 결정 (인기글 카테고리 선택 시 인기글 표시)
  const displayPosts = selectedCategory === "인기글" ? popularPosts : posts;

  return (
    <PostListContainer>
      {showCategoryTabs && (
        <CategoryTabsContainer>
          {[...categories, "인기글"].map((category) => (
            <CategoryTab
              key={category}
              active={selectedCategory === category}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </CategoryTab>
          ))}
        </CategoryTabsContainer>
      )}

      {displayPosts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#6B7280" }}>
          게시글이 없습니다.
        </div>
      ) : (
        displayPosts.map((post) => (
          <PostItem key={post.id} onClick={() => onPostClick(post.id)}>
            <TagContainer>
              {post.tags.map((tag, index) => (
                <Tag key={index} type={tag.type}>
                  {tag.text}
                </Tag>
              ))}
            </TagContainer>

            <PostHeader>
              <PostTitle>{post.title}</PostTitle>
              <PostDate>{post.date}</PostDate>
            </PostHeader>

            <PostContent>{post.content}</PostContent>

            <PostFooter>
              <PostAuthor>by {post.author}</PostAuthor>
              <PostStats>
                <LikeButton
                  liked={
                    localLikeStates[post.id]?.isLiked ?? post.isLikedByUser
                  }
                  onClick={(e) => handlePostLike(post.id, e)}
                >
                  ♥ {localLikeStates[post.id]?.count ?? post.likeCount}
                </LikeButton>
                <span>댓글 {post.commentCount}</span>
              </PostStats>
            </PostFooter>
          </PostItem>
        ))
      )}

      {showPagination && (
        <PaginationContainer>
          <PaginationButton
            type="arrow"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </PaginationButton>

          <PaginationButton
            type="arrow"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lsaquo;
          </PaginationButton>

          {renderPageNumbers()}

          <PaginationButton
            type="arrow"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &rsaquo;
          </PaginationButton>

          <PaginationButton
            type="arrow"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </PaginationButton>
        </PaginationContainer>
      )}
    </PostListContainer>
  );
}

export default CommunityPostList;
