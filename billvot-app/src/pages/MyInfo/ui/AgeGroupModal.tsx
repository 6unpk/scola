import { useState, useEffect } from "react";
import { styled } from "@app/styles";
import { BaseModal } from "@app/components/Modal";
import DefaultButton from "@app/components/DefaultButton";
import { AgeGroup, AGE_GROUP_OPTIONS } from "@app/types/healthInfo";

// 기존 HealthInfoModal과 동일한 스타일
const AgeGroupButton = styled("button", {
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
  padding: "0px 4px",
});

const InfoListContainer = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  padding: "0px 4px",
});

// 선택된 항목 표시용 버튼
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

interface AgeGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (ageGroup: AgeGroup) => void;
  initialData?: AgeGroup;
}

function AgeGroupModal({ isOpen, onClose, onUpdate, initialData }: AgeGroupModalProps) {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | undefined>(initialData);

  useEffect(() => {
    if (isOpen) {
      setSelectedAgeGroup(initialData);
    }
  }, [isOpen, initialData]);

  const handleAgeGroupSelect = (ageGroup: AgeGroup) => {
    setSelectedAgeGroup(ageGroup);
  };

  const handleComplete = () => {
    if (selectedAgeGroup) {
      onUpdate(selectedAgeGroup);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <Title>연령대 선택</Title>
      <ModalContent>
        <Section>
          <SectionTitle>선택된 연령대</SectionTitle>
          <SelectedInfoContainer>
            {selectedAgeGroup ? (
              <SelectedInfoButton>{selectedAgeGroup}</SelectedInfoButton>
            ) : (
              <div
                style={{
                  color: "#9CA3AF",
                  fontSize: "12px",
                  alignSelf: "center",
                  padding: "8px 0",
                }}
              >
                선택된 연령대가 없습니다
              </div>
            )}
          </SelectedInfoContainer>
        </Section>

        <Section>
          <SectionTitle>연령대 리스트</SectionTitle>
          <InfoListContainer>
            {AGE_GROUP_OPTIONS.map((option) => (
              <AgeGroupButton
                key={option}
                selected={selectedAgeGroup === option}
                onClick={() => handleAgeGroupSelect(option)}
              >
                {option}
              </AgeGroupButton>
            ))}
          </InfoListContainer>
        </Section>

        <DefaultButton onClick={handleComplete}>변경완료</DefaultButton>
      </ModalContent>
    </BaseModal>
  );
}

export default AgeGroupModal;
