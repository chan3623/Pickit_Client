// useManagerAuth.js
import { useContext } from "react";
import { ManagerAuthContext } from "./ManagerAuthContext";

export function useManagerAuth() {
  return useContext(ManagerAuthContext);
}
