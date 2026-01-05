import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import Login from './pages/Login';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreateJob = lazy(() => import('./pages/CreateJob'));
const EditJob = lazy(() => import('./pages/EditJob'));
const Jobs = lazy(() => import('./pages/Jobs'));
const JobDetail = lazy(() => import('./pages/JobDetail'));
const Kanban = lazy(() => import('./pages/Kanban')); // Nota: Jobs pode conter Kanban interno, mas a rota direta também é lazy
const Audit = lazy(() => import('./pages/Audit'));
const Roles = lazy(() => import('./pages/Roles'));
const CreateRole = lazy(() => import('./pages/CreateRole'));
const EditRole = lazy(() => import('./pages/EditRole'));
const Settings = lazy(() => import('./pages/Settings'));
const EditUser = lazy(() => import('./pages/EditUser'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const RequestAccess = lazy(() => import('./pages/RequestAccess'));
const TwoFactorAuth = lazy(() => import('./pages/TwoFactorAuth'));
const TalentBank = lazy(() => import('./pages/TalentBank'));

// Rotas do Candidato - Fluxo de Autenticação e Vagas
const PublicLayout = lazy(() => import('./layouts/PublicLayout'));
const JobsList = lazy(() => import('./pages/public/JobsList'));
const JobDetailPublic = lazy(() => import('./pages/public/JobDetailPublic'));
const CandidateLogin = lazy(() => import('./pages/public/CandidateLogin'));
const CandidateForgotPassword = lazy(() => import('./pages/public/CandidateForgotPassword'));
const CandidateRegister = lazy(() => import('./pages/public/CandidateRegister'));
const JobApplication = lazy(() => import('./pages/public/JobApplication'));
const CandidateLayout = lazy(() => import('./layouts/CandidateLayout'));
const CandidateDashboard = lazy(() => import('./pages/candidate/CandidateDashboard'));
const MyApplications = lazy(() => import('./pages/candidate/MyApplications'));
const CandidateSettings = lazy(() => import('./pages/candidate/CandidateSettings'));
const ApplicationDetail = lazy(() => import('./pages/candidate/ApplicationDetail'));
const TermsOfUse = lazy(() => import('./pages/public/TermsOfUse'));
const PrivacyPolicy = lazy(() => import('./pages/public/PrivacyPolicy'));
const VerifyEmail = lazy(() => import('./pages/public/VerifyEmail'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

// Componente para proteção de rotas
const RequireAuth = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Wait for auth to initialize
  if (isLoading) {
    return <LoadingScreen message="Verificando permissões..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // SECURITY: Block candidates from accessing admin routes
  if (user?.role === 'candidate') {
    return <Navigate to="/candidate/dashboard" replace />;
  }

  return <>{children}</>;
};

const RequireCandidateAuth = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Email confirmation not required for candidates
  return <>{children}</>;
};

import { LoadingScreen } from './components/ui/LoadingScreen';

const LoadingFallback = () => (
  <LoadingScreen message="Carregando recursos..." />
);

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground transition-all duration-300 ease-in-out">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72 transition-all duration-300 ease-in-out">
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

const RoleRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/vagas" replace />;
  if (user?.role === 'candidate') return <Navigate to="/candidate/dashboard" replace />;
  return <Navigate to="/admin/dashboard" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Home redirect */}
              <Route path="/" element={<RoleRedirect />} />

              {/* Rotas de Autenticação Admin */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/request-access" element={<RequestAccess />} />
              <Route path="/2fa" element={<TwoFactorAuth />} />

              {/* Rotas Públicas do Portal do Candidato */}
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

              {/* Rotas Privadas do Candidato */}
              <Route path="/candidate" element={
                <RequireCandidateAuth>
                  <CandidateLayout />
                </RequireCandidateAuth>
              }>
                <Route path="dashboard" element={<CandidateDashboard />} />
                <Route path="applications" element={<MyApplications />} />
                <Route path="applications/:id" element={<ApplicationDetail />} />
                <Route path="settings" element={<CandidateSettings />} />
              </Route>

              {/* Rotas do Painel (Protegidas) */}
              <Route element={
                <RequireAuth>
                  <MainLayout />
                </RequireAuth>
              }>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/new" element={<CreateJob />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/jobs/:id/edit" element={<EditJob />} />
                <Route path="/jobs/:id/kanban" element={<Kanban />} />
                <Route path="/kanban" element={<Kanban />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/roles/new" element={<CreateRole />} />
                <Route path="/roles/:id/edit" element={<EditRole />} />
                <Route path="/audit" element={<Audit />} />
                <Route path="/talent-bank" element={<TalentBank />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/users/:id/edit" element={<EditUser />} />
              </Route>

              {/* Rota 404 - Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;