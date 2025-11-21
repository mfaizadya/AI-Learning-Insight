import React from "react";
import { Navigate, Outlet } from "react-router";

const useAuth = () => {
  const token = localStorage.getItem("token");
  return { isAuthenticated: !!token };
};

const PublicRoutes = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Navigate to="/dashboard/pretest" replace />
  ) : (
    <Outlet />
  );
};

export default PublicRoutes;
