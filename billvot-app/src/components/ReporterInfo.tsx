import { styled } from "@app/styles";

const ReporterInfoContainer = styled("div", {
  padding: "20px 16px",
  borderTop: "1px solid #F3F4F6",
  borderBottom: "1px solid #F3F4F6",
  backgroundColor: "#F9FAFB",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "12px",
  cursor: "pointer",
  transition: "background-color 0.2s ease",

  "&:hover": {
    backgroundColor: "#F3F4F6",
  },
});

const ReporterInfoWrapper = styled("div", {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
});

const ReporterTitle = styled("div", {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1F2937",
  marginBottom: "12px",
});

const ReporterName = styled("div", {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#1F2937",
  marginBottom: "4px",
  textDecoration: "underline",
});

const ReporterDescription = styled("div", {
  fontSize: "12px",
  color: "#6B7280",
  marginBottom: "4px",
});

const ReporterContact = styled("div", {
  fontSize: "12px",
  color: "#6B7280",
  marginBottom: "2px",
});

const ReporterHashtags = styled("div", {
  fontSize: "12px",
  color: "#6B7280",
  marginTop: "4px",
  textDecoration: "underline",
});

const ReporterThumbnail = styled("img", {
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  objectFit: "cover",
  flexShrink: 0,
  backgroundColor: "#E5E7EB",
});

const ReporterContent = styled("div", {
  flex: 1,
});

interface ReporterInfoProps {
  mediaName?: string;
  reporterName?: string;
  description?: string;
  contact?: string;
  additionalInfo?: string[];
  thumbnailUrl?: string;
  onClick?: () => void;
}

function ReporterInfo({
  mediaName = "FoodNews",
  reporterName = "리포터",
  description = "리포터 간단 소개란 입니다.",
  contact = "글자수 제한은 100자로 제한 합니다.",
  additionalInfo = [],
  thumbnailUrl = "https://picsum.photos/80/80?random=reporter",
  onClick,
}: ReporterInfoProps) {
  return (
    <ReporterInfoContainer onClick={onClick}>
      {mediaName && <ReporterTitle>{mediaName}</ReporterTitle>}
      <ReporterInfoWrapper>
        <ReporterThumbnail src={thumbnailUrl} alt="기자 썸네일" />
        <ReporterContent>
          {reporterName && <ReporterName>{reporterName}</ReporterName>}
          {description && <ReporterDescription>{description}</ReporterDescription>}
          {additionalInfo && additionalInfo.length > 0 && (
            <ReporterHashtags>
              {additionalInfo
                .map((tag) => {
                  const trimmed = tag.trim()
                  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`
                })
                .join(' ')}
            </ReporterHashtags>
          )}
        </ReporterContent>
      </ReporterInfoWrapper>
    </ReporterInfoContainer>
  );
}

export default ReporterInfo;
