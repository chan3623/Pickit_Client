import axios from "axios";
import { ENV } from "../config/env";

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

/*
  =========================
  토큰 헬퍼
  =========================
*/

function getRole() {
  return localStorage.getItem("LOGIN_ROLE");
}

function getAccessToken() {
  const role = getRole();

  if (role === "USER") {
    return localStorage.getItem("USER_ACCESS_TOKEN");
  }

  if (role === "MANAGER") {
    return localStorage.getItem("MANAGER_ACCESS_TOKEN");
  }

  return null;
}

function getRefreshToken() {
  const role = getRole();

  if (role === "USER") {
    return localStorage.getItem("USER_REFRESH_TOKEN");
  }

  if (role === "MANAGER") {
    return localStorage.getItem("MANAGER_REFRESH_TOKEN");
  }

  return null;
}

function setAccessToken(token) {
  const role = getRole();

  if (role === "USER") {
    localStorage.setItem("USER_ACCESS_TOKEN", token);
  }

  if (role === "MANAGER") {
    localStorage.setItem("MANAGER_ACCESS_TOKEN", token);
  }
}

function setRefreshToken(token) {
  const role = getRole();

  if (role === "USER") {
    localStorage.setItem("USER_REFRESH_TOKEN", token);
  }

  if (role === "MANAGER") {
    localStorage.setItem("MANAGER_REFRESH_TOKEN", token);
  }
}

function clearRoleTokens() {
  const role = getRole();

  if (role === "USER") {
    localStorage.removeItem("USER_ACCESS_TOKEN");
    localStorage.removeItem("USER_REFRESH_TOKEN");
  }

  if (role === "MANAGER") {
    localStorage.removeItem("MANAGER_ACCESS_TOKEN");
    localStorage.removeItem("MANAGER_REFRESH_TOKEN");
  }

  localStorage.removeItem("LOGIN_ROLE");
}

/*
  =========================
  Refresh 동시 요청 제어
  =========================
*/

function onRefreshed(token) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

/*
  =========================
  요청 인터셉터
  =========================
*/

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (config.url !== "/auth/login" && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

/*
  =========================
  응답 인터셉터
  =========================
*/

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await axios.post(
          `${ENV.API_BASE_URL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
            withCredentials: true,
          },
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        if (newRefreshToken) {
          setRefreshToken(newRefreshToken);
        }

        setAccessToken(accessToken);

        onRefreshed(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        clearRoleTokens();
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

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
