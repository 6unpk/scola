import { styled } from "@app/styles";

const HeaderContainer = styled("div", {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "54px",
  flexShrink: 0, // 추가
  flexGrow: 0, // 추가
  backgroundColor: "white",
  borderBottom: "1px solid $cg100",
});

const Button = styled("button", {
  background: "none",
  border: "none",
  padding: "8px",
  cursor: "pointer",
  color: "$cg500",
  fontSize: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "46px",

  variants: {
    disabled: {
      true: {
        color: "$cg300",
        cursor: "not-allowed",
      },
    },
  },
});

const Title = styled("h1", {
  fontSize: "18px",
  fontWeight: "bold",
  color: "$text",
  margin: 0,
  flex: 1,
  textAlign: "center",
});

interface ArticleWriteHeaderProps {
  onBack: () => void;
  onUpload: () => void;
  isUploadDisabled?: boolean;
}

function ArticleWriteHeader({
  onBack,
  onUpload,
  isUploadDisabled = false,
}: ArticleWriteHeaderProps) {
  return (
    <HeaderContainer>
      <Button onClick={onBack}>이전</Button>
      <Title>게시글 작성</Title>
      <Button
        css={{ color: "$background" }}
        onClick={onUpload}
        disabled={isUploadDisabled}
      >
        업로드
      </Button>
    </HeaderContainer>
  );
}

export default ArticleWriteHeader;
