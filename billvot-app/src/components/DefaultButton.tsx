import { ButtonHTMLAttributes } from "react";

import { CSS } from "@stitches/react";

import BaseButton from "./BaseButton";

type DefaultButtonProps = {
  css?: CSS;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function DefaultButton({ css, children, ...props }: DefaultButtonProps) {
  return (
    <BaseButton
      width="100%"
      height={41}
      css={{
        backgroundColor: "transparent",
        color: "$cg500",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid $cg500",
        path: {
          fill: "$cg500",
        },
        ...css,
      }}
      {...props}
    >
      {children}
    </BaseButton>
  );
}

export default DefaultButton;
