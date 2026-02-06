import { useState } from "react";
import React from "react";

import { useNavigate, useParams } from "react-router-dom";

import DefaultHeader from "@app/components/DefaultHeader";
import CommunityCommentInput from "@app/components/CommunityCommentInput";
import CommunityCommentItem from "@app/components/CommunityCommentItem";
import { styled } from "@app/styles";
import { useCommunityPost, useCommunityPostLike } from "@app/hooks/useCommunity";
import { useCommunityComments, useCommunityCommentLike, useCommunityCommentDelete, useCommunityCommentUpdate } from "@app/hooks/useCommunityComments";
import { useBlockUser } from "@app/hooks/useBlockUser";
import ThumbIcon from "@app/assets/thumb.svg?react";
import ThumbFilledIcon from "@app/assets/thumb_filled.svg?react";
import ShareIcon from "@app/assets/share.svg?react";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const ScrollableContent = styled("div", {
  flex: 1,
  overflowY: "auto",
  paddingBottom: "calc(120px + env(safe-area-inset-bottom))", // 댓글 입력창 + SafeArea 여유 공간
});

const PostHeader = styled("div", {
  padding: "20px 16px",
  borderBottom: "1px solid #F3F4F6",
});

const TagContainer = styled("div", {
  display: "flex",
  gap: "6px",
  marginBottom: "12px",
});

const Tag = styled("span", {
  padding: "2px 8px",
  backgroundColor: "transparent",
  fontSize: "11px",
  borderRadius: "4px",
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

const PostTitle = styled("h1", {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1F2937",
  margin: "0 0 12px 0",
  lineHeight: 1.4,
});

const PostMeta = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "12px",
  color: "#6B7280",
  marginBottom: "8px",
});

const PostStats = styled("div", {
  display: "flex",
  gap: "12px",
});

const PostAuthor = styled("div", {
  fontSize: "12px",
  color: "#6B7280",
});

const PostContent = styled("div", {
  padding: "20px 16px",
  fontSize: "15px",
  lineHeight: 1.6,
  color: "#374151",
  whiteSpace: "pre-line",
});

const ContentParagraph = styled("p", {
  margin: "0 0 16px 0",
  "&:last-child": {
    marginBottom: 0,
  },
});

const ImageScrollContainer = styled("div", {
  display: "flex",
  overflowX: "auto",
  padding: "0 16px",
  gap: "8px",
  marginBottom: "20px",
});

const ContentImage = styled("img", {
  width: "200px",
  height: "150px",
  objectFit: "cover",
  borderRadius: "8px",
  flexShrink: 0,
});

const InteractionSection = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px",
  borderTop: "1px solid #F3F4F6",
  borderBottom: "1px solid #F3F4F6",
});

const LikeButton = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  color: "#6B7280",
  padding: "8px 12px",
  borderRadius: "6px",
  transition: "all 0.2s ease",

  "&:hover": {
    backgroundColor: "#F9FAFB",
  },
});

const ShareButton = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  color: "#6B7280",
  padding: "8px 12px",
  borderRadius: "6px",
  transition: "all 0.2s ease",

  "&:hover": {
    backgroundColor: "#F9FAFB",
  },
});

const CommentsSection = styled("div", {
  padding: "0",
});

const CommentsHeader = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 16px 8px 16px",
  fontSize: "16px",
  fontWeight: "600",
  color: "#1F2937",
});

const CommentsContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
});

const CommentInputWrapper = styled("div", {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  borderTop: "1px solid #E5E7EB",
  backgroundColor: "white",
  paddingBottom: "env(safe-area-inset-bottom)",
  zIndex: 10,
});

function CommunityDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [showReplyInput, setShowReplyInput] = useState<string | null>(null);
  const [localLikeState, setLocalLikeState] = useState<{ isLiked: boolean; count: number } | null>(null);

  // API에서 게시글 데이터 가져오기
  const { post, loading, error } = useCommunityPost(id || "");
  const { toggleLike } = useCommunityPostLike();
  
  // 차단 기능
  const { isUserBlocked } = useBlockUser();

  // 댓글 데이터 가져오기
  const { comments, loading: commentsLoading, refetch: refetchComments } = useCommunityComments(id || "");
  const { toggleLike: toggleCommentLike } = useCommunityCommentLike();
  const { deleteComment } = useCommunityCommentDelete();
  const { updateComment } = useCommunityCommentUpdate();

  // 로컬 좋아요 상태 초기화
  React.useEffect(() => {
    if (post) {
      setLocalLikeState({
        isLiked: post.isLikedByUser,
        count: post.likeCount
      });
    }
  }, [post]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleLike = async () => {
    if (!post || !localLikeState) return;
    
    // Optimistic update - 즉시 UI 업데이트
    const newIsLiked = !localLikeState.isLiked;
    const newCount = newIsLiked ? localLikeState.count + 1 : localLikeState.count - 1;
    
    setLocalLikeState({
      isLiked: newIsLiked,
      count: newCount
    });
    
    try {
      await toggleLike(post.id);
    } catch (error) {
      console.error("좋아요 실패:", error);
      // 실패 시 원래 상태로 되돌리기
      setLocalLikeState({
        isLiked: localLikeState.isLiked,
        count: localLikeState.count
      });
    }
  };

  const handleCommentReply = (commentId: string) => {
    setShowReplyInput(showReplyInput === commentId ? null : commentId);
  };

  const handleCommentCreated = () => {
    // 댓글 생성 후 댓글 목록 새로고침
    refetchComments();
    setShowReplyInput(null);
  };

  const handleCommentLike = async (commentId: string) => {
    try {
      await toggleCommentLike(commentId);
      // 댓글 목록 새로고침은 제거 - optimistic update로 처리
    } catch (error) {
      console.error("댓글 좋아요 실패:", error);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) {
      return;
    }
    
    try {
      await deleteComment(commentId);
      // 댓글 삭제 후 목록 새로고침
      refetchComments();
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  const handleCommentEdit = async (commentId: string, content: string) => {
    try {
      await updateComment(commentId, content);
      // 댓글 수정 후 목록 새로고침
      refetchComments();
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <Container>
        <DefaultHeader
          title=""
          articleId={id || ""}
          hideLogo={true}
          leftButton={{ icon: "arrow_back", onClick: handleBack }}
        />
        <div style={{ textAlign: 'center', padding: '40px' }}>
          게시글을 불러오는 중...
        </div>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container>
        <DefaultHeader
          title=""
          articleId={id || ""}
          hideLogo={true}
          leftButton={{ icon: "arrow_back", onClick: handleBack }}
        />
        <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
          {error || "게시글을 찾을 수 없습니다."}
        </div>
      </Container>
    );
  }

  // 차단된 사용자의 게시글인지 확인
  if (post.authorId && isUserBlocked(Number(post.authorId))) {
    return (
      <Container>
        <DefaultHeader
          title=""
          articleId={id || ""}
          hideLogo={true}
          leftButton={{ icon: "arrow_back", onClick: handleBack }}
        />
        <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
          차단된 사용자의 게시글입니다.
        </div>
      </Container>
    );
  }

  // API 데이터를 컴포넌트에서 사용하는 형태로 변환
  const tags = [
    ...(post.categoryName ? [{ text: post.categoryName, type: "category" as const }] : []),
    ...(post.likeCount > 10 ? [{ text: "BEST", type: "best" as const }] : []),
  ];

  return (
    <Container>
      <DefaultHeader
        title=""
        articleId={post.id}
        articleUserId={post.authorId}
        isCommunity={true}
        hideLogo={true}
        leftButton={{ icon: "arrow_back", onClick: handleBack }}
        rightButton={{ icon: "more_vert" }}
      />

      <ScrollableContent>
        <PostHeader>
          <TagContainer>
            {tags.map((tag, index) => (
              <Tag key={index} type={tag.type}>
                {tag.text}
              </Tag>
            ))}
          </TagContainer>

          <PostTitle>{post.title}</PostTitle>

          <PostMeta>
            <span>{new Date(post.createdAt).toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}</span>
            <PostStats>
              <span>댓글 {post.commentCount}</span>
              <span>조회수 {post.viewCount}</span>
            </PostStats>
          </PostMeta>

          <PostAuthor>by {post.authorNickname}</PostAuthor>
        </PostHeader>

        <PostContent>
          <ContentParagraph>{post.content}</ContentParagraph>
        </PostContent>

        {post.imageUrls.length > 0 && (
          <ImageScrollContainer>
            {post.imageUrls.map((image, index) => (
              <ContentImage
                key={index}
                src={image}
                alt={`게시글 이미지 ${index + 1}`}
              />
            ))}
          </ImageScrollContainer>
        )}

        <InteractionSection>
          <LikeButton onClick={handleLike}>
            {localLikeState?.isLiked ?? post.isLikedByUser ? (
              <ThumbFilledIcon width={18} height={18} />
            ) : (
              <ThumbIcon width={18} height={18} />
            )}
            <span>{localLikeState?.count ?? post.likeCount}</span>
          </LikeButton>
          {/* <ShareButton>
            <ShareIcon width={36} height={36} />
            <span>공유하기</span>
          </ShareButton> */}
        </InteractionSection>

        <CommentsSection>
          <CommentsHeader>
            댓글 {post.commentCount}개
          </CommentsHeader>
          <CommentsContainer>
            {commentsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>
                댓글을 불러오는 중...
              </div>
            ) : comments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>
                첫 번째 댓글을 작성해보세요!
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id}>
                  <CommunityCommentItem
                    comment={comment}
                    onCommentReply={handleCommentReply}
                    onLike={handleCommentLike}
                    onDelete={handleCommentDelete}
                    onEdit={handleCommentEdit}
                    showReplyInput={showReplyInput === comment.id}
                  />
                  
                  {/* 답글 입력창 */}
                  {showReplyInput === comment.id && (
                    <CommunityCommentInput
                      postId={post.id}
                      parentCommentId={comment.id}
                      onCommentCreated={handleCommentCreated}
                      placeholder={`${comment.authorNickname}님에게 답글 달기`}
                    />
                  )}
                  
                  {/* 대댓글 목록 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div>
                      {comment.replies.map((reply) => (
                        <CommunityCommentItem
                          key={reply.id}
                          comment={reply}
                          isReply={true}
                          onLike={handleCommentLike}
                          onDelete={handleCommentDelete}
                          onEdit={handleCommentEdit}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </CommentsContainer>
        </CommentsSection>
      </ScrollableContent>

      {/* 댓글 입력창 - 하단 고정 */}
      <CommentInputWrapper>
        <CommunityCommentInput
          postId={post.id}
          onCommentCreated={handleCommentCreated}
        />
      </CommentInputWrapper>
    </Container>
  );
}

export default CommunityDetailPage;