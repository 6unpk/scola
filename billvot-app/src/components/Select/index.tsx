import { styled } from "@app/styles";
import { forwardRef, SelectHTMLAttributes } from "react";

const BaseWrap = styled("div", {
  width: "100%",
});

const Label = styled("label", {
  fontSize: 14,
  fontWeight: 500,
  color: "$cg300",
});

const SelectWrap = styled("div", {
  position: "relative",
});

const StyledSelect = styled("select", {
  width: "100%",
  height: "40px",
  padding: "8px 10px",
  boxSizing: "border-box",
  color: "$cg300",
  border: "none",
  borderBottom: "1px solid $cg300",
  outline: "none",
  backgroundColor: "white",
  appearance: "none",
  backgroundImage:
    'url(\'data:image/svg+xml;charset=UTF-8,%3csvg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"%3e%3cpath d="M6 9L12 15L18 9" stroke="%23999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/%3e%3c/svg%3e\')',
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 8px center",
  cursor: "pointer",

  "&:focus": {
    color: "$text",
    borderBottom: "1px solid $text",
  },

  "&:disabled": {
    backgroundColor: "$cg50",
    cursor: "not-allowed",
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

interface BaseSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: boolean;
  containerCss?: any;
  css?: any;
}

const BaseSelect = forwardRef<HTMLSelectElement, BaseSelectProps>(
  ({ label, error, containerCss, css, children, ...props }, ref) => {
    return (
      <BaseWrap css={containerCss}>
        {label && <Label>{label}</Label>}
        <SelectWrap>
          <StyledSelect ref={ref} error={error} css={css} {...props}>
            {children}
          </StyledSelect>
        </SelectWrap>
      </BaseWrap>
    );
  },
);

BaseSelect.displayName = "BaseSelect";

export { BaseSelect };
