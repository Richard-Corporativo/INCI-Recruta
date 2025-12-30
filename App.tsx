import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CreateJob from './pages/CreateJob';
import EditJob from './pages/EditJob';
import Roles from './pages/Roles';
import CreateRole from './pages/CreateRole';
import Kanban from './pages/Kanban';
import Audit from './pages/Audit';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Settings from './pages/Settings';
import EditUser from './pages/EditUser';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RequestAccess from './pages/RequestAccess';
import TwoFactorAuth from './pages/TwoFactorAuth';

// Componente para proteção de rotas (Autenticação desativada conforme solicitação de remoção da área de login)
const RequireAuth = ({ children }: { children?: React.ReactNode }) => {
  // Pass-through direto para permitir acesso sem login
  return <>{children}</>;
};

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72 transition-all duration-200">
        <Outlet />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas / Autenticação (Sem Sidebar) */}
        {/* Rota de Login removida conforme solicitado */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/request-access" element={<RequestAccess />} />
        <Route path="/2fa" element={<TwoFactorAuth />} />

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
          <Route path="/audit" element={<Audit />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/users/:id/edit" element={<EditUser />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;