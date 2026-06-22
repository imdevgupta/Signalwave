import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

import DashboardPage from "../../pages/DashboardPage";

import LoginPage from "../../pages/auth/LoginPage";
import SetupPage from "../../pages/auth/SetupPage";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import ProfilesPage from "../../pages/ProfilesPage";
import MonitoringPage from "../../pages/MonitoringPage";
import DiagnosticsPage from "../../pages/DiagnosticsPage";
import HistoryPage from "../../pages/HistoryPage";
import TeamPage from "../../pages/TeamPage";
import AuditPage from "../../pages/AuditPage";
import SettingsPage from "../../pages/SettingsPage";
import ProfileDetailsPage from "../../pages/ProfileDetailsPage";
import HistoryDetailsPage from "../../pages/HistoryDetailsPage";
import ForgotPasswordPage from "../../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../../pages/auth/ResetPasswordPage";
import AdminRoute from "../../components/common/AdminRoute";
import AlertsPage from "../../pages/AlertsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}

        <Route path="/login" element={<LoginPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        {/* Protected App */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="profiles" element={<ProfilesPage />} />
          <Route path="profiles/:id" element={<ProfileDetailsPage />} />
          <Route path="monitoring" element={<MonitoringPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="diagnostics" element={<DiagnosticsPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route
            path="team"
            element={
              <AdminRoute>
                <TeamPage />
              </AdminRoute>
            }
          />

          <Route
            path="audit"
            element={
              <AdminRoute>
                <AuditPage />
              </AdminRoute>
            }
          />

          <Route
            path="settings"
            element={
              <AdminRoute>
                <SettingsPage />
              </AdminRoute>
            }
          />
          <Route path="history/:id" element={<HistoryDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
