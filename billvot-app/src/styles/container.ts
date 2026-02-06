import { styled } from ".";

export const Container = styled("div", {
  display: "flex",
  height: "100%",
  flexWrap: "nowrap",
  backgroundColor: "$background",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  columnGap: 5,
});

export const Header = styled("div", {
  position: "absolute",
  background: "#fff",
  fontSize: "20px",
  fontWeight: "600",
  color: "#000",
  height: "66px",
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
  width: "90%",
  margin: "0 16px 0 16px",
  borderBottom: "1px solid #E5E5E5",
});

export const Content = styled("div", {
  marginTop: "66px",
  display: "flex",
  flexDirection: "column",
  width: "90%",
});

export const BottomSheet = styled("div", {
  position: "absolute",
  background: "#fff",
  bottom: 0,
  width: "90%",
  height: "88px",
  display: "flex",
  alignItems: "center",
  borderTop: "1px solid #E5E5E5",
});
