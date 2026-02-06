import { useEffect, useState } from "react";

import { styled } from "@app/styles";
import { keyframes } from "@stitches/react";

const fadeIn = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

const slideUp = keyframes({
  from: {
    transform: "translateY(100%)",
  },
  to: {
    transform: "translateY(0)",
  },
});

const fadeOut = keyframes({
  from: {
    opacity: 1,
  },
  to: {
    opacity: 0,
  },
});

const slideDown = keyframes({
  from: {
    transform: "translateY(0)",
  },
  to: {
    transform: "translateY(100%)",
  },
});

const Overlay = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  zIndex: 100,

  variants: {
    isClosing: {
      true: {
        animation: `${fadeOut} 0.2s ease-out forwards`,
      },
      false: {
        animation: `${fadeIn} 0.2s ease-out forwards`,
      },
    },
  },
});

const SelectContainer = styled("div", {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  margin: "0 16px 33px",
  overflow: "hidden",
  zIndex: 101,

  variants: {
    isClosing: {
      true: {
        animation: `${slideDown} 0.2s ease-out forwards`,
      },
      false: {
        animation: `${slideUp} 0.2s ease-out forwards`,
      },
    },
  },
});

const Option = styled("button", {
  width: "100%",
  padding: "16px",
  fontSize: "16px",
  backgroundColor: "white",
  border: "none",
  borderBottom: "1px solid $cg100",
  color: "$cg900",
  textAlign: "center",
  cursor: "pointer",

  "&:first-child": {
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
  },

  "&:nth-last-child(2)": {
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
  },

  "&:last-child": {
    marginTop: "16px",
    borderBottom: "none",
    borderRadius: "4px",
  },

  "&:active": {
    backgroundColor: "$cg50",
  },

  "&:disabled": {
    color: "$cg300",
    cursor: "not-allowed",
  },
});

interface OverlaySelectProps {
  isOpen: boolean;
  onClose: () => void;
  options: Array<{
    label: string;
    onClick: () => void;
    disabled?: boolean;
  }>;
}

function OverlaySelect({ isOpen, onClose, options }: OverlaySelectProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 200); // 애니메이션 지속 시간과 동일하게 설정
  };

  if (!isVisible) return null;

  return (
    <>
      <Overlay onClick={handleClose} isClosing={isClosing} />
      <SelectContainer isClosing={isClosing}>
        {options.map((option, index) => (
          <Option
            key={index}
            onClick={() => {
              if (!option.disabled) {
                option.onClick();
                handleClose();
              }
            }}
            disabled={option.disabled}
          >
            {option.label}
          </Option>
        ))}
        <Option onClick={handleClose}>취소</Option>
      </SelectContainer>
    </>
  );
}

export default OverlaySelect;
