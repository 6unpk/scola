import { Outlet } from "react-router-dom";

import { styled } from "@app/styles";

export const PageLayoutContainer = styled("div", {
  height: "inherit",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

function PageLayout() {
  return (
    <PageLayoutContainer>
      <Outlet />
    </PageLayoutContainer>
  );
}

export default PageLayout;
