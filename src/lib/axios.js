import axios from "axios";
import { ENV } from "../config/env";

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  const role = localStorage.getItem("LOGIN_ROLE");

  let token = null;

  if (role === "USER") {
    token = localStorage.getItem("USER_ACCESS_TOKEN");
  }

  if (role === "MANAGER") {
    token = localStorage.getItem("MANAGER_ACCESS_TOKEN");
  }

  // Authorization 헤더
  if (config.url !== "/auth/login" && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ⭐ 핵심: FormData 감지
  if (config.data instanceof FormData) {
    // multipart 요청 → Content-Type 제거
    delete config.headers["Content-Type"];
  } else {
    // 일반 JSON 요청
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
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
