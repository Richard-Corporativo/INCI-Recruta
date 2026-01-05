import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { StorageService } from './lib/storage';
import { AuthProvider, useAuth } from './context/AuthContext';
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
const NotFound = lazy(() => import('./pages/public/NotFound'));

// Componente para proteção de rotas
const RequireAuth = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('recruitSys_token') || sessionStorage.getItem('recruitSys_token');

  if (!isAuthenticated && !token) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const RequireCandidateAuth = ({ children }: { children?: React.ReactNode }) => {
  const email = localStorage.getItem('recruitSys_candidate_email');
  if (!email) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

import { Skeleton } from './components/ui/Skeleton';

const LoadingFallback = () => (
  <div className="flex flex-col gap-4 p-8 w-full max-w-7xl mx-auto h-full min-h-[50vh]">
    {/* --> otimizado: Skeleton Screen para melhor percepção de carregamento (Fake Loading) */}
    <div className="flex items-center justify-between mb-8">
      <Skeleton className="h-8 w-48" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
    <div className="mt-8 space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  </div>
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

const App: React.FC = () => {
  React.useEffect(() => {
    StorageService.initialize();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
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
              <Route path="/" element={<Dashboard />} />
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
    </AuthProvider>
  );
};

export default App;