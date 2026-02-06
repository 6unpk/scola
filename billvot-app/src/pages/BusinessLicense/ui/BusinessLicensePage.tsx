import { useRef } from "react";

import { styled } from "@app/styles";
import BaseInput from "@app/components/BaseInput";
import Close from "@app/assets/close.svg?react";

import { useBusinessLicenseUpload } from "../hook/useBusinessLicenseUpload";

import BusinessLicenseHeader from "./BusinessLicenseHeader";

const PageContainer = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const ContentContainer = styled("div", {
  padding: "20px 16px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

const InputContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const Label = styled("span", {
  fontSize: "14px",
  color: "$cg500",
});

const UploadButton = styled("button", {
  width: "100%",
  height: "48px",
  backgroundColor: "white",
  border: "1px solid $cg500",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  cursor: "pointer",
  color: "$cg500",
  fontSize: "14px",

  "&:disabled": {
    backgroundColor: "$cg50",
    cursor: "not-allowed",
  },
});

const FilePreview = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "14px",
  padding: "0 16px",
  height: "33px",
  backgroundColor: "white",
  border: "1px solid $cg500",
  borderRadius: "8px",
});

const FileText = styled("span", {
  fontSize: "14px",
  color: "$cg900",
});

const RemoveButton = styled("button", {
  width: "24px",
  height: "24px",
  backgroundColor: "white",
  border: "none",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "$cg500",
  fontSize: "16px",
});

function BusinessLicensePage() {
  const identificationInputRef = useRef<HTMLInputElement>(null);
  const businessLicenseInputRef = useRef<HTMLInputElement>(null);
  const {
    identificationImageUrl,
    businessLicenseImageUrl,
    businessLicenseNumber,
    isUploading,
    error,
    handleIdentificationUpload,
    handleBusinessLicenseUpload,
    handleRemoveIdentification,
    handleRemoveBusinessLicense,
    handleUpload,
    setBusinessLicenseNumber,
  } = useBusinessLicenseUpload();

  const handleIdentificationClick = () => {
    identificationInputRef.current?.click();
  };

  const handleBusinessLicenseClick = () => {
    businessLicenseInputRef.current?.click();
  };

  const handleIdentificationFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleIdentificationUpload(file);
    }
  };

  const handleBusinessLicenseFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleBusinessLicenseUpload(file);
    }
  };

  const isUploadable = !!(
    identificationImageUrl &&
    businessLicenseImageUrl &&
    businessLicenseNumber
  );

  return (
    <PageContainer>
      <BusinessLicenseHeader
        onUpload={handleUpload}
        isUploadable={isUploadable}
      />
      <ContentContainer>
        <InputContainer>
          <input
            type="file"
            ref={identificationInputRef}
            onChange={handleIdentificationFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <UploadButton
            onClick={handleIdentificationClick}
            disabled={isUploading}
          >
            + 대표 신분증 사본 업로드
          </UploadButton>
          {identificationImageUrl && (
            <FilePreview>
              <FileText>신분증.jpg</FileText>
              <RemoveButton onClick={handleRemoveIdentification}>
                <Close />
              </RemoveButton>
            </FilePreview>
          )}
        </InputContainer>

        <InputContainer>
          <Label>사업자등록번호 입력 (숫자만 입력)</Label>
          <BaseInput
            maxLength={11}
            placeholder="사업자등록번호를 입력해주세요"
            type="number"
            value={businessLicenseNumber}
            onChange={(e) => setBusinessLicenseNumber(e.target.value)}
          />
        </InputContainer>

        <InputContainer>
          <input
            type="file"
            ref={businessLicenseInputRef}
            onChange={handleBusinessLicenseFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <UploadButton
            onClick={handleBusinessLicenseClick}
            disabled={isUploading}
          >
            + 사업자등록증 업로드하기
          </UploadButton>
          {businessLicenseImageUrl && (
            <FilePreview>
              <FileText>사업자등록증.jpg</FileText>
              <RemoveButton onClick={handleRemoveBusinessLicense}>
                <Close />
              </RemoveButton>
            </FilePreview>
          )}
        </InputContainer>

        {error && <div style={{ color: "red", fontSize: "14px" }}>{error}</div>}
      </ContentContainer>
    </PageContainer>
  );
}

export default BusinessLicensePage;
