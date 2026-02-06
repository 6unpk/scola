import { ReactNode } from "react";

import { styled } from "@app/styles";

const Overlay = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
});

const ModalContainer = styled("div", {
  position: "relative",
  width: "100%",
  maxWidth: "480px",
  maxHeight: "90vh",
  backgroundColor: "white",
  borderRadius: "8px",
  overflow: "auto",
  margin: "0 16px",
});

const CloseButton = styled("button", {
  position: "absolute",
  top: "16px",
  right: "16px",
  width: "24px",
  height: "24px",
  padding: 0,
  border: "none",
  background: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "&::before, &::after": {
    content: '""',
    position: "absolute",
    width: "16px",
    height: "2px",
    backgroundColor: "$cg500",
    transform: "rotate(45deg)",
  },

  "&::after": {
    transform: "rotate(-45deg)",
  },

  "&:hover": {
    "&::before, &::after": {
      backgroundColor: "$cg700",
    },
  },
});

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function BaseModal({ isOpen, onClose, children }: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} />
        {children}
      </ModalContainer>
    </Overlay>
  );
}

export { BaseModal };
