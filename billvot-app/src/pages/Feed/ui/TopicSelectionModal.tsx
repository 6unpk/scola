import { useState, useEffect } from "react";

// GraphQL imports 제거됨
import { styled } from "@app/styles";
import BaseModal from "@app/components/BaseModal";
import Check from "@app/assets/check.svg";
import DoubleCheck from "@app/assets/double_check.svg";
import DefaultButton from "@app/components/DefaultButton";

import { CSS } from "@stitches/react";

import type { Topic } from "@app/pages/Article/type/topic";

const TopicList = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  maxHeight: "400px",
  overflowY: "auto",
});

const TopicItem = styled("button", {
  display: "flex",
  alignItems: "center",
  height: "28px",
  gap: "12px",
  background: "none",
  border: "none",
  padding: "8px 0",
  cursor: "pointer",
  fontSize: "16px",
  color: "$cg700",
  textAlign: "left",

  "&:hover": {
    color: "$primary",
  },

  variants: {
    selected: {
      true: {
        color: "$primary",
        fontWeight: "500",
      },
    },
  },
});

interface TopicSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (selectedTopics: number[]) => void;
  initialSelectedTopics?: number[];
  css?: CSS;
  topicType: "CHAT" | "BUSINESS";
}

function TopicSelectionModal({
  isOpen,
  topicType,
  onClose,
  onComplete,
  initialSelectedTopics = [],
  css,
}: TopicSelectionModalProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<number[]>(
    initialSelectedTopics,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setSelectedTopics(initialSelectedTopics);
    }
  }, [isOpen, initialSelectedTopics]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true);
        const response = await GetArticleTopicsQuery.fetch(environment, {
          type: topicType,
        }).toPromise();

        if (response?.getArticleTopics) {
          setTopics(response.getArticleTopics);
        } else {
          console.error("토픽 데이터를 불러오는데 실패했습니다.");
          setTopics([]);
        }
      } catch (error) {
        console.error("토픽 목록을 불러오는데 실패했습니다:", error);
        setTopics([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchTopics();
    }
  }, [isOpen]);

  const handleTopicClick = (topicId: number | null) => {
    if (topicId === null) {
      setSelectedTopics([]);
      return;
    }

    setSelectedTopics((prev) => {
      if (prev.length === 0) {
        return [topicId];
      }

      const isSelected = prev.includes(topicId);
      if (isSelected) {
        return prev.filter((t) => t !== topicId);
      } else {
        return [...prev, topicId];
      }
    });
  };

  const handleComplete = () => {
    onComplete(selectedTopics);
    onClose();
  };

  if (isLoading) {
    return (
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="대화 주제 선택"
        css={css}
      >
        <div>로딩 중...</div>
      </BaseModal>
    );
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="대화 주제 선택"
      css={css}
    >
      <TopicList>
        <TopicItem
          key="all"
          selected={selectedTopics.length === 0}
          onClick={() => handleTopicClick(null)}
        >
          <img
            src={selectedTopics.length === 0 ? DoubleCheck : Check}
            alt="선택"
            width={20}
            height={20}
          />
          전체
        </TopicItem>
        {topics.map((topic) => (
          <TopicItem
            key={topic.topicId}
            selected={selectedTopics.includes(topic.topicId)}
            onClick={() => handleTopicClick(topic.topicId)}
          >
            <img
              src={selectedTopics.includes(topic.topicId) ? DoubleCheck : Check}
              alt="선택"
              width={20}
              height={20}
            />
            {topic.name}
          </TopicItem>
        ))}
      </TopicList>
      <DefaultButton onClick={handleComplete}>선택 완료</DefaultButton>
    </BaseModal>
  );
}

export default TopicSelectionModal;
