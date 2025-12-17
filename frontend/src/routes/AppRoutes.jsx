import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
// routes middleware (will be activated once the auth service/utils has been implemented)
import DashboardLayout from "../layouts/DashboardLayout";
import Pretest from "@/pages/PretestPage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import RegisterPage from "@/pages/RegisterPage";
import NotFoundPage from "@/pages/NotFoundPage";
import AccountPage from "@/pages/AccountPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";
import TestPage from "@/pages/TestPage";
import LandingPage from "@/pages/LandingPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* landing page */}
        <Route path="/" element={<LandingPage />} />
        {/* uncomment when the auth logic/service has been implement */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />

            {/* sub-routes */}
            <Route path="pretest" element={<Pretest />} />
            <Route path="pretest/test" element={<TestPage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>
        </Route>
        {/* uncomment when the auth logic/service has been implement */}
        <Route element={<PublicRoutes />}>
          <Route path="/auth">
            <Route index element={<Navigate to="/auth/login" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Route>
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
