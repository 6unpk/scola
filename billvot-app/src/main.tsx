import React from "react";

import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import App from "./App";

import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { setAuthStore } from "@app/api/rest/client";
import { useAuthStore } from "@app/store/useAuthStore";

GoogleAuth.initialize({});

// authStore를 API client에 설정
setAuthStore(useAuthStore);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
