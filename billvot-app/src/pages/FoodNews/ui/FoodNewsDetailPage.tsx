import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../../components/PageHeader";
import CommentInput from "../../../components/CommentInput";
import CommentItem from "../../../components/CommentItem";
import ReporterInfo from "../../../components/ReporterInfo";
import { styled } from "../../../styles";
import { articleService, Article, Comment, fooditService } from "../../../api/rest/services";
import {
  useArticleComments,
  useArticleCommentCreate,
} from "../../../hooks/useArticleComments";
import { useArticleLike } from "../../../hooks/api/useArticleLike";
import { useSafeArea } from "../../../hooks/useSafeArea";
import { cleanHtmlContent } from "../../../utils/date";
import ThumbIcon from "../../../assets/thumb.svg?react";
import ThumbFilledIcon from "../../../assets/thumb_filled.svg?react";

interface AuthorInfo {
  id: string;
  username: string;
  name: string;
  email: string;
  profileImageUrl: string;
  description: string;
  hashtags: string[];
  role: string;
  enabled: boolean;
  createdAt: string;
  lastLoginAt: string;
  totalFoodits: number;
  totalViews: number;
  totalBookmarks: number;
}

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

const NewsHeader = styled("div", {
  borderBottom: "1px solid #F3F4F6",
  borderRadius: "0 0 16px 16px",
  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
});

const NewsCategory = styled("div", {
  padding: "20px 16px 0",
  fontSize: "12px",
  fontWeight: "bold",
  color: "#22C55E",
  marginBottom: "8px",
});

const NewsTitle = styled("h1", {
  padding: "0 16px",
  fontSize: "28px",
  fontWeight: "bold",
  color: "#1F2937",
  margin: "0 0 12px 0",
  lineHeight: 1.3,
});

const NewsDate = styled("div", {
  padding: "0 16px",
  fontSize: "14px",
  color: "#6B7280",
  marginBottom: "16px",
});

const NewsImage = styled("img", {
  width: "100%",
  height: "240px",
  objectFit: "cover",
});

const NewsContent = styled("div", {
  padding: "20px 16px",
  lineHeight: 1.6,
  fontSize: "16px",
  color: "#1F2937",

  // 모바일 브라우저의 자동 폰트 조정 방지 (에디터 스타일 유지)
  WebkitTextSizeAdjust: "100%",
  MozTextSizeAdjust: "100%",
  msTextSizeAdjust: "100%",

  // 이미지 오버플로우 방지 및 비율 유지
  "& img": {
    maxWidth: "100%",
    height: "auto",
    display: "block",
    margin: "16px 0",
    objectFit: "contain", // 이미지 비율 유지
  },

  // figure 태그 처리 (에디터에서 이미지를 figure로 감싸는 경우)
  "& figure": {
    margin: "16px 0",
    "& img": {
      maxWidth: "100%",
      height: "auto",
      objectFit: "contain", // 이미지 비율 유지
    },
  },

  // hr 요소 오버플로우 방지
  "& hr": {
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    margin: "20px 0",
    border: "none",
    borderTop: "1px solid #E5E7EB",
  },

  // ul, ol 리스트 스타일 복원
  "& ul": {
    listStyleType: "disc",
    paddingInlineStart: "20px",
    marginTop: "12px",
    marginBottom: "12px",
  },

  "& ol": {
    listStyleType: "decimal",
    paddingInlineStart: "20px",
    marginTop: "12px",
    marginBottom: "12px",
  },

  "& li": {
    marginBottom: "8px",
  },

  // 이탤릭 스타일 명시
  "& i, & em": {
    fontStyle: "italic !important",
  },

  // 볼드 스타일 명시
  "& b, & strong": {
    fontWeight: "bolder !important",
  },
});

const ContentParagraph = styled("p", {
  margin: "0 0 16px 0",

  "&:last-child": {
    marginBottom: 0,
  },
});

const ContentImage = styled("img", {
  width: "100%",
  height: "auto",
  margin: "16px 0",
  borderRadius: "8px",
});

const CommentsSection = styled("div", {
  padding: "20px 0 0 0",
});

const CommentsHeader = styled("div", {
  padding: "0 16px 16px 16px",
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1F2937",
});

const CommentsContainer = styled("div", {
  backgroundColor: "#F9FAFB",
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

const LoadingContainer = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
  fontSize: "16px",
  color: "#6B7280",
});

const ErrorContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
  fontSize: "16px",
  color: "#EF4444",
  gap: "12px",
});

const RetryButton = styled("button", {
  padding: "8px 16px",
  backgroundColor: "#963535",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "14px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#7A2A2A",
  },
});

const LikeButtonContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "54px", // 헤더 높이와 동일하게 고정
  paddingTop: "8px", // 아이콘을 원래 위치에 고정
});

const LikeButton = styled("button", {
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "46px",

  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

const LikeCount = styled("span", {
  fontSize: "10px",
  color: "#1F2937", // 검은색으로 변경
  fontWeight: "500",
  marginTop: "2px", // 아이콘과의 간격
  lineHeight: 1,
});


function FoodNewsDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [showReplyInput, setShowReplyInput] = useState<string | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [author, setAuthor] = useState<AuthorInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 댓글 관련 훅
  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useArticleComments(id || "");
  const { createComment, loading: createLoading } = useArticleCommentCreate();

  // 좋아요 관련 훅
  const {
    toggleLike,
    isLoading: likeLoading,
    error: likeError,
  } = useArticleLike();

  // Safe Area 적용
  useSafeArea();

  // 좋아요 상태 관리
  const [likeState, setLikeState] = useState<{
    isLiked: boolean;
    likeCount: number;
  } | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  // 뉴스기사 상세 정보 로드
  const loadArticle = async () => {
    if (!id) {
      setError("뉴스기사 ID가 없습니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await articleService.getArticle(id);
      setArticle(response);
      // 좋아요 상태 초기화
      setLikeState({
        isLiked: response.isLikedByUser,
        likeCount: response.likeCount,
      });

      // 작성자 정보 로드
      try {
        const authorResponse = await fooditService.getAuthor(response.authorId);
        setAuthor(authorResponse);
      } catch (authorError) {
        console.error("작성자 정보 로드 중 오류:", authorError);
        setAuthor(null);
      }
    } catch (err: unknown) {
      console.error("뉴스기사 로드 중 오류:", err);
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "뉴스기사를 불러오는데 실패했습니다."
          : "뉴스기사를 불러오는데 실패했습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticle();
  }, [id]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\.$/, ""); // 
  };

  const handleCommentReply = (commentId: string) => {
    setShowReplyInput(showReplyInput === commentId ? null : commentId);
  };

  // 좋아요 토글 핸들러
  const handleLikeToggle = async () => {
    if (!id || !article) return;

    try {
      const result = await toggleLike(id);
      if (result) {
        setLikeState(result);
        // article 상태도 업데이트
        setArticle((prev) =>
          prev
            ? {
                ...prev,
                isLikedByUser: result.isLiked,
                likeCount: result.likeCount,
              }
            : null,
        );
      }
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
    }
  };

  const handleCommentCreated = async (
    content: string,
    parentCommentId?: string,
  ) => {
    if (!id) {
      console.error("유효하지 않은 뉴스기사 ID입니다.");
      return;
    }

    try {
      await createComment(id, content, parentCommentId);
      // 댓글 생성 후 댓글 목록 새로고침
      refetchComments();
      // 답글 입력창 닫기
      if (parentCommentId) {
        setShowReplyInput(null);
      }
    } catch (err) {
      console.error("댓글 생성 실패:", err);
    }
  };

  // 서버에서 가져온 댓글과 대댓글을 그대로 사용
  const parentComments = comments;
  
  // 디버깅용 로그
  console.log("FoodNews 댓글 디버깅:", {
    commentsLoading,
    commentsError,
    comments: comments?.length || 0,
    parentComments: parentComments?.length || 0,
    article: article?.id,
  });

  if (isLoading) {
    return (
      <Container>
        <PageHeader
          title=""
          leftButton={{ icon: "back", onClick: handleBack }}
          css={{
            backgroundColor: "white",
            "& button:first-child svg": {
              fill: "#000000",
            },
          }}
        />
        <LoadingContainer>뉴스기사를 불러오는 중...</LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <PageHeader
          title=""
          leftButton={{ icon: "back", onClick: handleBack }}
          css={{
            backgroundColor: "white",
            "& button:first-child svg": {
              fill: "#000000",
            },
          }}
        />
        <ErrorContainer>
          <div>{error}</div>
          <RetryButton onClick={loadArticle}>다시 시도</RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  if (!article) {
    return (
      <Container>
        <PageHeader
          title=""
          leftButton={{ icon: "back", onClick: handleBack }}
          css={{
            backgroundColor: "white",
            "& button:first-child svg": {
              fill: "#000000",
            },
          }}
        />
        <ErrorContainer>
          <div>뉴스기사를 찾을 수 없습니다.</div>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader
        title=""
        leftButton={{ icon: "back", onClick: handleBack }}
        rightButton={{
          element: (
            <LikeButtonContainer>
            <LikeButton onClick={handleLikeToggle} disabled={likeLoading}>
                {likeState?.isLiked ? (
                  <ThumbFilledIcon width="24" height="24" />
                ) : (
                  <ThumbIcon width="24" height="24" />
                )}
            </LikeButton>
              {likeState?.likeCount !== undefined && (
                <LikeCount>{likeState.likeCount}</LikeCount>
              )}
            </LikeButtonContainer>
          ),
        }}
        css={{
          backgroundColor: "white",
          "& button:first-child svg": {
            fill: "#000000",
          },
        }}
      />

      <ScrollableContent>
        {/* 뉴스 헤더 */}
        <NewsHeader>
          {article.thumbnailUrl && (
          <NewsImage
              src={article.thumbnailUrl}
            alt={article.title}
          />
          )}

          <NewsCategory style={{ color: "#22C55E" }}>
            {article.categoryName}
          </NewsCategory>
          <NewsTitle>
            {cleanHtmlContent(article.title, true).split('\n').map((line, index, array) => (
              <span key={index}>
                {line}
                {index < array.length - 1 && <br />}
              </span>
            ))}
          </NewsTitle>
          <NewsDate>{formatDate(article.createdAt)}</NewsDate>
        </NewsHeader>

        {/* 뉴스 내용 */}
        <NewsContent>
          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
            style={{
              lineHeight: "1.6",
              fontSize: "16px",
              color: "#1F2937",
            }}
          />
        </NewsContent>

        {/* 기자 정보 */}
        <ReporterInfo
          mediaName={author?.role === "EDITOR" ? "FOODDITOR" : ""}
          reporterName={author?.name || article.authorNickname}
          description={author?.description || ""}
          contact={author?.email || ""}
          thumbnailUrl={author?.profileImageUrl}
          additionalInfo={author?.hashtags || []}
        />

        {/* 댓글 섹션 */}
        <CommentsSection>
          <CommentsHeader>댓글 ({article.commentCount})</CommentsHeader>
          <CommentsContainer>
            {commentsLoading && (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#6B7280",
                }}
              >
                댓글을 불러오는 중...
              </div>
            )}

            {commentsError && (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#EF4444",
                }}
              >
                {commentsError}
              </div>
            )}

            {!commentsLoading &&
              !commentsError &&
              parentComments.map((comment) => (
                <div key={comment.commentId}>
                    <CommentItem
                    author={comment.user?.nickname || "익명"}
                      content={comment.content}
                    businessCategory={null}
                      time={comment.createdAt}
                      isLiked={comment.isLiked}
                      likeCount={comment.likeCount}
                    onCommentReply={() => handleCommentReply(comment.commentId)}
                    />

                    {/* 답글 입력창 */}
                  {showReplyInput === comment.commentId && (
                      <CommentInput
                        articleId={article.id}
                      parentCommentId={comment.originalId}
                        onCommentCreated={(content) =>
                        handleCommentCreated(content, comment.originalId)
                        }
                      />
                    )}

                  {/* 답글들 - 커뮤니티와 동일한 방식 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div>
                      {comment.replies.map((reply) => (
                      <CommentItem
                          key={reply.commentId}
                          author={reply.user?.nickname || "익명"}
                        content={reply.content}
                          businessCategory={null}
                        time={reply.createdAt}
                        isLiked={reply.isLiked}
                        likeCount={reply.likeCount}
                        isReply={true}
                        disableCommentReply={true}
                      />
                    ))}
                  </div>
                  )}
                </div>
              ))}

            {!commentsLoading &&
              !commentsError &&
              parentComments.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#6B7280",
                  }}
                >
                  첫 번째 댓글을 작성해보세요!
                </div>
              )}
          </CommentsContainer>
        </CommentsSection>
      </ScrollableContent>

      {/* 댓글 입력창 */}
      <CommentInputWrapper>
        <CommentInput
          articleId={article.id}
          onCommentCreated={(content) => handleCommentCreated(content)}
        />
      </CommentInputWrapper>
    </Container>
  );
}

export default FoodNewsDetailPage;
