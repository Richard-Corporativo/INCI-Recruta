'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useToast } from '@src/components/ui/Toast';
import { getAllRolesCrossTenant, RoleWithCompany } from '@src/services/super-admin.service';

const PAGE_SIZE = 50;

export default function SuperAdminRoles() {
    const { error: toastError } = useToast();
    const [roles, setRoles] = useState<RoleWithCompany[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const load = useCallback(async (p: number) => {
        setIsLoading(true);
        try {
            const result = await getAllRolesCrossTenant({ page: p, pageSize: PAGE_SIZE });
            setRoles(result.data);
            setTotal(result.total);
        } catch {
            toastError('Erro ao carregar cargos.');
        } finally {
            setIsLoading(false);
        }
    }, [toastError]);

    useEffect(() => { load(page); }, [load, page]);

    const filtered = roles.filter(r => {
        const matchSearch = !search ||
            r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.code.toLowerCase().includes(search.toLowerCase()) ||
            (r.department || '').toLowerCase().includes(search.toLowerCase()) ||
            r.company_name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && r.status === 'Ativo') ||
            (statusFilter === 'inactive' && r.status === 'Inativo');
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Biblioteca de Cargos</h1>
                <p className="text-sm text-muted-foreground mt-1">Todos os cargos cadastrados em todas as empresas.</p>
            </div>

            <div className="flex gap-3 flex-wrap items-center">
                <div className="relative flex-1 min-w-[280px]">
                    <Icon icon="material-symbols:search-rounded" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                    <input
                        type="text"
                        placeholder="Buscar por cargo, código, departamento ou empresa..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full h-9 pl-9 pr-4 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
                    />
                </div>
                <div className="flex gap-1">
                    {[{ val: 'all', label: 'Todos' }, { val: 'active', label: 'Ativos' }, { val: 'inactive', label: 'Inativos' }].map(s => (
                        <button key={s.val} onClick={() => setStatusFilter(s.val)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${
                                statusFilter === s.val ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                            }`}>{s.label}</button>
                    ))}
                </div>
                <button onClick={() => load(page)} className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors duration-200">
                    <Icon icon="material-symbols:refresh-rounded" className="size-4" />
                    Atualizar
                </button>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {isLoading ? (
                    <div className="divide-y divide-border">
                        {[...Array(6)].map((_, i) => <div key={i} className="p-5 h-16 animate-pulse bg-muted/20" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <Icon icon="material-symbols:work-outline" className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Nenhum cargo encontrado.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-accent/30">
                                    <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cargo</th>
                                    <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden md:table-cell">Empresa</th>
                                    <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden lg:table-cell">Departamento/Setor</th>
                                    <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                                    <th className="text-center px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden lg:table-cell">Vagas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filtered.map(role => (
                                    <tr key={role.id} className="hover:bg-accent/20 transition-colors duration-150">
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-foreground text-sm">{role.title}</p>
                                            <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{role.code}</p>
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <span className="text-xs font-semibold text-foreground px-2 py-0.5 rounded-md bg-muted border border-border/50">{role.company_name}</span>
                                        </td>
                                        <td className="px-5 py-4 hidden lg:table-cell text-xs text-muted-foreground font-medium">
                                            {role.department || role.area || <span className="text-muted-foreground/40">—</span>}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1 h-5 px-2 rounded text-[10px] font-semibold border ${
                                                role.status === 'Ativo'
                                                    ? 'bg-success/10 text-success border-success/20'
                                                    : 'bg-muted text-muted-foreground border-border'
                                            }`}>
                                                <span className={`size-1.5 rounded-full ${role.status === 'Ativo' ? 'bg-success' : 'bg-muted-foreground'}`} />
                                                {role.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center hidden lg:table-cell text-sm font-semibold text-foreground">
                                            {role.open_positions ?? 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {!isLoading && (
                    <div className="px-5 py-3 border-t border-border bg-accent/20 flex items-center justify-between">
                        <p className="text-[10px] text-muted-foreground font-medium">
                            {filtered.length} cargo{filtered.length !== 1 ? 's' : ''} nesta página · {total} no total
                        </p>
                        {totalPages > 1 && (
                            <div className="flex gap-2 items-center">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-border text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    <Icon icon="material-symbols:chevron-left-rounded" className="size-3.5" />
                                    Anterior
                                </button>
                                <span className="flex items-center px-2 text-[10px] text-muted-foreground font-medium">{page}/{totalPages}</span>
                                <button
                                    disabled={page >= totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-border text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Próxima
                                    <Icon icon="material-symbols:chevron-right-rounded" className="size-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
