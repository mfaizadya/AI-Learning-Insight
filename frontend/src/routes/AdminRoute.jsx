import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Navigate, Outlet } from "react-router";

const AdminRoute = () => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
