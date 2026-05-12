'use client';
import { Icon } from "@iconify/react";

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import { useUsers } from '@src/hooks/useUsers';
import { useAudit } from '@src/hooks/useAudit';
import { useAuth } from '@src/context/AuthContext';
import { useSettings } from '@src/hooks/useSettings';
import { useRoles } from '@src/hooks/useRoles';
import { useCompany } from '@src/hooks/useCompany';
import UserModal from '@src/components/admin/UserModal';
import Toast from '@src/components/shared/Toast';
import { StorageService } from '@src/lib/storage';
import LogDetailsModal from '@src/components/admin/LogDetailsModal';
import { useQuickView } from '@src/context/QuickViewContext';
import ConfirmationModal from '@src/components/shared/ConfirmationModal';
import Select from '@src/components/atoms/Select/Select';
import { User, AuditLog, SystemSettings, TalentPoolSettings, RolePermissionsMatrix, RolePermissionKey } from '@src/types';
import { cn } from '@src/lib/utils';

const DEFAULT_ROLE_PERMISSIONS: RolePermissionsMatrix = {
  admin:          { create_job: true,  approve_job: true,  move_candidate: true,  view_salaries: true,  export_data: true,  access_tests: true  },
  recruiter:      { create_job: true,  approve_job: false, move_candidate: true,  view_salaries: false, export_data: false, access_tests: true  },
  manager:        { create_job: false, approve_job: false, move_candidate: true,  view_salaries: false, export_data: false, access_tests: false },
  interviewer:    { create_job: false, approve_job: false, move_candidate: false, view_salaries: false, export_data: false, access_tests: true  },
  view_only:      { create_job: false, approve_job: false, move_candidate: false, view_salaries: false, export_data: false, access_tests: false },
};

const COMPANY_TYPES = ['Startup', 'Grande Empresa', 'Consultoria', 'Indústria', 'Governo', 'ONG / Terceiro Setor'];
const HEADCOUNT_OPTIONS = ['1–10', '11–50', '51–200', '201–500', '501–1000', '1001–5000', '5000+'];
const SEGMENTS = ['Tecnologia', 'Educação', 'Saúde', 'Financeiro', 'Varejo', 'Logística', 'Construção Civil', 'Agronegócio', 'Telecomunicações'];
const PERMISSION_LABELS: Record<RolePermissionKey, string> = {
  create_job:      'Criar vaga',
  approve_job:     'Aprovar vaga',
  move_candidate:  'Mover candidato',
  view_salaries:   'Ver salários',
  export_data:     'Exportar dados',
  access_tests:    'Acessar testes',
};
const ROLE_LABELS: Record<string, string> = {
  admin:       'Admin da empresa',
  recruiter:   'Recrutador',
  manager:     'Gestor',
  interviewer: 'Entrevistador',
  view_only:   'Somente visualização',
};

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { users, updateUser, deleteUser, addUser } = useUsers();
  const { settings, updateSettings } = useSettings();
  const { roles } = useRoles();
  const { logs, addLog } = useAudit();
  const { user: currentUser, isOwner } = useAuth();
  const { company, isSaving: isSavingCompany, updateCompany } = useCompany();

  const [pendingSettings, setPendingSettings] = useState<SystemSettings | null>(null);
  const [pendingUserPermissions, setPendingUserPermissions] = useState<Record<string, Partial<User>>>({});
  const [isSaving, setIsSaving] = useState(false);

  // ── Empresa form state ──────────────────────────────────────────────────────
  const [empresaForm, setEmpresaForm] = useState({
    name: '',
    cnpj: '',
    website: '',
    linkedin_url: '',
    segment: '',
    headcount: '',
    company_type: '',
    cep: '',
    state_code: '',
    city: '',
    address: '',
    work_model: 'presencial' as string,
    work_model_custom: '',
  });
  const [empresaInternalRoles, setEmpresaInternalRoles] = useState<string[]>([]);
  const [newInternalRole, setNewInternalRole] = useState('');
  const [empresaTalentPool, setEmpresaTalentPool] = useState<TalentPoolSettings>({
    who_can_access: ['admin', 'recruiter'],
    visible_areas: [],
    retention_days: 180,
    allow_reuse: true,
  });
  const [empresaRolePerms, setEmpresaRolePerms] = useState<RolePermissionsMatrix>(DEFAULT_ROLE_PERMISSIONS);
  const [isCepLoading, setIsCepLoading] = useState(false);

  // Sincroniza form quando a empresa carrega do Supabase
  useEffect(() => {
    if (!company) return;
    setEmpresaForm({
      name: company.name ?? '',
      cnpj: company.cnpj ?? '',
      website: company.website ?? '',
      linkedin_url: company.linkedin_url ?? '',
      segment: company.segment ?? '',
      headcount: company.headcount ?? '',
      company_type: company.company_type ?? '',
      cep: company.cep ?? '',
      state_code: company.state_code ?? '',
      city: company.city ?? '',
      address: company.address ?? '',
      work_model: company.work_model ?? 'presencial',
      work_model_custom: company.work_model_custom ?? '',
    });
    if (company.internal_roles?.length) setEmpresaInternalRoles(company.internal_roles);
    if (company.talent_pool_settings) setEmpresaTalentPool(company.talent_pool_settings);
    if (company.role_permissions && Object.keys(company.role_permissions).length)
      setEmpresaRolePerms({ ...DEFAULT_ROLE_PERMISSIONS, ...company.role_permissions });
  }, [company]);

  const handleCepBlur = useCallback(async () => {
    const raw = empresaForm.cep.replace(/\D/g, '');
    if (raw.length !== 8) return;
    setIsCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setEmpresaForm(prev => ({
          ...prev,
          state_code: data.uf ?? prev.state_code,
          city: data.localidade ?? prev.city,
          address: data.logradouro ? `${data.logradouro}${data.bairro ? ', ' + data.bairro : ''}` : prev.address,
        }));
      }
    } catch {
      // silencioso
    } finally {
      setIsCepLoading(false);
    }
  }, [empresaForm.cep]);

  const handleSaveEmpresa = async () => {
    const ok = await updateCompany({
      ...empresaForm,
      work_model: empresaForm.work_model as 'presencial' | 'hibrido' | 'remoto' | 'outro',
      internal_roles: empresaInternalRoles,
      talent_pool_settings: empresaTalentPool,
      role_permissions: empresaRolePerms,
    });
    if (ok) {
      await addLog({
        action: 'Atualização do Perfil da Empresa',
        details: 'Dados institucionais e configurações da empresa foram atualizados.',
        category: 'system',
        user_name: currentUser?.name || 'Admin',
      });
      setToast({ message: 'Dados da empresa salvos com sucesso.', type: 'success' });
    } else {
      setToast({ message: 'Erro ao salvar. Verifique sua conexão e tente novamente.', type: 'error' });
    }
  };

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

  // CNPJ modal (Escopo do Gestor)
  const [isCnpjModalOpen, setIsCnpjModalOpen] = useState(false);
  const [cnpjInput, setCnpjInput] = useState('');
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [cnpjResult, setCnpjResult] = useState<{ razao_social?: string; nome_fantasia?: string; cnpj?: string; logradouro?: string; municipio?: string; uf?: string } | null>(null);
  const [cnpjError, setCnpjError] = useState('');

  const handleCnpjSearch = async () => {
    const raw = cnpjInput.replace(/\D/g, '');
    if (raw.length !== 14) { setCnpjError('CNPJ inválido. Digite os 14 dígitos.'); return; }
    setCnpjLoading(true); setCnpjError(''); setCnpjResult(null);
    try {
      const res = await fetch(`https://publica.cnpj.ws/cnpj/${raw}`);
      if (!res.ok) throw new Error('not found');
      const data = await res.json();
      setCnpjResult(data);
    } catch {
      setCnpjError('Empresa não encontrada. Verifique o CNPJ.');
    } finally {
      setCnpjLoading(false);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesAuthor = !auditAuthor || log.user_name.toLowerCase().includes(auditAuthor.toLowerCase());
      const matchesCategory = !auditCategory || log.category === auditCategory;
      const matchesTarget = !auditTarget ||
        (log.affected_user_name && log.affected_user_name.toLowerCase().includes(auditTarget.toLowerCase())) ||
        log.details.toLowerCase().includes(auditTarget.toLowerCase());

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

  useEffect(() => {
    if (!selectedManagerId && users.length > 0) {
      const firstManager = users.find(u => u.role === 'manager' || u.role === 'admin');
      if (firstManager) setSelectedManagerId(firstManager.id);
    }
  }, [users, selectedManagerId]);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    e.target.value = '';
  };

  const selectedManager = users.find(u => u.id === selectedManagerId);

  const tabs = [
    { id: 'empresa', label: 'Empresa' },
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
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: 'Configurações' }]} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Configurações</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie usuários, permissões e regras de governança do sistema.</p>
        </div>
        {hasPendingChanges && (
          <button onClick={handleSaveAll} disabled={isSaving}
            className="h-11 px-6 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50">
            <Icon icon={isSaving ? 'material-symbols:sync' : 'material-symbols:cloud-done'} className={cn("size-5", isSaving && "animate-spin")} />
            {isSaving ? 'Sincronizando...' : 'Salvar Alterações'}
          </button>
        )}
      </div>

      <div className="flex items-center gap-6 border-b border-border overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
              ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6">

          {/* Tab: Empresa */}
          {activeTab === 'empresa' && (
            <div className="space-y-6">

              {/* 1. Dados da Empresa */}
              <section className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="text-base font-semibold text-foreground">Dados da Empresa</h2>
                  <p className="text-muted-foreground text-xs mt-1">Informações institucionais públicas da organização.</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Nome da empresa</label>
                    <input
                      value={empresaForm.name}
                      onChange={e => setEmpresaForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Ex: INCI Brasil"
                      className="h-10 px-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">CNPJ</label>
                    <input
                      value={empresaForm.cnpj}
                      onChange={e => setEmpresaForm(p => ({ ...p, cnpj: e.target.value }))}
                      placeholder="00.000.000/0001-00"
                      className="h-10 px-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Site institucional</label>
                    <input
                      value={empresaForm.website}
                      onChange={e => setEmpresaForm(p => ({ ...p, website: e.target.value }))}
                      placeholder="https://suaempresa.com.br"
                      type="url"
                      className="h-10 px-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">LinkedIn da empresa</label>
                    <input
                      value={empresaForm.linkedin_url}
                      onChange={e => setEmpresaForm(p => ({ ...p, linkedin_url: e.target.value }))}
                      placeholder="https://linkedin.com/company/..."
                      type="url"
                      className="h-10 px-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2 pt-2 border-t border-border">
                    <p className="text-sm font-semibold text-foreground">Segmento / Área de atuação</p>
                    <div className="flex flex-wrap gap-2">
                      {SEGMENTS.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setEmpresaForm(p => ({ ...p, segment: p.segment === s ? '' : s }))}
                          className={cn(
                            'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200',
                            empresaForm.segment === s
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background text-foreground border-border hover:border-primary/50'
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <input
                      value={SEGMENTS.includes(empresaForm.segment) ? '' : empresaForm.segment}
                      onChange={e => setEmpresaForm(p => ({ ...p, segment: e.target.value }))}
                      onFocus={() => {
                        if (SEGMENTS.includes(empresaForm.segment)) {
                          setEmpresaForm(p => ({ ...p, segment: '' }));
                        }
                      }}
                      placeholder="Outro segmento..."
                      className={cn(
                        'h-8 px-3 rounded-xl text-xs font-semibold border transition-all duration-200 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-36',
                        !SEGMENTS.includes(empresaForm.segment) && empresaForm.segment
                          ? 'border-primary text-primary'
                          : 'border-border'
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2 pt-2 border-t border-border">
                    <p className="text-sm font-semibold text-foreground">Quantidade de colaboradores</p>
                    <div className="flex flex-wrap gap-2">
                      {HEADCOUNT_OPTIONS.map(h => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setEmpresaForm(p => ({ ...p, headcount: p.headcount === h ? '' : h }))}
                          className={cn(
                            'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200',
                            empresaForm.headcount === h
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background text-foreground border-border hover:border-primary/50'
                          )}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2 pt-2 border-t border-border">
                    <p className="text-sm font-semibold text-foreground">Tipo de empresa</p>
                    <div className="flex flex-wrap gap-2">
                      {COMPANY_TYPES.map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setEmpresaForm(p => ({ ...p, company_type: p.company_type === type ? '' : type }))}
                          className={cn(
                            'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200',
                            empresaForm.company_type === type
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background text-foreground border-border hover:border-primary/50'
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <input
                      value={COMPANY_TYPES.includes(empresaForm.company_type) ? '' : empresaForm.company_type}
                      onChange={e => setEmpresaForm(p => ({ ...p, company_type: e.target.value }))}
                      onFocus={() => {
                        if (COMPANY_TYPES.includes(empresaForm.company_type)) {
                          setEmpresaForm(p => ({ ...p, company_type: '' }));
                        }
                      }}
                      placeholder="Outro tipo..."
                      className={cn(
                        'h-8 px-3 rounded-xl text-xs font-semibold border transition-all duration-200 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-40',
                        !COMPANY_TYPES.includes(empresaForm.company_type) && empresaForm.company_type
                          ? 'border-primary text-primary'
                          : 'border-border'
                      )}
                    />
                  </div>
                </div>
              </section>

              {/* 2. Localização */}
              <section className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="text-base font-semibold text-foreground">Localização</h2>
                  <p className="text-muted-foreground text-xs mt-1">Endereço e modelo de trabalho praticado.</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">CEP</label>
                    <div className="relative">
                      <input
                        value={empresaForm.cep}
                        onChange={e => setEmpresaForm(p => ({ ...p, cep: e.target.value }))}
                        onBlur={handleCepBlur}
                        placeholder="00000-000"
                        maxLength={9}
                        className="h-10 w-full px-3 pr-9 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                      />
                      {isCepLoading && (
                        <Icon icon="material-symbols:sync" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" width="16" height="16" />
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">Ao sair do campo, endereço é preenchido automaticamente.</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Estado</label>
                    <input
                      value={empresaForm.state_code}
                      onChange={e => setEmpresaForm(p => ({ ...p, state_code: e.target.value }))}
                      placeholder="SP"
                      maxLength={2}
                      className="h-10 px-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Cidade</label>
                    <input
                      value={empresaForm.city}
                      onChange={e => setEmpresaForm(p => ({ ...p, city: e.target.value }))}
                      placeholder="São Paulo"
                      className="h-10 px-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-3">
                    <label className="text-xs font-semibold text-foreground">Endereço</label>
                    <input
                      value={empresaForm.address}
                      onChange={e => setEmpresaForm(p => ({ ...p, address: e.target.value }))}
                      placeholder="Rua, número, bairro"
                      className="h-10 px-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-3">
                    <label className="text-xs font-semibold text-foreground">Modelo de atuação</label>
                    <div className="flex flex-wrap gap-2">
                      {(['presencial', 'hibrido', 'remoto', 'outro'] as const).map(model => (
                        <button
                          key={model}
                          type="button"
                          onClick={() => setEmpresaForm(p => ({ ...p, work_model: model }))}
                          className={cn(
                            'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 capitalize',
                            empresaForm.work_model === model
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background text-foreground border-border hover:border-primary/50'
                          )}
                        >
                          {model === 'hibrido' ? 'Híbrido' : model.charAt(0).toUpperCase() + model.slice(1)}
                        </button>
                      ))}
                    </div>
                    {empresaForm.work_model === 'outro' && (
                      <input
                        value={empresaForm.work_model_custom}
                        onChange={e => setEmpresaForm(p => ({ ...p, work_model_custom: e.target.value }))}
                        placeholder="Descreva o modelo da empresa..."
                        className="h-10 px-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                      />
                    )}
                  </div>
                </div>
              </section>

              {/* 3. Cargos Internos */}
              <section className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="text-base font-semibold text-foreground">Cargos Internos</h2>
                  <p className="text-muted-foreground text-xs mt-1">Tipos de cargos que compõem o time de RH e recrutamento.</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-2 min-h-[2rem]">
                    {empresaInternalRoles.map(role => (
                      <span key={role} className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-xl text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        {role}
                        <button
                          type="button"
                          onClick={() => setEmpresaInternalRoles(p => p.filter(r => r !== role))}
                          className="size-4 rounded-full hover:bg-primary/20 transition-all flex items-center justify-center"
                        >
                          <Icon icon="material-symbols:close" width="10" height="10" />
                        </button>
                      </span>
                    ))}
                    {empresaInternalRoles.length === 0 && (
                      <span className="text-xs text-muted-foreground italic">Nenhum cargo interno cadastrado.</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newInternalRole}
                      onChange={e => setNewInternalRole(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newInternalRole.trim() && !empresaInternalRoles.includes(newInternalRole.trim())) {
                          setEmpresaInternalRoles(p => [...p, newInternalRole.trim()]);
                          setNewInternalRole('');
                        }
                      }}
                      placeholder="Ex: Diretor de RH, Entrevistador..."
                      className="flex-1 h-10 px-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newInternalRole.trim() && !empresaInternalRoles.includes(newInternalRole.trim())) {
                          setEmpresaInternalRoles(p => [...p, newInternalRole.trim()]);
                          setNewInternalRole('');
                        }
                      }}
                      className="h-10 px-4 rounded-xl bg-background border border-border text-xs font-semibold hover:bg-accent transition-all duration-200 flex items-center gap-1.5"
                    >
                      <Icon icon="material-symbols:add" width="16" height="16" />
                      Adicionar
                    </button>
                  </div>
                </div>
              </section>

              {/* 4. Banco de Talentos */}
              <section className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="text-base font-semibold text-foreground">Banco de Talentos</h2>
                  <p className="text-muted-foreground text-xs mt-1">Configure como o banco de candidatos espontâneos é gerenciado.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-foreground">Quem pode acessar o banco</label>
                    <div className="flex flex-wrap gap-3">
                      {(['admin', 'recruiter', 'manager'] as const).map(role => (
                        <label key={role} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={empresaTalentPool.who_can_access.includes(role)}
                            onChange={e => setEmpresaTalentPool(prev => ({
                              ...prev,
                              who_can_access: e.target.checked
                                ? [...prev.who_can_access, role]
                                : prev.who_can_access.filter(r => r !== role)
                            }))}
                            className="size-4 rounded border-border accent-primary"
                          />
                          <span className="text-sm font-medium text-foreground capitalize">{ROLE_LABELS[role] ?? role}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-foreground">Retenção de candidatos (dias)</label>
                      <input
                        type="number"
                        min={30}
                        max={730}
                        value={empresaTalentPool.retention_days}
                        onChange={e => setEmpresaTalentPool(prev => ({ ...prev, retention_days: Number(e.target.value) }))}
                        className="h-10 px-3 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                      />
                      <p className="text-[10px] text-muted-foreground">Após esse prazo, o perfil é inativado automaticamente.</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-2xl">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Reaproveitamento de perfil</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Permite vincular candidatos do banco a novas vagas.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={empresaTalentPool.allow_reuse}
                          onChange={e => setEmpresaTalentPool(prev => ({ ...prev, allow_reuse: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* Botão Salvar */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveEmpresa}
                  disabled={isSavingCompany}
                  className="h-11 px-8 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                >
                  <Icon
                    icon={isSavingCompany ? 'material-symbols:sync' : 'material-symbols:cloud-done'}
                    className={cn('size-5', isSavingCompany && 'animate-spin')}
                  />
                  {isSavingCompany ? 'Salvando...' : 'Salvar dados da empresa'}
                </button>
              </div>

            </div>
          )}

          {/* Tab: Usuários */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Icon icon="material-symbols:search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground  text-[20px]" width="20" height="20" />
                      <input
                        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                        placeholder="Buscar por nome ou e-mail"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="w-full md:w-48">
                      <Select
                        value={filterRole}
                        onChange={setFilterRole}
                        placeholder="Todos os tipos"
                        options={[
                          { value: 'admin', label: 'Admin / Qualidade' },
                          { value: 'manager', label: 'Gestor' },
                        ]}
                        size="md"
                      />
                    </div>
                    <div className="w-full md:w-48">
                      <Select
                        value={filterStatus}
                        onChange={setFilterStatus}
                        placeholder="Status: Todos"
                        options={[
                          { value: 'active', label: 'Ativo' },
                          { value: 'suspended', label: 'Suspenso' },
                        ]}
                        size="md"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="h-11 px-5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0"
                  >
                    <Icon icon="material-symbols:person-add" className="text-[18px]" width="18" height="18" />
                    Adicionar usuário
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl overflow-hidden">
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
                      {users
                        .filter(u => {
                          const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            u.email.toLowerCase().includes(searchTerm.toLowerCase());
                          const matchesRole = filterRole ? u.role === filterRole : true;
                          const matchesStatus = filterStatus ? u.status === filterStatus : true;
                          return matchesSearch && matchesRole && matchesStatus;
                        })
                        .map((user) => (
                          <tr key={user.id} className="group hover:bg-muted/40 transition-all duration-200">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0 border border-primary/20">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex flex-col">
                                  <span
                                    className="font-semibold text-foreground cursor-pointer hover:underline"
                                    onClick={() => openQuickView('user', user)}
                                  >
                                    {user.name}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-muted-foreground font-medium">{user.email}</span>
                                    {user.company_name && (
                                      <>
                                        <span className="size-1 rounded-full bg-border" />
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{user.company_name}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-2xl text-xs font-semibold bg-muted text-foreground border border-border capitalize">
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
                                <button
                                  onClick={() => openQuickView('user', user)}
                                  className="p-1.5 text-muted-foreground hover:text-primary transition-all duration-200"
                                  title="Visualização Rápida"
                                >
                                  <Icon icon="material-symbols:visibility" className="text-[18px]" width="18" height="18" />
                                </button>
                                <Link href={`/settings/users/${user.id}/edit`} className="p-1.5 text-muted-foreground hover:text-primary transition-all duration-200" title="Editar"><Icon icon="material-symbols:edit" className="text-[18px]" width="18" height="18" /></Link>
                                <button
                                  onClick={() => updateUser(user.id, { status: user.status === 'active' ? 'suspended' : 'active' })}
                                  className={`p-1.5 transition-all duration-200 ${user.status === 'active' ? 'text-muted-foreground hover:text-destructive' : 'text-muted-foreground hover:text-emerald-500'}`}
                                  title={user.status === 'active' ? 'Suspender' : 'Ativar'}
                                >
                                  <Icon 
                                    icon={user.status === 'active' ? 'material-symbols:block' : 'material-symbols:check-circle'} 
                                    className="text-[18px]" 
                                    width="18" 
                                    height="18" 
                                  />
                                </button>
                                <button
                                  onClick={() => setUserToDelete(user.id)}
                                  className="p-1.5 text-muted-foreground hover:text-destructive transition-all duration-200"
                                  title="Excluir"
                                >
                                  <Icon icon="material-symbols:delete" className="text-[18px]" width="18" height="18" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-border flex justify-between items-center bg-muted/20">
                  <span className="text-xs text-muted-foreground font-semibold italic">Mostrando {users.length} usuários registrados</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Privileges */}
          {activeTab === 'privileges' && (
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-4">Resumo por Perfil</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card p-5 rounded-2xl border border-border flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0 border border-primary/20">
                        <Icon icon="material-symbols:admin-panel-settings" className="" width="20" height="20" />
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
                  <div className="bg-card p-5 rounded-2xl border border-border  flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0 border border-primary/20">
                      <Icon icon="material-symbols:supervisor-account" className="" width="20" height="20" />
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

              <section className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="text-lg font-semibold text-foreground">Chaves de Permissão para Gestores</h2>
                  <p className="text-muted-foreground text-sm mt-1">Defina quais ações sensíveis os gestores podem executar autonomamente em seus processos.</p>
                </div>
                <div className="divide-y divide-border">
                  {([
                    { key: 'move_to_finalist',      label: 'Mover candidato para "Finalista"',   desc: 'Permite ao gestor avançar candidatos para a fase final sem validação prévia do RH.' },
                    { key: 'mark_not_selected',      label: 'Marcar candidato como "Não Selecionado"', desc: 'Permite ao gestor reprovar candidatos diretamente, sem passar pelo RH.' },
                    { key: 'return_candidate_stage', label: 'Retroceder etapa do candidato',      desc: 'Permite ao gestor mover um candidato de volta a uma etapa anterior no Kanban.' },
                    { key: 'close_job',              label: 'Encerrar vaga',                      desc: 'Permite ao gestor encerrar uma vaga aberta sem aprovação do administrador.' },
                    { key: 'view_salaries',          label: 'Visualizar faixas salariais',        desc: 'Permite ao gestor ver as faixas de salário mínimo e máximo das vagas.' },
                  ] as const).map(({ key, label, desc }) => (
                    <div key={key} className="px-6 py-4 flex items-center justify-between gap-4 transition-colors hover:bg-muted/30">
                      <div className="flex-1">
                        <h3 className="text-foreground font-semibold">{label}</h3>
                        <p className="text-xs text-muted-foreground font-medium">{desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          checked={currentSettings.manager_permissions[key]}
                          onChange={(e) => updateManagerPermission(key, e.target.checked)}
                          className="sr-only peer"
                          type="checkbox"
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Tab: Escopo do Gestor */}
          {activeTab === 'scope' && (
            <div className="space-y-6">
              {/* Seleção do Gestor */}
              <section className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="text-base font-semibold text-foreground">Seleção do Gestor</h2>
                  <p className="text-muted-foreground text-xs mt-1">Escolha o gestor para configurar escopo e permissões individuais.</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Selecionar gestor */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Gestor</label>
                    <Select
                      value={selectedManagerId || ''}
                      onChange={(val) => setSelectedManagerId(val || null)}
                      placeholder="Selecione..."
                      options={users
                        .filter(u => u.role === 'manager' || u.role === 'admin')
                        .map(u => ({ value: u.id, label: u.name }))}
                      size="md"
                    />
                  </div>

                  {/* Cargo / função */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Cargo / Função</label>
                    <div className="h-10 px-3 bg-muted/30 border border-border rounded-lg flex items-center text-sm text-foreground">
                      {selectedManager
                        ? (selectedManager.role === 'admin' ? 'Administrador' : selectedManager.role === 'manager' ? 'Gestor Contratante' : selectedManager.role)
                        : <span className="text-muted-foreground text-xs">—</span>}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Status</label>
                    <div className="h-10 px-3 bg-muted/30 border border-border rounded-lg flex items-center gap-2">
                      {selectedManager ? (
                        <>
                          <span className={cn('size-2 rounded-full', selectedManager.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-destructive')} />
                          <span className="text-sm text-foreground">{selectedManager.status === 'active' ? 'Ativo' : 'Suspenso'}</span>
                        </>
                      ) : <span className="text-muted-foreground text-xs">—</span>}
                    </div>
                  </div>

                  {/* Empresa vinculada */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Empresa Vinculada</label>
                    <button
                      type="button"
                      onClick={() => { setCnpjInput(''); setCnpjResult(null); setCnpjError(''); setIsCnpjModalOpen(true); }}
                      disabled={!selectedManager}
                      className="h-10 px-3 bg-background border border-border rounded-lg text-sm text-left flex items-center gap-2 hover:bg-accent transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Icon icon="material-symbols:business-rounded" className="text-muted-foreground size-4 shrink-0" />
                      <span className={cn('truncate', selectedManager?.company_name ? 'text-foreground' : 'text-muted-foreground text-xs')}>
                        {selectedManager?.company_name || 'Buscar por CNPJ...'}
                      </span>
                    </button>
                  </div>
                </div>
              </section>

              {selectedManager && (
                <>
                  {/* Visibilidade de Vagas */}
                  <section className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-border">
                      <h2 className="text-base font-semibold text-foreground">Visibilidade de Vagas</h2>
                      <p className="text-muted-foreground text-xs mt-1">Defina quais vagas este gestor pode visualizar no sistema.</p>
                    </div>
                    <div className="p-6 space-y-3">
                      {([
                        { value: 'direct', label: 'Somente vagas onde ele é responsável direto', desc: 'Vê apenas as vagas em que está designado como ponto focal.' },
                        { value: 'department', label: 'Vagas do departamento dele', desc: 'Vê todas as vagas da sua área, independente de atribuição.' },
                        { value: 'selected_departments', label: 'Vagas de departamentos selecionados', desc: 'Acesso customizado a departamentos específicos definidos abaixo.' },
                      ] as const).map(opt => {
                        const current = (pendingUserPermissions[selectedManagerId!]?.scope ?? selectedManager.scope)?.vacancy_view_type ?? 'direct';
                        const checked = current === opt.value;
                        return (
                          <label key={opt.value} className={cn(
                            'flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200',
                            checked ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/30'
                          )}>
                            <input
                              type="radio"
                              name="vacancy_scope"
                              checked={checked}
                              onChange={() => handleUpdateScope({ vacancy_view_type: opt.value })}
                              className="sr-only"
                            />
                            <div className={cn('size-4 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors', checked ? 'border-primary' : 'border-border')}>
                              <div className={cn('size-2 rounded-full bg-primary transition-transform', checked ? 'scale-100' : 'scale-0')} />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                              <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                            </div>
                          </label>
                        );
                      })}

                      {/* Departamentos selecionados */}
                      {((pendingUserPermissions[selectedManagerId!]?.scope ?? selectedManager.scope)?.vacancy_view_type === 'selected_departments') && (
                        <div className="mt-2 pl-8 space-y-3">
                          <div className="flex flex-wrap gap-2 p-3 min-h-12 bg-background border border-border rounded-lg">
                            {((pendingUserPermissions[selectedManagerId!]?.scope ?? selectedManager.scope)?.allowed_departments ?? []).length === 0 && (
                              <span className="text-xs text-muted-foreground italic flex items-center">Nenhum departamento selecionado</span>
                            )}
                            {((pendingUserPermissions[selectedManagerId!]?.scope ?? selectedManager.scope)?.allowed_departments ?? []).map(dept => (
                              <span key={dept} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                                {dept}
                                <button onClick={() => handleUpdateScope({ allowed_departments: ((pendingUserPermissions[selectedManagerId!]?.scope ?? selectedManager.scope)?.allowed_departments ?? []).filter(d => d !== dept) })}>
                                  <Icon icon="material-symbols:close-rounded" className="size-3.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <Select
                            value=""
                            onChange={(val) => {
                              if (!val) return;
                              const current = (pendingUserPermissions[selectedManagerId!]?.scope ?? selectedManager.scope)?.allowed_departments ?? [];
                              if (!current.includes(val)) handleUpdateScope({ allowed_departments: [...current, val] });
                            }}
                            placeholder="Adicionar departamento..."
                            options={departments
                              .filter(d => !((pendingUserPermissions[selectedManagerId!]?.scope ?? selectedManager.scope)?.allowed_departments ?? []).includes(d))
                              .map(d => ({ value: d, label: d }))}
                            size="md"
                          />
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Ações Habilitadas */}
                  <section className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-border">
                      <h2 className="text-base font-semibold text-foreground">Ações Habilitadas</h2>
                      <p className="text-muted-foreground text-xs mt-1">Controle quais ações este gestor pode realizar sobre candidatos e vagas.</p>
                    </div>
                    <div className="divide-y divide-border">
                      {([
                        { key: 'view_candidates',            label: 'Ver candidatos',                      desc: 'Visualizar lista de candidatos nas vagas acessíveis.', disabled: false },
                        { key: 'view_resume',                label: 'Ver currículo',                       desc: 'Acessar o currículo completo dos candidatos.', disabled: false },
                        { key: 'view_contact',               label: 'Ver dados de contato',                desc: 'Visualizar telefone, e-mail e redes do candidato.', disabled: false },
                        { key: 'schedule_interview',         label: 'Agendar entrevista',                  desc: 'Criar e gerenciar agendamentos de entrevista.', disabled: false },
                        { key: 'register_feedback',          label: 'Registrar feedback',                  desc: 'Inserir notas e avaliações sobre candidatos.', disabled: false },
                        { key: 'move_candidate_stage',       label: 'Mover candidato de etapa',            desc: 'Arrastar candidatos entre colunas do Kanban.', disabled: false },
                        { key: 'reject_candidate',           label: 'Reprovar candidato',                  desc: 'Marcar candidato como não selecionado.', disabled: false },
                        { key: 'mark_finalist',              label: 'Marcar como finalista',               desc: 'Avançar candidato para a fase final do processo.', disabled: false },
                        { key: 'request_behavioral_test',    label: 'Solicitar teste comportamental',      desc: 'Enviar convite para o candidato realizar o teste DISC.', disabled: false },
                        { key: 'view_behavioral_test_result',label: 'Ver resultado de teste comportamental', desc: 'Acessar relatório DISC do candidato. (Módulo em desenvolvimento)', disabled: true },
                        { key: 'export_candidate_data',      label: 'Exportar dados do candidato',        desc: 'Baixar informações do candidato em arquivo.', disabled: false },
                        { key: 'archive_job',                label: 'Arquivar e Encerrar vaga',            desc: 'Arquivar ou encerrar uma vaga ativa.', disabled: false },
                      ] as const).map(({ key, label, desc, disabled }) => {
                        const perms = pendingUserPermissions[selectedManagerId!]?.custom_permissions ?? selectedManager.custom_permissions ?? {};
                        const isChecked = perms[key] ?? false;
                        return (
                          <div key={key} className={cn('px-6 py-4 flex items-center justify-between gap-4 transition-colors', disabled ? 'opacity-50' : 'hover:bg-muted/30')}>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold text-foreground">{label}</h3>
                                {disabled && (
                                  <span className="text-[10px] font-semibold bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded">Em breve</span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                            </div>
                            <label className={cn('relative inline-flex items-center', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={disabled}
                                onChange={(e) => handleUpdateUserPermission(key as keyof NonNullable<User['custom_permissions']>, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-muted border border-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:border-primary transition-all duration-200" />
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </>
              )}

              {!selectedManager && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                  <Icon icon="material-symbols:person-search-rounded" className="size-12 opacity-20" />
                  <p className="text-sm font-semibold">Selecione um gestor para configurar o escopo</p>
                </div>
              )}
            </div>
          )}

          {/* Modal CNPJ */}
          {isCnpjModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setIsCnpjModalOpen(false)}>
              <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 space-y-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">Buscar Empresa por CNPJ</h3>
                  <button onClick={() => setIsCnpjModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <Icon icon="material-symbols:close-rounded" className="size-5" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cnpjInput}
                    onChange={(e) => setCnpjInput(e.target.value.replace(/\D/g, '').slice(0, 14))}
                    onKeyDown={(e) => e.key === 'Enter' && handleCnpjSearch()}
                    placeholder="00.000.000/0000-00"
                    className="flex-1 h-10 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={handleCnpjSearch}
                    disabled={cnpjLoading}
                    className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Icon icon={cnpjLoading ? 'material-symbols:sync' : 'material-symbols:search'} className={cn('size-4', cnpjLoading && 'animate-spin')} />
                    {cnpjLoading ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>
                {cnpjError && <p className="text-xs text-destructive">{cnpjError}</p>}
                {cnpjResult && (
                  <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-2">
                    <p className="text-sm font-semibold text-foreground">{cnpjResult.razao_social}</p>
                    {cnpjResult.nome_fantasia && <p className="text-xs text-muted-foreground">{cnpjResult.nome_fantasia}</p>}
                    <p className="text-xs text-muted-foreground">{cnpjResult.cnpj}</p>
                    {cnpjResult.municipio && <p className="text-xs text-muted-foreground">{cnpjResult.logradouro} — {cnpjResult.municipio}/{cnpjResult.uf}</p>}
                    <button
                      onClick={() => {
                        if (selectedManagerId) {
                          setPendingUserPermissions(prev => ({
                            ...prev,
                            [selectedManagerId]: { ...(prev[selectedManagerId] ?? {}), company_name: cnpjResult?.razao_social }
                          }));
                        }
                        setIsCnpjModalOpen(false);
                      }}
                      className="mt-2 w-full h-9 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
                    >
                      Vincular esta empresa
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Auditoria de Configurações */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              {/* Permissões por Tipo de Acesso */}
              <section className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="text-base font-semibold text-foreground">Permissões por Tipo de Acesso</h2>
                  <p className="text-muted-foreground text-xs mt-1">Configure o que cada perfil pode fazer dentro do sistema.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted border-b border-border">
                        <th className="px-6 py-3 text-xs font-semibold text-muted-foreground w-44">Perfil</th>
                        {(Object.keys(PERMISSION_LABELS) as RolePermissionKey[]).map(key => (
                          <th key={key} className="px-4 py-3 text-xs font-semibold text-muted-foreground text-center whitespace-nowrap">
                            {PERMISSION_LABELS[key]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(Object.keys(ROLE_LABELS) as string[]).map(roleKey => {
                        const isAdmin = roleKey === 'admin';
                        const rowPerms = empresaRolePerms[roleKey] ?? DEFAULT_ROLE_PERMISSIONS[roleKey];
                        return (
                          <tr key={roleKey} className={cn('transition-colors', isAdmin ? 'bg-muted/20' : 'hover:bg-muted/30')}>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-semibold text-foreground">{ROLE_LABELS[roleKey]}</span>
                                {isAdmin && <span className="text-[10px] text-muted-foreground">Acesso total — não editável</span>}
                              </div>
                            </td>
                            {(Object.keys(PERMISSION_LABELS) as RolePermissionKey[]).map(permKey => {
                              const checked = isAdmin ? true : (rowPerms?.[permKey] ?? false);
                              return (
                                <td key={permKey} className="px-4 py-4 text-center">
                                  <button
                                    type="button"
                                    disabled={isAdmin}
                                    onClick={() => {
                                      if (isAdmin) return;
                                      setEmpresaRolePerms(prev => ({
                                        ...prev,
                                        [roleKey]: { ...DEFAULT_ROLE_PERMISSIONS[roleKey], ...(prev[roleKey] ?? {}), [permKey]: !checked }
                                      }));
                                    }}
                                    className={cn(
                                      'relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
                                      checked ? 'bg-primary' : 'bg-muted border border-border',
                                      isAdmin && 'opacity-40 cursor-not-allowed'
                                    )}
                                    role="switch"
                                    aria-checked={checked}
                                  >
                                    <span className={cn('inline-block size-4 rounded-full bg-white transition-transform duration-200', checked ? 'translate-x-6' : 'translate-x-1')} />
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Filtros de Auditoria */}
              <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Icon icon="material-symbols:filter-list-rounded" className="text-primary size-5" />
                  <h2 className="text-base font-semibold text-foreground">Filtros de Auditoria</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Início</label>
                    <input type="date" value={auditStartDate} onChange={e => setAuditStartDate(e.target.value)}
                      className="h-10 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Fim</label>
                    <input type="date" value={auditEndDate} onChange={e => setAuditEndDate(e.target.value)}
                      className="h-10 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Autor</label>
                    <input type="text" value={auditAuthor} onChange={e => setAuditAuthor(e.target.value)} placeholder="Nome ou e-mail"
                      className="h-10 px-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Categoria</label>
                    <Select
                      value={auditCategory}
                      onChange={setAuditCategory}
                      placeholder="Todas"
                      options={[
                        { value: '', label: 'Todas' },
                        { value: 'privileges', label: 'Privilégios' },
                        { value: 'scope', label: 'Escopo' },
                        { value: 'user_management', label: 'Usuários' },
                        { value: 'candidate_movement', label: 'Candidatos' },
                        { value: 'job_management', label: 'Vagas' },
                        { value: 'system', label: 'Sistema' },
                      ]}
                      size="md"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Alvo</label>
                    <input type="text" value={auditTarget} onChange={e => setAuditTarget(e.target.value)} placeholder="Usuário afetado"
                      className="h-10 px-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => { setAuditAuthor(''); setAuditCategory(''); setAuditTarget(''); setAuditStartDate(''); setAuditEndDate(''); }}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <Icon icon="material-symbols:restart-alt-rounded" className="size-4" />
                    Limpar filtros
                  </button>
                </div>
              </section>

              {/* Log de Auditoria */}
              <section className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted border-b border-border">
                        <th className="px-6 py-3 text-xs font-semibold text-muted-foreground w-48">Autor / Data</th>
                        <th className="px-6 py-3 text-xs font-semibold text-muted-foreground w-32">Categoria</th>
                        <th className="px-6 py-3 text-xs font-semibold text-muted-foreground">Ocorrência</th>
                        <th className="px-6 py-3 text-xs font-semibold text-muted-foreground w-40">Destino</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {filteredLogs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3 text-muted-foreground opacity-30">
                              <Icon icon="material-symbols:database-off-outline-rounded" className="size-12" />
                              <span className="text-sm font-semibold">Nenhum registro encontrado</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredLogs.map(log => (
                          <tr key={log.id} className="hover:bg-muted/30 transition-colors duration-200">
                            <td className="px-6 py-4 align-top">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold border border-primary/20">
                                    {log.user_name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <span className="text-foreground font-semibold text-xs">{log.user_name}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                  <Icon icon="material-symbols:schedule-rounded" className="size-3" />
                                  {new Date(log.timestamp).toLocaleString('pt-BR')}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 align-top">
                              <span className={cn(
                                'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border',
                                log.category === 'privileges' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' :
                                log.category === 'scope' ? 'bg-primary/10 text-primary border-primary/20' :
                                log.category === 'user_management' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                log.category === 'candidate_movement' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                                log.category === 'job_management' ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20' :
                                'bg-muted text-muted-foreground border-border'
                              )}>
                                {log.category === 'privileges' ? 'Privilégios' :
                                 log.category === 'scope' ? 'Escopo' :
                                 log.category === 'user_management' ? 'Usuários' :
                                 log.category === 'candidate_movement' ? 'Candidatos' :
                                 log.category === 'job_management' ? 'Vagas' : 'Sistema'}
                              </span>
                            </td>
                            <td className="px-6 py-4 align-top">
                              <p className="text-foreground font-semibold text-xs">{log.action}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>
                            </td>
                            <td className="px-6 py-4 align-top">
                              {log.affected_user_name ? (
                                <div className="flex items-center gap-1.5">
                                  <div className="size-5 rounded-full bg-muted border border-border flex items-center justify-center text-[9px] font-semibold text-muted-foreground">
                                    {log.affected_user_name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <span className="text-xs font-semibold text-foreground/80">{log.affected_user_name}</span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-muted-foreground">N/A</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 border-t border-border flex justify-between items-center bg-muted/20">
                  <span className="text-xs text-muted-foreground">{filteredLogs.length} evento{filteredLogs.length !== 1 ? 's' : ''} registrado{filteredLogs.length !== 1 ? 's' : ''}</span>
                </div>
              </section>
            </div>
          )}

          {/* Tab: System */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <section className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Gerenciamento de Dados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/20 border border-border rounded-2xl">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Exportar Backup</h3>
                    <p className="text-xs text-muted-foreground mb-4">Gere um arquivo JSON com todos os dados do sistema para backup local.</p>
                    <button
                      onClick={handleExport}
                      className="px-4 py-2 bg-background border border-border rounded-2xl text-xs font-semibold hover:bg-accent transition-all"
                    >
                      Fazer Exportação
                    </button>
                  </div>
                  <div className="p-4 bg-muted/20 border border-border rounded-2xl">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Importar Dados</h3>
                    <p className="text-xs text-muted-foreground mb-4">Restaurar sistema a partir de um arquivo de backup (.json).</p>
                    <button
                      onClick={handleImportClick}
                      className="px-4 py-2 bg-background border border-border rounded-2xl text-xs font-semibold hover:bg-accent transition-all"
                    >
                      Importar Arquivo
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".json"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

      </div>

      {/* Modals */}
      <UserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={(msg) => setToast({ message: msg, type: 'success' })}
      />

      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={async () => {
          if (!userToDelete) return;
          const deletedUser = users.find(u => u.id === userToDelete);
          await deleteUser(userToDelete);
          await addLog({
            action: 'Exclusão de Usuário',
            details: `Usuário removido: ${deletedUser?.name || userToDelete} (${deletedUser?.email || ''})`,
            category: 'user_management',
            user_name: currentUser?.name || 'Admin'
          });
          setToast({ message: 'Usuário removido com sucesso.', type: 'success' });
        }}
        title="Confirmar Exclusão"
        message="Esta ação é permanente e removerá todos os registros associados a este usuário."
        confirmLabel="Excluir Usuário"
        type="danger"
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

export default SettingsPage;
