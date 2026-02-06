import { useCallback, useEffect } from "react";

import { useLocation } from "react-router-dom";

import Foodit from "@app/assets/foodit.svg?react";
import FooditFill from "@app/assets/foodit-fill.svg?react";
import Article from "@app/assets/article.svg?react";
import ArticleFill from "@app/assets/article-fill.svg?react";
import Scanner from "@app/assets/scanner.svg?react";
import Community from "@app/assets/community.svg?react";
import CommunityFill from "@app/assets/community-fill.svg?react";
import FoodWiki from "@app/assets/food_wiki.svg?react";
import FoodWikiFill from "@app/assets/food_wiki-fill.svg?react";
import { useAuthStore } from "@app/store/useAuthStore";

import { CSS } from "@stitches/react";
import { Capacitor } from "@capacitor/core";

import { styled } from "../styles";
import { useSafeArea } from "../hooks/useSafeArea";

const BottomNavContainer = styled("nav", {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  height: "42px",
  backgroundColor: "white",
  padding: "8px 0 var(--safe-area-inset-bottom, env(safe-area-inset-bottom)) 0",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  width: "100%",
  margin: "0 auto",
  borderTop: "1px solid $cg100",
  zIndex: 66,
});

const TabButton = styled("button", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "4px 8px",
  color: "$cg700",
  fontSize: "12px",
  fontWeight: 500,
  width: "64px",
  minHeight: "38px",

  "&:focus": {
    outline: "none",
  },

  "& path": {
    fill: "$cg500",
  },

  variants: {
    active: {
      true: {
        color: "$cg900",
        "& path": {
          fill: "$cg900",
        },
      },
    },
    isScanner: {
      true: {
        width: "64px",
        height: "64px",
        borderRadius: "20px",
        backgroundColor: "$primary",
        padding: "0",
        marginTop: "-40px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 67,
        "& path": {
          fill: "white",
        },
      },
    },
  },
});

const tabs = [
  {
    id: "home",
    label: "푸디터",
    icon: Foodit,
    iconFill: FooditFill,
    path: "/main/feed",
  },
  {
    id: "foodnews",
    label: "푸드뉴스",
    icon: Article,
    iconFill: ArticleFill,
    path: "/main/foodnews",
  },
  { id: "foodscanner", label: "", icon: Scanner, path: "/main/foodscanner" },
  {
    id: "community",
    label: "커뮤니티",
    icon: Community,
    iconFill: CommunityFill,
    path: "/main/community",
  },
  {
    id: "foodwiki",
    label: "푸드위키",
    icon: FoodWiki,
    iconFill: FoodWikiFill,
    path: "/main/foodwiki",
  },
];

interface BottomTabBarProps {
  onTabClick: (path: string) => void;
  css?: CSS;
}

function BottomTabBar({ onTabClick, css }: BottomTabBarProps) {
  const location = useLocation();
  const { user } = useAuthStore();
  const { isLoginModalOpen, openLoginModal, closeLoginModal } = useAuthStore();
  const { insets, isLoading } = useSafeArea();
  const platform = Capacitor.getPlatform();
  const isWeb = platform === "web";

  const handleTabClick = useCallback(
    (path: string, tabId: string) => {
      if (tabId === "foodscanner") {
        const platform = Capacitor.getPlatform();
        if (platform === "web") {
          alert("푸드스캐너는 모바일 앱에서만 사용 가능합니다.");
          return;
        }
        if (!user) {
          console.log("login modal open");
          openLoginModal();
          return;
        }
      }
      onTabClick(path);
    },
    [onTabClick, user, openLoginModal],
  );

  // SafeArea 로딩 중에는 기본 높이로 표시
  if (isLoading) {
    return (
      <BottomNavContainer
        css={{
          ...css,
          ...(isWeb && { paddingBottom: "12px" })
        }}
      >
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const IconComponent =
            isActive && tab.iconFill ? tab.iconFill : tab.icon;
          const isScanner = tab.id === "foodscanner";

          return (
            <TabButton
              key={tab.id}
              active={isActive}
              isScanner={isScanner}
              onClick={() => handleTabClick(tab.path, tab.id)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                }}
              >
                <IconComponent width={36} height={36} />
              </div>
              {tab.label && <span>{tab.label}</span>}
            </TabButton>
          );
        })}
      </BottomNavContainer>
    );
  }

  return (
    <BottomNavContainer
      css={{
        ...css,
        ...(isWeb && { paddingBottom: "12px" })
      }}
    >
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        const IconComponent =
          isActive && tab.iconFill ? tab.iconFill : tab.icon;
        const isScanner = tab.id === "foodscanner";

        return (
          <TabButton
            key={tab.id}
            active={isActive}
            isScanner={isScanner}
            onClick={() => handleTabClick(tab.path, tab.id)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "24px",
                height: "24px",
              }}
            >
              <IconComponent width={24} height={24} />
            </div>
            {tab.label && <span>{tab.label}</span>}
          </TabButton>
        );
      })}
    </BottomNavContainer>
  );
}

export default BottomTabBar;
