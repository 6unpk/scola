import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

import { styled } from "../styles";
import { useAuthStore } from "../store/useAuthStore";

const SidebarOverlay = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 9999,
  opacity: 0,
  visibility: "hidden",
  transition: "opacity 0.3s ease, visibility 0.3s ease",

  variants: {
    isOpen: {
      true: {
        opacity: 1,
        visibility: "visible",
      },
    },
  },
});

const SidebarContainer = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  width: "80%",
  minWidth: "264px",
  maxWidth: "320px",
  height: "100%",
  backgroundColor: "white",
  zIndex: 10000,
  transform: "translateX(-100%)",
  transition: "transform 0.3s ease",
  boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)",
  paddingTop: "env(safe-area-inset-top)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxSizing: "border-box",

  variants: {
    isOpen: {
      true: {
        transform: "translateX(0)",
      },
    },
  },
});

const SidebarHeader = styled("div", {
  padding: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const MenuContainer = styled("div", {
  padding: "20px 16px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const MenuItem = styled("button", {
  width: "100%",
  padding: "0",
  background: "none",
  border: "none",
  fontFamily: "Pretendard",
  fontSize: "18px",
  fontWeight: "600",
  color: "#292E33",
  textAlign: "left",
  cursor: "pointer",
  transition: "color 0.2s ease",

  "&:hover": {
    color: "#1F2937",
  },
});

const CloseButton = styled("button", {
  background: "none",
  border: "none",
  fontSize: "24px",
  color: "#6B7280",
  cursor: "pointer",
  padding: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ContactInfo = styled("div", {
  position: "absolute",
  bottom: "20px",
  left: "20px",
  right: "20px",
  fontFamily: "Pretendard",
  fontWeight: 400,
  fontSize: "16px",
  color: "#525C66",
  lineHeight: 1.17,
  paddingBottom: "env(safe-area-inset-bottom)",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialMenu?: "billvoting" | "myinfo";
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { user, openLoginModal } = useAuthStore();

  const handleBillVotingClick = () => {
    navigate("/bill-voting");
    onClose();
  };

  const handleMyInfoClick = () => {
    if (!user) {
      openLoginModal();
      onClose();
      return;
    }
    navigate("/myinfo");
    onClose();
  };

  if (typeof document === "undefined") {
    return null;
  }

  const sidebarContent = (
    <>
      <SidebarOverlay
        isOpen={isOpen}
        onClick={onClose}
      />
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <div style={{ flex: 1 }} />
          <CloseButton onClick={onClose}>
            ×
          </CloseButton>
        </SidebarHeader>

        <MenuContainer>
          <MenuItem onClick={handleBillVotingClick}>
            빌보팅
          </MenuItem>
          <MenuItem onClick={handleMyInfoClick}>
            나의 정보
          </MenuItem>
        </MenuContainer>

        <ContactInfo>
          <div>E. contact@billvot.com</div>
        </ContactInfo>
      </SidebarContainer>
    </>
  );

  return createPortal(sidebarContent, document.body);
}

export default Sidebar;
