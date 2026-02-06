import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { route } from "../pages/route";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user, token } = useAuthStore();

  console.log("ProtectedRoute 체크:", { isAuthenticated, user, token });

  // user와 token이 모두 있어야 인증된 것으로 판단
  if (!isAuthenticated || !user || !token) {
    console.log("ProtectedRoute: 인증되지 않음, 시작 페이지로 리다이렉트");
    return <Navigate to={route.START} replace />;
  }

  console.log("ProtectedRoute: 인증 성공, 컨텐츠 렌더링");
  return <>{children}</>;
};

export default ProtectedRoute;
