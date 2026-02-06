import { useState } from "react";

import Edit from "@app/assets/post_edit.svg?react";
import Store from "@app/assets/add_location.svg?react";
import Close from "@app/assets/close.svg?react";
import { styled } from "@app/styles";

import { CSS } from "@stitches/react";

const Overlay = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 99,
  opacity: 0,
  visibility: "hidden",
  transition: "opacity 0.2s ease, visibility 0.2s ease",

  variants: {
    isOpen: {
      true: {
        opacity: 1,
        visibility: "visible",
      },
    },
  },
});

const FloatingButtonContainer = styled("div", {
  position: "fixed",
  bottom: "calc(80px + env(safe-area-inset-bottom))",
  right: "16px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "12px",
  zIndex: 100,
});

const ActionButton = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 20px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "$background",
  color: "white",
  fontSize: "14px",
  fontWeight: "500",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.12)",
  transform: "translateX(100px)",
  opacity: 0,
  transition: "transform 0.3s ease, opacity 0.3s ease",

  path: {
    fill: "white",
  },
  "&:hover": {
    filter: "brightness(1.1)",
  },

  variants: {
    isOpen: {
      true: {
        transform: "translateX(0)",
        opacity: 1,
      },
    },
    delay: {
      first: {
        transitionDelay: "0s",
      },
      second: {
        transitionDelay: "0.1s",
      },
    },
  },
});

const FloatingButton = styled("button", {
  width: "82px",
  height: "41px",
  borderRadius: "28px",
  fontSize: "14px",
  color: "white",
  backgroundColor: "$background",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  cursor: "pointer",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.12)",
  transition: "transform 0.2s ease, background-color 0.2s ease",

  "&:hover": {
    transform: "scale(1.05)",
  },

  "&:active": {
    transform: "scale(0.95)",
  },

  variants: {
    isOpen: {
      true: {
        color: "white",
        width: "41px",
        height: "41px",
        backgroundColor: "transparent",
        border: "1px solid white",

        path: {
          fill: "white",
        },
      },
    },
  },
});

interface WriteButtonProps {
  onStoreClick?: () => void;
  onPostClick?: () => void;
  css?: CSS;
}

function WriteButton({ onStoreClick, onPostClick, css }: WriteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleStoreClick = () => {
    onStoreClick?.();
    setIsOpen(false);
  };

  const handlePostClick = () => {
    onPostClick?.();
    setIsOpen(false);
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClick={() => setIsOpen(false)} />
      <FloatingButtonContainer css={css}>
        <ActionButton isOpen={isOpen} delay="first" onClick={handleStoreClick}>
          <Store width={20} height={20} />
          매장 직거래
        </ActionButton>
        <ActionButton isOpen={isOpen} delay="second" onClick={handlePostClick}>
          <Edit width={20} height={20} />
          게시글 작성
        </ActionButton>
        <FloatingButton isOpen={isOpen} onClick={toggleMenu}>
          {isOpen ? (
            <Close width={17} height={17} />
          ) : (
            <Edit width={17} height={17} />
          )}
          {!isOpen && "글작성"}
        </FloatingButton>
      </FloatingButtonContainer>
    </>
  );
}

export default WriteButton;
