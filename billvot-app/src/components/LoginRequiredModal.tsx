import { styled } from "@app/styles";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@app/assets/close.svg?react";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
  onLogin: () => void;
}

const Overlay = styled(motion.div, {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
});

const ModalContainer = styled(motion.div, {
  backgroundColor: "$white",
  borderRadius: "16px",
  padding: "16px",
  width: "calc(100% - 32px)",
  maxWidth: "320px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

const CloseButton = styled(motion.button, {
  alignSelf: "flex-end",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const CloseIconStyled = styled(CloseIcon, {
  width: "24px",
  height: "24px",
  fill: "$cg900",
});

const Message = styled("p", {
  fontSize: "16px",
  fontWeight: 500,
  color: "$cg900",
  textAlign: "center",
  margin: 0,
  lineHeight: 1.5,
});

const ButtonContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const PrimaryButton = styled(motion.button, {
  width: "100%",
  padding: "12px",
  backgroundColor: "$primary",
  border: "none",
  borderRadius: "8px",
  color: "$white",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
});

const SecondaryButton = styled(motion.button, {
  width: "100%",
  padding: "12px",
  backgroundColor: "$white",
  border: "1px solid $primary",
  borderRadius: "8px",
  color: "$primary",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
});

function LoginRequiredModal({ isOpen, onClose, onSignUp, onLogin }: LoginRequiredModalProps) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ModalContainer
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <CloseButton
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <CloseIconStyled />
            </CloseButton>
            <Message>
              해당 서비스는 로그인 이후
              <br />
              이용 가능합니다.
            </Message>
            <ButtonContainer>
              <PrimaryButton
                onClick={onSignUp}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                회원가입
              </PrimaryButton>
              <SecondaryButton
                onClick={onLogin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                로그인
              </SecondaryButton>
            </ButtonContainer>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

export default LoginRequiredModal;
