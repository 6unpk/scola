import { useState, useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useImageUpload } from "@app/hooks/useImageUpload";
import { articleService } from "@app/api/rest/services";
import { route } from "@app/pages/route";

import { Topic } from "../type/topic";

export const useArticleWrite = ({ articleId }: { articleId?: string }) => {
  const navigate = useNavigate();
  const isEditMode = !!articleId;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState<Topic>({
    topicId: 0,
    name: "",
    description: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const { uploadImages, isUploading } = useImageUpload();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxBytes = 6000;

  // 수정 모드인 경우 기존 게시글 데이터 불러오기
  useEffect(() => {
    if (isEditMode) {
      const fetchArticle = async () => {
        try {
          const article = await articleService.getArticle(articleId);

          if (article) {
            setTitle(article.title);
            setContent(article.content);
            if (article.topic) {
              setTopic({
                topicId: article.topic.topicId,
                name: article.topic.name,
                description: article.topic.description || "",
              });
            }
            if (article.images && article.images.length > 0) {
              setUploadedImages(article.images.map((img) => img.imageUrl));
            }
          }
        } catch (error) {
          console.error(
            "게시글 정보를 불러오는 중 오류가 발생했습니다:",
            error,
          );
          alert("게시글 정보를 불러오는데 실패했습니다.");
          navigate(-1);
        } finally {
          setIsLoading(false);
        }
      };

      fetchArticle();
    }
  }, [articleId, isEditMode, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const urls = await uploadImages(Array.from(files));
      setUploadedImages((prev) => [...prev, ...urls]);
    } catch (error) {
      console.error("이미지 업로드 중 오류가 발생했습니다:", error);
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!title || !content || !topic.topicId) {
      alert("제목, 내용, 주제를 모두 입력해주세요.");
      return;
    }

    if (title.length < 3) {
      alert("제목은 3글자 이상이어야 합니다.");
      return;
    }

    if (content.length < 10) {
      alert("내용은 10글자 이상이어야 합니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        // 수정 모드인 경우
        const updatedArticle = await articleService.updateArticle(
          articleId,
          {
            title,
            content,
            topicId: topic?.topicId,
            images: uploadedImages,
          },
        );

        if (updatedArticle) {
          navigate(route.ARTICLE_DETAIL(updatedArticle.articleId), {
            replace: true,
          });
        }
      } else {
        // 생성 모드인 경우
        const newArticle = await articleService.createArticle({
          title,
          content,
          topicId: topic?.topicId,
          images: uploadedImages,
        });

        if (newArticle) {
          navigate(route.ARTICLE_DETAIL(newArticle.articleId), {
            replace: true,
          });
        } else {
          alert("게시글 작성에 실패했습니다. 다시 시도해주세요.");
        }
      }
    } catch (error) {
      console.error(
        isEditMode
          ? "게시글 수정 중 오류가 발생했습니다:"
          : "게시글 작성 중 오류가 발생했습니다:",
        error,
      );
      alert(
        isEditMode
          ? "게시글 수정에 실패했습니다. 다시 시도해주세요."
          : "게시글 작성에 실패했습니다. 다시 시도해주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTopicClick = () => {
    // 수정 모드에서는 주제 변경 불가능
    if (!isEditMode) {
      setIsModalOpen(true);
    } else {
      alert("게시글 수정 시에는 주제를 변경할 수 없습니다.");
    }
  };

  const handleComplete = (selectedTopics: Topic[]) => {
    setTopic(selectedTopics[0]);
    setIsModalOpen(false);
  };

  const isUploadDisabled =
    !title || !content || !topic.topicId || isSubmitting || isLoading;

  return {
    isEditMode,
    isLoading,
    title,
    setTitle,
    content,
    setContent,
    topic,
    isModalOpen,
    setIsModalOpen,
    isUploading,
    uploadedImages,
    fileInputRef,
    maxBytes,
    handleBack,
    handleImageUpload,
    handleImageClick,
    handleRemoveImage,
    handleUpload,
    handleTopicClick,
    handleComplete,
    isUploadDisabled,
  };
};
