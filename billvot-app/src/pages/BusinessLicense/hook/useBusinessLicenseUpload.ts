import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { route } from "@app/pages/route";
import { useImageUpload } from "@app/hooks/useImageUpload";
import { useUpdateUser } from "@app/hooks/useUpdateUser";

interface UseBusinessLicenseUploadReturn {
  identificationImageUrl: string | null;
  businessLicenseImageUrl: string | null;
  businessLicenseNumber: string;
  isUploading: boolean;
  error: string | null;
  handleIdentificationUpload: (file: File) => Promise<void>;
  handleBusinessLicenseUpload: (file: File) => Promise<void>;
  handleRemoveIdentification: () => void;
  handleRemoveBusinessLicense: () => void;
  handleUpload: () => Promise<void>;
  setBusinessLicenseNumber: (value: string) => void;
}

export function useBusinessLicenseUpload(): UseBusinessLicenseUploadReturn {
  const navigate = useNavigate();
  const { uploadImages, isUploading } = useImageUpload();
  const { updateUser, error } = useUpdateUser();
  const [identificationImageUrl, setIdentificationImageUrl] = useState<
    string | null
  >(null);
  const [businessLicenseImageUrl, setBusinessLicenseImageUrl] = useState<
    string | null
  >(null);
  const [businessLicenseNumber, setBusinessLicenseNumber] = useState("");

  const handleIdentificationUpload = async (file: File) => {
    try {
      const [url] = await uploadImages([file]);
      if (url) {
        setIdentificationImageUrl(url);
      }
    } catch (err) {
      console.error("신분증 업로드 실패:", err);
    }
  };

  const handleBusinessLicenseUpload = async (file: File) => {
    try {
      const [url] = await uploadImages([file]);
      if (url) {
        setBusinessLicenseImageUrl(url);
      }
    } catch (err) {
      console.error("사업자등록증 업로드 실패:", err);
    }
  };

  const handleRemoveIdentification = () => {
    setIdentificationImageUrl(null);
  };

  const handleRemoveBusinessLicense = () => {
    setBusinessLicenseImageUrl(null);
  };

  const handleUpload = async () => {
    if (
      !identificationImageUrl ||
      !businessLicenseImageUrl ||
      !businessLicenseNumber
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    try {
      const success = await updateUser({
        identificationImageUrl,
        businessLicenseImageUrl,
        businessLicenseNumber,
      });

      if (success) {
        alert("사업자 등록증이 성공적으로 업로드되었습니다.");
        navigate(route.MYINFO);
      }
    } catch (err) {
      console.error("사업자 등록증 업로드 중 오류 발생:", err);
    }
  };

  return {
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
  };
}
