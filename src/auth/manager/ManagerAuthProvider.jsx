import { logout } from "@/services/auth.api";
import { getUser } from "@/services/user.api";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ManagerAuthContext } from "./ManagerAuthContext";

const ACCESS_TOKEN_KEY = "MANAGER_ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "MANAGER_REFRESH_TOKEN";

export default function ManagerAuthProvider({ children }) {
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
      navigate("/manager", { replace: true });
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
      } catch (e) {
        console.log("e: ", e);
        handleLogout();
      } finally {
        setLoading(false);
      }
    })();
  }, [handleLogout]);

  return (
    <ManagerAuthContext.Provider
      value={{ account, setAccount, handleLogout, loading }}
    >
      {!loading && children}
    </ManagerAuthContext.Provider>
  );
}
