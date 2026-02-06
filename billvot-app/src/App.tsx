import { useEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

import { globalStyles } from "./styles/font";
import { animationStyles } from "./styles/animations";
import MainPage from "./pages/Main/ui/MainPage";
import BillVotingListPage from "./pages/BillVoting/ui/BillVotingListPage";
import BillVotingDetailPage from "./pages/BillVoting/ui/BillVotingDetailPage";
import { NewsListPage } from "./pages/News";
import LoginPage from "./pages/Login/ui/LoginPage";
import SignUpPage from "./pages/SignUp/ui/SignUpPage";
import NotificationsPage from "./pages/Notifications/ui/NotificationsPage";
import MyInfoPage from "./pages/MyInfo/ui/MyInfoPage";
import { modalManager } from "./components/BaseModal";
import GlobalLoginModal from "./components/GlobalLoginModal";

function App() {
  globalStyles();
  animationStyles();

  useEffect(() => {
    const initializeApp = async () => {
      console.log("Billvot 앱 초기화 시작");

      // 모바일 웹에서 safe area insets 설정
      const isCapacitor = Capacitor.getPlatform() === "ios" || Capacitor.getPlatform() === "android";
      if (!isCapacitor) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          document.documentElement.style.setProperty('--safe-area-inset-top', '0px');
          document.documentElement.style.setProperty('--safe-area-inset-bottom', '20px');
          document.documentElement.style.setProperty('--safe-area-inset-left', '0px');
          document.documentElement.style.setProperty('--safe-area-inset-right', '0px');
          console.log("모바일 웹: safe area insets 설정됨");
        }
      }
    };

    initializeApp();
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.backgroundColor = "#F7F9FA";

    return () => {
      document.documentElement.style.backgroundColor = "white";
    };
  }, [location]);

  useEffect(() => {
    const backButtonListener = CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      if (modalManager.hasOpenModals()) {
        modalManager.closeLatestModal();
        return;
      }

      if (canGoBack) {
        navigate(-1);
      }
    });

    return () => {
      backButtonListener.remove();
    };
  }, [location.pathname, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/bill-voting" element={<BillVotingListPage />} />
        <Route path="/bill-voting/:id" element={<BillVotingDetailPage />} />
        <Route path="/news" element={<NewsListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/myinfo" element={<MyInfoPage />} />
        <Route path="*" element={<MainPage />} />
      </Routes>
      <GlobalLoginModal />
    </>
  );
}

export default App;
