import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import PublicLayout from './layouts/PublicLayout';
import CandidateLayout from './layouts/CandidateLayout';

// Static Imports for ALL pages to eliminate Lazy-Loading White Screens
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import JobsList from './pages/public/JobsList';
import JobDetailPublic from './pages/public/JobDetailPublic';
import CandidateLogin from './pages/public/CandidateLogin';
import CandidateForgotPassword from './pages/public/CandidateForgotPassword';
import CandidateRegister from './pages/public/CandidateRegister';
import JobApplication from './pages/public/JobApplication';
import TermsOfUse from './pages/public/TermsOfUse';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import VerifyEmail from './pages/public/VerifyEmail';
import NotFound from './pages/public/NotFound';

import CreateJob from './pages/CreateJob';
import EditJob from './pages/EditJob';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Kanban from './pages/Kanban';
import Audit from './pages/Audit';
import Roles from './pages/Roles';
import CreateRole from './pages/CreateRole';
import EditRole from './pages/EditRole';
import Settings from './pages/Settings';
import EditUser from './pages/EditUser';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RequestAccess from './pages/RequestAccess';
import TwoFactorAuth from './pages/TwoFactorAuth';
import TalentBank from './pages/TalentBank';

import CandidateDashboard from './pages/candidate/CandidateDashboard';
import MyApplications from './pages/candidate/MyApplications';
import CandidateSettings from './pages/candidate/CandidateSettings';
import ApplicationDetail from './pages/candidate/ApplicationDetail';
import DebugAuth from './pages/DebugAuth';

// --- Helpers ---
const RequireAuth = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // If loading, render nothing (invisible wait) instead of a spinner
  if (isLoading) return null;

  // If not authenticated or user profile missing, forced redirect to login
  if (!isAuthenticated || !user) {
    console.warn('[Guard] RequireAuth: Sem autenticação ou perfil. Redirecionando para login admin.');
    return <Navigate to="/admin/login" replace />;
  }

  // SECURITY: Block candidates from accessing admin routes
  if (user?.role === 'candidate') {
    console.warn('[Guard] RequireAuth: Candidato tentando acessar área admin. Redirecionando para portal.');
    return <Navigate to="/candidate/dashboard" replace />;
  }

  console.log('[Guard] RequireAuth: Acesso autorizado para', user.name);
  return <>{children}</>;
};

const RequireCandidateAuth = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated || !user) {
    console.warn('[Guard] RequireCandidateAuth: Redirecionando para login candidato.');
    return <Navigate to="/login" replace />;
  }

  console.log('[Guard] RequireCandidateAuth: Acesso autorizado para', user.name);
  return <>{children}</>;
};

const RoleRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated || !user) {
    console.log('[Guard] RoleRedirect: Usuário não logado. Indo para Vagas.');
    return <Navigate to="/vagas" replace />;
  }

  console.log('[Guard] RoleRedirect: Redirecionando usuário por cargo:', user.role);
  if (user.role === 'candidate') return <Navigate to="/candidate/dashboard" replace />;
  return <Navigate to="/admin/dashboard" replace />;
};

// Basic Admin Layout without lazy
const AdminLayout: React.FC = () => (
  <div className="flex min-h-screen w-full bg-background text-foreground transition-all duration-300 ease-in-out">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0 lg:ml-72 transition-all duration-300 ease-in-out">
      <Outlet />
    </div>
  </div>
);

// --- App Structure ---
const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Base Redirect */}
            <Route path="/" element={<RoleRedirect />} />

            {/* Admin Auth */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/request-access" element={<RequestAccess />} />
            <Route path="/2fa" element={<TwoFactorAuth />} />

            {/* Public Routes (Candidate Portal) */}
            <Route element={<PublicLayout />}>
              <Route path="/login" element={<CandidateLogin />} />
              <Route path="/cadastro" element={<CandidateRegister />} />
              <Route path="/recuperar-senha" element={<CandidateForgotPassword />} />
              <Route path="/vagas" element={<JobsList />} />
              <Route path="/vagas/:id" element={<JobDetailPublic />} />
              <Route path="/vagas/:id/candidatar" element={<JobApplication />} />
              <Route path="/termos" element={<TermsOfUse />} />
              <Route path="/privacidade" element={<PrivacyPolicy />} />
              <Route path="/verificar-email" element={<VerifyEmail />} />
            </Route>

            {/* Candidate Protected Routes */}
            <Route path="/candidate" element={
              <RequireCandidateAuth>
                <CandidateLayout />
              </RequireCandidateAuth>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CandidateDashboard />} />
              <Route path="applications" element={<MyApplications />} />
              <Route path="applications/:id" element={<ApplicationDetail />} />
              <Route path="settings" element={<CandidateSettings />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/new" element={<CreateJob />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/jobs/:id/edit" element={<EditJob />} />
              <Route path="/jobs/:id/kanban" element={<Kanban />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/roles/new" element={<CreateRole />} />
              <Route path="/roles/:id/edit" element={<EditRole />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/talent-bank" element={<TalentBank />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/users/:id/edit" element={<EditUser />} />
            </Route>

            {/* Global 404 */}
            <Route path="/debug" element={<DebugAuth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;