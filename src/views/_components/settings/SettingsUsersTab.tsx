'use client';

// @component SettingsUsersTab | @tipo page-component | @versao 1.0.0
// > Tab de usuários nas configurações — lista, add, edit, delete
// @api SettingsUsersTabProps — users, onEdit, onDelete

import React from 'react';
import { Link } from '@src/lib/router-compat';
import { Icon } from '@iconify/react';
import type { SettingsUsersTabProps } from './types';

export default function SettingsUsersTab({
    users, searchTerm, setSearchTerm, filterRole, setFilterRole,
    filterStatus, setFilterStatus, updateUser, setIsInviteModalOpen,
    setUserToDelete, openQuickView,
}: SettingsUsersTabProps) {
    return (
        <div className="space-y-6">
            {/* Action Bar */}
            <div className="bg-card border-2 border-border rounded-2xl p-6">
                <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
                        <div className="relative flex-1 group">
                            <Icon icon="material-symbols:search-rounded" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-secondary size-5 transition-colors" />
                            <input
                                className="w-full h-12 pl-12 pr-4 bg-background border-2 border-border rounded-xl text-sm font-semibold text-foreground placeholder:text-muted-foreground/30 focus:border-secondary outline-none transition-all"
                                placeholder="Buscar por nome ou e-mail"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-56">
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="w-full h-12 px-4 bg-background border-2 border-border rounded-xl text-sm font-bold text-foreground focus:border-secondary outline-none transition-all cursor-pointer"
                            >
                                <option value="">Todos os tipos</option>
                                <option value="admin">Admin / Qualidade</option>
                                <option value="manager">Gestor</option>
                            </select>
                        </div>
                        <div className="w-full md:w-56">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full h-12 px-4 bg-background border-2 border-border rounded-xl text-sm font-bold text-foreground focus:border-secondary outline-none transition-all cursor-pointer"
                            >
                                <option value="">Status: Todos</option>
                                <option value="active">Ativo</option>
                                <option value="suspended">Suspenso</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="w-full xl:w-auto h-12 px-8 flex items-center justify-center gap-2.5 text-sm font-black text-white bg-primary rounded-xl hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                    >
                        <Icon icon="material-symbols:person-add-rounded" className="size-5" />
                        ADICIONAR USUÁRIO
                    </button>
                </div>
            </div>

            {/* Users List */}
            <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b-2 border-border">
                                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-1/3">Usuário</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tipo de Acesso</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Último Login</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Gestão</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-border/50 text-sm">
                            {users
                                .filter(u => {
                                    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        u.email.toLowerCase().includes(searchTerm.toLowerCase());
                                    const matchesRole = filterRole ? u.role === filterRole : true;
                                    const matchesStatus = filterStatus ? u.status === filterStatus : true;
                                    return matchesSearch && matchesRole && matchesStatus;
                                })
                                .map((user) => (
                                    <tr key={user.id} className="group hover:bg-muted/20 transition-all duration-200">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border-2 border-primary/20 transition-transform group-hover:rotate-6 group-hover:scale-110">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <button
                                                        className="font-bold text-foreground text-left hover:text-secondary transition-colors truncate max-w-[200px]"
                                                        onClick={() => openQuickView('user', user)}
                                                    >
                                                        {user.name}
                                                    </button>
                                                    <span className="text-[11px] text-muted-foreground/60 font-bold uppercase tracking-tight">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-muted/50 text-foreground border-2 border-border/50">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border-2 ${
                                                user.status === 'active' 
                                                    ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10' 
                                                    : 'bg-destructive/5 text-destructive border-destructive/50'
                                            }`}>
                                                <span className={`size-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-destructive'}`} />
                                                {user.status === 'active' ? 'Ativo' : 'Suspenso'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/70">
                                                <Icon icon="material-symbols:schedule-rounded" className="size-3.5" />
                                                {user.lastAccess}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button 
                                                    onClick={() => openQuickView('user', user)} 
                                                    className="size-9 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary/10 hover:text-secondary transition-all"
                                                    title="Visualizar"
                                                >
                                                    <Icon icon="material-symbols:visibility-outline-rounded" className="size-5" />
                                                </button>
                                                <Link 
                                                    to={`/settings/users/${user.id}/edit`} 
                                                    className="size-9 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                                                    title="Editar"
                                                >
                                                    <Icon icon="material-symbols:edit-document-outline-rounded" className="size-5" />
                                                </Link>
                                                <button
                                                    onClick={() => updateUser(user.id, { status: user.status === 'active' ? 'suspended' : 'active' })}
                                                    className={`size-9 flex items-center justify-center rounded-xl transition-all ${
                                                        user.status === 'active' 
                                                            ? 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive' 
                                                            : 'text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600'
                                                    }`}
                                                    title={user.status === 'active' ? 'Suspender' : 'Ativar'}
                                                >
                                                    <Icon icon={user.status === 'active' ? "material-symbols:block-rounded" : "material-symbols:check-circle-outline-rounded"} className="size-5" />
                                                </button>
                                                <button 
                                                    onClick={() => setUserToDelete(user.id)} 
                                                    className="size-9 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                                                    title="Excluir"
                                                >
                                                    <Icon icon="material-symbols:delete-outline-rounded" className="size-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t-2 border-border flex justify-between items-center bg-muted/5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                        Total de {users.length} operadores registrados
                    </span>
                </div>
            </div>
        </div>
    );
}
