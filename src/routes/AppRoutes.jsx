import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';
import AnalyticsPage from '../pages/AnalyticsPage.jsx';
import AdmissionPage from '../pages/AdmissionPage.jsx';
import PlansPage from '../pages/PlansPage.jsx';
import MembersPage from '../pages/MembersPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

const AppRoutes = () => (
  <Routes>
    {/* No public site — the root goes to the dashboard (or login if signed out). */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login" element={<LoginPage />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<AnalyticsPage />} />
      <Route path="admission" element={<AdmissionPage />} />
      <Route path="plans" element={<PlansPage />} />
      <Route path="members" element={<MembersPage />} />
      <Route path="records" element={<Navigate to="/dashboard/members" replace />} />
      <Route path="profile" element={<ProfilePage />} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
