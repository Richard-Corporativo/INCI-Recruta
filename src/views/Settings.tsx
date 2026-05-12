'use client';

// @page Settings | @tipo page-component | @versao 1.0.0
// > Configurações do sistema — tabs: usuários, privilégios, auditoria, sistema
// @calls useSettings — CRUD config, Breadcrumbs — navegação

import React, { useState, useMemo } from 'react';
import { Link } from '@src/lib/router-compat';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import { useUsers } from '@src/hooks/useUsers';
import { useAudit } from '@src/hooks/useAudit';
import { useAuth } from '@src/hooks/useAuth';
import { useSettings } from '@src/hooks/useSettings';
import { useRoles } from '@src/hooks/useRoles';
import UserModal from '@src/components/admin/UserModal';
import Toast from '@src/components/shared/Toast';
import { StorageService } from '@src/lib/storage';
import LogDetailsModal from '@src/components/admin/LogDetailsModal';
import { useQuickView } from '@src/context/QuickViewContext';
import ConfirmationModal from '@src/components/shared/ConfirmationModal';
import { User, AuditLog, SystemSettings } from '@src/types';
import { Icon } from "@iconify/react";
import { 
  SettingsUsersTab, 
  SettingsAuditTab, 
  SettingsSystemTab,
  SettingsPrivilegesTab,
  SettingsScopeTab 
} from './_components/settings';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { users, updateUser, deleteUser } = useUsers();
  const { settings, updateSettings } = useSettings();
  const { roles } = useRoles();
  const { logs, addLog } = useAudit();
  const { user: currentUser } = useAuth();

  const [pendingSettings, setPendingSettings] = useState<SystemSettings | null>(null);
  const [pendingUserPermissions, setPendingUserPermissions] = useState<Record<string, Partial<User>>>({});
  const [isSaving, setIsSaving] = useState(false);

  const currentSettings = pendingSettings || settings;

  const departments = useMemo(() => {
    const depts = new Set<string>();
    roles.forEach(role => {
      if (role.department) depts.add(role.department);
    });
    return Array.from(depts).sort();
  }, [roles]);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // 1. Save Global Settings
      if (pendingSettings) {
        await updateSettings(pendingSettings);
        await addLog({
          action: 'Atualização de Privilégios Globais',
          details: `Alteradas chaves de permissão para gestores.`,
          category: 'privileges',
          user_name: currentUser?.name || 'Admin'
        });
      }

      // 2. Save Individual User Scope/Permissions
      for (const [userId, updates] of Object.entries(pendingUserPermissions)) {
        await updateUser(userId, updates);
        const user = users.find(u => u.id === userId);

        // Determine category based on what was updated
        const hasScope = (updates as Partial<User>).scope !== undefined;
        const hasPermissions = (updates as Partial<User>).custom_permissions !== undefined;
        const category = hasScope ? 'scope' : hasPermissions ? 'privileges' : 'user_management';

        await addLog({
          action: hasScope ? 'Atualização de Escopo' : 'Atualização de Permissões',
          details: `Alteradas configurações individuais para ${user?.name || userId}.`,
          category,
          affected_user_id: userId,
          affected_user_name: user?.name,
          user_name: currentUser?.name || 'Admin'
        });
      }

      setPendingSettings(null);
      setPendingUserPermissions({});
      setToast({ message: 'Todas as configurações foram sincronizadas com sucesso.', type: 'success' });
    } catch (error) {
      setToast({ message: 'Erro ao salvar algumas configurações.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const updateManagerPermission = (key: keyof SystemSettings['manager_permissions'], value: boolean) => {
    setPendingSettings(prev => ({
      ...currentSettings,
      manager_permissions: {
        ...currentSettings.manager_permissions,
        [key]: value
      }
    }));
  };

  const hasPendingChanges = pendingSettings !== null || Object.keys(pendingUserPermissions).length > 0;

  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const { openQuickView } = useQuickView();

  // User filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Audit filters
  const [auditStartDate, setAuditStartDate] = useState('');
  const [auditEndDate, setAuditEndDate] = useState('');
  const [auditAuthor, setAuditAuthor] = useState('');
  const [auditCategory, setAuditCategory] = useState('');
  const [auditTarget, setAuditTarget] = useState('');

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Author filter
      const matchesAuthor = !auditAuthor || log.user_name.toLowerCase().includes(auditAuthor.toLowerCase());

      // Category filter
      const matchesCategory = !auditCategory || log.category === auditCategory;

      // Affected user filter (check both affected_user_name and details)
      const matchesTarget = !auditTarget ||
        (log.affected_user_name && log.affected_user_name.toLowerCase().includes(auditTarget.toLowerCase())) ||
        log.details.toLowerCase().includes(auditTarget.toLowerCase());

      // Date range filter
      let matchesDateRange = true;
      if (auditStartDate || auditEndDate) {
        const logDate = new Date(log.timestamp);
        logDate.setHours(0, 0, 0, 0);

        if (auditStartDate) {
          const startDate = new Date(auditStartDate);
          startDate.setHours(0, 0, 0, 0);
          matchesDateRange = matchesDateRange && logDate >= startDate;
        }

        if (auditEndDate) {
          const endDate = new Date(auditEndDate);
          endDate.setHours(23, 59, 59, 999);
          matchesDateRange = matchesDateRange && logDate <= endDate;
        }
      }

      return matchesAuthor && matchesCategory && matchesTarget && matchesDateRange;
    });
  }, [logs, auditAuthor, auditCategory, auditTarget, auditStartDate, auditEndDate]);

  // Initialize selected manager
  React.useEffect(() => {
    if (!selectedManagerId && users.length > 0) {
      const firstManager = users.find(u => u.role === 'manager' || u.role === 'admin');
      if (firstManager) setSelectedManagerId(firstManager.id);
    }
  }, [users, selectedManagerId]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const data = StorageService.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `recruitsys-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setToast({ message: 'Backup exportado com sucesso!', type: 'success' });
    } catch (e) {
      setToast({ message: 'Erro ao exportar backup.', type: 'error' });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (StorageService.importData(content)) {
        setToast({ message: 'Dados importados! Reiniciando o sistema...', type: 'success' });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setToast({ message: 'Arquivo inválido ou erro na importação.', type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const selectedManager = users.find(u => u.id === selectedManagerId);

  const tabs = [
    { id: 'users', label: 'Usuários' },
    { id: 'privileges', label: 'Privilégios' },
    { id: 'scope', label: 'Escopo do Gestor' },
    { id: 'audit', label: 'Auditoria de Configurações' },
    { id: 'system', label: 'Sistema' },
  ];





  const handleUpdateScope = (updates: Partial<NonNullable<User['scope']>>) => {
    if (!selectedManagerId) return;
    const userUpdates = pendingUserPermissions[selectedManagerId] || {};
    const currentScope = userUpdates.scope || selectedManager?.scope || {
      vacancy_view_type: 'direct',
      allowed_departments: [],
      allowed_role_codes: []
    };

    setPendingUserPermissions(prev => ({
      ...prev,
      [selectedManagerId]: {
        ...userUpdates,
        scope: { ...currentScope, ...updates }
      }
    }));
  };

  const handleUpdateUserPermission = (key: keyof NonNullable<User['custom_permissions']>, value: boolean) => {
    if (!selectedManagerId) return;
    const userUpdates = pendingUserPermissions[selectedManagerId] || {};
    const currentPermissions = userUpdates.custom_permissions || selectedManager?.custom_permissions || {};

    setPendingUserPermissions(prev => ({
      ...prev,
      [selectedManagerId]: {
        ...userUpdates,
        custom_permissions: { ...currentPermissions, [key]: value }
      }
    }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background font-sans antialiased">
      {/* Header Section */}
      <header className="bg-card border-b-2 border-border p-6 lg:px-8 shrink-0 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-full bg-secondary/5 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="mb-4">
            <Breadcrumbs items={[{ label: 'Configurações' }]} />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
                Configurações
                <div className="size-2 rounded-full bg-secondary animate-pulse" />
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Gerenciamento global de usuários, privilégios e governança do ecossistema.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {hasPendingChanges && (
                <button
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="h-11 px-6 bg-primary text-primary-foreground font-semibold text-sm rounded-xl transition-all hover:bg-primary/95 active:scale-[0.98] flex items-center gap-2.5 shadow-xl shadow-primary/20 animate-in fade-in zoom-in duration-300"
                >
                  <Icon icon={isSaving ? "line-md:loading-twotone-loop" : "material-symbols:cloud-done-outline-rounded"} className="size-5" />
                  {isSaving ? 'Sincronizando...' : 'Salvar Alterações'}
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-2 overflow-x-auto scrollbar-hide no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-10 px-5 text-sm font-semibold rounded-t-xl transition-all relative whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-background text-primary border-t-2 border-x-2 border-border'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute -bottom-[2px] left-0 w-full h-[2px] bg-background z-20" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto bg-background selection:bg-primary/20">
        <div className="max-w-7xl mx-auto w-full p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 gap-8">

            {/* Tab: Usuários */}
            {activeTab === 'users' && (
              <SettingsUsersTab
                users={users}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterRole={filterRole}
                setFilterRole={setFilterRole}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                updateUser={updateUser}
                setIsInviteModalOpen={setIsInviteModalOpen}
                setUserToDelete={setUserToDelete}
                openQuickView={openQuickView}
              />
            )}

            {/* Tab: Privilégios */}
            {activeTab === 'privileges' && (
              <SettingsPrivilegesTab
                currentSettings={currentSettings}
                updateManagerPermission={updateManagerPermission}
              />
            )}

            {/* Tab: Escopo do Gestor */}
            {activeTab === 'scope' && (
              <SettingsScopeTab
                users={users}
                selectedManagerId={selectedManagerId}
                setSelectedManagerId={setSelectedManagerId}
                selectedManager={selectedManager}
                departments={departments}
                roles={roles}
                handleUpdateScope={handleUpdateScope}
                currentSettings={currentSettings}
                pendingUserPermissions={pendingUserPermissions}
                handleUpdateUserPermission={handleUpdateUserPermission}
              />
            )}

            {/* Tab: Auditoria */}
            {activeTab === 'audit' && (
              <SettingsAuditTab
                logs={logs}
                filteredLogs={filteredLogs}
                auditStartDate={auditStartDate}
                setAuditStartDate={setAuditStartDate}
                auditEndDate={auditEndDate}
                setAuditEndDate={setAuditEndDate}
                auditAuthor={auditAuthor}
                setAuditAuthor={setAuditAuthor}
                auditCategory={auditCategory}
                setAuditCategory={setAuditCategory}
                auditTarget={auditTarget}
                setAuditTarget={setAuditTarget}
              />
            )}

            {/* Tab: Sistema */}
            {activeTab === 'system' && (
              <SettingsSystemTab
                handleExport={handleExport}
                handleImportClick={handleImportClick}
                handleFileChange={handleFileChange}
                fileInputRef={fileInputRef}
                setIsResetConfirmOpen={setIsResetConfirmOpen}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modals and Toasts */}
      <ConfirmationModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          localStorage.clear();
          window.location.reload();
        }}
        title="Restaurar Sistema"
        message="Esta ação apagará todos os dados locais permanentemente. Deseja prosseguir?"
        confirmLabel="Resetar Tudo"
        type="danger"
      />

      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => {
          if (userToDelete) {
            deleteUser(userToDelete);
            setUserToDelete(null);
            setToast({ message: 'Usuário removido com sucesso.', type: 'success' });
          }
        }}
        title="Remover Usuário"
        message="O usuário perderá o acesso imediatamente. Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        type="danger"
      />

      <UserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={(message) => setToast({ message, type: 'success' })}
      />

      <LogDetailsModal
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Settings;
