import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { StorageService } from './lib/storage';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login'; // Mantido estático para LCP otimizado

// --> otimizado: lazy loading para code splitting por rota (React & Bundle Optimization)
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

// Rotas do Candidato
const PublicLayout = lazy(() => import('./layouts/PublicLayout'));
const JobsList = lazy(() => import('./pages/public/JobsList'));

// Componente para proteção de rotas
const RequireAuth = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('recruitSys_token') || sessionStorage.getItem('recruitSys_token');

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const LoadingFallback = () => (
  // --> otimizado: feedback visual leve durante carregamento de chunks
  <div className="flex items-center justify-center h-full w-full min-h-[50vh]">
    <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
  </div>
);

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72 transition-all duration-200">
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
            {/* Rotas Públicas / Autenticação (Sem Sidebar) */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/request-access" element={<RequestAccess />} />
            <Route path="/2fa" element={<TwoFactorAuth />} />

            {/* Rotas Públicas do Portal do Candidato */}
            <Route element={<PublicLayout />}>
              <Route path="/vagas" element={<JobsList />} />
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
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/users/:id/edit" element={<EditUser />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;