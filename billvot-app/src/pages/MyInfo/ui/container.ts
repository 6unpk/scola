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
  overflowY: "auto",
});

export const ActivitySection = styled("div", {
  padding: "24px 16px",
  backgroundColor: "white",
  marginBottom: "8px",
});

export const ActivityTitle = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "16px",
  fontWeight: 500,
  color: "$cg900",
  margin: "0 0 16px 0",
});

export const ActivityCount = styled("span", {
  fontSize: "12px",
  color: "$cg500",
  marginLeft: "8px",
});

export const MenuList = styled("div", {
  display: "flex",
  flexDirection: "column",
});

export const MenuItem = styled("button", {
  width: "100%",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "none",
  border: "none",
  borderBottom: "1px solid $cg100",
  cursor: "pointer",
  color: "$cg700",
  textAlign: "left",

  path: {
    fill: "$cg700",
  },

  "&:last-child": {
    borderBottom: "none",
  },
});

export const MenuText = styled("span", {
  flex: 1,
  paddingLeft: "4px",
  fontSize: "14px",
  color: "$cg900",
});

export const ProfileSection = styled("div", {
  backgroundColor: "white",
  padding: "24px 16px",
});

export const ProfileTitle = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "12px",
  fontWeight: "bold",
  color: "$cg500",
  margin: "0 0 24px 0",
});

export const ProfileNickname = styled("span", {
  fontSize: "16px",
  fontWeight: "bold",
  color: "$cg900",
});

export const BusinessLicenseSection = styled("div", {
  backgroundColor: "white",
  color: "$primary",
  fontSize: "12px",
  fontWeight: "bold",
  textDecoration: "underline",
});

export const NicknameChangeSection = styled("div", {
  backgroundColor: "white",
  color: "$cg500",
  fontSize: "12px",
  fontWeight: "bold",
  textDecoration: "underline",
});

export const ProfileField = styled("div", {
  marginBottom: "24px",

  "&:last-child": {
    marginBottom: 0,
  },
});

export const ButtonContainer = styled("div", {
  display: "flex",
  height: "48px",
  fontSize: "12px",
  color: "$cg900",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
});
