import React, { createContext, useContext, useEffect, useState } from "react";
import { hashPassword } from "../helper/hashPassword";

export interface UserDetails {
  user: string | null;
  register: (username: string, password: string) => boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}
const AuthContext = createContext<UserDetails | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("user");

    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const register = (username: string, password: string) => {
    const isExist = localStorage.getItem(username);

    if (isExist) {
      return false;
    }

    localStorage.setItem(username, hashPassword(password));
    return true;
  };
  const login = (username: string, password: string) => {
    const isRegistered = localStorage.getItem(username);
    if (!isRegistered || isRegistered !== hashPassword(password)) return false;

    sessionStorage.setItem("user", hashPassword(password));
    setUser(username);
    return true;
  };
  const logout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context) {
    return useContext(AuthContext);
  } else {
    throw new Error("useAuth must be used within an AuthProvider");
  }
};

export default AuthProvider;
