import { styled } from "@app/styles";

export const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "$cg20",
  display: "flex",
  flexDirection: "column",
  paddingBottom: "54px",
});

export const Content = styled("div", {
  overflowY: "auto",
});

export const ScrollableContent = styled("div", {
  flex: 1,
  overflowY: "auto",
  paddingBottom: "54px",
  marginBottom: "calc(env(safe-area-inset-bottom) + 54px)",
});

export const CommentSection = styled("div", {
  backgroundColor: "$cg50",
});

export const CommentInputContainer = styled("div", {
  position: "fixed",
  bottom: 0,
  height: "calc(54px + env(safe-area-inset-bottom))",
  borderRadius: "0px",
  boxSizing: "border-box",
  width: "100%",
  padding: "8px 16px",
  backgroundColor: "white",
  border: "none",
});

export const CommentList = styled("div", {
  borderTop: "1px solid $cg100",
});

export const ImageGrid = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginTop: "16px",
});

export const ArticleImage = styled("img", {
  width: "100%",
  borderRadius: "8px",
  objectFit: "cover",
});
