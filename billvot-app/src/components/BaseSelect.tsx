import { useState } from "react";

import { styled } from "@app/styles";
import { CSS } from "@stitches/react";

import ArrowDown from "@app/assets/arrow_down.svg";

const SelectContainer = styled("div", {
  width: "100%",
});

const Label = styled("label", {
  fontSize: 14,
  fontWeight: 500,
  color: "$cg300",
});

const SelectButton = styled("button", {
  width: "100%",
  height: 40,
  padding: "8px 12px",
  background: "white",
  border: "1px solid #98A5B3",
  borderRadius: "6px",
  color: "$cg900",
  fontSize: "14px",
  textAlign: "left",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  outline: "none",

  "&:focus": {
    color: "$text",
    border: "1px solid $text",
  },

  variants: {
    disabled: {
      true: {
        color: "#9CA3AF",
        backgroundColor: "#F9FAFB",
        border: "1px solid #E5E7EB",
        cursor: "not-allowed",
      },
    },
  },
});

const OptionsContainer = styled("div", {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  backgroundColor: "white",
  border: "1px solid #E5E7EB",
  borderRadius: "6px",
  marginTop: "4px",
  maxHeight: "200px",
  overflowY: "auto",
  zIndex: 1000,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
});

const Option = styled("button", {
  width: "100%",
  padding: "12px 16px",
  background: "none",
  border: "none",
  borderBottom: "1px solid #F3F4F6",
  color: "#374151",
  fontSize: "14px",
  textAlign: "left",
  cursor: "pointer",

  "&:last-child": {
    borderBottom: "none",
    paddingBottom: "20px",
  },

  "&:hover": {
    backgroundColor: "#F9FAFB",
  },
});

const SelectWrapper = styled("div", {
  position: "relative",
});

interface BaseSelectProps {
  label?: string;
  placeholder?: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  containerCss?: CSS;
  css?: CSS;
}

function BaseSelect({
  label,
  placeholder = "선택해주세요",
  options,
  value,
  onChange,
  disabled,
  containerCss,
  css,
}: BaseSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange?.(option);
    setIsOpen(false);
  };

  return (
    <SelectContainer css={containerCss}>
      {label && <Label>{label}</Label>}
      <SelectWrapper>
        <SelectButton
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          css={css}
        >
          {value || placeholder}
          <img src={ArrowDown} alt="열기" width={20} height={20} />
        </SelectButton>
        {isOpen && (
          <OptionsContainer>
            {options.map((option) => (
              <Option
                key={option}
                onClick={() => handleSelect(option)}
                type="button"
              >
                {option}
              </Option>
            ))}
          </OptionsContainer>
        )}
      </SelectWrapper>
    </SelectContainer>
  );
}

export default BaseSelect;
