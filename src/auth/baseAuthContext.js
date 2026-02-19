// baseAuthContext.js
import { createContext } from "react";

export function createAuthContext() {
  return createContext({
    account: null,
    setAccount: () => {},
    logout: () => {},
    loading: true,
  });
}
