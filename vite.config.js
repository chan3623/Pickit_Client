// vite.config.js
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url"; // 추가
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url); // 현재 파일 경로
const __dirname = path.dirname(__filename); // 현재 디렉토리 경로

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // @를 src 폴더로 매핑
    },
  },
});
