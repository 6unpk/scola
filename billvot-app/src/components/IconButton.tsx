import { ButtonHTMLAttributes } from "react";

import { CSS, VariantProps } from "@stitches/react";

import { styled } from "../styles";

const BaseButton = styled("button", {
  width: "59px",
  height: "55px",
  borderRadius: "16px",
  border: "none",
  padding: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#F0F0F0",
  "&:disabled": {
    backgroundColor: "$CG20",
  },
  "&:hover": {
    backgroundColor: "none",
  },
});

type IconButton = {
  disabled?: boolean;
  icon: string | undefined;
  iconWidth?: string | undefined;
  iconHeight?: string | undefined;
  css?: CSS;
} & VariantProps<typeof IconButton> &
  ButtonHTMLAttributes<HTMLButtonElement>;

function IconButton({
  disabled,
  icon,
  iconWidth,
  iconHeight,
  ...props
}: IconButton) {
  return (
    <BaseButton disabled={disabled} {...props}>
      <img
        src={icon}
        style={{ width: iconWidth ?? "100%", height: iconHeight ?? "100%" }}
      />
    </BaseButton>
  );
}

export default IconButton;
