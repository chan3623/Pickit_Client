// useUserAuth.js
import { useContext } from "react";
import { UserAuthContext } from "./UserAuthContext";

export function useUserAuth() {
  return useContext(UserAuthContext);
}
