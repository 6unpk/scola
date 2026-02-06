import { ButtonHTMLAttributes } from "react";

import { CSS, VariantProps } from "@stitches/react";

import { styled } from "../styles";

import BaseButton from "./BaseButton";

export const BaseChipButton = styled("button", {
  "&:focus": {
    outline: 0,
  },
  cursor: "pointer",
  border: "none",
  borderRadius: "16px",
  padding: "0.2em 0.6em",
  fontFamily: "inherit",
  display: "inline-block",
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

type BaseChipProps = {
  height: number;
  css?: CSS;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof BaseButton>;

function BaseChip({ height, css, children, ...props }: BaseChipProps) {
  return (
    <BaseChipButton css={{ height, ...css }} {...props}>
      {children}
    </BaseChipButton>
  );
}

export default BaseChip;
