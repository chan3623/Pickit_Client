// AuthProvider.jsx
import { showInfo } from "@/lib/swal";
import { getUser } from "@/services/user.api";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null);

  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const logout = useCallback((reason = "manual") => {
    clearLogoutTimer();

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);

    if (reason === "expired") {
      showInfo("세션이 만료되었습니다. 다시 로그인해주세요.").then(() => {
        window.location.href = "/home";
      });
    }
  }, []);

  const scheduleLogout = useCallback(
    (token) => {
      clearLogoutTimer();

      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      const timeout = (decoded.exp - now) * 1000;

      if (timeout <= 0) {
        logout("expired");
        return;
      }

      logoutTimerRef.current = setTimeout(() => {
        logout("expired");
      }, timeout);
    },
    [logout],
  );

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
          logout("expired");
          return;
        }

        scheduleLogout(token);

        const res = await getUser();
        setUser(res.data);
      } catch (err) {
        logout("expired");
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      clearLogoutTimer();
    };
  }, []);

  useEffect(() => {
    console.log("AuthProvider user 변경:", user);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        scheduleLogout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
