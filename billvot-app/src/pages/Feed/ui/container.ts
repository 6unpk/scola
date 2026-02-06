import { styled } from "@app/styles";

export const FeedContainer = styled("div", {
  height: "100dvh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#fff",
  overflow: "hidden",
});

export const ArticleList = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

export const LogoWrap = styled("div", {
  flex: 2,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

export const LogoTitle = styled("div", {
  marginTop: "16px",
});

export const LogoTitleText = styled("span", {
  fontSize: "16px",
  fontWeight: 500,
  color: "$cg500",
});

export const SignUpForm = styled("div", {
  flex: 1,
  width: "100%",
  margin: "0 16px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
  alignItems: "center",
});

export const SocialLoginButtonContainer = styled("span", {
  display: "inline-block",
  margin: "0px 12px 0 12px",
  fontWeight: 500,
});

export const SocialLoginIcon = styled("img", {
  height: "16px",
});

export const SignUpText = styled("span", {
  fontSize: "20px",
  width: "calc(100% - 32px)",
  fontWeight: 700,
  color: "$text",
  margin: "16px 0 0 0",
  padding: "0 16px",
});

export const SignUpWelcomeText = styled("span", {
  width: "calc(100% - 32px)",
  fontSize: "16px",
  fontWeight: 500,
  color: "$cg500",
});
