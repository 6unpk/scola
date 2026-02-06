import { useState, useEffect } from "react";
import { styled } from "@app/styles";
import { BaseModal } from "@app/components/Modal";
import DefaultButton from "@app/components/DefaultButton";
import { InterestArea, INTEREST_AREA_OPTIONS } from "@app/types/healthInfo";

// 기존 HealthInfoModal과 동일한 스타일
const InterestAreaButton = styled("button", {
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

interface InterestAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (interestAreas: InterestArea[]) => void;
  initialData?: InterestArea[];
}

function InterestAreaModal({ isOpen, onClose, onUpdate, initialData }: InterestAreaModalProps) {
  const [selectedAreas, setSelectedAreas] = useState<InterestArea[]>(initialData || []);

  useEffect(() => {
    if (isOpen) {
      setSelectedAreas(initialData || []);
    }
  }, [isOpen, initialData]);

  const handleAreaToggle = (area: InterestArea) => {
    setSelectedAreas(prev => {
      if (prev.includes(area)) {
        return prev.filter(item => item !== area);
      } else {
        return [...prev, area];
      }
    });
  };

  const handleComplete = () => {
    onUpdate(selectedAreas);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <Title>관심분야 선택</Title>
      <ModalContent>
        <Section>
          <SectionTitle>선택된 관심분야</SectionTitle>
          <SelectedInfoContainer>
            {selectedAreas.length === 0 ? (
              <div
                style={{
                  color: "#9CA3AF",
                  fontSize: "12px",
                  alignSelf: "center",
                  padding: "8px 0",
                }}
              >
                선택된 관심분야가 없습니다
              </div>
            ) : (
              selectedAreas.map((area) => (
                <SelectedInfoButton key={area}>{area}</SelectedInfoButton>
              ))
            )}
          </SelectedInfoContainer>
        </Section>

        <Section>
          <SectionTitle>관심분야 리스트</SectionTitle>
          <InfoListContainer>
            {INTEREST_AREA_OPTIONS.map((option) => (
              <InterestAreaButton
                key={option}
                selected={selectedAreas.includes(option)}
                onClick={() => handleAreaToggle(option)}
              >
                {option}
              </InterestAreaButton>
            ))}
          </InfoListContainer>
        </Section>

        <DefaultButton onClick={handleComplete}>변경완료</DefaultButton>
      </ModalContent>
    </BaseModal>
  );
}

export default InterestAreaModal;
