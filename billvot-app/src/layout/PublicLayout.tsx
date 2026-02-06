import { useEffect, useState } from "react";

import { Navigate, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "@app/hooks/api/useAuth";
import { route } from "@app/pages/route";
import { styled } from "@app/styles";

const Loading = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100dvh",
});

function PublicLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   if (user && window.location.pathname === route.LOGIN) {
  //     navigate(route.FEED);
  //   }
  //   setIsLoading(false);
  // }, [user, navigate]);

  // // if (user) {
  // return <Navigate to={route.FEED} />;
  // // }

  return isLoading ? <Loading /> : <Outlet />;
}

export default PublicLayout;
