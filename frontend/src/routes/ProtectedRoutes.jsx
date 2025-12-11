import { useAuth } from "@/context/AuthContext";
import { storage } from "@/utils/storage";
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return !isAuthenticated ? (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};

export default ProtectedRoutes;
