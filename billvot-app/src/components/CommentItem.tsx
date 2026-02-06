import { styled } from "@app/styles";
import EmptyHeart from "@app/assets/border_favorite.svg?react";
import FilledHeart from "@app/assets/filled_favorite.svg?react";
import Reply from "@app/assets/comment_left.svg?react";
import dayjs from "dayjs";
import { formatBusinessCategory } from "@app/utils/format";

const CommentContainer = styled("div", {
  height: "77px",
  borderBottom: "1px solid $cg100",
  backgroundColor: "white",
  variants: {
    isReply: {
      true: {
        paddingLeft: "24px",
        backgroundColor: "$cg20", // 대댓글은 기존 색상 유지
      },
    },
  },
});

const CommentWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "100%",
  padding: "0px 16px",
});

const AuthorInfo = styled("div", {
  fontSize: "12px",
  color: "$cg500",
  marginBottom: "8px",
});

const Content = styled("div", {
  fontSize: "14px",
  color: "$cg900",
  marginBottom: "8px",
});

const ActionBar = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "16px",
});

const TimeInfo = styled("span", {
  fontSize: "12px",
  width: "110px",
  color: "$cg500",
});

const LikeButton = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  background: "none",
  border: "none",
  padding: "0",
  color: "$cg600",
  fontSize: "12px",
  cursor: "pointer",

  "&:hover": {
    color: "$primary",
  },

  variants: {
    liked: {
      true: {
        color: "$primary",
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
  color: "$cg600",
  fontSize: "12px",
  cursor: "pointer",

  "&:hover": {
    color: "$primary",
  },
});

interface CommentItemProps {
  author: string;
  content: string;
  businessCategory: string | null;
  time: string;
  isLiked?: boolean;
  isReply?: boolean;
  onLike?: () => void;
  onCommentReply?: () => void;
  disableCommentReply?: boolean;
  isLikeLoading?: boolean;
  likeCount?: number;
}

function CommentItem({
  author,
  content,
  businessCategory,
  time,
  isReply = false,
  isLiked = false,
  disableCommentReply = false,
  isLikeLoading = false,
  likeCount = 0,
  onCommentReply,
  onLike,
}: CommentItemProps) {
  return (
    <CommentContainer isReply={isReply}>
      <CommentWrapper>
        <AuthorInfo>
          {author}
          {businessCategory && ` · ${formatBusinessCategory(businessCategory)}`}
        </AuthorInfo>
        <Content>{content}</Content>
        <ActionBar>
          <TimeInfo>
            {dayjs(new Date(time)).format("HH:mm DD/MM/YYYY")}
          </TimeInfo>
          <LikeButton
            onClick={onLike}
            liked={isLiked}
            isLoading={isLikeLoading}
          >
            {isLiked ? (
              <FilledHeart width={16} height={16} />
            ) : (
              <EmptyHeart width={16} height={16} />
            )}
            추천 {likeCount > 0 ? likeCount : ""}
          </LikeButton>
          {!disableCommentReply && (
            <ReplyButton onClick={onCommentReply}>
              <Reply width={16} height={16} />
              답글달기
            </ReplyButton>
          )}
        </ActionBar>
      </CommentWrapper>
    </CommentContainer>
  );
}

export default CommentItem;
