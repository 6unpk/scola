import { styled } from "@app/styles";
import { motion } from "framer-motion";

const CardContainer = styled(motion.div, {
  backgroundColor: "$white",
  borderRadius: "16px",
  padding: "12px 16px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%",
  boxSizing: "border-box",
});

const TitleRow = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  width: "100%",
});

const Badge = styled(motion.span, {
  backgroundColor: "$primary",
  color: "$white",
  fontSize: "8px",
  fontWeight: 500,
  padding: "4px 8px",
  borderRadius: "16px",
  flexShrink: 0,
});

const Title = styled("p", {
  fontSize: "16px",
  fontWeight: 500,
  color: "$cg900",
  margin: 0,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const VoteBarContainer = styled("div", {
  width: "100%",
  height: "14px",
  backgroundColor: "$cg100",
  borderRadius: "4px",
  overflow: "hidden",
  display: "flex",
});

const DisagreeBar = styled(motion.div, {
  backgroundColor: "$disagree",
  height: "100%",
  display: "flex",
  alignItems: "center",
  paddingLeft: "4px",
  paddingRight: "4px",
  minWidth: "fit-content",
});

const AgreeBar = styled(motion.div, {
  backgroundColor: "$agree",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  paddingLeft: "4px",
  paddingRight: "4px",
  minWidth: "fit-content",
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

export type VotingCardProps = {
  title: string;
  proposer: string;
  proposedDate: string;
  billNumber: string;
  session: string;
  agreePercent: number;
  disagreePercent: number;
  isPopular?: boolean;
  onClick?: () => void;
};

function VotingCard({
  title,
  proposer,
  proposedDate,
  billNumber,
  session,
  agreePercent,
  disagreePercent,
  isPopular = false,
  onClick,
}: VotingCardProps) {
  // 막대 너비 계산 (항상 100% 채우기)
  const total = agreePercent + disagreePercent;
  const displayAgree = total === 0 ? 50 : (agreePercent / total) * 100;
  const displayDisagree = total === 0 ? 50 : (disagreePercent / total) * 100;

  return (
    <CardContainer
      onClick={onClick}
      css={{ cursor: onClick ? "pointer" : "default" }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <TitleRow>
        {isPopular && (
          <Badge
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.1 }}
          >
            인기
          </Badge>
        )}
        <Title>{title}</Title>
      </TitleRow>

      <VoteBarContainer>
        <DisagreeBar
          initial={{ width: 0 }}
          animate={{ width: `${displayDisagree}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <VoteText>반대 {disagreePercent}%</VoteText>
        </DisagreeBar>
        <AgreeBar
          initial={{ width: 0 }}
          animate={{ width: `${displayAgree}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <VoteText>{agreePercent}% 찬성</VoteText>
        </AgreeBar>
      </VoteBarContainer>

      <InfoContainer>
        <Proposer>{proposer}</Proposer>
        <InfoRow>
          <InfoLabel>제안일자</InfoLabel>
          <InfoValue>{proposedDate}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>의안번호</InfoLabel>
          <InfoValue>{billNumber}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>제안회기</InfoLabel>
          <InfoValue>{session}</InfoValue>
        </InfoRow>
      </InfoContainer>
    </CardContainer>
  );
}

export default VotingCard;
