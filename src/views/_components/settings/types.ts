'use client';

// @types Settings Component Types | @tipo types | @versao 1.0.0
// > Types para componentes de settings — props, interfaces

import { User, AuditLog, SystemSettings } from '@src/types';

/**
 * Props compartilhadas entre todas as tabs de Settings.
 * Evita prop drilling excessivo mantendo interface explícita.
 */

export interface SettingsUsersTabProps {
    users: User[];
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    filterRole: string;
    setFilterRole: (v: string) => void;
    filterStatus: string;
    setFilterStatus: (v: string) => void;
    updateUser: (id: string, data: Partial<User>) => void;
    setIsInviteModalOpen: (v: boolean) => void;
    setUserToDelete: (v: string | null) => void;
    openQuickView: (type: string, data: any) => void;
}

export interface SettingsPrivilegesTabProps {
    currentSettings: SystemSettings;
    updateManagerPermission: (key: keyof SystemSettings['manager_permissions'], value: boolean) => void;
}

export interface SettingsScopeTabProps {
    users: User[];
    selectedManagerId: string | null;
    setSelectedManagerId: (v: string | null) => void;
    selectedManager: User | undefined;
    departments: string[];
    roles: { id: string; code: string; title: string; department: string }[];
    currentSettings: SystemSettings;
    pendingUserPermissions: Record<string, Partial<User>>;
    handleUpdateScope: (updates: Partial<NonNullable<User['scope']>>) => void;
    handleUpdateUserPermission: (key: keyof NonNullable<User['custom_permissions']>, value: boolean) => void;
}

export interface SettingsAuditTabProps {
    logs: AuditLog[];
    filteredLogs: AuditLog[];
    auditStartDate: string;
    setAuditStartDate: (v: string) => void;
    auditEndDate: string;
    setAuditEndDate: (v: string) => void;
    auditAuthor: string;
    setAuditAuthor: (v: string) => void;
    auditCategory: string;
    setAuditCategory: (v: string) => void;
    auditTarget: string;
    setAuditTarget: (v: string) => void;
}

export interface SettingsSystemTabProps {
    handleExport: () => void;
    handleImportClick: () => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    setIsResetConfirmOpen: (v: boolean) => void;
}

export default function Dummy() { return null; }
