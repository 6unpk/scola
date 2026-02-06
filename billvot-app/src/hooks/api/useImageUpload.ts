import { useState } from "react";

interface UseImageUploadReturn {
  uploadImages: (files: File[]) => Promise<string[]>;
  isUploading: boolean;
  error: string | null;
}

export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImages = async (files: File[]): Promise<string[]> => {
    setIsUploading(true);
    setError(null);

    try {
      // REST API 문서에 이미지 업로드 API가 없어서 임시 구현
      // 실제로는 presigned URL 또는 직접 업로드 API를 사용해야 함

      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          // 임시로 로컬 URL 생성 (실제로는 서버 업로드 필요)
          const reader = new FileReader();
          return new Promise<string>((resolve, reject) => {
            reader.onload = () => {
              // 실제 구현에서는 서버에 업로드하고 URL을 받아야 함
              const url = `https://example.com/uploads/${Date.now()}_${
                file.name
              }`;
              resolve(url);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }),
      );

      return uploadedUrls;
    } catch (err: any) {
      console.error("이미지 업로드 중 오류가 발생했습니다:", err);
      setError(err.response?.data?.message || "이미지 업로드에 실패했습니다.");
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImages,
    isUploading,
    error,
  };
}
