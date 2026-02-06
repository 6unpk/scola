import { useState, useCallback, useEffect } from "react";

// GraphQL imports 제거됨
import { styled } from "@app/styles";

import TopicSelectionModal from "./TopicSelectionModal";

import type { Topic } from "@app/pages/Article/type/topic";

const BaseTopicSelection = styled("div", {
  width: "100%",
  height: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#fff",
  borderBottom: "1px solid $cg100",
});

const TopicsContainer = styled("div", {
  flex: 1,
  overflowX: "auto",
  display: "flex",
  gap: "8px",
  padding: "0 16px",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  msOverflowStyle: "none",
  scrollbarWidth: "none",
});

const Topic = styled("div", {
  height: "22px",
  padding: "0 12px",
  fontSize: "12px",
  border: "1px solid $cg700",
  borderRadius: "64px",
  color: "$cg700",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  whiteSpace: "nowrap",
  cursor: "pointer",

  variants: {
    active: {
      true: {
        borderColor: "$cg500",
        color: "$cg500",
      },
    },
  },
});

const TopicChangeButton = styled("button", {
  height: "38px",
  padding: "0 16px",
  textDecoration: "underline",
  fontSize: "12px",
  color: "$cg500",
  background: "none",
  border: "none",
  cursor: "pointer",
  flexShrink: 0,

  "&:hover": {
    color: "$primary",
  },
});

interface TopicSelectionProps {
  onSelect: (topicIds: number[]) => void;
  topicType: "CHAT" | "BUSINESS";
}

function TopicSelection({ onSelect, topicType }: TopicSelectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await GetArticleTopicsQuery.fetch(environment, {
          type: topicType,
        }).toPromise();

        if (response?.getArticleTopics) {
          setTopics(response.getArticleTopics);
        }
      } catch (error) {
        console.error("토픽 목록을 불러오는데 실패했습니다:", error);
      }
    };

    fetchTopics();
  }, []);

  const handleComplete = (topicIds: number[]) => {
    setSelectedTopicIds(topicIds);
    setActiveTopicIndex(0);
    onSelect(topicIds);
  };

  const handleTopicClick = useCallback(
    (topicId: number) => {
      setSelectedTopicIds((prev) => {
        const newTopics = prev.includes(topicId)
          ? prev.filter((id) => id !== topicId)
          : [...prev, topicId];
        onSelect(newTopics);
        return newTopics;
      });
    },
    [onSelect],
  );

  const getTopicName = (topicId: number) => {
    const topic = topics.find((t) => t.topicId === topicId);
    return topic?.name || "";
  };

  return (
    <>
      <BaseTopicSelection>
        <TopicsContainer>
          {selectedTopicIds.length === 0 ? (
            <Topic active={true}>전체</Topic>
          ) : (
            selectedTopicIds.map((topicId, index) => (
              <Topic
                key={topicId}
                active={index === activeTopicIndex}
                onClick={() => handleTopicClick(topicId)}
              >
                {getTopicName(topicId)}
              </Topic>
            ))
          )}
        </TopicsContainer>
        <TopicChangeButton onClick={() => setIsModalOpen(true)}>
          주제변경
        </TopicChangeButton>
      </BaseTopicSelection>

      <TopicSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleComplete}
        initialSelectedTopics={selectedTopicIds}
        topicType={topicType}
      />
    </>
  );
}

export default TopicSelection;
