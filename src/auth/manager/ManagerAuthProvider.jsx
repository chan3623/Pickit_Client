// auth/manager/ManagerAuthProvider.jsx
import { getUser } from "@/services/user.api";
import { useCallback, useEffect, useState } from "react";
import { ManagerAuthContext } from "./ManagerAuthContext.js";

const ACCESS_TOKEN_KEY = "MANAGER_ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "MANAGER_REFRESH_TOKEN";

export default function ManagerAuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAccount(null);
    window.location.href = "/manager";
  }, []);

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
        logout();
      } finally {
        setLoading(false);
      }
    })();
  }, [logout]);

  return (
    <ManagerAuthContext.Provider
      value={{
        account,
        setAccount,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </ManagerAuthContext.Provider>
  );
}
