import { styled } from "@app/styles";
import { UserHealthInfo, GENDER_OPTIONS, AGE_GROUP_OPTIONS, INTEREST_AREA_OPTIONS } from "@app/types/healthInfo";

const Section = styled("div", {
  padding: "20px 0",
  borderBottom: "1px solid #F3F4F6",
});

const SectionTitle = styled("div", {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1F2937",
  marginBottom: "12px",
});

const InfoRow = styled("div", {
  padding: "16px 0",
  borderBottom: "1px solid #F3F4F6",

  "&:last-child": {
    borderBottom: "none",
  },
});

const InfoLabel = styled("div", {
  fontSize: "14px",
  color: "#1F2937",
  fontWeight: "500",
  marginBottom: "8px",
});

const TagsContainer = styled("div", {
  display: "flex",
  gap: "8px",
  marginBottom: "8px",
  flexWrap: "wrap",
});

const InfoContent = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
});

const Tag = styled("button", {
  padding: "8px 16px",
  borderRadius: "20px",
  border: "1px solid #E5E7EB",
  backgroundColor: "white",
  fontSize: "12px",
  color: "#6B7280",
  cursor: "pointer",
  transition: "all 0.2s",

  "&:hover": {
    backgroundColor: "#F9FAFB",
  },

  variants: {
    selected: {
      true: {
        backgroundColor: "white",
        border: "1px solid #1F2937",
        color: "#1F2937",
      },
    },
  },
});

const EditLink = styled("div", {
  fontSize: "12px",
  color: "#9CA3AF",
  textAlign: "right",
  textDecoration: "underline",
  cursor: "pointer",

  "&:hover": {
    color: "#6B7280",
  },
});


interface UserHealthInfoSectionProps {
  userHealthInfo?: UserHealthInfo;
  onGenderEdit: () => void;
  onAgeGroupEdit: () => void;
  onInterestAreaEdit: () => void;
}

function UserHealthInfoSection({ userHealthInfo, onGenderEdit, onAgeGroupEdit, onInterestAreaEdit }: UserHealthInfoSectionProps) {
  return (
    <Section>
      <SectionTitle>나의 건강정보</SectionTitle>
      
      <InfoRow>
        <InfoLabel>성별</InfoLabel>
        <TagsContainer>
          {userHealthInfo?.gender ? (
            <Tag selected={true}>{userHealthInfo.gender}</Tag>
          ) : (
            <div style={{ color: "#9CA3AF", fontSize: "12px" }}>미설정</div>
          )}
        </TagsContainer>
        <InfoContent>
          <div></div>
          <EditLink onClick={onGenderEdit}>수정하기</EditLink>
        </InfoContent>
      </InfoRow>
      
      <InfoRow>
        <InfoLabel>연령대</InfoLabel>
        <TagsContainer>
          {userHealthInfo?.ageGroup ? (
            <Tag selected={true}>{userHealthInfo.ageGroup}</Tag>
          ) : (
            <div style={{ color: "#9CA3AF", fontSize: "12px" }}>미설정</div>
          )}
        </TagsContainer>
        <InfoContent>
          <div></div>
          <EditLink onClick={onAgeGroupEdit}>수정하기</EditLink>
        </InfoContent>
      </InfoRow>
      
      <InfoRow>
        <InfoLabel>관심분야</InfoLabel>
        <TagsContainer>
          {userHealthInfo?.interestAreas && userHealthInfo.interestAreas.length > 0 ? (
            userHealthInfo.interestAreas.map((area, index) => (
              <Tag key={index} selected={true}>{area}</Tag>
            ))
          ) : (
            <div style={{ color: "#9CA3AF", fontSize: "12px" }}>미설정</div>
          )}
        </TagsContainer>
        <InfoContent>
          <div></div>
          <EditLink onClick={onInterestAreaEdit}>수정하기</EditLink>
        </InfoContent>
      </InfoRow>
    </Section>
  );
}

export default UserHealthInfoSection;
