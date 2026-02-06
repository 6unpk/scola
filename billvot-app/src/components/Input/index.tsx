import { forwardRef, InputHTMLAttributes } from "react";

import { styled } from "@app/styles";

const StyledInput = styled("input", {
  width: "100%",
  height: "48px",
  padding: "0 16px",
  border: "1px solid $cg200",
  borderRadius: "4px",
  fontSize: "14px",
  color: "$cg900",
  backgroundColor: "white",

  "&:focus": {
    outline: "none",
    borderColor: "$primary",
  },

  "&:disabled": {
    backgroundColor: "$cg100",
    cursor: "not-allowed",
  },

  "&::placeholder": {
    color: "$cg500",
  },

  variants: {
    error: {
      true: {
        borderColor: "$error",
        "&:focus": {
          borderColor: "$error",
        },
      },
    },
  },
});

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ error, ...props }, ref) => {
    return <StyledInput ref={ref} error={error} {...props} />;
  },
);

BaseInput.displayName = "BaseInput";

export { BaseInput };
