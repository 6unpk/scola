import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { styled } from "@app/styles";
import PageHeader from "@app/components/PageHeader";
import { useBlockUser } from "@app/hooks/useBlockUser";
import { BlockedUser } from "@app/store/useAuthStore";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const Content = styled("div", {
  flex: 1,
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const EmptyState = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 20px",
  textAlign: "center",
});

const EmptyText = styled("p", {
  fontSize: "16px",
  color: "$cg500",
  margin: "8px 0 0 0",
});

const BlockedUserItem = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px",
  backgroundColor: "white",
  border: "1px solid $cg200",
  borderRadius: "8px",
  marginBottom: "8px",
});

const UserInfo = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

const UserNickname = styled("div", {
  fontSize: "16px",
  fontWeight: 500,
  color: "$cg900",
});

const BlockDate = styled("div", {
  fontSize: "12px",
  color: "$cg500",
});

const BlockReason = styled("div", {
  fontSize: "14px",
  color: "$cg700",
  marginTop: "4px",
});

const UnblockButton = styled("button", {
  padding: "8px 16px",
  backgroundColor: "$cg100",
  color: "$cg700",
  border: "1px solid $cg300",
  borderRadius: "6px",
  fontSize: "14px",
  cursor: "pointer",
  
  "&:hover": {
    backgroundColor: "$cg200",
  },
});

function BlockedUsersPage() {
  const navigate = useNavigate();
  const { blockedUsers, unblockUser } = useBlockUser();
  const [isUnblocking, setIsUnblocking] = useState<number | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleUnblock = async (userId: number) => {
    setIsUnblocking(userId);
    try {
      unblockUser(userId);
      // 성공 메시지는 필요에 따라 추가
    } catch (error) {
      console.error("차단 해제 실패:", error);
      alert("차단 해제에 실패했습니다.");
    } finally {
      setIsUnblocking(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container>
      <PageHeader
        title="차단된 사용자"
        leftButton={{ icon: "back", onClick: handleBack }}
      />
      <Content>
        {blockedUsers.length === 0 ? (
          <EmptyState>
            <EmptyText>차단된 사용자가 없습니다.</EmptyText>
          </EmptyState>
        ) : (
          blockedUsers.map((user: BlockedUser) => (
            <BlockedUserItem key={user.id}>
              <UserInfo>
                <UserNickname>{user.nickname}</UserNickname>
                <BlockDate>차단일: {formatDate(user.blockedAt)}</BlockDate>
                {user.reason && (
                  <BlockReason>사유: {user.reason}</BlockReason>
                )}
              </UserInfo>
              <UnblockButton
                onClick={() => handleUnblock(user.id)}
                disabled={isUnblocking === user.id}
              >
                {isUnblocking === user.id ? "해제 중..." : "차단 해제"}
              </UnblockButton>
            </BlockedUserItem>
          ))
        )}
      </Content>
    </Container>
  );
}

export default BlockedUsersPage;
