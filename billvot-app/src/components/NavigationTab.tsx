import { useState, useEffect, useRef } from "react";

import { styled } from "@app/styles";

import { CSS } from "@stitches/react";

const NavigationContainer = styled("nav", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "8px",
  position: "relative",
});

const TabList = styled("div", {
  width: "calc(100% - 32px)",
  display: "flex",
  gap: "2px",
  position: "relative",
});

const Tab = styled("button", {
  flex: 1,
  padding: "14px 0",
  background: "none",
  border: "none",
  fontSize: "12px",
  fontWeight: 700,
  cursor: "pointer",
  position: "relative",
  color: "#999999",
  transition: "color 0.3s ease",

  variants: {
    active: {
      true: {
        color: "#000000",
      },
    },
  },
});

const Indicator = styled("div", {
  position: "absolute",
  bottom: 0,
  height: "2px",
  backgroundColor: "#000000",
  transition: "left 0.3s ease, width 0.3s ease",
});

export type TabItem = {
  id: string;
  label: string;
};

export type NavigationTabProps = {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  css?: CSS;
};

function NavigationTab({
  tabs,
  activeTab,
  onTabChange,
  css,
}: NavigationTabProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });

  // 활성 탭이 변경될 때마다 인디케이터 위치 업데이트
  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
      if (activeIndex >= 0 && tabRefs.current[activeIndex]) {
        const tabElement = tabRefs.current[activeIndex];
        if (tabElement) {
          const tabRect = tabElement.getBoundingClientRect();
          const parentRect = tabElement.parentElement?.getBoundingClientRect();
          if (parentRect) {
            setIndicatorStyle({
              left: tabRect.left - parentRect.left,
              width: tabRect.width,
            });
          }
        }
      }
    };

    updateIndicator();
    // 윈도우 크기가 변경될 때도 인디케이터 위치 업데이트
    window.addEventListener("resize", updateIndicator);
    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeTab, tabs]);

  // 탭 클릭 핸들러
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  // 탭 참조 초기화
  const setTabRef = (index: number) => (el: HTMLButtonElement | null) => {
    tabRefs.current[index] = el;
  };

  return (
    <NavigationContainer css={css}>
      <TabList>
        {tabs.map((tab, index) => (
          <Tab
            key={tab.id}
            ref={setTabRef(index)}
            active={activeTab === tab.id}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </Tab>
        ))}
        <Indicator
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />
      </TabList>
    </NavigationContainer>
  );
}

export default NavigationTab;
