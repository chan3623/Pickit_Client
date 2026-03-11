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
  const role = localStorage.getItem("LOGIN_ROLE");
  return role;
}

function getAccessToken() {
  const role = getRole();

  let token = null;

  if (role === "USER") {
    token = localStorage.getItem("USER_ACCESS_TOKEN");
  }

  if (role === "MANAGER") {
    token = localStorage.getItem("MANAGER_ACCESS_TOKEN");
  }

  return token;
}

function getRefreshToken() {
  const role = getRole();

  let token = null;

  if (role === "USER") {
    token = localStorage.getItem("USER_REFRESH_TOKEN");
  }

  if (role === "MANAGER") {
    token = localStorage.getItem("MANAGER_REFRESH_TOKEN");
  }

  return token;
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
  console.log("[AUTH] onRefreshed:", token);

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
  const url = config.url || "";

  const isLoginRequest = url.includes("/auth/login");

  if (token && !isLoginRequest) {
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
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const url = originalRequest.url || "";

    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/logout") ||
      url.includes("/auth/refresh");

    /*
    =========================
    401 → refresh 처리
    =========================
    */

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };

            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();

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

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        if (!accessToken) {
          throw new Error("Invalid refresh response");
        }

        if (newRefreshToken) {
          setRefreshToken(newRefreshToken);
        }

        setAccessToken(accessToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        onRefreshed(accessToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };

        return api(originalRequest);
      } catch (refreshError) {
        clearRoleTokens();

        if (!window.__LOGOUT_TRIGGERED__) {
          window.__LOGOUT_TRIGGERED__ = true;
          window.dispatchEvent(new Event("auth:logout"));
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
