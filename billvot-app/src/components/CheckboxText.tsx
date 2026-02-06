import { InputHTMLAttributes, useState } from "react";

import { CSS, VariantProps } from "@stitches/react";
import { styled } from "../styles";
import CheckboxChecked from "@app/assets/check.svg?react";

const BaseCheckboxContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  color: "$text",
});

const BaseCheckbox = styled("input", {
  display: "none",
});

const StyledCheckboxChecked = styled(CheckboxChecked, {
  width: "16px",
  height: "16px",
  color: "$cg300",
  cursor: "pointer",
  transition: "color 0.2s ease",

  variants: {
    checked: {
      true: {
        path: {
          fill: "$primary",
        },
      },
    },
    size: {
      small: {
        width: "14px",
        height: "14px",
      },
      default: {
        width: "16px",
        height: "16px",
      },
      large: {
        width: "18px",
        height: "18px",
      },
    },
    disabled: {
      true: {
        cursor: "not-allowed",
        opacity: 0.5,
      },
    },
  },
});

const BaseLabel = styled("label", {
  cursor: "pointer",
  userSelect: "none",
  fontWeight: 500,
  fontSize: "14px",
  variants: {
    size: {
      small: {
        fontSize: "12px",
      },
      default: {
        fontSize: "14px",
      },
      large: {
        fontSize: "16px",
      },
    },
    disabled: {
      true: {
        cursor: "not-allowed",
        opacity: 0.5,
      },
    },
  },
});

type CheckboxTextProps = {
  label: string;
  css?: CSS;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof StyledCheckboxChecked>;

function CheckboxText({
  label,
  size = "default",
  disabled,
  checked,
  onChange,
  css,
  ...props
}: CheckboxTextProps) {
  const [isChecked, setIsChecked] = useState(checked ?? false);

  const handleClick = () => {
    if (disabled) return;

    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange?.({ target: { checked: newChecked } } as any);
  };

  return (
    <BaseCheckboxContainer css={css} onClick={handleClick}>
      <StyledCheckboxChecked
        size={size}
        disabled={disabled}
        checked={isChecked}
      />
      <BaseCheckbox
        type="checkbox"
        checked={isChecked}
        disabled={disabled}
        {...props}
      />
      <BaseLabel size={size} disabled={disabled}>
        {label}
      </BaseLabel>
    </BaseCheckboxContainer>
  );
}

export default CheckboxText;
