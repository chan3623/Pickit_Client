// auth/user/UserAuthProvider.jsx
import { showInfo } from "@/lib/swal";
import { getUser } from "@/services/user.api";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserAuthContext } from "./UserAuthContext";

const ACCESS_TOKEN_KEY = "USER_ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "USER_REFRESH_TOKEN";

export default function UserAuthProvider({ children }) {
  const [account, setAccount] = useState(null);
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
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAccount(null);

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

      logoutTimerRef.current = setTimeout(() => logout("expired"), timeout);
    },
    [logout],
  );

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const decoded = jwtDecode(token);

        if (decoded.exp <= Date.now() / 1000) {
          logout("expired");
          return;
        }

        scheduleLogout(token);
        const res = await getUser();
        setAccount(res.data);
      } catch {
        logout("expired");
      } finally {
        setLoading(false);
      }
    })();

    return clearLogoutTimer;
  }, []);

  return (
    <UserAuthContext.Provider
      value={{
        account,
        setAccount,
        logout,
        scheduleLogout,
        loading,
      }}
    >
      {!loading && children}
    </UserAuthContext.Provider>
  );
}
