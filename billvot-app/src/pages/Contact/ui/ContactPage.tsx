import { useState, useRef } from "react";

import { useNavigate } from "react-router-dom";

import { styled } from "@app/styles";
import BaseInput from "@app/components/BaseInput";
import BaseTextArea from "@app/components/BaseTextArea";
import BaseButton from "@app/components/BaseButton";
import BaseSelect from "@app/components/BaseSelect";
import PageHeader from "@app/components/PageHeader";
import { useAuthStore } from "@app/store/useAuthStore";
import { useAuth } from "@app/hooks/api/useAuth";
import { inquiryService, InquiryType, s3Service } from "@foodscanner/shared";

const ContactContainer = styled("div", {
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const ContactForm = styled("div", {
  flex: 1,
  padding: "24px 16px",
  paddingBottom: "calc(80px + env(safe-area-inset-bottom))",
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
});

const FormTitle = styled("h1", {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#000",
  margin: "0 0 8px 0",
});

const FormSubtitle = styled("p", {
  fontSize: "16px",
  color: "#000",
  margin: "0 0 32px 0",
});


const InputGroup = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  marginBottom: "32px",
});

const ErrorMessage = styled("p", {
  fontSize: "12px",
  color: "#ff4444",
  margin: "4px 0 0 0",
});

const SubmitButton = styled(BaseButton, {
  backgroundColor: "rgba(21, 210, 120, 0.16)",
  color: "#15D278",
  border: "1px solid #15D278",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "500",
  marginTop: "auto",
  marginBottom: "calc(24px + env(safe-area-inset-bottom))",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,

  "&:hover": {
    backgroundColor: "rgba(21, 210, 120, 0.24)",
  },

  "&:disabled": {
    backgroundColor: "#f0f0f0",
    color: "#999",
    border: "1px solid #f0f0f0",
  },
});

const ImageUploadSection = styled("div", {
  marginTop: "8px",
});

const ImageUploadLabel = styled("label", {
  fontSize: "14px",
  fontWeight: "500",
  color: "#000",
  marginBottom: "8px",
  display: "block",
});

const ImageUploadButton = styled("button", {
  width: "100%",
  padding: "12px",
  border: "1px dashed #98A5B3",
  borderRadius: "6px",
  backgroundColor: "#F7F9FA",
  color: "#666",
  fontSize: "14px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  transition: "all 0.2s",

  "&:hover": {
    borderColor: "#15D278",
    backgroundColor: "rgba(21, 210, 120, 0.05)",
  },

  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.5,
  },
});

const ImagePreviewContainer = styled("div", {
  display: "flex",
  gap: "12px",
  marginTop: "12px",
  flexWrap: "wrap",
});

const ImagePreview = styled("div", {
  position: "relative",
  width: "100px",
  height: "100px",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid #E5E5E5",
});

const PreviewImage = styled("img", {
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const RemoveImageButton = styled("button", {
  position: "absolute",
  top: "4px",
  right: "4px",
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  border: "none",
  color: "white",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "16px",

  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
});

const ImageUploadHint = styled("p", {
  fontSize: "12px",
  color: "#666",
  marginTop: "4px",
});

const CONTACT_CATEGORIES = [
  "제휴 문의",
  "계정 문의",
  "오류 문의",
  "기사 제보",
  "기타 문의",
] as const;

type ContactCategory = typeof CONTACT_CATEGORIES[number];

// 카테고리를 API InquiryType으로 매핑
const mapCategoryToInquiryType = (
  category: ContactCategory,
): InquiryType => {
  switch (category) {
    case "제휴 문의":
      return InquiryType.BUSINESS;
    case "계정 문의":
      return InquiryType.GENERAL;
    case "오류 문의":
      return InquiryType.BUG_REPORT;
    case "기사 제보":
      return InquiryType.FEATURE_REQUEST;
    case "기타 문의":
      return InquiryType.OTHER;
    default:
      return InquiryType.OTHER;
  }
};

function ContactPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAuthenticated } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState<ContactCategory | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const [errors, setErrors] = useState<{
    category?: string;
    name?: string;
    email?: string;
    subject?: string;
    content?: string;
  }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const remainingSlots = 3 - images.length;
    const newFiles = Array.from(files).slice(0, remainingSlots);

    if (newFiles.length + images.length > 3) {
      alert("최대 3개의 이미지만 업로드할 수 있습니다.");
      return;
    }

    // 파일 크기 체크 (5MB)
    const oversizedFiles = newFiles.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert("이미지는 최대 5MB까지 업로드 가능합니다.");
      return;
    }

    // 이미지 파일 타입 체크
    const invalidFiles = newFiles.filter(
      (file) => !file.type.startsWith("image/"),
    );
    if (invalidFiles.length > 0) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    setImages((prev) => [...prev, ...newFiles]);

    // 미리보기 생성
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToS3 = async (): Promise<string[]> => {
    if (images.length === 0) return [];

    const uploadPromises = images.map(async (file) => {
      try {
        // Presigned URL 요청
        const presignedData = await s3Service.getPresignedUrl({
          fileName: file.name,
          contentType: file.type,
        });

        // S3에 파일 업로드
        await s3Service.uploadToS3(presignedData.presignedUrl, file);

        // 공개 URL 반환
        return s3Service.getPublicUrl(presignedData.key);
      } catch (error) {
        console.error("Image upload failed:", error);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!category) {
      newErrors.category = "문의 내역을 선택해주세요.";
    }

    if (!name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    }

    if (!email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!validateEmail(email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    if (!subject.trim()) {
      newErrors.subject = "제목을 입력해주세요.";
    }

    if (!content.trim()) {
      newErrors.content = "문의 내용을 입력해주세요.";
    } else if (content.trim().length < 10) {
      newErrors.content = "문의 내용을 10자 이상 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setIsUploadingImages(true);

    try {
      // 이미지 업로드 (있는 경우)
      let imageUrls: string[] = [];
      if (images.length > 0) {
        try {
          imageUrls = await uploadImagesToS3();
        } catch (uploadError) {
          console.error("이미지 업로드 실패:", uploadError);
          alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
          setIsLoading(false);
          setIsUploadingImages(false);
          return;
        }
      }

      setIsUploadingImages(false);

      const inquiryType = mapCategoryToInquiryType(category as ContactCategory);

      await inquiryService.createInquiry({
        name: name.trim(),
        email: email.trim(),
        title: subject.trim(),
        content: content.trim(),
        inquiryType,
        image1Url: imageUrls[0],
        image2Url: imageUrls[1],
        image3Url: imageUrls[2],
      });

      alert("문의가 접수되었습니다. 감사합니다.");
      navigate(-1);
    } catch (err) {
      console.error("문의 접수 중 오류:", err);
      alert("문의 접수에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
      setIsUploadingImages(false);
    }
  };

  const isFormValid =
    category &&
    name.trim() &&
    email.trim() &&
    subject.trim() &&
    content.trim().length >= 10 &&
    validateEmail(email);

  return (
    <ContactContainer>
      <PageHeader
        title="문의하기"
        leftButton={{ icon: "back", onClick: () => navigate(-1) }}
      />
      <ContactForm>
        <FormTitle>문의하기</FormTitle>
        <FormSubtitle>문의사항을 남겨주시면 빠르게 답변드리겠습니다.</FormSubtitle>

        <InputGroup>
          <div>
            <BaseSelect
              label="문의 내역*"
              placeholder="문의 내역을 선택해주세요"
              options={CONTACT_CATEGORIES}
              value={category}
              onChange={(selected) => {
                setCategory(selected as ContactCategory);
                if (errors.category) {
                  setErrors((prev) => ({ ...prev, category: undefined }));
                }
              }}
              css={{
                height: "48px",
              }}
            />
            {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
          </div>
          <div>
            <BaseInput
              label="이름*"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
              height="48px"
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </div>

          <div>
            <BaseInput
              label="이메일*"
              placeholder="이메일을 입력해주세요"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              height="48px"
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </div>

          <div>
            <BaseInput
              label="제목*"
              placeholder="문의 제목을 입력해주세요"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errors.subject) {
                  setErrors((prev) => ({ ...prev, subject: undefined }));
                }
              }}
              height="48px"
            />
            {errors.subject && <ErrorMessage>{errors.subject}</ErrorMessage>}
          </div>

          <div>
            <BaseTextArea
              label="문의 내용*"
              placeholder="문의 내용을 상세히 입력해주세요 (10자 이상)"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) {
                  setErrors((prev) => ({ ...prev, content: undefined }));
                }
              }}
              rows={8}
              css={{
                width: "100%",
                padding: "12px",
                border: "1px solid #98A5B3",
                borderRadius: "6px",
                fontFamily: "Pretendard",
                fontSize: "16px",
                resize: "vertical",
                "&:focus": {
                  border: "1px solid $text",
                  outline: "none",
                },
              }}
            />
            {errors.content && <ErrorMessage>{errors.content}</ErrorMessage>}
          </div>

          <ImageUploadSection>
            <ImageUploadLabel>첨부 이미지 (선택, 최대 3개)</ImageUploadLabel>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              style={{ display: "none" }}
            />
            <ImageUploadButton
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= 3}
            >
              <span>
                {images.length >= 3
                  ? "최대 3개까지 업로드 가능"
                  : `이미지 추가 (${images.length}/3)`}
              </span>
            </ImageUploadButton>
            <ImageUploadHint>
              JPG, PNG, GIF 형식 지원 / 최대 5MB
            </ImageUploadHint>

            {imagePreviews.length > 0 && (
              <ImagePreviewContainer>
                {imagePreviews.map((preview, index) => (
                  <ImagePreview key={index}>
                    <PreviewImage src={preview} alt={`미리보기 ${index + 1}`} />
                    <RemoveImageButton
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                    >
                      ✕
                    </RemoveImageButton>
                  </ImagePreview>
                ))}
              </ImagePreviewContainer>
            )}
          </ImageUploadSection>
        </InputGroup>

        <SubmitButton
          width="100%"
          height={48}
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading || isUploadingImages}
        >
          {isUploadingImages
            ? "이미지 업로드 중..."
            : isLoading
              ? "접수 중..."
              : "문의 접수"}
        </SubmitButton>
      </ContactForm>
    </ContactContainer>
  );
}

export default ContactPage;

