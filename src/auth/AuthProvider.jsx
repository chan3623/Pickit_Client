// AuthProvider.jsx
import { getUser } from "@/services/user.api";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { showInfo } from "@/utils/swal";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutTimer, setLogoutTimer] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    showInfo("세션이 만료되어 로그아웃 되었습니다.").then(() => {
      window.location.href = "/home";
    });
  }, []);

  const scheduleLogout = useCallback(
    (token) => {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      const timeout = (decoded.exp - now) * 1000;

      if (timeout <= 0) {
        logout();
        return;
      }

      const timer = setTimeout(() => {
        console.log("토큰 만료: 자동 로그아웃 실행");
        logout();
      }, timeout);

      setLogoutTimer(timer);
    },
    [logout],
  );

  // 새로고침 시 기존 토큰 체크
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp <= now) {
          logout();
          setLoading(false);
          return;
        }

        scheduleLogout(token);
        const res = await getUser();
        setUser(res.data);
      } catch (err) {
        console.log(err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, []); // 로그인 후 바로 실행되도록 user 의존성 제거

  return (
    <AuthContext.Provider value={{ user, setUser, logout, scheduleLogout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
