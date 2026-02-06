import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@app/styles";
import { motion } from "framer-motion";
import MainHeader from "@app/components/MainHeader";
import { useAuthStore } from "@app/store/useAuthStore";
import { authService } from "@app/api/services/auth";

const PageContainer = styled(motion.div, {
  width: "100%",
  minHeight: "100vh",
  backgroundColor: "$cg20",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
});

const ContentContainer = styled("div", {
  flex: 1,
  padding: "16px",
  display: "flex",
  flexDirection: "column",
});

const InfoCard = styled(motion.div, {
  backgroundColor: "$white",
  borderRadius: "16px",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

const PageTitle = styled("h1", {
  fontSize: "20px",
  fontWeight: 700,
  color: "$cg900",
  margin: 0,
});

const InfoGroup = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const InfoLabel = styled("span", {
  fontSize: "12px",
  fontWeight: 500,
  color: "$cg500",
});

const InfoValue = styled("p", {
  fontSize: "14px",
  fontWeight: 500,
  color: "$cg700",
  margin: 0,
  padding: "12px 0",
  borderBottom: "1px solid $cg100",
});

const ButtonRow = styled("div", {
  display: "flex",
  justifyContent: "center",
  gap: "24px",
  marginTop: "8px",
});

const TextButton = styled(motion.button, {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 500,
  color: "$cg700",
  padding: "8px",
});

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

function MyInfoPage() {
  const navigate = useNavigate();
  const { user, clearAuth, openLoginModal } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      openLoginModal();
      navigate(-1);
    }
  }, [user, openLoginModal, navigate]);

  const handleLogout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      clearAuth();
      navigate("/", { replace: true });
    }
  };

  const handleWithdraw = async () => {
    if (!confirm("정말 회원탈퇴 하시겠습니까?\n탈퇴 후 모든 데이터가 삭제됩니다.")) {
      return;
    }

    setIsLoading(true);
    try {
      await authService.deleteAccount();
      clearAuth();
      alert("회원탈퇴가 완료되었습니다.");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("회원탈퇴 실패:", error);
      alert("회원탈퇴에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <MainHeader />

      <ContentContainer>
        <InfoCard variants={itemVariants}>
          <PageTitle>나의 정보</PageTitle>

          <InfoGroup>
            <InfoLabel>아이디</InfoLabel>
            <InfoValue>{user?.email || "email@gmail.com"}</InfoValue>
          </InfoGroup>

          <InfoGroup>
            <InfoLabel>닉네임</InfoLabel>
            <InfoValue>{user?.nickname || "사용중인 닉네임"}</InfoValue>
          </InfoGroup>

          <ButtonRow>
            <TextButton
              onClick={handleLogout}
              whileTap={{ scale: 0.95 }}
            >
              로그아웃
            </TextButton>
            <TextButton
              onClick={handleWithdraw}
              whileTap={{ scale: 0.95 }}
            >
              회원탈퇴
            </TextButton>
          </ButtonRow>
        </InfoCard>
      </ContentContainer>
    </PageContainer>
  );
}

export default MyInfoPage;
