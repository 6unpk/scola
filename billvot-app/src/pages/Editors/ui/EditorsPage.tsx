import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DefaultHeader from "@app/components/DefaultHeader";
import { styled } from "@app/styles";
import { fooditService } from "@app/api/rest/services";
import { Editor } from "@app/api/rest/types";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "#F7F9FA",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const Content = styled("div", {
  flex: 1,
  overflowY: "auto",
  paddingBottom: "calc(80px + env(safe-area-inset-bottom))",
});

const TitleSection = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "24px 20px 32px",
  gap: "8px",
});

const Subtitle = styled("h2", {
  fontFamily: "Pretendard",
  fontSize: "18px",
  fontWeight: 600,
  lineHeight: 1.193,
  color: "#095933",
  margin: 0,
});

const Title = styled("h1", {
  fontFamily: "Pretendard",
  fontSize: "24px",
  fontWeight: 700,
  lineHeight: 1.193,
  color: "#12161A",
  margin: 0,
});

const EditorList = styled("div", {
  padding: "20px 16px",
});

const EditorItem = styled("div", {
  display: "flex",
  gap: "12px",
  marginBottom: "20px",
  cursor: "pointer",
  height: "107px",
  alignItems: "center",
});

const EditorImage = styled("div", {
  width: "80px",
  height: "107px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  flexShrink: 0,
  backgroundColor: "#D9D9D9",
});

const EditorContent = styled("div", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  height: "100%",
  gap: "6px",
});

const EditorName = styled("h3", {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1F2937",
  margin: 0,
  lineHeight: 1.3,
});

const EditorHashtags = styled("div", {
  fontSize: "12px",
  color: "#9CA3AF",
  lineHeight: 1.2,
});

const EditorDescription = styled("p", {
  fontSize: "14px",
  color: "#6B7280",
  margin: 0,
  lineHeight: 1.4,
  whiteSpace: "pre-line",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const LoadingContainer = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "400px",
  fontSize: "16px",
  color: "#6B7280",
});

const ErrorContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "400px",
  fontSize: "16px",
  color: "#EF4444",
  gap: "12px",
  padding: "20px",
  textAlign: "center",
});

const RetryButton = styled("button", {
  padding: "10px 20px",
  backgroundColor: "#30532D",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#1e3a1c",
  },
});

const EmptyContainer = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "400px",
  fontSize: "16px",
  color: "#6B7280",
});

function EditorsPage() {
  const navigate = useNavigate();
  const [editors, setEditors] = useState<Editor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const loadEditors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fooditService.getEditors(0, 50);
      setEditors(response.result);
    } catch (err) {
      console.error("에디터 리스트 로드 중 오류:", err);
      setError("에디터 리스트를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEditors();
  }, []);

  const handleEditorClick = (editorId: string) => {
    navigate(`/editors/${editorId}`);
  };

  return (
    <Container>
      <DefaultHeader
        title="OURs"
        leftButton={{ icon: "back", onClick: handleBack }}
      />

      <Content>
        <TitleSection>
          <Subtitle>Introduce</Subtitle>
          <Title>푸드스캐너를 만드는 사람들</Title>
        </TitleSection>

        {isLoading && (
          <LoadingContainer>
            <div>에디터 목록을 불러오는 중...</div>
          </LoadingContainer>
        )}

        {error && (
          <ErrorContainer>
            <div>{error}</div>
            <RetryButton onClick={loadEditors}>다시 시도</RetryButton>
          </ErrorContainer>
        )}

        {!isLoading && !error && editors.length === 0 && (
          <EmptyContainer>에디터가 없습니다.</EmptyContainer>
        )}

        {!isLoading && !error && editors.length > 0 && (
          <EditorList>
            {editors.map((editor) => (
              <EditorItem
                key={editor.id}
                onClick={() => handleEditorClick(editor.id)}
              >
                <EditorImage
                  style={{
                    backgroundImage: editor.profileImageUrl
                      ? `url(${editor.profileImageUrl})`
                      : undefined,
                  }}
                />
                <EditorContent>
                  <EditorName>{editor.name}</EditorName>
                  {editor.hashtags && editor.hashtags.length > 0 && (
                    <EditorHashtags>
                      {editor.hashtags.join(" ")}
                    </EditorHashtags>
                  )}
                  {editor.description && (
                    <EditorDescription>{editor.description}</EditorDescription>
                  )}
                </EditorContent>
              </EditorItem>
            ))}
          </EditorList>
        )}
      </Content>
    </Container>
  );
}

export default EditorsPage;

