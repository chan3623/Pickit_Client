import axios from "axios";
import { ENV } from "../config/env";

const api = axios.create({
  baseURL: `${ENV.API_BASE_URL}`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// 요청 인터셉터: 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const role = localStorage.getItem("LOGIN_ROLE");

  let token = null;

  if (role === "USER") {
    token = localStorage.getItem("USER_ACCESS_TOKEN");
  }

  if (role === "MANAGER") {
    token = localStorage.getItem("MANAGER_ACCESS_TOKEN");
  }

  if (config.url !== "/auth/login" && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 응답 인터셉터: 서버 메시지 항상 customMessage로 전달
api.interceptors.response.use(
  (response) => response, // 정상 응답
  (error) => {
    if (error.response && error.response.data) {
      const message = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(", ")
        : error.response.data.message ||
          error.response.data.error ||
          "Unknown Error";
      error.customMessage = message;
    } else {
      error.customMessage = error.message;
    }
    return Promise.reject(error);
  },
);

export default api;
