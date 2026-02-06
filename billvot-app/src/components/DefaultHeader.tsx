import { useState } from "react";

import { styled } from "@app/styles";
import Logo from "@app/assets/logo-primary.svg?react";
import arrowBack from "@app/assets/arrow_back.svg";
import Option from "@app/assets/more_horiz.svg";
import { useAuth } from "@app/hooks/api/useAuth";
import { useArticleDelete } from "@app/hooks/useArticleDelete";
import { useCommunityPostDelete } from "@app/hooks/useCommunityPostDelete";
import { useAuthStore } from "@app/store/useAuthStore";

import { CSS } from "@stitches/react";
import { useNavigate } from "react-router";

import OverlaySelect from "./OverlaySelect";

const HeaderContainer = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  height: "54px",
  backgroundColor: "white",
});

const HeaderTitleContainer = styled("div", {
  flex: 1,
  display: "flex",
  justifyContent: "right",
  alignItems: "center",
});

const Spacer = styled("div", {
  flex: 1,
});

const HeaderTitle = styled(Logo, {
  height: "24px",
  margin: 0,
  marginRight: "8px", // 뒤로가기 버튼과 같은 여백
  svg: {
    path: {
      fill: "#E4EAF0",
    },
  },
});

const Button = styled("button", {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "$cg900",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "46px",

  "&:disabled": {
    color: "$cg300",
    cursor: "not-allowed",
    display: "none",
  },
});

interface ButtonConfig {
  icon?: string;
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface PageHeaderProps {
  title: string;
  leftButton?: ButtonConfig;
  rightButton?: ButtonConfig;
  articleId?: number | string;
  articleUserId?: number | string;
  isRealty?: boolean;
  isCommunity?: boolean;
  hideLogo?: boolean;
  css?: CSS;
}

function DefaultHeader({
  css,
  articleId,
  articleUserId,
  isRealty,
  isCommunity = false,
  hideLogo = false,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const { user } = useAuth();
  const { deleteArticle, isDeleting } = useArticleDelete();
  const { deletePost, isDeleting: isDeletingCommunity } = useCommunityPostDelete();

  const handleOptionClick = () => {
    setIsOverlayOpen(true);
  };

  const handleOverlayClose = () => {
    setIsOverlayOpen(false);
  };

  const handleDelete = async () => {
    if (articleId) {
      setIsOverlayOpen(false);
      if (isCommunity) {
        await deletePost(articleId as string);
        navigate("/main/community");
      } else {
        await deleteArticle(articleId as string);
        navigate(-1);
      }
    }
  };

  const handleBlockUser = async () => {
    if (!articleUserId) return;
    try {
      // 클라이언트 사이드 차단 처리
      const { blockUser } = useAuthStore.getState();
      const userIdNumber = typeof articleUserId === 'string' ? parseInt(articleUserId) : articleUserId;
      blockUser(userIdNumber, "사용자", "헤더에서 차단");
      navigate(-1);
      alert("사용자가 차단되었습니다.");
      setIsOverlayOpen(false);
    } catch (error) {
      console.error("사용자 차단 실패:", error);
      alert("사용자 차단에 실패했습니다.");
    }
  };

  const handleLogoClick = () => {
    navigate("/main/feed");
  };

  return (
    <>
      <HeaderContainer css={css}>
        <Button onClick={() => navigate(-1)}>
          <img src={arrowBack} alt="뒤로가기" width={24} height={24} />
        </Button>
        {!hideLogo ? (
          <HeaderTitleContainer>
            <Button onClick={handleLogoClick}>
              <HeaderTitle />
            </Button>
          </HeaderTitleContainer>
        ) : (
          <Spacer />
        )}
        <Button onClick={handleOptionClick} disabled={!articleId}>
          <img src={Option} alt="옵션" width={24} height={24} />
        </Button>
      </HeaderContainer>
      <OverlaySelect
        isOpen={isOverlayOpen}
        onClose={handleOverlayClose}
        options={[
          ...(articleUserId === user?.id
            ? [
                {
                  label: "수정하기",
                  onClick: () => {
                    if (isCommunity) {
                      navigate(`/community/write?postId=${articleId}`);
                    } else if (isRealty) {
                      navigate(`/realty-article?articleId=${articleId}`);
                    } else {
                      navigate(`/article?articleId=${articleId}`);
                    }
                  },
                },
              ]
            : []),
          ...(articleUserId === user?.id
            ? [
                {
                  label: (isDeleting || isDeletingCommunity) ? "삭제 중..." : "삭제하기",
                  onClick: handleDelete,
                  disabled: isDeleting || isDeletingCommunity,
                },
              ]
            : []),
          ...(articleUserId !== user?.id
            ? [
                // {
                //   label: "쪽지보내기",
                //   onClick: () => {
                //     if (articleUserId != user?.id) {
                //       navigate(`/message/send?userId=${articleUserId}`);
                //     } else {
                //       alert("자신에게 쪽지를 보낼 수 없습니다.");
                //     }
                //   },
                // },
              ]
            : []),
          ...(articleUserId !== user?.id
            ? [
                {
                  label: "신고하기",
                  onClick: () => {
                    navigate(
                      `/report?articleId=${articleId}&userId=${articleUserId}`,
                    );
                  },
                },
                {
                  label: "사용자 차단하기",
                  onClick: handleBlockUser,
                },
              ]
            : []),
        ]}
      />
    </>
  );
}

export default DefaultHeader;
