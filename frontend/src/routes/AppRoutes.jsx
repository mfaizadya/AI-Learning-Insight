import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
// routes middleware (will be activated once the auth service/utils has been implemented)
// import ProtectedRoutes from "./ProtectedRoutes";
// import PublicRoutes from "./PublicRoutes";
import DashboardLayout from "../layouts/DashboardLayout";
import Pretest from "@/pages/Pretest";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* uncomment when the auth logic/service has been implement */}
        {/* <Route element={<ProtectedRoutes />}> */}
        <Route path="/" element={<DashboardLayout />}>
          {/* (temporary while the dashboard page has not been implemented) */}
          <Route index element={<Navigate to="/dashboard/pretest" replace />} />
          <Route
            path="dashboard"
            element={<Navigate to="/dashboard/pretest" replace />}
          />
          <Route path="dashboard/pretest" element={<Pretest />} />
          {/* other/next */}
          {/* <Route path="dashboard/account" element={<AccountPage />} /> */}
        </Route>
        {/* </Route> */}
        {/* uncomment when the auth logic/service has been implement */}
        {/* <Route element={<PublicRoutes />}> */}
        {/* <Route path="/auth" element={<AuthLayout />}> (optional)*/}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        {/* </Route> */}
        {/* </Route> */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
