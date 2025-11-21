import React from "react";
import { Navigate, Outlet } from "react-router";

const useAuth = () => {
  const token = localStorage.getItem("token");
  return { isAuthenticated: !!token };
};

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoutes;
