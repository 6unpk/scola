import { useState, useEffect } from "react";

import BaseModal from "@app/components/BaseModal";
import { styled } from "@app/styles";
// GraphQL imports 제거됨 - REST API 문서에 토픽 관련 API가 없어서 임시로 하드코딩
import Check from "@app/assets/check.svg";
import DoubleCheck from "@app/assets/double_check.svg";
import DefaultButton from "@app/components/DefaultButton";

import { CSS } from "@stitches/react";

import { Topic } from "../type/topic";

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
  topicType: "CHAT" | "BUSINESS";
  onClose: () => void;
  onComplete: (selectedTopics: Topic[]) => void;
  css?: CSS;
}

function ArticleTopicSelectionModal({
  isOpen,
  topicType,
  onClose,
  onComplete,
  css,
}: TopicSelectionModalProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true);
        // REST API 문서에 토픽 API가 없어서 임시 하드코딩
        const mockTopics = [
          { topicId: 1, name: "일반" },
          { topicId: 2, name: "뉴스" },
          { topicId: 3, name: "정보" },
          { topicId: 4, name: "후기" },
        ];
        setTopics(mockTopics);

        if (false) {
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
      setSelectedTopic(topics[0]); // 모달이 열릴 때마다 선택 초기화
    }
  }, [isOpen]);

  const handleTopicClick = (topic: Topic) => {
    // 단일 선택만 허용: 현재 선택된 토픽이 클릭되면 선택 해제, 다른 토픽이면 교체
    if (selectedTopic && selectedTopic.topicId === topic.topicId) {
      setSelectedTopic(null);
    } else {
      setSelectedTopic(topic);
    }
  };

  const handleComplete = () => {
    if (selectedTopic) {
      onComplete([selectedTopic]); // 선택된 토픽 배열로 전달
    }
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
        {topics.map((topic) => (
          <TopicItem
            key={topic.topicId}
            selected={selectedTopic?.topicId === topic.topicId}
            onClick={() => handleTopicClick(topic)}
          >
            <img
              src={
                selectedTopic?.topicId === topic.topicId ? DoubleCheck : Check
              }
              alt="선택"
              width={20}
              height={20}
            />
            {topic.name}
          </TopicItem>
        ))}
      </TopicList>
      <DefaultButton onClick={handleComplete} disabled={!selectedTopic}>
        선택 완료
      </DefaultButton>
    </BaseModal>
  );
}

export default ArticleTopicSelectionModal;
