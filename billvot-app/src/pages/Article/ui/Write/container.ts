import { styled } from "@app/styles";

export const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "$cg20",
  display: "flex",
  flexDirection: "column",
});

export const Content = styled("div", {
  flex: 1,
  margin: "16px 16px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

export const ImageUploadSection = styled("div", {
  paddingBottom: "24px",
});

export const ByteCount = styled("div", {
  textAlign: "right",
  color: "$cg400",
  fontSize: "12px",
  marginTop: "4px",
});
