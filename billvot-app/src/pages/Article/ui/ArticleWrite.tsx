import { useLocation } from "react-router-dom";

import BaseInput from "@app/components/BaseInput";
import BaseTextArea from "@app/components/BaseTextArea";
import Edit from "@app/assets/post_edit_black.svg";
import ImagePreviewList from "@app/components/ImagePreviewList";
import DefaultButton from "@app/components/DefaultButton";

import { useArticleWrite } from "../hook/useArticleWrite";

import ArticleWriteHeader from "./ArticleWriteHeader";
import ArticleTopicSelectionModal from "./ArticleTopicSelectionModal";
import {
  Container,
  Content,
  ImageUploadSection,
  ByteCount,
} from "./Write/container";

function ArticleWrite() {
  const { search } = useLocation();
  const articleId = new URLSearchParams(search).get("articleId");
  const topicType = new URLSearchParams(search).get("topicType") as
    | "CHAT"
    | "BUSINESS";
  const {
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
  } = useArticleWrite({ articleId: articleId ?? undefined });

  return (
    <Container>
      <ArticleTopicSelectionModal
        topicType={topicType}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleComplete}
      />
      <ArticleWriteHeader
        onBack={handleBack}
        onUpload={handleUpload}
        isUploadDisabled={isUploadDisabled}
      />
      <Content>
        <BaseInput
          label="주제"
          placeholder="주제를 선택해주세요."
          value={topic.name}
          onClick={handleTopicClick}
          icon={Edit}
          readOnly
        />

        <BaseInput
          label="제목"
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div>
          <BaseTextArea
            label="내용"
            placeholder="내용을 입력해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            css={{ minHeight: "200px" }}
          />
          <ByteCount>
            {content.length}/{maxBytes} Bytes
          </ByteCount>
        </div>

        <ImageUploadSection>
          {uploadedImages.length > 0 && (
            <ImagePreviewList
              images={uploadedImages}
              onRemove={handleRemoveImage}
            />
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <DefaultButton onClick={handleImageClick} disabled={isUploading}>
            {isUploading ? "업로드 중..." : "사진 업로드"}
          </DefaultButton>
        </ImageUploadSection>
      </Content>
    </Container>
  );
}

export default ArticleWrite;
