import { useState } from "react";

import { useNavigate, useParams, useLocation } from "react-router-dom";

import { styled } from "@app/styles";
import PageHeader from "@app/components/PageHeader";
import BaseTextArea from "@app/components/BaseTextArea";
import BaseSelect from "@app/components/BaseSelect";
import DefaultButton from "@app/components/DefaultButton";
import { useReport } from "@app/hooks/useReport";
import { useAuth } from "@app/hooks/api/useAuth";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const Content = styled("div", {
  flex: 1,
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const SectionContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

const SectionLabel = styled("label", {
  fontSize: "12px",
  fontWeight: 400,
  color: "$cg900",
  lineHeight: "1.19",
});

const TextAreaContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

const ErrorText = styled("div", {
  color: "$red500",
  fontSize: "14px",
  marginTop: "8px",
});

function ReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = useLocation();
  const articleId = new URLSearchParams(search).get("articleId");
  const commentId = new URLSearchParams(search).get("commentId");
  const userId = new URLSearchParams(search).get("userId");

  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const { reportPost, reportComment, categories, isLoadingCategories, isLoading, error } = useReport();

  const postId = articleId || location.state?.postId;
  const commentIdParam = commentId || location.state?.commentId;

  if (!postId && !commentIdParam) {
    navigate(-1);
    return null;
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("신고 내용을 입력해주세요.");
      return;
    }

    if (!categoryId) {
      alert("신고 카테고리를 선택해주세요.");
      return;
    }

    if (content.length > 100) {
      alert("신고 내용은 최대 100자까지 입력 가능합니다.");
      return;
    }

    // 게시글 신고 또는 댓글 신고 처리
    if (postId) {
      const success = await reportPost(postId, categoryId, content);
      if (success) {
        alert("신고가 접수되었습니다.");
        navigate(-1);
      }
    } else if (commentIdParam) {
      const success = await reportComment(commentIdParam, categoryId, content);
      if (success) {
        alert("신고가 접수되었습니다.");
        navigate(-1);
      }
    }
  };

  return (
    <Container>
      <PageHeader
        title="신고"
        leftButton={{ text: "취소", onClick: handleBack }}
        rightButton={{ text: "신고", onClick: handleSubmit, disabled: isLoading }}
      />
      <Content>
        <SectionContainer>
          <SectionLabel>카테고리를 선택해주세요</SectionLabel>
          <BaseSelect
            placeholder={isLoadingCategories ? "카테고리 로딩 중..." : "카테고리를 선택해주세요"}
            options={categories.map(cat => cat.name)}
            value={categories.find(cat => cat.id === categoryId)?.name || ""}
            onChange={(value) => {
              const selectedCategory = categories.find(cat => cat.name === value);
              setCategoryId(selectedCategory?.id || "");
            }}
            disabled={isLoadingCategories}
          />
        </SectionContainer>

        <TextAreaContainer>
          <SectionLabel>내용을 입력해주세요</SectionLabel>
          <BaseTextArea
            placeholder={`신고할 내용을 입력해주세요\n\n*명확한 신고 이유를 상세하게 서술해주세요\n*허위사실 또는 주관적 입장의 경우 신고자에게 불이익이 있습니다.`}
            value={content}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 100) {
                setContent(value);
              }
            }}
            maxLength={100}
            css={{ 
              minHeight: "160px",
              fontSize: "12px",
              lineHeight: "1.19"
            }}
          />
          <div style={{ 
            fontSize: "12px", 
            color: content.length > 100 ? "#d93025" : "#6C7680",
            textAlign: "right",
            marginTop: "4px"
          }}>
            {content.length}/100
          </div>
          {error && <ErrorText>{error}</ErrorText>}
        </TextAreaContainer>
      </Content>
    </Container>
  );
}

export default ReportPage;
