import { InputHTMLAttributes } from "react";

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

const BaseInputWrap = styled("div", {
  position: "relative",
});

const BaseSimpleInput = styled("input", {
  background: "white",
  width: "100%",
  height: 40,
  padding: "8px 12px",
  boxSizing: "border-box",
  color: "$cg900",
  border: "1px solid #98A5B3",
  borderRadius: "6px",
  outline: "none",
  "&:focus": {
    color: "$text",
    border: "1px solid $text",
  },
  "&:disabled": {
    color: "#000",
    backgroundColor: "#F9FAFB",
    border: "1px solid #E5E7EB",
  },
});

const IconWrap = styled("img", {
  position: "absolute",
  width: "18px",
  top: "50%",
  right: "8px",
  transform: "translateY(-50%)",
});

export type InputProps = {
  label?: string;
  containerCss?: CSS;
  css?: CSS;
  width?: string;
  height?: string;
  icon?: string;
} & VariantProps<typeof BaseInput> &
  InputHTMLAttributes<HTMLInputElement>;

function BaseInput({
  label,
  containerCss,
  css,
  width,
  height,
  icon,
  ...props
}: InputProps) {
  return (
    <BaseWrap css={containerCss}>
      <Label>{label}</Label>
      <BaseInputWrap>
        <BaseSimpleInput
          css={{
            width,
            height,
            ...css,
          }}
          {...props}
        />
        <IconWrap src={icon} />
      </BaseInputWrap>
    </BaseWrap>
  );
}
export default BaseInput;
