import { styled } from "@app/styles";

export const LoginContainer = styled("div", {
  height: "100dvh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
  columnGap: 5,
});

export const LogoWrap = styled("div", {
  flex: 1,
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

export const ButtonsWrap = styled("div", {
  flex: 1,
  width: "100%",
  margin: "0 16px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "env(safe-area-inset-bottom)",
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
  fontSize: "14px",
  fontWeight: 500,
  color: "$text",
  marginTop: "16px",
});
