import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vitejs.dev/config/
export default defineConfig((mode) => {
  return {
    resolve: {
      alias: {
        "@app": resolve(__dirname, "src"),
      },
    },
    plugins: [react(), svgr()],
    server: {
      allowedHosts: ["afb6fa4e2b21.ngrok-free.app"],
      proxy: {
        "/api": {
          target: "http://localhost:8080",
          rewrite: (path) => path.replace(/^\/api/, ""),
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
