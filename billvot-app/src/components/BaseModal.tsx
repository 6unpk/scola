import { HTMLAttributes, ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

import { styled } from "@app/styles";
import Close from "@app/assets/close.svg";

import { CSS, VariantProps } from "@stitches/react";

// 모달 관리를 위한 싱글톤 객체
class ModalManager {
  private static instance: ModalManager;
  private openModals: Set<() => void> = new Set();

  private constructor() {}

  static getInstance(): ModalManager {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager();
    }
    return ModalManager.instance;
  }

  registerModal(closeHandler: () => void): () => void {
    this.openModals.add(closeHandler);
    return () => this.unregisterModal(closeHandler);
  }

  unregisterModal(closeHandler: () => void): void {
    this.openModals.delete(closeHandler);
  }

  hasOpenModals(): boolean {
    return this.openModals.size > 0;
  }

  closeLatestModal(): boolean {
    if (this.openModals.size === 0) return false;

    // 가장 최근에 등록된 모달을 닫음 (Set에서는 마지막으로 추가된 항목이 마지막으로 순회됨)
    const lastModal = Array.from(this.openModals).pop();
    if (lastModal) {
      lastModal();
      return true;
    }
    return false;
  }
}

// 전역에서 접근 가능하도록 export
export const modalManager = ModalManager.getInstance();

const ModalOverlay = styled("div", {
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
  backgroundColor: "white",
  borderRadius: "12px",
  width: "80%",
  maxWidth: "400px",
  maxHeight: "80vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const ModalContent = styled("div", {
  overflow: "auto",
  padding: "0 12px 12px 12px",
  flex: 1,
});

const ModalHeader = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 12px 0px 12px",
});

const ModalFooter = styled("div", {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: "8px",
  borderTop: "1px solid $cg100",
  backgroundColor: "white",
});

const Dummy = styled("div", {
  color: "white",
  width: "40px",
  height: "40px",
});

const ModalTitle = styled("h2", {
  margin: 0,
  color: "$cg900",
  fontSize: "18px",
  fontWeight: "bold",
});

const CloseButton = styled("button", {
  background: "none",
  border: "none",
  padding: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  css?: CSS;
}

interface ModalFooterProps {
  children: ReactNode;
}

const ModalFooterComponent = ({ children }: ModalFooterProps) => {
  return <ModalFooter>{children}</ModalFooter>;
};

interface BaseModalComponent extends React.FC<BaseModalProps> {
  Footer: React.FC<ModalFooterProps>;
}

const BaseModal: BaseModalComponent = Object.assign(
  ({ isOpen, onClose, title, children, css }: BaseModalProps) => {
    // 모달이 열릴 때 ModalManager에 등록
    useEffect(() => {
      if (isOpen) {
        const unregister = modalManager.registerModal(onClose);
        return unregister;
      }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const modalContent = (
      <ModalOverlay onClick={onClose}>
        <ModalContainer onClick={(e) => e.stopPropagation()} css={css}>
          <ModalHeader>
            <Dummy>1</Dummy>
            <ModalTitle>{title}</ModalTitle>
            <CloseButton onClick={onClose}>
              <img src={Close} alt="닫기" width={24} height={24} />
            </CloseButton>
          </ModalHeader>
          <ModalContent>{children}</ModalContent>
        </ModalContainer>
      </ModalOverlay>
    );

    return createPortal(modalContent, document.body);
  },
  { Footer: ModalFooterComponent },
);

export default BaseModal;
