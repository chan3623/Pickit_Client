import { logout } from "@/services/auth.api";
import { getUser } from "@/services/user.api";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuthContext } from "./UserAuthContext";

const ACCESS_TOKEN_KEY = "USER_ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "USER_REFRESH_TOKEN";

export default function UserAuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (e) {
      console.log("e: ", e);
    } finally {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      setAccount(null);
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const handleGlobalLogout = () => {
      handleLogout();
    };

    window.addEventListener("auth:logout", handleGlobalLogout);
    return () => {
      window.removeEventListener("auth:logout", handleGlobalLogout);
    };
  }, [handleLogout]);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await getUser();
        setAccount(res.data);
      } catch {
        handleLogout();
      } finally {
        setLoading(false);
      }
    })();
  }, [handleLogout]);

  return (
    <UserAuthContext.Provider
      value={{ account, setAccount, handleLogout, loading }}
    >
      {!loading && children}
    </UserAuthContext.Provider>
  );
}
