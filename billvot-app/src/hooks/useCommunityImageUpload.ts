import { useState } from "react";

import { s3Service, PresignedUrlRequest } from "@app/api/rest/services";

interface UseCommunityImageUploadReturn {
  uploadImages: (files: File[]) => Promise<string[]>;
  isUploading: boolean;
  error: string | null;
  progress: number;
}

export function useCommunityImageUpload(): UseCommunityImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadImages = async (files: File[]): Promise<string[]> => {
    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const uploadedUrls: string[] = [];
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 파일 크기 제한 (10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(
            `파일 크기가 너무 큽니다. 최대 10MB까지 업로드 가능합니다. (${file.name})`,
          );
        }

        // 파일 타입 검증
        if (!file.type.startsWith("image/")) {
          throw new Error(`이미지 파일만 업로드 가능합니다. (${file.name})`);
        }

        // 고유한 파일명 생성
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = file.name.split(".").pop();
        const fileName = `community/${timestamp}_${randomString}.${fileExtension}`;

        // Presigned URL 요청
        const presignedRequest: PresignedUrlRequest = {
          fileName,
          contentType: file.type,
        };

        const presignedResponse = await s3Service.getPresignedUrl(
          presignedRequest,
        );

        console.log("Presigned URL Response:", presignedResponse);

        // S3에 파일 업로드
        await s3Service.uploadToS3(presignedResponse.presignedUrl, file);

        // 업로드된 파일의 공개 URL 생성
        const publicUrl = s3Service.getPublicUrl(presignedResponse.key);
        console.log("Public URL for display:", publicUrl);
        uploadedUrls.push(publicUrl);

        // 진행률 업데이트
        setProgress(((i + 1) / totalFiles) * 100);
      }

      return uploadedUrls;
    } catch (err: unknown) {
      console.error("이미지 업로드 중 오류 발생:", err);
      const errorMessage =
        err instanceof Error ? err.message : "이미지 업로드에 실패했습니다.";
      setError(errorMessage);
      return [];
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return {
    uploadImages,
    isUploading,
    error,
    progress,
  };
}
