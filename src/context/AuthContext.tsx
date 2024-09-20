import React, { createContext, useContext, useEffect, useState } from "react";
import { hashPassword } from "../helper/hashPassword";

export interface UserDetails {
  user: string | null;
  loading: boolean;
  register: (username: string, password: string) => boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<UserDetails | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("user");
    if (loggedInUser) {
      try {
        const userData = JSON.parse(loggedInUser);
        setUser(userData.username);
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Clear the invalid data from sessionStorage
        sessionStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const register = (username: string, password: string) => {
    const isExist = localStorage.getItem(username);
    if (isExist) {
      return false;
    }
    const payload = {
      username,
      password: hashPassword(password),
    };
    localStorage.setItem(username, JSON.stringify(payload));
    return true;
  };

  const login = (username: string, password: string) => {
    const isRegistered = localStorage.getItem(username);
    if (!isRegistered) return false;

    try {
      const userData = JSON.parse(isRegistered);
      if (userData.password !== hashPassword(password)) return false;

      const payload = {
        username,
        password: hashPassword(password),
      };
      sessionStorage.setItem("user", JSON.stringify(payload));
      setUser(username);
      return true;
    } catch (error) {
      console.error("Error parsing user data during login:", error);
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context) {
    return context;
  } else {
    throw new Error("useAuth must be used within an AuthProvider");
  }
};

export default AuthProvider;
