import { useCallback, useEffect, useState } from "react";

import DefaultHeader from "@app/components/DefaultHeader";
import CommentItem from "@app/components/CommentItem";
import CommentInput from "@app/components/CommentInput";
import { styled } from "@app/styles";

import { useParams } from "react-router";

import {
  CommentInputContainer,
  CommentList,
  CommentSection,
  Container,
  Content,
  ScrollableContent,
} from "./container";

// 원본 댓글을 위한 스타일
const OriginalCommentContainer = styled("div", {
  padding: "12px 16px",
  backgroundColor: "$cg50",
  borderBottom: "1px solid $cg100",
});

const OriginalCommentLabel = styled("div", {
  fontSize: "12px",
  color: "$cg500",
  marginBottom: "4px",
});

function ArticleCommentReply() {
  const { id, commentId } = useParams();

  const [replies, setReplies] = useState<CommentReply[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parentComment, setParentComment] = useState<Comment | null>(null);
  const [isLoadingParentComment, setIsLoadingParentComment] = useState(true);

  // 원본 댓글 불러오기
  const fetchParentComment = useCallback(async () => {
    if (!commentId) return;

    try {
      setIsLoadingParentComment(true);
      const response = await GetCommentByIdQuery.fetch(environment, {
        commentId: parseInt(commentId, 10),
      }).toPromise();

      if (response?.commentById) {
        setParentComment(response.commentById);
      }
    } catch (error) {
      console.error("원본 댓글을 불러오는데 실패했습니다:", error);
    } finally {
      setIsLoadingParentComment(false);
    }
  }, [commentId]);

  // 답글 불러오기
  const fetchReplies = useCallback(
    async (cursor?: number) => {
      if (!commentId) return;

      try {
        setIsLoadingReplies(true);
        const response = await GetCommentRepliesQuery.fetch(environment, {
          commentId: parseInt(commentId, 10),
          cursor,
        }).toPromise();

        if (response?.commentReplies) {
          const newReplies = response.commentReplies.edges.map(
            (edge: CommentReplyEdge) => edge.node,
          );

          if (cursor) {
            setReplies((prev) => [...prev, ...newReplies]);
          } else {
            setReplies(newReplies);
          }

          setHasNextPage(response.commentReplies.pageInfo.hasNextPage);
          setEndCursor(response.commentReplies.pageInfo.endCursor);
        }
      } catch (error) {
        console.error("답글을 불러오는데 실패했습니다:", error);
        setError("답글을 불러오는데 실패했습니다.");
      } finally {
        setIsLoadingReplies(false);
      }
    },
    [commentId],
  );

  useEffect(() => {
    fetchParentComment();
    fetchReplies();
  }, [fetchParentComment, fetchReplies]);

  const handleCommentCreated = useCallback(() => {
    // 새 댓글이 작성되면 목록을 새로고침
    fetchReplies();
  }, [fetchReplies]);

  const loadMoreReplies = useCallback(() => {
    if (hasNextPage && !isLoadingReplies && endCursor) {
      fetchReplies(endCursor);
    }
  }, [hasNextPage, isLoadingReplies, endCursor, fetchReplies]);

  const handleCommentLike = useCallback((commentId: number) => {
    console.log(`댓글 ${commentId} 좋아요`);
    // 필요한 경우 좋아요 API 호출을 구현
  }, []);

  return (
    <Container>
      <DefaultHeader title="댓글 답글" />
      <Content>
        <ScrollableContent>
          <CommentSection>
            {/* 원본 댓글 표시 (로딩 중이면 로딩 표시) */}
            {isLoadingParentComment ? (
              <div>원본 댓글 로딩 중...</div>
            ) : parentComment ? (
              <CommentItem
                key={`parent-${parentComment.commentId}`}
                author={parentComment.user.name}
                businessCategory={parentComment.user.businessCategory}
                content={parentComment.content}
                time={parentComment.createdAt}
                disableCommentReply={true}
                onLike={() => handleCommentLike(parentComment.commentId)}
              />
            ) : (
              <div>원본 댓글을 찾을 수 없습니다.</div>
            )}

            <CommentList>
              {replies.map((reply) => (
                <CommentItem
                  key={reply.commentId}
                  isReply={true}
                  author={reply.user.name}
                  content={reply.content}
                  time={reply.createdAt}
                  disableCommentReply={true}
                  onLike={() => handleCommentLike(reply.commentId)}
                />
              ))}

              {isLoadingReplies && <div>답글 로딩 중...</div>}
              {hasNextPage && !isLoadingReplies && (
                <button onClick={loadMoreReplies}>더보기</button>
              )}
              {error && <div>{error}</div>}
            </CommentList>
          </CommentSection>
        </ScrollableContent>
      </Content>
      <CommentInputContainer>
        <CommentInput
          articleId={id || ""}
          parentCommentId={Number(commentId)}
          onCommentCreated={handleCommentCreated}
        />
      </CommentInputContainer>
    </Container>
  );
}

export default ArticleCommentReply;
