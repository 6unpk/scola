import { styled } from "@app/styles";

const PageWrapper = styled("div", {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "white",
});

interface PageTransitionProps {
  children: React.ReactNode;
}

function PageTransition({ children }: PageTransitionProps) {
  return <PageWrapper>{children}</PageWrapper>;
}

export default PageTransition;
