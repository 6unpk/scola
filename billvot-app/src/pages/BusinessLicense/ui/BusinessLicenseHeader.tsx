import { useNavigate } from "react-router-dom";

import { styled } from "@app/styles";

const HeaderContainer = styled("div", {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "54px",
  flexShrink: 0,
  flexGrow: 0,
  backgroundColor: "white",
  borderBottom: "1px solid $cg100",
});

const Button = styled("button", {
  background: "none",
  border: "none",
  padding: "8px",
  cursor: "pointer",
  color: "$cg500",
  fontSize: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "46px",

  variants: {
    disabled: {
      true: {
        color: "$cg300",
        cursor: "not-allowed",
      },
    },
  },
});

const Title = styled("h1", {
  fontSize: "18px",
  fontWeight: "bold",
  color: "$text",
  margin: 0,
  flex: 1,
  textAlign: "center",
});

interface BusinessLicenseHeaderProps {
  onUpload: () => void;
  isUploadable: boolean;
}

function BusinessLicenseHeader({
  onUpload,
  isUploadable,
}: BusinessLicenseHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <HeaderContainer>
      <Button onClick={handleBack}>이전</Button>
      <Title>사업자 등록증 인증</Title>
      <Button
        css={{ color: isUploadable ? "$primary" : undefined }}
        onClick={isUploadable ? onUpload : undefined}
        disabled={!isUploadable}
      >
        업로드
      </Button>
    </HeaderContainer>
  );
}

export default BusinessLicenseHeader;
