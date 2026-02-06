import { TextareaHTMLAttributes } from "react";

import { CSS, VariantProps } from "@stitches/react";

import { styled } from "../styles";

const BaseWrap = styled("div", {
  width: "100%",
});

const Label = styled("label", {
  fontSize: 14,
  fontWeight: 500,
  color: "$cg300",
});

const BaseSimpleTextArea = styled("textarea", {
  background: "white",
  width: "100%",
  minHeight: 120,
  padding: "12px",
  boxSizing: "border-box",
  color: "$cg900",
  borderRadius: "6px",
  border: "1px solid #98A5B3",
  outline: "none",
  resize: "vertical",
  fontFamily: "inherit",
  fontSize: 14,
  lineHeight: 1.5,

  "&:focus": {
    color: "$text",
    border: "1px solid $text",
  },

  "&::placeholder": {
    color: "#9CA3AF",
  },

  variants: {
    disabled: {
      true: {
        color: "#000",
        backgroundColor: "#F9FAFB",
        border: "1px solid #E5E7EB",
        resize: "none",
        cursor: "not-allowed",
      },
    },
  },
});

export type TextAreaProps = {
  label?: string;
  containerCss?: CSS;
  css?: CSS;
  width?: string;
  height?: string;
} & VariantProps<typeof BaseSimpleTextArea> &
  TextareaHTMLAttributes<HTMLTextAreaElement>;

function BaseTextArea({
  label,
  containerCss,
  css,
  width,
  height,
  ...props
}: TextAreaProps) {
  return (
    <BaseWrap css={containerCss}>
      {label && <Label>{label}</Label>}
      <BaseSimpleTextArea
        css={{
          width,
          height,
          ...css,
        }}
        {...props}
      />
    </BaseWrap>
  );
}

export default BaseTextArea;
