import { ButtonHTMLAttributes } from "react";

import { CSS, VariantProps } from "@stitches/react";

import { styled } from "../styles";

export const BaseBaseButton = styled("button", {
  "&:focus": {
    outline: 0,
  },
  "&:active": {
    backgroundSize: "100%",
    transition: "background 0s",
  },
  backgroundColor: "$background",
  color: "#ffffff",
  cursor: "pointer",
  border: "none",
  borderRadius: "4px",
  padding: "0.6em 1.2em",
  fontFamily: "inherit",
  display: "flex",
  transition: "background 0.8s",
  variants: {
    size: {
      small: {
        padding: "3px 10px",
        fontSize: 12,
        lineHeight: "20px",
      },
      default: {
        padding: "6px 18px",
        fontSize: 14,
        lineHeight: "24px",
      },
      large: {
        padding: "8px 18px",
        fontSize: 16,
        lineHeight: "24px",
      },
    },
    disabled: {
      true: {
        background: "#D2D2D2!important",
      },
    },
  },
});

type BaseButtonProps = {
  width?: number | "100%";
  height?: number | "100%";
  css?: CSS;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof BaseButton>;

function BaseButton({
  width,
  height,
  children,
  css,
  ...props
}: BaseButtonProps) {
  return (
    <BaseBaseButton
      css={{
        width,
        height,
        ...css,
      }}
      {...props}
    >
      {children}
    </BaseBaseButton>
  );
}

export default BaseButton;
