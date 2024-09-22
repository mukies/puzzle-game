import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RouteProtection: React.FC = () => {
  const { user, loading } = useAuth();

  return loading ? (
    <div className=" text-xl">Loading...</div>
  ) : !loading && user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};
