import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useUsers } from '../hooks/useUsers';
import { useAudit } from '../hooks/useAudit';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../hooks/useSettings';
import { useRoles } from '../hooks/useRoles';
import UserModal from '../components/UserModal';
import Toast from '../components/Toast';
import { StorageService } from '../lib/storage';
import LogDetailsModal from '../components/LogDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { User, AuditLog } from '../types';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { users, updateUser, deleteUser } = useUsers();
  const { settings, updateManagerPermission, updateEmailTemplates } = useSettings();
  const { roles } = useRoles();
  const { logs, refresh: refreshAudit } = useAudit();
  const { user: currentUser } = useAuth();
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // User Filters State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');

  // Audit Filters State
  const [auditPeriod, setAuditPeriod] = useState('30');
  const [auditUser, setAuditUser] = useState('');
  const [auditType, setAuditType] = useState('');
  const [auditTarget, setAuditTarget] = useState('');

  // Pagination State
  const [userPage, setUserPage] = useState(1);
  const [auditPage, setAuditPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered Users Calculation
  const filteredUsers = users.filter(user => {
    const matchesSearch = userSearch === '' ||
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === '' || user.role === userRoleFilter;
    const matchesStatus = userStatusFilter === '' || user.status === userStatusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination Slices (Users)
  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const displayedUsers = filteredUsers.slice((userPage - 1) * itemsPerPage, userPage * itemsPerPage);

  // Reset pagination when filters change
  React.useEffect(() => { setUserPage(1); }, [userSearch, userRoleFilter, userStatusFilter]);
  React.useEffect(() => { setAuditPage(1); }, [auditPeriod, auditUser, auditType, auditTarget]);

  // Filtered Logs Calculation
  const filteredLogs = logs.filter(log => {
    // Filter by Period
    const logDate = new Date(log.timestamp);
    const now = new Date();
    if (auditPeriod === '7') {
      const past = new Date(); past.setDate(now.getDate() - 7);
      if (logDate < past) return false;
    } else if (auditPeriod === '30') {
      const past = new Date(); past.setDate(now.getDate() - 30);
      if (logDate < past) return false;
    } else if (auditPeriod === 'today') {
      if (logDate.toDateString() !== now.toDateString()) return false;
    }

    // Filter by User who performed action
    if (auditUser && !log.user_name.toLowerCase().includes(auditUser.toLowerCase())) return false;

    // Filter by Type (assuming action corresponds loosely or we map it)
    // Since type is generic string in mockup, let's match action or details
    if (auditType) {
      if (auditType === 'profile' && !log.details.includes('Perfil')) return false;
      if (auditType === 'scope' && !log.details.includes('Escopo')) return false;
      if (auditType === 'system' && !log.details.includes('Sistema')) return false;
      // Simple fallback search if precise mapping isn't available
      if (auditType === 'privileges' && !log.details.includes('Privilégios')) return false;
    }

    // Filter by Target User (checking details for now as target_id might differ)
    if (auditTarget && !log.details.toLowerCase().includes(auditTarget.toLowerCase())) return false;

    return true;
  });

  const totalAuditPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const displayedLogs = filteredLogs.slice((auditPage - 1) * itemsPerPage, auditPage * itemsPerPage);
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
    { id: 'emails', label: 'E-mails' },
    { id: 'audit', label: 'Auditoria de Configurações' },
    { id: 'system', label: 'Sistema' },
  ];



  const [deptInput, setDeptInput] = useState('');

  const handleUpdateScope = (updates: Partial<NonNullable<User['scope']>>) => {
    if (!selectedManagerId) return;
    const currentScope = selectedManager?.scope || {
      vacancy_view_type: 'direct',
      allowed_departments: [],
      allowed_role_codes: []
    };
    updateUser(selectedManagerId, {
      scope: { ...currentScope, ...updates }
    });
  };

  const handleUpdateUserPermission = (key: keyof NonNullable<User['custom_permissions']>, value: boolean) => {
    if (!selectedManagerId) return;
    const currentPermissions = selectedManager?.custom_permissions || {};
    updateUser(selectedManagerId, {
      custom_permissions: { ...currentPermissions, [key]: value }
    });
  };


  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background relative">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-6 sticky top-0 z-20 shrink-0">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-4">
            <Breadcrumbs items={[{ label: 'Configurações' }]} />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Configurações</h1>
              <p className="text-muted-foreground text-sm mt-1">Gerencie usuários, permissões e regras de governança do sistema.</p>
            </div>
            <div className="flex gap-2">
              <button className="items-center justify-center gap-2 bg-primary text-primary-foreground border border-border/40 font-semibold py-2.5 px-6 rounded-base shadow-sm transition-all duration-200 ease-in-out hover:bg-primary/90 active:translate-y-[1px] hidden sm:inline-flex focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <span className="material-symbols-outlined text-[20px]">save</span>
                Salvar alterações
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 border-b border-border overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">

          {/* Tab: Usuários */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground material-symbols-outlined text-[20px]">search</span>
                      <input
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-base text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                        placeholder="Buscar por nome ou e-mail"
                        type="text"
                      />
                    </div>
                    <div className="w-full md:w-48">
                      <select
                        value={userRoleFilter}
                        onChange={(e) => setUserRoleFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-base text-sm text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 cursor-pointer"
                      >
                        <option value="">Todos os tipos</option>
                        <option value="admin">Admin / Qualidade</option>
                        <option value="manager">Gestor</option>
                      </select>
                    </div>
                    <div className="w-full md:w-48">
                      <select
                        value={userStatusFilter}
                        onChange={(e) => setUserStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-base text-sm text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 cursor-pointer"
                      >
                        <option value="">Status: Todos</option>
                        <option value="active">Ativo</option>
                        <option value="suspended">Suspenso</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary border border-border/40 rounded-base shadow-sm transition-all duration-200 ease-in-out hover:bg-primary/90 active:translate-y-[1px] whitespace-nowrap focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                    Adicionar usuário
                  </button>
                </div>
              </div>

              <div className="bg-card border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted border-b border-border">
                        <th className="px-6 py-4 text-xs font-semibold text-muted-foreground w-1/3">Nome / e-mail</th>
                        <th className="px-6 py-4 text-xs font-semibold text-muted-foreground">Tipo</th>
                        <th className="px-6 py-4 text-xs font-semibold text-muted-foreground">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-muted-foreground">Último acesso</th>
                        <th className="px-6 py-4 text-xs font-semibold text-muted-foreground text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {displayedUsers.map((user) => (
                        <tr key={user.id} className="group hover:bg-muted/40 transition-all duration-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0 border border-primary/20">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-foreground">{user.name}</span>
                                <span className="text-xs text-muted-foreground font-medium">{user.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-muted text-foreground border border-border capitalize">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                              <span className={`size-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-destructive'}`}></span>
                              {user.status === 'active' ? 'Ativo' : 'Suspenso'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground font-medium">{user.lastAccess}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* ACTIONS */}
                              <Link to={`/settings/users/${user.id}/edit`} className="p-1.5 text-muted-foreground hover:text-primary transition-all duration-200" title="Editar"><span className="material-symbols-outlined text-[18px]">edit</span></Link>
                              <button
                                onClick={() => updateUser(user.id, { status: user.status === 'active' ? 'suspended' : 'active' })}
                                className={`p-1.5 transition-all duration-200 ${user.status === 'active' ? 'text-muted-foreground hover:text-destructive' : 'text-muted-foreground hover:text-emerald-500'}`}
                                title={user.status === 'active' ? 'Suspender' : 'Ativar'}
                              >
                                <span className="material-symbols-outlined text-[18px]">{user.status === 'active' ? 'block' : 'check_circle'}</span>
                              </button>
                              <button
                                onClick={() => setUserToDelete(user.id)}
                                className="p-1.5 text-muted-foreground hover:text-destructive transition-all duration-200"
                                title="Excluir"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-border flex justify-between items-center bg-muted/20">
                  <span className="text-xs text-muted-foreground font-semibold italic">Mostrando {displayedUsers.length} de {filteredUsers.length} usuários</span>
                  {totalUserPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setUserPage(p => Math.max(1, p - 1))}
                        disabled={userPage === 1}
                        className="p-1 rounded hover:bg-muted disabled:opacity-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                      </button>
                      <span className="text-xs font-semibold text-foreground">Pág. {userPage} de {totalUserPages}</span>
                      <button
                        onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
                        disabled={userPage === totalUserPages}
                        className="p-1 rounded hover:bg-muted disabled:opacity-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Privilégios */}
          {activeTab === 'privileges' && (
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-4">Resumo por Perfil</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card p-5 rounded-lg border border-border shadow-sm flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0 border border-primary/20">
                      <span className="material-symbols-outlined">admin_panel_settings</span>
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold text-sm mb-1">Administrador / Qualidade</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed mb-2 font-medium">
                        Possui acesso irrestrito a todas as vagas, candidatos e configurações do sistema. Pode auditar ações e reverter etapas.
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                        Acesso total
                      </span>
                    </div>
                  </div>
                  <div className="bg-card p-5 rounded-lg border border-border shadow-sm flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0 border border-primary/20">
                      <span className="material-symbols-outlined">supervisor_account</span>
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold text-sm mb-1">Gestor Contratante</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed mb-2 font-medium">
                        Acesso restrito apenas às vagas e departamentos sob sua responsabilidade direta. Ações críticas requerem validação ou configuração explícita.
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-foreground border border-border">
                        Escopo restrito
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="text-lg font-semibold text-foreground">Chaves de Permissão para Gestores</h2>
                  <p className="text-muted-foreground text-sm mt-1">Defina quais ações sensíveis os gestores podem executar autonomamente em seus processos.</p>
                </div>
                <div className="divide-y divide-border">
                  <div className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-foreground font-semibold">Mover candidato para "Finalista"</h3>
                      <p className="text-xs text-muted-foreground font-medium">Permite ao gestor avançar candidatos para a fase final sem validação prévia do RH.</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 w-fit px-2 py-0.5 rounded border border-amber-500/20">
                        <span className="material-symbols-outlined text-[12px]">info</span> Impacta diretamente os KPIs de conversão do funil.
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        checked={settings.manager_permissions.move_to_finalist}
                        onChange={(e) => updateManagerPermission('move_to_finalist', e.target.checked)}
                        className="sr-only peer"
                        type="checkbox"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-foreground font-semibold">Marcar como "Não Selecionado / Banco"</h3>
                      <p className="text-xs text-muted-foreground font-medium">Habilita o gestor a desqualificar candidatos durante o processo de entrevista.</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted w-fit px-2 py-0.5 rounded border border-border">
                        <span className="material-symbols-outlined text-[12px]">fact_check</span> O sistema solicitará confirmação dupla e motivo obrigatório.
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        checked={settings.manager_permissions.mark_not_selected}
                        onChange={(e) => updateManagerPermission('mark_not_selected', e.target.checked)}
                        className="sr-only peer"
                        type="checkbox"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-foreground font-semibold">Retornar etapa do candidato</h3>
                      <p className="text-xs text-muted-foreground font-medium">Permite voltar um candidato para uma fase anterior (ex: de Entrevista para Triagem).</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 w-fit px-2 py-0.5 rounded border border-amber-500/20">
                        <span className="material-symbols-outlined text-[12px]">warning</span> Ação limitada a 3 ocorrências/mês para evitar distorção de SLA.
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        checked={settings.manager_permissions.return_candidate_stage}
                        onChange={(e) => updateManagerPermission('return_candidate_stage', e.target.checked)}
                        className="sr-only peer"
                        type="checkbox"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-foreground font-semibold">Encerrar vaga</h3>
                      <p className="text-xs text-muted-foreground font-medium">Autoridade para fechar a vaga diretamente pelo painel do gestor.</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-destructive bg-destructive/10 w-fit px-2 py-0.5 rounded border border-destructive/20">
                        <span className="material-symbols-outlined text-[12px]">security</span> Recomendado apenas para gestores de nível sênior.
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        checked={settings.manager_permissions.close_job}
                        onChange={(e) => updateManagerPermission('close_job', e.target.checked)}
                        className="sr-only peer"
                        type="checkbox"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Matriz de Acesso Detalhada</h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Visualização somente leitura</span>
                </div>
                <div className="bg-card border-border shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-muted border-b border-border">
                          <th className="px-6 py-4 text-xs font-semibold text-muted-foreground w-1/3">Área / funcionalidade</th>
                          <th className="px-6 py-4 text-xs font-semibold text-muted-foreground text-center w-1/3">Admin / qualidade</th>
                          <th className="px-6 py-4 text-xs font-semibold text-muted-foreground text-center w-1/3">Gestor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-sm">

                        {/* Gestão de Cargos */}
                        <tr className="hover:bg-muted/40 transition-colors">
                          <td className="px-6 py-4 text-foreground font-semibold">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-muted-foreground text-[18px]">work</span> Gestão de Cargos
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              <span className="material-symbols-outlined text-[14px]">check</span> Criar e Editar
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-foreground border border-border">
                              <span className="material-symbols-outlined text-[14px]">visibility</span> Visualizar Apenas
                            </span>
                          </td>
                        </tr>

                        {/* Encerrar Vaga */}
                        <tr className="hover:bg-muted/40 transition-colors">
                          <td className="px-6 py-4 text-foreground font-semibold">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-muted-foreground text-[18px]">lock</span> Encerrar Vaga
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              <span className="material-symbols-outlined text-[14px]">check</span> Permitido
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${settings.manager_permissions.close_job
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                              : 'bg-muted text-muted-foreground border-border'
                              }`}>
                              <span className="material-symbols-outlined text-[14px]">
                                {settings.manager_permissions.close_job ? 'check' : 'block'}
                              </span>
                              {settings.manager_permissions.close_job ? 'Permitido' : 'Bloqueado'}
                            </span>
                          </td>
                        </tr>

                        {/* Aprovar Finalista */}
                        <tr className="hover:bg-muted/40 transition-colors">
                          <td className="px-6 py-4 text-foreground font-semibold">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-muted-foreground text-[18px]">trophy</span> Aprovar Finalista
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              <span className="material-symbols-outlined text-[14px]">check</span> Permitido
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${settings.manager_permissions.move_to_finalist
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                              : 'bg-muted text-muted-foreground border-border'
                              }`}>
                              <span className="material-symbols-outlined text-[14px]">
                                {settings.manager_permissions.move_to_finalist ? 'check' : 'block'}
                              </span>
                              {settings.manager_permissions.move_to_finalist ? 'Permitido' : 'Bloqueado'}
                            </span>
                          </td>
                        </tr>

                        {/* Retornar Candidato */}
                        <tr className="hover:bg-muted/40 transition-colors">
                          <td className="px-6 py-4 text-foreground font-semibold">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-muted-foreground text-[18px]">undo</span> Retornar Etapa
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              <span className="material-symbols-outlined text-[14px]">check</span> Permitido
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${settings.manager_permissions.return_candidate_stage
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                              : 'bg-muted text-muted-foreground border-border'
                              }`}>
                              <span className="material-symbols-outlined text-[14px]">
                                {settings.manager_permissions.return_candidate_stage ? 'check' : 'block'}
                              </span>
                              {settings.manager_permissions.return_candidate_stage ? 'Permitido' : 'Bloqueado'}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Tab: Escopo do Gestor */}
          {activeTab === 'scope' && (
            <div className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                <div>
                  <h3 className="text-sm font-semibold text-primary">Definição de Escopo</h3>
                  <p className="text-sm text-foreground/80 mt-1 font-medium">Configure o que cada gestor pode visualizar e operar dentro do sistema. As alterações aqui refletem imediatamente no acesso do usuário.</p>
                </div>
              </div>

              <section className="bg-card border border-border shadow-sm rounded-lg p-6">
                <label className="block text-foreground font-semibold mb-4">Selecione o Gestor para Configurar</label>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-muted-foreground">person_search</span>
                    <select
                      value={selectedManagerId || ''}
                      onChange={(e) => setSelectedManagerId(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-base focus:ring-2 focus:ring-ring text-sm text-foreground font-semibold appearance-none cursor-pointer"
                    >
                      {users.filter(u => u.role === 'manager' || u.role === 'admin').map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">expand_more</span>
                  </div>
                </div>

                {selectedManager && (
                  <div className="mt-6 flex items-center gap-4 p-4 border border-border bg-muted/30 rounded-lg">
                    <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold shrink-0 border border-primary/20 shadow-inner">
                      {selectedManager.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{selectedManager.name}</h3>
                      <p className="text-sm text-muted-foreground font-semibold">{selectedManager.role === 'admin' ? 'Administrador' : 'Gestor'} • {selectedManager.department || 'Geral'}</p>
                    </div>
                    <span className={`ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${selectedManager.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                      }`}>
                      {selectedManager.status === 'active' ? 'Ativo' : 'Suspenso'}
                    </span>
                  </div>
                )}
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <section className="bg-card border-border shadow-sm p-6">
                    <h2 className="text-foreground font-semibold hover:text-primary transition-all duration-200 ease-in-out mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">visibility</span> Visibilidade de Vagas
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Gestor responsável por quais vagas?</label>
                        <div className="space-y-3">
                          <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${(!selectedManager?.scope?.vacancy_view_type || selectedManager?.scope?.vacancy_view_type === 'direct') ? 'border-primary bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
                            <input
                              checked={!selectedManager?.scope?.vacancy_view_type || selectedManager?.scope?.vacancy_view_type === 'direct'}
                              onChange={() => handleUpdateScope({ vacancy_view_type: 'direct' })}
                              className="mt-1 text-primary focus:ring-primary border-slate-300 dark:border-slate-600 bg-transparent"
                              name="vacancy_scope"
                              type="radio"
                            />
                            <div>
                              <span className="block text-sm text-foreground font-semibold hover:text-primary transition-all duration-200 ease-in-out">Somente vagas onde ele é responsável direto</span>
                              <span className="block text-xs text-muted-foreground font-medium">O gestor verá apenas as vagas atribuídas diretamente ao seu perfil.</span>
                            </div>
                          </label>
                          <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${selectedManager?.scope?.vacancy_view_type === 'department' ? 'border-primary bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
                            <input
                              checked={selectedManager?.scope?.vacancy_view_type === 'department'}
                              onChange={() => handleUpdateScope({ vacancy_view_type: 'department' })}
                              className="mt-1 text-primary focus:ring-primary border-slate-300 dark:border-slate-600 bg-transparent"
                              name="vacancy_scope"
                              type="radio"
                            />
                            <div>
                              <span className="block text-sm text-foreground font-semibold hover:text-primary transition-all duration-200 ease-in-out">Também pode ver vagas do seu departamento</span>
                              <span className="block text-xs text-muted-foreground font-medium">Permite visualizar todas as vagas dentro dos departamentos selecionados abaixo, mesmo sem ser o responsável direto.</span>
                            </div>
                          </label>
                        </div>
                      </div>
                      <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Áreas / Departamentos Permitidos</label>
                        <p className="text-xs text-muted-foreground font-medium mb-3">Departamentos onde o gestor pode abrir vagas ou visualizar processos.</p>
                        <div className="relative">
                          <div className="flex flex-wrap gap-2 mb-2 p-2 min-h-[46px] bg-background border border-border rounded-base">
                            {(selectedManager?.scope?.allowed_departments || []).map(dept => (
                              <span key={dept} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-muted border border-border text-xs font-semibold text-foreground">
                                {dept} <button onClick={() => handleUpdateScope({ allowed_departments: (selectedManager?.scope?.allowed_departments || []).filter(d => d !== dept) })} className="hover:text-destructive flex items-center transition-colors"><span className="material-symbols-outlined text-[14px]">close</span></button>
                              </span>
                            ))}
                            <input
                              value={deptInput}
                              onChange={(e) => setDeptInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && deptInput.trim()) {
                                  e.preventDefault();
                                  const current = selectedManager?.scope?.allowed_departments || [];
                                  if (!current.includes(deptInput.trim())) {
                                    handleUpdateScope({ allowed_departments: [...current, deptInput.trim()] });
                                  }
                                  setDeptInput('');
                                }
                              }}
                              className="bg-transparent border-none text-sm focus:ring-0 p-0 placeholder:text-muted-foreground min-w-[150px] text-foreground font-medium flex-1"
                              placeholder="Adicionar departamento..."
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Cargos do catálogo permitidos <span className="text-xs font-normal text-slate-400 ml-1">(Opcional)</span>
                        </label>
                        <div className="relative">
                          <select
                            value={selectedManager?.scope?.allowed_role_codes || []}
                            onChange={(e) => {
                              const selectedOptions = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
                              handleUpdateScope({ allowed_role_codes: selectedOptions });
                            }}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600"
                            multiple
                            size={4}
                          >
                            {roles.map(role => (
                              <option key={role.id} value={role.code}>{role.title}</option>
                            ))}
                          </select>
                          <p className="text-xs text-slate-500 mt-1">Segure Ctrl (ou Cmd) para selecionar múltiplos.</p>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-4 flex gap-3">
                    <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 shrink-0">warning</span>
                    <div>
                      <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-200">Regra de Perda de Acesso</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300/80 mt-1">
                        Ao remover um gestor de uma vaga ativa, ele perderá imediatamente o acesso aos dados dos candidatos daquela vaga. Uma reatribuição manual de responsável será solicitada na tela de "Vagas".
                      </p>
                    </div>
                  </section>
                </div>
                <div className="lg:col-span-1">
                  <section className="bg-card border-border shadow-sm p-6 sticky top-24">
                    <h2 className="text-foreground font-semibold hover:text-primary transition-all duration-200 ease-in-out mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">toggle_on</span> Ações Habilitadas
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Defina quais operações críticas este gestor pode realizar autonomamente.</p>
                    <div className="space-y-5">
                      <div className="flex items-center justify-between group">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Encerrar Vaga</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Permite fechar vagas abertas</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            checked={!!selectedManager?.custom_permissions?.close_job}
                            onChange={(e) => handleUpdateUserPermission('close_job', e.target.checked)}
                            className="sr-only peer"
                            type="checkbox"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
                      <div className="flex items-center justify-between group">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Aprovar para Finalista</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Mover para etapa final</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            checked={!!selectedManager?.custom_permissions?.approve_finalist}
                            onChange={(e) => handleUpdateUserPermission('approve_finalist', e.target.checked)}
                            className="sr-only peer"
                            type="checkbox"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
                      <div className="flex items-center justify-between group">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Registrar Feedback</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Inserir notas de entrevista</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            checked={!!selectedManager?.custom_permissions?.register_feedback}
                            onChange={(e) => handleUpdateUserPermission('register_feedback', e.target.checked)}
                            className="sr-only peer"
                            type="checkbox"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
                      <div className="flex items-center justify-between group opacity-50 cursor-not-allowed">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Visualizar Salários</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Restrito a Admin/RH</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-not-allowed">
                          <input className="sr-only peer" disabled type="checkbox" />
                          <div className="w-11 h-6 bg-slate-200 rounded-full peer dark:bg-slate-700 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 dark:border-gray-600"></div>
                        </label>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}

          {/* Tab: E-mails */}
          {activeTab === 'emails' && (
            <div className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-[32px]">mail</span>
                <div>
                  <h3 className="text-base font-semibold text-primary">Templates de Notificação</h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-foreground/80 font-medium">
                      Personalize as mensagens enviadas automaticamente aos candidatos. Use os marcadores:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5 bg-background/50 p-3 rounded-lg border border-primary/10">
                      <div className="flex items-center gap-2 text-xs">
                        <code className="bg-primary/10 px-1 rounded font-bold text-primary">{"{{name}}"}</code>
                        <span className="text-muted-foreground font-medium">: Nome do Candidato</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <code className="bg-primary/10 px-1 rounded font-bold text-primary">{"{{job_title}}"}</code>
                        <span className="text-muted-foreground font-medium">: Nome da Vaga</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <code className="bg-primary/10 px-1 rounded font-bold text-primary">{"{{company}}"}</code>
                        <span className="text-muted-foreground font-medium">: Nome da sua Empresa</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <code className="bg-primary/10 px-1 rounded font-bold text-primary">{"{{recruiter}}"}</code>
                        <span className="text-muted-foreground font-medium">: Nome do Recrutador</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <code className="bg-primary/10 px-1 rounded font-bold text-primary">{"{{portal_url}}"}</code>
                        <span className="text-muted-foreground font-medium">: Link direto para o Portal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.entries(settings.email_templates || {}).map(([stageId, template]) => {
                  const stageInfo = {
                    received: { label: 'Candidatura Recebida', icon: 'inbox' },
                    screening: { label: 'Em Triagem', icon: 'search' },
                    technical: { label: 'Avaliação Técnica', icon: 'code' },
                    hr_interview: { label: 'Entrevista RH', icon: 'person' },
                    manager_interview: { label: 'Entrevista Gestor', icon: 'supervisor_account' },
                    finalist: { label: 'Finalista', icon: 'star' },
                    hired: { label: 'Contratado', icon: 'celebration' },
                    rejected: { label: 'Não Selecionado', icon: 'cancel' }
                  }[stageId] || { label: stageId, icon: 'mail' };

                  const isEditing = editingTemplate === stageId;

                  return (
                    <div key={stageId} className={`bg-card rounded-lg border transition-all duration-300 ${isEditing ? 'ring-2 ring-primary border-primary shadow-lg' : 'border-border hover:border-primary/50 shadow-sm'}`}>
                      <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary">{stageInfo.icon}</span>
                          <span className="font-semibold text-sm text-foreground">{stageInfo.label}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer scale-75">
                          <input
                            checked={template.enabled}
                            onChange={(e) => {
                              const newTemplates = { ...settings.email_templates };
                              newTemplates[stageId] = { ...template, enabled: e.target.checked };
                              updateEmailTemplates(newTemplates);
                            }}
                            className="sr-only peer"
                            type="checkbox"
                          />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>

                      <div className="p-5 space-y-4">
                        {isEditing ? (
                          <>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase">Assunto do E-mail</label>
                              <input
                                value={template.subject}
                                onChange={(e) => {
                                  const newTemplates = { ...settings.email_templates };
                                  newTemplates[stageId] = { ...template, subject: e.target.value };
                                  updateEmailTemplates(newTemplates);
                                }}
                                className="w-full px-3 py-2 bg-background border border-border rounded text-sm focus:ring-1 focus:ring-primary outline-none"
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center gap-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase whitespace-nowrap">Corpo da Mensagem</label>
                                <div className="flex flex-wrap gap-1 justify-end">
                                  {['{{name}}', '{{job_title}}', '{{company}}', '{{recruiter}}', '{{portal_url}}'].map(tag => (
                                    <button
                                      key={tag}
                                      type="button"
                                      onClick={() => {
                                        const textarea = document.getElementById(`body-${stageId}`) as HTMLTextAreaElement;
                                        if (textarea) {
                                          const start = textarea.selectionStart;
                                          const end = textarea.selectionEnd;
                                          const currentBody = template.body;
                                          const newBody = currentBody.substring(0, start) + tag + currentBody.substring(end);

                                          const newTemplates = { ...settings.email_templates };
                                          newTemplates[stageId] = { ...template, body: newBody };
                                          updateEmailTemplates(newTemplates);

                                          setTimeout(() => {
                                            textarea.focus();
                                            textarea.setSelectionRange(start + tag.length, start + tag.length);
                                          }, 0);
                                        }
                                      }}
                                      className="text-[9px] px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded hover:bg-primary hover:text-white transition-all font-bold"
                                    >
                                      {tag}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <textarea
                                id={`body-${stageId}`}
                                value={template.body}
                                onChange={(e) => {
                                  const newTemplates = { ...settings.email_templates };
                                  newTemplates[stageId] = { ...template, body: e.target.value };
                                  updateEmailTemplates(newTemplates);
                                }}
                                rows={5}
                                className="w-full px-3 py-2 bg-background border border-border rounded text-sm focus:ring-1 focus:ring-primary outline-none resize-none"
                              />
                            </div>
                            <button
                              onClick={() => {
                                setEditingTemplate(null);
                                setToast({ message: 'Template atualizado com sucesso!', type: 'success' });
                              }}
                              className="w-full py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[14px]">check</span>
                              Salvar e fechar
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Assunto</span>
                              <p className="text-sm font-semibold text-foreground truncate">{template.subject}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Prévia</span>
                              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                {template.body}
                              </p>
                            </div>
                            <button
                              onClick={() => setEditingTemplate(stageId)}
                              className="w-full py-2 border border-border bg-muted/30 text-foreground text-xs font-bold rounded hover:bg-muted transition-all flex items-center justify-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                              Customizar Template
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab: Auditoria */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="bg-card border-border p-5 shadow-sm">
                <h2 className="text-foreground font-semibold hover:text-primary transition-all duration-200 ease-in-out mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">filter_list</span>
                  Filtros de Auditoria
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Período</label>
                    <select
                      value={auditPeriod}
                      onChange={(e) => setAuditPeriod(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-base text-sm text-foreground font-semibold focus:ring-2 focus:ring-ring transition-all duration-200 cursor-pointer"
                    >
                      <option value="30">Últimos 30 dias</option>
                      <option value="7">Últimos 7 dias</option>
                      <option value="today">Hoje</option>
                      <option value="all">Todo o histórico</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Quem alterou</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-muted-foreground text-[18px]">person_search</span>
                      </span>
                      <input
                        value={auditUser}
                        onChange={(e) => setAuditUser(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-base text-sm text-foreground font-medium focus:ring-2 focus:ring-ring transition-all duration-200 placeholder:text-muted-foreground" placeholder="Nome ou e-mail"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Tipo de mudança</label>
                    <select
                      value={auditType}
                      onChange={(e) => setAuditType(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-base text-sm text-foreground font-semibold focus:ring-2 focus:ring-ring transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Todos os tipos</option>
                      <option value="profile">Perfil de acesso</option>
                      <option value="scope">Escopo de gestão</option>
                      <option value="system">Sistema</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Termo de busca (Detalhes)</label>
                    <input
                      value={auditTarget}
                      onChange={(e) => setAuditTarget(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-base text-sm text-foreground font-medium focus:ring-2 focus:ring-ring transition-all duration-200 placeholder:text-muted-foreground" placeholder="Ex: Financeiro, João..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
                  <button
                    onClick={() => {
                      setAuditPeriod('30');
                      setAuditUser('');
                      setAuditType('');
                      setAuditTarget('');
                    }}
                    className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Limpar Filtros
                  </button>
                  <button
                    onClick={() => refreshAudit?.()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-6 rounded-base transition-all duration-200 text-sm shadow-sm flex items-center gap-2 active:translate-y-[1px]"
                  >
                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                    Atualizar Logs
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Registro de Alterações</h3>
                <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-muted border-b border-border">
                          <th className="px-6 py-4 text-xs font-semibold text-muted-foreground w-48">Quem / quando</th>
                          <th className="px-6 py-4 text-xs font-semibold text-muted-foreground w-40">Tipo</th>
                          <th className="px-6 py-4 text-xs font-semibold text-muted-foreground">O que mudou</th>
                          <th className="px-6 py-4 text-xs font-semibold text-muted-foreground w-48">Motivo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-sm">
                        {displayedLogs.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground italic font-semibold">Nenhum registro de auditoria encontrado.</td>
                          </tr>
                        ) : (
                          displayedLogs.map(log => (
                            <tr key={log.id} className="group hover:bg-muted/40 transition-all duration-200">
                              <td className="px-6 py-4 align-top">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold border border-primary/20">
                                      {log.user_name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span className="text-foreground font-semibold">{log.user_name}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-muted-foreground font-semibold text-[10px]">
                                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                    <span>
                                      {new Intl.DateTimeFormat('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      }).format(new Date(log.timestamp))}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 align-top">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-muted text-foreground border border-border capitalize">
                                  {log.action}
                                </span>
                              </td>
                              <td className="px-6 py-4 align-top">
                                <p className="text-foreground font-medium leading-relaxed">{log.details}</p>
                              </td>
                              <td className="px-6 py-4 align-top">
                                <span className="text-muted-foreground italic text-xs font-semibold">Automático</span>
                              </td>
                              <td className="px-6 py-4 align-top text-right">
                                <button
                                  onClick={() => setSelectedLog(log)}
                                  className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[20px]">info</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-6 py-4 border-t border-border flex justify-between items-center bg-muted/20">
                    <span className="text-xs text-muted-foreground font-semibold italic">Mostrando {displayedLogs.length} de {filteredLogs.length} registros</span>
                    {totalAuditPages > 1 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAuditPage(p => Math.max(1, p - 1))}
                          disabled={auditPage === 1}
                          className="p-1 rounded hover:bg-muted disabled:opacity-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        </button>
                        <span className="text-xs font-semibold text-foreground">Pág. {auditPage} de {totalAuditPages}</span>
                        <button
                          onClick={() => setAuditPage(p => Math.min(totalAuditPages, p + 1))}
                          disabled={auditPage === totalAuditPages}
                          className="p-1 rounded hover:bg-muted disabled:opacity-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Sistema */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400 shrink-0 border border-amber-500/20">
                    <span className="material-symbols-outlined">database</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Gerenciamento de Dados (Backup)</h2>
                    <p className="text-muted-foreground text-sm mt-1">Como o sistema utiliza armazenamento local, recomendamos exportar seus dados regularmente para evitar perdas acidentais.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 border border-border rounded-lg hover:bg-muted/30 transition-all duration-200 ease-in-out group">
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-primary">file_upload</span>
                      Exportar Dados
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">Cria um arquivo JSON com todas as configurações, vagas e candidatos atuais.</p>
                    <button
                      onClick={handleExport}
                      className="w-full py-2.5 bg-foreground text-background font-semibold rounded-base text-sm transition-all duration-200 ease-in-out hover:opacity-90 active:translate-y-[1px]"
                    >
                      Exportar JSON
                    </button>
                  </div>

                  <div className="p-5 border border-border rounded-lg hover:bg-muted/30 transition-all duration-200 ease-in-out group">
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-primary">file_download</span>
                      Importar Dados
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">Carrega dados de um backup anterior. <span className="text-destructive font-semibold">Isso apagará o estado atual!</span></p>
                    <button
                      onClick={handleImportClick}
                      className="w-full py-2.5 bg-background border border-border text-foreground font-semibold rounded-base text-sm transition-all duration-200 ease-in-out hover:bg-muted active:translate-y-[1px]"
                    >
                      Importar JSON
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".json"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-5 flex gap-4">
                <span className="material-symbols-outlined text-destructive shrink-0">dangerous</span>
                <div>
                  <h4 className="text-sm font-semibold text-destructive">Zona de Perigo</h4>
                  <p className="text-sm text-foreground/80 mt-1 font-medium">
                    Apagar todos os dados locais restaurará o sistema para o estado inicial (dados de demonstração). Esta ação não pode ser desfeita.
                  </p>
                  <button
                    onClick={() => setIsResetConfirmOpen(true)}
                    className="mt-4 px-4 py-2 bg-destructive border border-border/40 text-destructive-foreground text-xs font-semibold rounded-base transition-all duration-200 hover:bg-destructive/90 shadow-sm active:translate-y-[1px]"
                  >
                    Resetar Todo o Sistema
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          localStorage.clear();
          window.location.reload();
        }}
        title="Resetar Todo o Sistema"
        message="Tem certeza que deseja apagar todos os dados locais? Esta ação restaurará o sistema para o estado inicial e não pode ser desfeita."
        confirmLabel="Resetar Sistema"
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
        title="Excluir Usuário"
        message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita e ele perderá o acesso imediatamente."
        confirmLabel="Excluir Usuário"
        type="danger"
      />

      <UserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={(message) => setToast({ message, type: 'success' })}
      />

      <LogDetailsModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />

      {
        toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )
      }
    </div >
  );
};

export default Settings;
