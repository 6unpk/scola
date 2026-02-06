import { useState, useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import BaseInput from "@app/components/BaseInput";
import BaseTextArea from "@app/components/BaseTextArea";
import BaseSelect from "@app/components/BaseSelect";
import { styled } from "@app/styles";
import { useCommunityCategories, useCommunityPost } from "@app/hooks/useCommunity";
import { communityService } from "@app/api/rest/services";
import { useCommunityImageUpload } from "@app/hooks/useCommunityImageUpload";
import { useAuthStore } from "@app/store/useAuthStore";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const Header = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 20px",
  borderBottom: "1px solid #E5E7EB",
});

const HeaderButton = styled("button", {
  background: "none",
  border: "none",
  fontSize: "16px",
  fontWeight: "500",
  cursor: "pointer",
  padding: "4px 0",

  variants: {
    type: {
      cancel: {
        color: "#6B7280",
      },
      submit: {
        color: "#2563EB",
      },
    },
  },

  "&:disabled": {
    color: "#9CA3AF",
    cursor: "not-allowed",
  },
});

const ScrollContainer = styled("div", {
  flex: 1,
  overflowY: "auto",
  padding: "20px",
});

const FormGroup = styled("div", {
  marginBottom: "24px",
});

const PhotoUploadButton = styled("button", {
  width: "100%",
  padding: "16px",
  border: "1px solid #E5E7EB",
  borderRadius: "8px",
  backgroundColor: "white",
  fontSize: "14px",
  color: "#6B7280",
  cursor: "pointer",
  transition: "all 0.2s ease",

  "&:hover": {
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
  },

  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.6,
    "&:hover": {
      borderColor: "#E5E7EB",
      backgroundColor: "white",
    },
  },
});

const PhotoListContainer = styled("div", {
  display: "flex",
  gap: "12px",
  marginTop: "16px",
  overflowX: "auto",
  paddingBottom: "8px",
});

const PhotoItem = styled("div", {
  position: "relative",
  flexShrink: 0,
  width: "100px",
  height: "100px",
  borderRadius: "8px",
  overflow: "hidden",
  backgroundColor: "#F3F4F6",
});

const PhotoImage = styled("img", {
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const RemoveButton = styled("button", {
  position: "absolute",
  top: "4px",
  right: "4px",
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  color: "white",
  border: "none",
  fontSize: "12px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
});

const UploadProgressContainer = styled("div", {
  padding: "12px 20px",
  backgroundColor: "#F3F4F6",
  borderBottom: "1px solid #E5E7EB",
});

const UploadProgressText = styled("div", {
  fontSize: "14px",
  color: "#374151",
  marginBottom: "8px",
  textAlign: "center",
});

const UploadProgressBar = styled("div", {
  width: "100%",
  height: "4px",
  backgroundColor: "#E5E7EB",
  borderRadius: "2px",
  overflow: "hidden",
});

const UploadProgressFill = styled("div", {
  height: "100%",
  backgroundColor: "#2563EB",
  transition: "width 0.3s ease",
});

const UploadError = styled("div", {
  padding: "12px 20px",
  backgroundColor: "#FEF2F2",
  borderBottom: "1px solid #FECACA",
  color: "#DC2626",
  fontSize: "14px",
  textAlign: "center",
});

function CommunityWritePage() {
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal } = useAuthStore();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("postId");
  const isEditMode = !!postId;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 로그인 체크
  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal();
      navigate("/main/community");
    }
  }, [isAuthenticated, openLoginModal, navigate]);

  // API에서 카테고리 목록 가져오기
  const { categories, loading: categoriesLoading } = useCommunityCategories();
  
  // 수정 모드일 때 기존 게시글 데이터 가져오기
  const { post, loading: postLoading } = useCommunityPost(postId || "");

  // S3 이미지 업로드 훅
  const { uploadImages, isUploading, error: uploadError, progress } = useCommunityImageUpload();

  // 수정 모드일 때 기존 데이터로 폼 초기화
  useEffect(() => {
    if (isEditMode && post) {
      setTitle(post.title);
      setContent(post.content);
      setSelectedCategory(post.categoryId || "");
      setUploadedPhotos(post.imageUrls || []);
    }
  }, [isEditMode, post]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !title.trim() || !content.trim()) {
      alert("카테고리, 제목, 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && postId) {
        // 수정 모드
        await communityService.updatePost(postId, {
          title: title.trim(),
          content: content.trim(),
          imageUrls: uploadedPhotos,
          categoryId: selectedCategory,
        });
        navigate(`/community/${postId}`);
      } else {
        // 작성 모드
        await communityService.createPost({
          title: title.trim(),
          content: content.trim(),
          imageUrls: uploadedPhotos,
          categoryId: selectedCategory,
        });
        navigate("/main/community");
      }
    } catch (error) {
      console.error("게시글 처리 실패:", error);
      alert(`게시글 ${isEditMode ? "수정" : "작성"}에 실패했습니다. 다시 시도해주세요.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        try {
          const fileArray = Array.from(files);
          const uploadedUrls = await uploadImages(fileArray);
          
          console.log("Uploaded URLs:", uploadedUrls);
          
          if (uploadedUrls.length > 0) {
            setUploadedPhotos((prev) => {
              const newPhotos = [...prev, ...uploadedUrls];
              console.log("Updated photos list:", newPhotos);
              return newPhotos;
            });
          }
        } catch (error) {
          console.error("이미지 업로드 실패:", error);
        }
      }
    };

    input.click();
  };

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (categoryName: string) => {
    // 카테고리 이름으로 ID 찾기
    const category = categories.find(cat => cat.name === categoryName);
    if (category) {
      setSelectedCategory(category.id);
    }
  };

  // 카테고리 옵션 생성 (이름만 표시)
  const categoryOptions = categories.map(cat => cat.name);

  // 수정 모드에서 게시글 데이터 로딩 중
  if (isEditMode && postLoading) {
    return (
      <Container>
        <Header>
          <HeaderButton type="cancel" onClick={handleCancel}>
            취소
          </HeaderButton>
          <HeaderButton type="submit" disabled>
            로딩 중...
          </HeaderButton>
        </Header>
        <div style={{ textAlign: "center", padding: "40px" }}>
          게시글을 불러오는 중...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderButton type="cancel" onClick={handleCancel}>
          취소
        </HeaderButton>
        <HeaderButton
          type="submit" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (isEditMode ? "수정 중..." : "등록 중...") : (isEditMode ? "수정 완료" : "등록")}
        </HeaderButton>
      </Header>

      <ScrollContainer>
        <FormGroup>
          <BaseSelect
            label="카테고리를 선택해주세요"
            placeholder={categoriesLoading ? "카테고리 로딩 중..." : "카테고리를 선택해주세요"}
            options={categoryOptions}
            value={categories.find(cat => cat.id === selectedCategory)?.name || ""}
            onChange={handleCategoryChange}
            disabled={categoriesLoading}
          />
        </FormGroup>

        <FormGroup>
          <BaseInput
            label="제목을 입력해 주세요"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <BaseTextArea
            label="내용을 입력해 주세요"
            placeholder="작성할 내용을 입력해주세요

*욕설, 혐오 발언, 스팸 등 불법적인 콘텐츠를 금지합니다.
*위 사항 위반 시 게시글 또는 계정이 삭제될 수 있습니다."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            height="200px"
          />
        </FormGroup>

        <FormGroup>
          <PhotoUploadButton onClick={handlePhotoUpload} disabled={isUploading}>
            {isUploading ? "업로드 중..." : "사진 업로드 하기"}
          </PhotoUploadButton>

          {isUploading && (
            <UploadProgressContainer>
              <UploadProgressText>
                이미지 업로드 중... {Math.round(progress)}%
              </UploadProgressText>
              <UploadProgressBar>
                <UploadProgressFill style={{ width: `${progress}%` }} />
              </UploadProgressBar>
            </UploadProgressContainer>
          )}

          {uploadError && (
            <UploadError>
              {uploadError}
            </UploadError>
          )}

          {uploadedPhotos.length > 0 && (
            <PhotoListContainer>
              {uploadedPhotos.map((photo, index) => {
                console.log(`Rendering photo ${index}:`, photo);
                return (
                  <PhotoItem key={index}>
                    <PhotoImage 
                      src={photo} 
                      alt={`업로드된 사진 ${index + 1}`}
                      onError={(e) => {
                        console.error(`Image load error for ${photo}:`, e);
                      }}
                      onLoad={() => {
                        console.log(`Image loaded successfully: ${photo}`);
                      }}
                    />
                    <RemoveButton onClick={() => handleRemovePhoto(index)}>
                      ×
                    </RemoveButton>
                  </PhotoItem>
                );
              })}
            </PhotoListContainer>
          )}
        </FormGroup>
      </ScrollContainer>
    </Container>
  );
}

export default CommunityWritePage;
