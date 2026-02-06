import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@app/styles";
import dayjs from "dayjs";
import ArrowBack from "@app/assets/arrow_back.svg?react";
import LogoBillvot from "@app/assets/billvot.svg?react";
import ChevronRight from "@app/assets/chevron_right.svg?react";
import { useBill, useVote, useVoteStatus, useComments, useCreateComment, useLikeComment } from "@app/hooks/api";
import { useAuthStore } from "@app/store/useAuthStore";
import type { VoteType } from "@app/api/services";

const PageContainer = styled("div", {
  width: "100%",
  height: "100vh",
  backgroundColor: "$cg20",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const Header = styled("header", {
  width: "100%",
  height: "48px",
  backgroundColor: "$white",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
  boxSizing: "border-box",
  flexShrink: 0,
});

const HeaderLeft = styled("div", {
  display: "flex",
  alignItems: "center",
});

const HeaderRight = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const BackButton = styled("button", {
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "11px",
  marginLeft: "-11px",
});

const BackIcon = styled(ArrowBack, {
  width: "24px",
  height: "24px",
  fill: "$cg900",
});

const LogoImage = styled(LogoBillvot, {
  height: "20px",
  width: "auto",
});

const ContentContainer = styled("div", {
  flex: 1,
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  overflowY: "auto",
  paddingBottom: "32px",
});

// VotingCard 스타일
const CardContainer = styled("div", {
  backgroundColor: "$white",
  borderRadius: "16px",
  padding: "12px 16px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const TitleRow = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "4px",
});

const Badge = styled("span", {
  backgroundColor: "$primary",
  color: "$white",
  fontSize: "8px",
  fontWeight: 500,
  padding: "4px 8px",
  borderRadius: "16px",
});

const Title = styled("p", {
  fontSize: "16px",
  fontWeight: 500,
  color: "$cg900",
  margin: 0,
});

const VoteBarContainer = styled("div", {
  width: "100%",
  height: "14px",
  backgroundColor: "$cg100",
  borderRadius: "4px",
  overflow: "hidden",
  display: "flex",
});

const DisagreeBar = styled("div", {
  backgroundColor: "$disagree",
  height: "100%",
  display: "flex",
  alignItems: "center",
  paddingLeft: "4px",
  paddingRight: "4px",
});

const AgreeBar = styled("div", {
  backgroundColor: "$agree",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  paddingLeft: "4px",
  paddingRight: "4px",
});

const VoteText = styled("span", {
  fontSize: "8px",
  fontWeight: 500,
  color: "$white",
});

const InfoContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

const Proposer = styled("p", {
  fontSize: "12px",
  fontWeight: 700,
  color: "$cg700",
  margin: 0,
});

const InfoRow = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "12px",
});

const InfoLabel = styled("span", {
  color: "$cg500",
  fontWeight: 500,
});

const InfoValue = styled("span", {
  color: "$cg700",
  fontWeight: 700,
});

const LinkButton = styled("button", {
  width: "100%",
  padding: "4px 0",
  background: "none",
  border: "none",
  cursor: "pointer",
  textAlign: "center",
});

const LinkText = styled("span", {
  fontSize: "12px",
  fontWeight: 500,
  color: "$cg700",
  textDecoration: "underline",
});

// 법안 진행 현황
const ProcessCard = styled("div", {
  backgroundColor: "$white",
  borderRadius: "16px",
  padding: "12px 16px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const ProcessTitle = styled("p", {
  fontSize: "16px",
  fontWeight: 500,
  color: "$cg900",
  margin: 0,
});

const ProcessGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr auto 1fr",
  alignItems: "center",
  rowGap: "8px",
});

const ProcessStep = styled("span", {
  fontSize: "12px",
  fontWeight: 500,
  color: "$cg700",
  textAlign: "center",

  variants: {
    active: {
      true: {
        color: "$primary",
        fontWeight: 700,
      },
    },
  },
});

const ProcessArrow = styled(ChevronRight, {
  width: "20px",
  height: "20px",
  fill: "$cg300",
  justifySelf: "center",
});

// 투표 섹션
const VoteSection = styled("div", {
  backgroundColor: "$white",
  borderRadius: "16px",
  padding: "12px 16px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const VoteButtonsRow = styled("div", {
  display: "flex",
  width: "100%",
  borderRadius: "4px",
  overflow: "hidden",
});

const VoteButton = styled("button", {
  flex: 1,
  padding: "8px",
  border: "1px solid $cg500",
  backgroundColor: "$white",
  fontSize: "14px",
  fontWeight: 500,
  color: "$cg500",
  cursor: "pointer",

  variants: {
    selected: {
      agree: {
        borderColor: "$agree",
        color: "$agree",
      },
      disagree: {
        borderColor: "$disagree",
        color: "$disagree",
      },
    },
  },
});

const SubmitButton = styled("button", {
  width: "100%",
  padding: "12px",
  backgroundColor: "$primary",
  border: "none",
  borderRadius: "4px",
  color: "$white",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",

  "&:disabled": {
    backgroundColor: "$cg300",
    cursor: "not-allowed",
  },
});

// 댓글 섹션
const CommentSection = styled("div", {
  backgroundColor: "$white",
  borderRadius: "16px",
  padding: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const CommentInputContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  backgroundColor: "$cg20",
  borderRadius: "8px",
  padding: "0 8px",
});

const CommentInput = styled("input", {
  flex: 1,
  border: "none",
  background: "none",
  padding: "12px 0",
  fontSize: "12px",
  color: "$cg900",
  outline: "none",

  "&::placeholder": {
    color: "$cg500",
  },
});

const SendButton = styled("button", {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const CommentList = styled("div", {
  display: "flex",
  flexDirection: "column",
});

const CommentItem = styled("div", {
  padding: "11px 8px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

const CommentHeader = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

const CommentAuthor = styled("span", {
  fontSize: "12px",
  fontWeight: 500,
  color: "$cg900",
});

const CommentTime = styled("span", {
  fontSize: "8px",
  fontWeight: 500,
  color: "$cg500",
});

const CommentContent = styled("p", {
  fontSize: "12px",
  fontWeight: 500,
  color: "$cg700",
  margin: 0,
});

const CommentActions = styled("div", {
  display: "flex",
  gap: "8px",
});

const CommentAction = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: "2px",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  fontSize: "12px",
  fontWeight: 500,
  color: "$cg700",
});

const ReplyItem = styled("div", {
  marginLeft: "16px",
  padding: "8px",
  borderLeft: "1px solid $cg300",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

// 날짜 포맷 함수
const formatDate = (dateString: string) => {
  return dayjs(dateString).format("YYYY.MM.DD HH:mm");
};

function BillVotingDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const billId = Number(id);

  const { data: bill, isLoading: isBillLoading } = useBill(billId);
  const { data: voteStatus } = useVoteStatus(billId);
  const { mutate: submitVote, isPending: isVoting } = useVote();
  const { data: comments = [], isLoading: isCommentsLoading } = useComments(billId);
  const { mutate: createComment, isPending: isCreatingComment } = useCreateComment(billId);
  const { mutate: likeComment } = useLikeComment(billId);
  const { user, openLoginModal } = useAuthStore();

  const [selectedVote, setSelectedVote] = useState<VoteType | null>(null);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const isLoggedIn = !!user;

  // 이미 투표한 경우 선택 상태 반영
  useEffect(() => {
    if (voteStatus?.user_vote) {
      setSelectedVote(voteStatus.user_vote);
    }
  }, [voteStatus]);

  // API 데이터 사용
  const billData = bill
    ? {
        id: bill.id,
        title: bill.title,
        proposer: bill.author,
        proposedDate: bill.proposed_date || "-",
        billNumber: bill.bill_number || "-",
        session: bill.session || "-",
        committee: bill.committee || "-",
        externalUrl: bill.external_url || "",
        agreePercent: bill.agree_percent,
        disagreePercent: bill.disagree_percent,
        isPopular: bill.total_votes >= 10,
        processStep: bill.process_step || "접수",
      }
    : null;

  // 법안 진행 단계 계산
  const processSteps = [
    { name: "접수", active: billData?.processStep === "접수" },
    { name: "위원회 심사", active: billData?.processStep === "위원회 심사" },
    { name: "체계자구 심사", active: billData?.processStep === "체계자구 심사" },
    { name: "본회의 심의", active: billData?.processStep === "본회의 심의" },
    { name: "정부 이송", active: billData?.processStep === "정부 이송" },
    { name: "공포", active: billData?.processStep === "공포" },
  ];

  // 막대 너비 계산 (항상 100% 채우기)
  const agreePercent = voteStatus?.agree_percent ?? billData?.agreePercent ?? 0;
  const disagreePercent = voteStatus?.disagree_percent ?? billData?.disagreePercent ?? 0;
  const total = agreePercent + disagreePercent;
  const displayAgree = total === 0 ? 50 : (agreePercent / total) * 100;
  const displayDisagree = total === 0 ? 50 : (disagreePercent / total) * 100;

  const handleBack = () => {
    navigate(-1);
  };

  const handleVote = (vote: VoteType) => {
    setSelectedVote(vote);
  };

  const handleSubmitVote = () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    if (selectedVote && billId) {
      submitVote(
        { billId, voteType: selectedVote },
        {
          onSuccess: () => {
            alert("투표가 완료되었습니다!");
          },
          onError: (error) => {
            alert("투표에 실패했습니다. 다시 시도해주세요.");
            console.error("Vote error:", error);
          },
        }
      );
    }
  };

  const handleSubmitComment = () => {
    if (!commentText.trim() || isCreatingComment) return;

    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    createComment(
      {
        content: commentText.trim(),
        nickname: user?.nickname || user?.email || "익명",
        user_id: user?.id,
        parent_id: replyingTo || undefined,
      },
      {
        onSuccess: () => {
          setCommentText("");
          setReplyingTo(null);
        },
        onError: (error) => {
          console.error("Comment error:", error);
          alert("댓글 작성에 실패했습니다.");
        },
      }
    );
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleLike = (commentId: number) => {
    likeComment(commentId);
  };

  return (
    <PageContainer>
      <Header>
        <HeaderLeft>
          <BackButton onClick={handleBack}>
            <BackIcon />
          </BackButton>
        </HeaderLeft>
        <HeaderRight>
          <LogoImage />
        </HeaderRight>
      </Header>

      <ContentContainer>
        {/* 법안 정보 카드 */}
        <CardContainer>
          {isBillLoading ? (
            <Title>로딩 중...</Title>
          ) : !billData ? (
            <Title>법안을 찾을 수 없습니다</Title>
          ) : (
            <>
              <TitleRow>
                {billData.isPopular && <Badge>인기</Badge>}
                <Title>{billData.title}</Title>
              </TitleRow>

              <VoteBarContainer>
                <DisagreeBar css={{ width: `${displayDisagree}%` }}>
                  <VoteText>반대 {disagreePercent}%</VoteText>
                </DisagreeBar>
                <AgreeBar css={{ width: `${displayAgree}%` }}>
                  <VoteText>{agreePercent}% 찬성</VoteText>
                </AgreeBar>
              </VoteBarContainer>

              <InfoContainer>
                <Proposer>{billData.proposer}</Proposer>
                <InfoRow>
                  <InfoLabel>제안일자</InfoLabel>
                  <InfoValue>{billData.proposedDate}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>의안번호</InfoLabel>
                  <InfoValue>{billData.billNumber}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>제안회기</InfoLabel>
                  <InfoValue>{billData.session}</InfoValue>
                </InfoRow>
              </InfoContainer>

              <LinkButton onClick={() => billData.externalUrl && window.open(billData.externalUrl, "_blank")}>
                <LinkText>법안 바로 확인하기</LinkText>
              </LinkButton>
            </>
          )}
        </CardContainer>

        {/* 법안 진행 현황 */}
        {billData && (
        <ProcessCard>
          <ProcessTitle>법안 진행 현황</ProcessTitle>
          <ProcessGrid>
            <ProcessStep active={processSteps[0].active}>
              {processSteps[0].name}
            </ProcessStep>
            <ProcessArrow />
            <ProcessStep active={processSteps[1].active}>
              {processSteps[1].name}
            </ProcessStep>
            <ProcessArrow />
            <ProcessStep active={processSteps[2].active}>
              {processSteps[2].name}
            </ProcessStep>
            <ProcessStep active={processSteps[3].active}>
              {processSteps[3].name}
            </ProcessStep>
            <ProcessArrow />
            <ProcessStep active={processSteps[4].active}>
              {processSteps[4].name}
            </ProcessStep>
            <ProcessArrow />
            <ProcessStep active={processSteps[5].active}>
              {processSteps[5].name}
            </ProcessStep>
          </ProcessGrid>
        </ProcessCard>
        )}

        {/* 투표 섹션 */}
        {billData && (
        <VoteSection>
          <VoteBarContainer>
            <DisagreeBar css={{ width: `${displayDisagree}%` }}>
              <VoteText>반대 {disagreePercent}%</VoteText>
            </DisagreeBar>
            <AgreeBar css={{ width: `${displayAgree}%` }}>
              <VoteText>{agreePercent}% 찬성</VoteText>
            </AgreeBar>
          </VoteBarContainer>

          <VoteButtonsRow>
            <VoteButton
              selected={selectedVote === "disagree" ? "disagree" : undefined}
              onClick={() => handleVote("disagree")}
            >
              반대
            </VoteButton>
            <VoteButton
              selected={selectedVote === "agree" ? "agree" : undefined}
              onClick={() => handleVote("agree")}
            >
              찬성
            </VoteButton>
          </VoteButtonsRow>

          <SubmitButton onClick={handleSubmitVote} disabled={isVoting || !selectedVote}>
            {isVoting ? "투표 중..." : voteStatus?.user_vote ? "다시 투표하기" : "투표하기"}
          </SubmitButton>
        </VoteSection>
        )}

        {/* 댓글 섹션 */}
        <CommentSection>
          <CommentInputContainer>
            <CommentInput
              placeholder={replyingTo ? "답글을 입력해주세요." : "댓글을 입력해주세요."}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && !isCreatingComment) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
              disabled={isCreatingComment}
            />
            {replyingTo && (
              <SendButton onClick={handleCancelReply}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5L15 15" stroke="#98A5B3" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </SendButton>
            )}
            <SendButton onClick={handleSubmitComment} disabled={isCreatingComment}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="#7D5CFD" />
              </svg>
            </SendButton>
          </CommentInputContainer>

          <CommentList>
            {isCommentsLoading ? (
              <CommentItem>
                <CommentContent>댓글을 불러오는 중...</CommentContent>
              </CommentItem>
            ) : comments.length === 0 ? (
              <CommentItem>
                <CommentContent>첫 번째 댓글을 남겨보세요!</CommentContent>
              </CommentItem>
            ) : (
              comments.map((comment) => (
                <div key={comment.id}>
                  <CommentItem>
                    <CommentHeader>
                      <CommentAuthor>{comment.nickname}</CommentAuthor>
                      <CommentTime>{formatDate(comment.created_at)}</CommentTime>
                    </CommentHeader>
                    <CommentContent>{comment.content}</CommentContent>
                    <CommentActions>
                      <CommentAction onClick={() => handleLike(comment.id)}>
                        ♡ {comment.likes_count > 0 ? comment.likes_count : "좋아요"}
                      </CommentAction>
                      <CommentAction onClick={() => handleReply(comment.id)}>
                        💬 댓글 달기
                      </CommentAction>
                    </CommentActions>
                  </CommentItem>
                  {comment.replies?.map((reply) => (
                    <ReplyItem key={reply.id}>
                      <CommentHeader>
                        <CommentAuthor>{reply.nickname}</CommentAuthor>
                        <CommentTime>{formatDate(reply.created_at)}</CommentTime>
                      </CommentHeader>
                      <CommentContent>{reply.content}</CommentContent>
                      <CommentActions>
                        <CommentAction onClick={() => handleLike(reply.id)}>
                          ♡ {reply.likes_count > 0 ? reply.likes_count : "좋아요"}
                        </CommentAction>
                      </CommentActions>
                    </ReplyItem>
                  ))}
                </div>
              ))
            )}
          </CommentList>
        </CommentSection>
      </ContentContainer>
    </PageContainer>
  );
}

export default BillVotingDetailPage;
