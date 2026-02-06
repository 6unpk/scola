import { HTMLAttributes, useState } from "react";

import { styled } from "@app/styles";
import Menu from "@app/assets/menu.svg?react";
import LogoBillvot from "@app/assets/billvot.svg?react";
import Search from "@app/assets/search.svg?react";
import Notification from "@app/assets/notification.svg?react";

import { CSS, VariantProps } from "@stitches/react";
import { useNavigate } from "react-router";

import Sidebar from "./Sidebar";
import SearchOverlay from "./SearchOverlay";

const HeaderContainer = styled("header", {
  width: "100%",
  height: "48px",
  boxSizing: "border-box",
  backgroundColor: "$white",
  padding: "0 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const LeftSection = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "12px",
});

const RightSection = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "4px",
});

const LogoImage = styled(LogoBillvot, {
  height: "20px",
  width: "auto",
});

const MenuIcon = styled(Menu, {
  width: "24px",
  height: "24px",
  fill: "$cg900",
});

const SearchIcon = styled(Search, {
  width: "24px",
  height: "24px",
  fill: "$cg900",
});

const NotificationIcon = styled(Notification, {
  width: "24px",
  height: "24px",
  fill: "$cg900",
});

const IconButton = styled("button", {
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "11px",

  variants: {
    right: {
      true: {
        paddingRight: "0px",
      },
    },
    left: {
      true: {
        paddingLeft: "0px",
      },
    },
  },
});

type HeaderProps = {
  css?: CSS;
} & Omit<
  HTMLAttributes<HTMLDivElement>,
  keyof VariantProps<typeof HeaderContainer>
> &
  VariantProps<typeof HeaderContainer>;

function MainHeader({ css }: HeaderProps) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleSearchClick = () => {
    setIsSearchOverlayOpen(true);
  };

  const handleSearchOverlayClose = () => {
    setIsSearchOverlayOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  return (
    <>
      <HeaderContainer css={css}>
        <LeftSection>
          <IconButton onClick={handleMenuClick} left>
            <MenuIcon />
          </IconButton>
          <IconButton onClick={handleLogoClick}>
            <LogoImage />
          </IconButton>
        </LeftSection>

        <RightSection>
          <IconButton onClick={handleNotificationClick}>
            <NotificationIcon />
          </IconButton>
          <IconButton onClick={handleSearchClick} right>
            <SearchIcon />
          </IconButton>
        </RightSection>
      </HeaderContainer>

      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={handleSearchOverlayClose}
      />
    </>
  );
}

export default MainHeader;
