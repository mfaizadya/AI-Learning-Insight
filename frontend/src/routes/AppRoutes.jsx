import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
// routes middleware (will be activated once the auth service/utils has been implemented)
// import ProtectedRoutes from "./ProtectedRoutes";
// import PublicRoutes from "./PublicRoutes";
import DashboardLayout from "../layouts/DashboardLayout";
import Pretest from "@/pages/PretestPage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import RegisterPage from "@/pages/RegisterPage";
import NotFoundPage from "@/pages/NotFoundPage";
import QuizPage from "@/pages/pretest/QuizPage";
import AccountPage from "@/pages/AccountPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* uncomment when the auth logic/service has been implement */}
        {/* <Route element={<ProtectedRoutes />}> */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route index element={<DashboardPage />} />
          <Route path="dashboard/pretest" element={<Pretest />} />
          {/* (!) for the next, a parameter or slug will be added for a unique quiz ID for each session. (maybe)*/}
          <Route path="dashboard/pretest/start-quiz" element={<QuizPage />} />
          <Route path="dashboard/account" element={<AccountPage />} />
          {/* other/next */}
          {/* <Route path="dashboard/account" element={<AccountPage />} /> */}
        </Route>
        {/* </Route> */}
        {/* uncomment when the auth logic/service has been implement */}
        {/* <Route element={<PublicRoutes />}> */}
        {/* <Route path="/auth" element={<AuthLayout />}> (optional)*/}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        {/* </Route> */}
        {/* </Route> */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
