// auth/user/UserAuthProvider.jsx
import { getUser } from "@/services/user.api";
import { useCallback, useEffect, useState } from "react";
import { UserAuthContext } from "./UserAuthContext";

const ACCESS_TOKEN_KEY = "USER_ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "USER_REFRESH_TOKEN";

export default function UserAuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAccount(null);
    window.location.href = "/home";
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
    <UserAuthContext.Provider
      value={{
        account,
        setAccount,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </UserAuthContext.Provider>
  );
}
