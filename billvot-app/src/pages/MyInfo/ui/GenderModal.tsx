import { useState, useEffect } from "react";
import { styled } from "@app/styles";
import { BaseModal } from "@app/components/Modal";
import DefaultButton from "@app/components/DefaultButton";
import { Gender, GENDER_OPTIONS } from "@app/types/healthInfo";

// 기존 HealthInfoModal과 동일한 스타일
const GenderButton = styled("button", {
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

interface GenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (gender: Gender) => void;
  initialData?: Gender;
}

function GenderModal({ isOpen, onClose, onUpdate, initialData }: GenderModalProps) {
  const [selectedGender, setSelectedGender] = useState<Gender | undefined>(initialData);

  useEffect(() => {
    if (isOpen) {
      setSelectedGender(initialData);
    }
  }, [isOpen, initialData]);

  const handleGenderSelect = (gender: Gender) => {
    setSelectedGender(gender);
  };

  const handleComplete = () => {
    if (selectedGender) {
      onUpdate(selectedGender);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <Title>성별 선택</Title>
      <ModalContent>
        <Section>
          <SectionTitle>선택된 성별</SectionTitle>
          <SelectedInfoContainer>
            {selectedGender ? (
              <SelectedInfoButton>{selectedGender}</SelectedInfoButton>
            ) : (
              <div
                style={{
                  color: "#9CA3AF",
                  fontSize: "12px",
                  alignSelf: "center",
                  padding: "8px 0",
                }}
              >
                선택된 성별이 없습니다
              </div>
            )}
          </SelectedInfoContainer>
        </Section>

        <Section>
          <SectionTitle>성별 리스트</SectionTitle>
          <InfoListContainer>
            {GENDER_OPTIONS.map((option) => (
              <GenderButton
                key={option}
                selected={selectedGender === option}
                onClick={() => handleGenderSelect(option)}
              >
                {option}
              </GenderButton>
            ))}
          </InfoListContainer>
        </Section>

        <DefaultButton onClick={handleComplete}>변경완료</DefaultButton>
      </ModalContent>
    </BaseModal>
  );
}

export default GenderModal;
