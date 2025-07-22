import { useContext } from "react";
import Cookies from "js-cookie";
import { UserContext } from "./UserContext";

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export const setToken = (token) => {
  Cookies.set("token", token, {
    path: "/",
    expires: 12 / 24,
  });
  window.dispatchEvent(new Event("token-changed"));
};

export const removeToken = () => {
  Cookies.remove("token", { path: "/" });
  window.dispatchEvent(new Event("token-changed"));
}; 