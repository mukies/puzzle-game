import React, { createContext, useContext, useEffect, useState } from "react";
import { authSvc } from "../service/authService";

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
    const res = authSvc.register(username, password);
    return res;
  };

  const login = (username: string, password: string) => {
    const res = authSvc.login(username, password);
    setUser(username);
    return res;
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
