import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@app/store/useAuthStore";
import LoginRequiredModal from "./LoginRequiredModal";

function GlobalLoginModal() {
  const navigate = useNavigate();
  const { isLoginModalOpen, closeLoginModal } = useAuthStore();

  const handleSignUp = () => {
    closeLoginModal();
    navigate("/signup");
  };

  const handleLogin = () => {
    closeLoginModal();
    navigate("/login");
  };

  return (
    <LoginRequiredModal
      isOpen={isLoginModalOpen}
      onClose={closeLoginModal}
      onSignUp={handleSignUp}
      onLogin={handleLogin}
    />
  );
}

export default GlobalLoginModal;
