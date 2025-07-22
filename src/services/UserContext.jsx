import React, {
  createContext,
  useState,
  useEffect,
} from "react";
import Cookies from 'js-cookie';
import { removeToken } from './userUtils.js';
import { jwtDecode } from "jwt-decode";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get('token')
  );

  const setAuth = () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.id && decoded.exp > currentTime) {
          setUserId(String(decoded.id));
          setIsAuthenticated(true);
        }
        if(decoded.sub && decoded.exp > currentTime){
          setEmail(String(decoded.sub))
        }
      } catch (err) {
        setUserId(null);
        setIsAuthenticated(false);
        console.error('Token inválido:', err);
      }
    } else {
      setUserId(null);
      setIsAuthenticated(false);
    }
  }
  useEffect(() => {
    setAuth();
    const handleStorageChange = (event) => {
      if (event.key === "token") {
        Cookies.get('token') ? login() : logout();
      }
    };

    const handleTokenChanged = () => {
      console.log("Token changed event triggered");
      Cookies.get('token') ? login() : logout();
      setAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("token-changed", handleTokenChanged);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("token-changed", handleTokenChanged);
    };
  }, []);

  const checkAuth = () => {
    const token = Cookies.get('token');
    return !!token;
  };

  const login = () => setIsAuthenticated(true);

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider
      value={{ userId, email, setUserId, isAuthenticated, checkAuth, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
