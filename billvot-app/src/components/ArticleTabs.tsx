import { styled } from "@app/styles";

const TabContainer = styled("div", {
  display: "flex",
  padding: "20px 16px 0 16px",
  gap: "24px",
});

const TabItem = styled("button", {
  background: "none",
  border: "none",
  fontSize: "16px",
  fontWeight: "bold",
  color: "#9CA3AF",
  cursor: "pointer",
  padding: "0 0 12px 0",
  position: "relative",

  variants: {
    active: {
      true: {
        color: "#1F2937",
      },
    },
  },
});

interface ArticleTabsProps {
  tabs: string[];
  activeTab: string;
  onTabClick: (tab: string) => void;
}

function ArticleTabs({ tabs, activeTab, onTabClick }: ArticleTabsProps) {
  return (
    <TabContainer>
      {tabs.map((tab) => (
        <TabItem
          key={tab}
          active={activeTab === tab}
          onClick={() => onTabClick(tab)}
        >
          {tab}
        </TabItem>
      ))}
    </TabContainer>
  );
}

export default ArticleTabs;
