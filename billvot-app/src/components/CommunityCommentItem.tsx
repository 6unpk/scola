import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@app/styles";
import EmptyHeart from "@app/assets/border_favorite.svg?react";
import FilledHeart from "@app/assets/filled_favorite.svg?react";
import Reply from "@app/assets/comment_left.svg?react";
import MoreHoriz from "@app/assets/more_hor.svg?react";
import Send from "@app/assets/send.svg?react";
import OverlaySelect from "./OverlaySelect";
import { useBlockUser } from "@app/hooks/useBlockUser";
import { useAuthStore } from "@app/store/useAuthStore";
import dayjs from "dayjs";
import BaseInput from "./BaseInput";

const CommentContainer = styled("div", {
  minHeight: "77px",
  borderBottom: "1px solid #F3F4F6",
  backgroundColor: "white",
  variants: {
    isReply: {
      true: {
        paddingLeft: "24px",
        backgroundColor: "#F9FAFB",
      },
    },
  },
});

const CommentWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: "77px",
  padding: "12px 16px",
});

const AuthorInfo = styled("div", {
  fontSize: "12px",
  color: "#6B7280",
  marginBottom: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const AuthorName = styled("span", {
  fontWeight: "500",
  color: "#374151",
});

const Content = styled("div", {
  fontSize: "14px",
  color: "#1F2937",
  marginBottom: "8px",
  lineHeight: 1.4,
});

const ActionBar = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "16px",
});

const TimeInfo = styled("span", {
  fontSize: "12px",
  color: "#9CA3AF",
});

const LikeButton = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  background: "none",
  border: "none",
  padding: "4px 0",
  color: "#6B7280",
  fontSize: "12px",
  cursor: "pointer",
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
    isLoading: {
      true: {
        opacity: 0.5,
        pointerEvents: "none",
      },
    },
  },
});

const ReplyButton = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  background: "none",
  border: "none",
  color: "#6B7280",
  fontSize: "12px",
  cursor: "pointer",
  padding: "4px 0",
  transition: "color 0.2s ease",

  "&:hover": {
    color: "#374151",
  },
});

const ReplyCount = styled("span", {
  fontSize: "12px",
  color: "#9CA3AF",
  marginLeft: "8px",
});

const MoreButton = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  background: "none",
  border: "none",
  color: "#6B7280",
  fontSize: "12px",
  cursor: "pointer",
  padding: "4px 0",
  transition: "color 0.2s ease",

  "&:hover": {
    color: "#374151",
  },
});

const EditContainer = styled("div", {
  width: "100%",
  background: "white",
  boxSizing: "border-box",
  padding: "4px",
});

const EditInputContainer = styled("div", {
  display: "flex",
  alignItems: "center",
});

const EditSendButton = styled("span", {
  width: "46px",
  height: "46px",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",

  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  path: {
    fill: "#9CA3AF",
  },
});

interface CommunityCommentItemProps {
  comment: {
    id: string;
    authorName: string;
    authorNickname: string;
    authorId?: string;
    content: string;
    likeCount: number;
    replyCount: number;
    isLikedByUser: boolean;
    createdAt: string;
    replies?: any[];
  };
  isReply?: boolean;
  isLikeLoading?: boolean;
  onCommentReply?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  showReplyInput?: boolean;
}

function CommunityCommentItem({
  comment,
  isReply = false,
  isLikeLoading = false,
  onCommentReply,
  onLike,
  onDelete,
  onEdit,
  showReplyInput = false,
}: CommunityCommentItemProps) {
  const navigate = useNavigate();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [localLikeState, setLocalLikeState] = useState<{ isLiked: boolean; count: number } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const { blockUser } = useBlockUser();
  const { user } = useAuthStore();

  // 로컬 좋아요 상태 초기화
  useEffect(() => {
    setLocalLikeState({
      isLiked: comment.isLikedByUser,
      count: comment.likeCount
    });
  }, [comment.isLikedByUser, comment.likeCount]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!localLikeState) return;
    
    // Optimistic update - 즉시 UI 업데이트
    const newIsLiked = !localLikeState.isLiked;
    const newCount = newIsLiked ? localLikeState.count + 1 : localLikeState.count - 1;
    
    setLocalLikeState({
      isLiked: newIsLiked,
      count: newCount
    });
    
    if (onLike) {
      onLike(comment.id);
    }
  };

  const handleReply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCommentReply) {
      onCommentReply(comment.id);
    }
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOverlayOpen(true);
  };

  const handleOverlayClose = () => {
    setIsOverlayOpen(false);
  };

  const handleReport = () => {
    if (comment.authorId) {
      navigate(`/report?commentId=${comment.id}&userId=${comment.authorId}`);
    }
  };

  const handleBlockUser = () => {
    if (comment.authorId) {
      blockUser(comment.authorId, comment.authorNickname, "댓글에서 차단");
      alert("사용자가 차단되었습니다.");
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(comment.id);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
    setIsOverlayOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleEditSave = () => {
    if (onEdit && editContent.trim() !== comment.content) {
      onEdit(comment.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}일 전`;
    
    return dayjs(date).format("MM/DD");
  };

  return (
    <CommentContainer isReply={isReply}>
      <CommentWrapper>
        <AuthorInfo>
          <AuthorName>{comment.authorNickname || comment.authorName}</AuthorName>
          <TimeInfo>{formatTime(comment.createdAt)}</TimeInfo>
        </AuthorInfo>
        
        {isEditing ? (
          <EditContainer>
            <EditInputContainer>
              <BaseInput
                placeholder="댓글을 수정하세요"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleEditSave();
                  }
                }}
              />
              <EditSendButton>
                <Send onClick={handleEditSave} />
              </EditSendButton>
            </EditInputContainer>
          </EditContainer>
        ) : (
          <Content>{comment.content}</Content>
        )}
        
        <ActionBar>
          {!isEditing ? (
            <>
              <LikeButton
                onClick={handleLike}
                liked={localLikeState?.isLiked ?? comment.isLikedByUser}
                isLoading={isLikeLoading}
              >
                {(localLikeState?.isLiked ?? comment.isLikedByUser) ? (
                  <FilledHeart width={16} height={16} />
                ) : (
                  <EmptyHeart width={16} height={16} />
                )}
                좋아요 {(localLikeState?.count ?? comment.likeCount) > 0 ? (localLikeState?.count ?? comment.likeCount) : ""}
              </LikeButton>
              
              {!isReply && (
                <ReplyButton onClick={handleReply}>
                  <Reply width={16} height={16} />
                  답글달기
                  {comment.replyCount > 0 && (
                    <ReplyCount>({comment.replyCount})</ReplyCount>
                  )}
                </ReplyButton>
              )}
            </>
          ) : (
            <div style={{ fontSize: "12px", color: "#6B7280" }}>
              수정 중... 더보기 버튼을 눌러 취소할 수 있습니다
            </div>
          )}

          <MoreButton onClick={handleMoreClick}>
            <MoreHoriz width={16} height={16} />
          </MoreButton>
        </ActionBar>
      </CommentWrapper>
      
      <OverlaySelect
        isOpen={isOverlayOpen}
        onClose={handleOverlayClose}
        options={[
          // 수정 모드일 때는 취소 옵션만 표시
          ...(isEditing ? [{
            label: "수정 취소",
            onClick: handleEditCancel,
          }] : []),
          // 내가 작성한 댓글인 경우 수정/삭제 옵션 표시
          ...(!isEditing && user && comment.authorId && user.id === comment.authorId ? [
            {
              label: "수정하기",
              onClick: handleEdit,
            },
            {
              label: "삭제하기",
              onClick: handleDelete,
            }
          ] : []),
          // 수정 모드가 아닐 때만 신고/차단 옵션 표시
          ...(!isEditing ? [
            {
              label: "신고하기",
              onClick: handleReport,
            },
            {
              label: "사용자 차단하기",
              onClick: handleBlockUser,
            }
          ] : []),
        ]}
      />
    </CommentContainer>
  );
}

export default CommunityCommentItem;
