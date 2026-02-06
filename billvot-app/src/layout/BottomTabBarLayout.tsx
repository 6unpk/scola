import { Outlet, useNavigate } from "react-router-dom";

import BottomTabBar from "@app/components/BottomTabBar";
import { styled } from "@app/styles";
import useBottomTabStore, { TabType } from "@app/store/useBottomTabStore";
import { useSafeArea } from "@app/hooks/useSafeArea";

const LayoutContainer = styled("div", {
  width: "100%",
  height: "100dvh",
  display: "flex",
  flexDirection: "column",
});

const Content = styled("div", {
  flex: 1,
  overflowY: "auto",
  paddingBottom: "calc(54px + var(--safe-area-inset-bottom, env(safe-area-inset-bottom)))",
});

function BottomTabBarLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { setCurrentTab } = useBottomTabStore();
  
  // SafeArea 초기화
  useSafeArea();

  const handleTabClick = (path: string) => {
    navigate(path);
    setCurrentTab(path.split("/")[2] as TabType);
  };

  return (
    <LayoutContainer>
      <Content>
        {children}
      </Content>
      <BottomTabBar onTabClick={handleTabClick} />
    </LayoutContainer>
  );
}

export default BottomTabBarLayout;
