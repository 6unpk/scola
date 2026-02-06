import { HTMLAttributes } from "react";

import { styled } from "@app/styles";
import { CSS, VariantProps } from "@stitches/react";

import arrowBack from "@app/assets/arrow_back.svg";

const HeaderContainer = styled("div", {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "54px",
  backgroundColor: "white",

  variants: {
    bottomBorder: {
      true: { borderBottom: "1px solid $cg100" },
    },
    overlay: {
      true: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        backgroundColor: "transparent",
        borderBottom: "none",
      },
    },
  },
});

const HeaderTitle = styled("h1", {
  fontSize: "18px",
  color: "$cg900",
  margin: 0,
  flex: 1,
  textAlign: "center",
});

const Button = styled("button", {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "$cg900",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "46px",

  "&:disabled": {
    color: "$cg300",
    cursor: "not-allowed",
  },

  variants: {
    iconColor: {
      white: {
        color: "white",
        "& img": {
          filter: "brightness(0) invert(1)", // SVG를 흰색으로 변경
        },
      },
      black: {
        color: "$cg900",
        "& img": {
          filter: "none", // 기본 색상 유지
        },
      },
    },
  },
});

interface ButtonConfig {
  icon?: string;
  text?: string;
  element?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  iconColor?: "white" | "black";
}

interface PageHeaderProps {
  title: string;
  bottomBorder?: boolean;
  overlay?: boolean;
  leftButton?: ButtonConfig;
  rightButton?: ButtonConfig;
  css?: CSS;
}

function PageHeader({
  title,
  leftButton,
  rightButton,
  bottomBorder,
  overlay,
  css,
}: PageHeaderProps) {
  return (
    <HeaderContainer css={css} bottomBorder={bottomBorder} overlay={overlay}>
      <Button
        onClick={leftButton?.onClick}
        disabled={leftButton?.disabled}
        iconColor={leftButton?.iconColor}
      >
        {leftButton?.icon === "back" && (
          <img src={arrowBack} alt="뒤로가기" width={24} height={24} />
        )}
        {leftButton?.text}
      </Button>
      <HeaderTitle>{title}</HeaderTitle>
      <Button
        onClick={rightButton?.onClick}
        disabled={rightButton?.disabled}
        iconColor={rightButton?.iconColor}
      >
        {rightButton?.element || rightButton?.text}
      </Button>
    </HeaderContainer>
  );
}

export default PageHeader;
