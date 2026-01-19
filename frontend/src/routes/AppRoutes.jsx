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
import ApiDocsPage from "@/pages/docs/ApiDocsPage";
import DeveloperPage from "@/pages/dashboard/developer/DeveloperPage";
import PlaceholderPage from "@/pages/dashboard/admin/PlaceholderPage";
import AdminRoute from "./AdminRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* public API docs */}
        <Route path="/docs" element={<ApiDocsPage />} />

        {/* protected dashboard routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />

            {/* sub-routes */}
            <Route path="pretest" element={<Pretest />} />
            <Route path="pretest/test" element={<TestPage />} />
            <Route path="developer" element={<DeveloperPage />} />
            <Route path="account" element={<AccountPage />} />

            {/* Admin Exclusive Routes */}
            <Route element={<AdminRoute />}>
              <Route path="tenants" element={<PlaceholderPage title="Tenants Management" />} />
              <Route path="users" element={<PlaceholderPage title="User Management" />} />
            </Route>
          </Route>
        </Route>

        {/* public auth routes */}
        <Route element={<PublicRoutes />}>
          <Route path="/auth">
            <Route index element={<Navigate to="/auth/login" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Route>

        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

