import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// 요청 인터셉터: 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
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
