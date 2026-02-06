import { useState, useEffect } from "react";

import { styled } from "@app/styles";
import { BaseModal } from "@app/components/Modal";
import DefaultButton from "@app/components/DefaultButton";

import type { CSS } from "@stitches/react";

// 푸드위키와 통일된 칩 스타일 - 건강정보용
const HealthButton = styled("button", {
  padding: "6px 12px",
  border: "1px solid #98A5B3",
  borderRadius: "20px",
  backgroundColor: "white",
  fontSize: "12px",
  color: "#98A5B3",
  cursor: "pointer",
  transition: "all 0.2s ease",

  "&:hover": {
    borderColor: "#D1D5DB",
  },

  variants: {
    selected: {
      true: {
        borderWidth: "2px",
        color: "#292E33",
        borderColor: "#292E33",
        backgroundColor: "#F9FAFB",
      },
    },
  },
});

// 푸드위키와 통일된 칩 스타일 - 피하고싶은 성분용
const AvoidanceButton = styled("button", {
  padding: "6px 12px",
  border: "1px solid #98A5B3",
  borderRadius: "20px",
  backgroundColor: "white",
  fontSize: "12px",
  color: "#98A5B3",
  cursor: "pointer",
  transition: "all 0.2s ease",

  "&:hover": {
    borderColor: "#D1D5DB",
  },

  variants: {
    selected: {
      true: {
        borderWidth: "2px",
        color: "#292E33",
        borderColor: "#292E33",
        backgroundColor: "#F9FAFB",
      },
    },
  },
});

const ModalContent = styled("div", {
  padding: "20px 16px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

const Title = styled("div", {
  fontSize: "18px",
  fontWeight: "bold",
  textAlign: "center",
  padding: "12px 12px 8px 12px",
});

const Section = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const SectionTitle = styled("div", {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1F2937",
});

const SelectedInfoContainer = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  padding: "0px 4px", // 피그마 디자인에 맞게 패딩 조정
});

const InfoListContainer = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  padding: "0px 4px", // SelectedInfoContainer와 동일한 패딩 적용
});

// 선택된 항목 표시용 버튼 - 푸드위키 스타일과 통일
const SelectedInfoButton = styled("button", {
  padding: "6px 12px",
  border: "2px solid #292E33",
  borderRadius: "20px",
  backgroundColor: "#F9FAFB",
  fontSize: "12px",
  color: "#292E33",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
  transition: "all 0.2s ease",
  
  "&:hover": {
    backgroundColor: "#F3F4F6",
  },
});

const EditText = styled("div", {
  fontSize: "12px",
  color: "#9CA3AF",
  textAlign: "center",
  marginTop: "8px",
  cursor: "pointer",
  textDecoration: "underline",

  "&:hover": {
    color: "#6B7280",
  },
});

interface HealthInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  css?: CSS;
  type: "health" | "avoidance";
  onUpdate?: (data: string[]) => void;
  initialData?: string[];
}

function HealthInfoModal({ isOpen, onClose, css, type, onUpdate, initialData }: HealthInfoModalProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(
    initialData || (type === "health" ? ["비만", "저체중"] : ["설탕", "제정신만"]),
  );

  // initialData가 변경되면 selectedItems 업데이트
  useEffect(() => {
    if (initialData) {
      setSelectedItems(initialData);
    }
  }, [initialData]);

  const availableItems =
    type === "health"
      ? [
          "비만",
          "저체중",
          "고혈압",
          "당뇨",
          "심장병",
          "간질환",
          "신장병",
          "알레르기",
        ]
      : [
          "설탕",
          "제정신만",
          "나트륨",
          "트랜스지방",
          "방부제",
          "색소",
          "향료",
          "글루텐",
        ];

  const handleItemClick = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selected) => selected !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleComplete = () => {
    console.log(
      `${type === "health" ? "건강정보" : "피하고 싶은 성분"} 변경:`,
      selectedItems,
    );
    
    if (onUpdate) {
      onUpdate(selectedItems);
    } else {
      alert(
        `${
          type === "health" ? "건강정보" : "피하고 싶은 성분"
        }가 성공적으로 변경되었습니다.`,
      );
      onClose();
    }
  };

  const getTitle = () => {
    return type === "health"
      ? "나의 건강정보 수정"
      : "내가 피하고 싶은 성분 수정";
  };

  const getSectionTitle = () => {
    return type === "health" ? "추가된 정보" : "피하고 싶은 성분";
  };

  const getListTitle = () => {
    return type === "health" ? "정보 리스트" : "성분 리스트";
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <Title>{getTitle()}</Title>
      <ModalContent css={css}>
        <Section>
          <SectionTitle>{getSectionTitle()}</SectionTitle>
          <SelectedInfoContainer>
            {selectedItems.length === 0 ? (
              <div
                style={{
                  color: "#9CA3AF",
                  fontSize: "12px",
                  alignSelf: "center",
                  padding: "8px 0",
                }}
              >
                선택된 항목이 없습니다
              </div>
            ) : (
              selectedItems.map((item) => (
                <SelectedInfoButton key={item}>{item}</SelectedInfoButton>
              ))
            )}
          </SelectedInfoContainer>
        </Section>

        <Section>
          <SectionTitle>{getListTitle()}</SectionTitle>
          <InfoListContainer>
            {availableItems.map((item) => {
              const ButtonComponent =
                type === "health" ? HealthButton : AvoidanceButton;
              return (
                <ButtonComponent
                  key={item}
                  selected={selectedItems.includes(item)}
                  onClick={() => handleItemClick(item)}
                >
                  {item}
                </ButtonComponent>
              );
            })}
          </InfoListContainer>
        </Section>

        <DefaultButton onClick={handleComplete}>변경완료</DefaultButton>
      </ModalContent>
    </BaseModal>
  );
}

export default HealthInfoModal;
