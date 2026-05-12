'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useToast } from '@src/components/ui/Toast';
import { getAllAuditLogsCrossTenant, AuditLogWithCompany } from '@src/services/super-admin.service';

export default function SuperAdminAudit() {
    const { error: toastError } = useToast();
    const [logs, setLogs] = useState<AuditLogWithCompany[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState('all');

    const load = useCallback(async () => {
        setIsLoading(true);
        try {
            setLogs(await getAllAuditLogsCrossTenant());
        } catch {
            toastError('Erro ao carregar logs de auditoria.');
        } finally {
            setIsLoading(false);
        }
    }, [toastError]);

    useEffect(() => { load(); }, [load]);

    const filtered = logs.filter(log => {
        const matchSearch = !search ||
            log.user_name.toLowerCase().includes(search.toLowerCase()) ||
            log.details.toLowerCase().includes(search.toLowerCase()) ||
            log.company_name.toLowerCase().includes(search.toLowerCase()) ||
            (log.entity_type || '').toLowerCase().includes(search.toLowerCase());
        const matchAction = actionFilter === 'all' || log.action === actionFilter;
        return matchSearch && matchAction;
    });

    const uniqueActions = [...new Set(logs.map(l => l.action))].slice(0, 5);

    const handleExport = () => {
        const headers = ['Data', 'Hora', 'Empresa', 'Usuário', 'Ação', 'Detalhes', 'Recurso'];
        const csvContent = [
            headers.join(','),
            ...filtered.map(log => {
                const date = new Date(log.timestamp);
                return [
                    date.toLocaleDateString('pt-BR'),
                    date.toLocaleTimeString('pt-BR'),
                    `"${log.company_name}"`,
                    `"${log.user_name}"`,
                    `"${log.action}"`,
                    `"${log.details.replace(/"/g, '""')}"`,
                    `"${log.entity_type || ''}"`,
                ].join(',');
            }),
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `auditoria-global-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const actionBadge = (action: string) => {
        const map: Record<string, string> = {
            CREATE: 'bg-success/10 text-success border-success/20',
            DELETE: 'bg-destructive/10 text-destructive border-destructive/20',
            UPDATE: 'bg-primary/10 text-primary border-primary/20',
        };
        return map[action] ?? 'bg-muted text-muted-foreground border-border';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">Auditoria Global</h1>
                    <p className="text-sm text-muted-foreground mt-1">Histórico de ações de todas as empresas na plataforma.</p>
                </div>
                <button onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-accent transition-all duration-200">
                    <Icon icon="material-symbols:download-rounded" className="size-4" />
                    Exportar CSV
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap items-center">
                <div className="relative flex-1 min-w-[280px]">
                    <Icon icon="material-symbols:search-rounded" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                    <input
                        type="text"
                        placeholder="Buscar por empresa, usuário ou recurso..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full h-9 pl-9 pr-4 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
                    />
                </div>
                <div className="flex gap-1 flex-wrap">
                    <button onClick={() => setActionFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${actionFilter === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}>
                        Todas
                    </button>
                    {uniqueActions.map(a => (
                        <button key={a} onClick={() => setActionFilter(a)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${actionFilter === a ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}>
                            {a}
                        </button>
                    ))}
                </div>
                <button onClick={load} className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors duration-200">
                    <Icon icon="material-symbols:refresh-rounded" className="size-4" />
                    Atualizar
                </button>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-accent/30">
                                <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Carimbo</th>
                                <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden lg:table-cell">Empresa</th>
                                <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Usuário</th>
                                <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ação</th>
                                <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden md:table-cell">Descrição</th>
                                <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden xl:table-cell">Recurso</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                [...Array(6)].map((_, i) => (
                                    <tr key={i}><td colSpan={6} className="px-5 py-5"><div className="h-4 bg-muted animate-pulse rounded-xl" /></td></tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="px-5 py-16 text-center text-sm text-muted-foreground">Nenhum registro encontrado.</td></tr>
                            ) : filtered.map(log => (
                                <tr key={log.id} className="hover:bg-accent/20 transition-colors duration-150">
                                    <td className="px-5 py-4">
                                        <p className="text-sm font-semibold text-foreground">{new Date(log.timestamp).toLocaleDateString('pt-BR')}</p>
                                        <p className="text-[10px] text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </td>
                                    <td className="px-5 py-4 hidden lg:table-cell">
                                        <span className="text-xs font-semibold text-foreground px-2 py-0.5 rounded-md bg-muted border border-border/50">{log.company_name}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                                                {log.user_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                            </div>
                                            <p className="text-sm font-semibold text-foreground truncate">{log.user_name}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${actionBadge(log.action)}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 hidden md:table-cell">
                                        <p className="text-xs text-foreground/80 line-clamp-1 font-medium">{log.details}</p>
                                    </td>
                                    <td className="px-5 py-4 hidden xl:table-cell">
                                        <p className="text-xs font-bold text-foreground uppercase tracking-tight">{log.entity_type || 'Geral'}</p>
                                        {log.entity_id && <p className="text-[10px] text-muted-foreground">#{log.entity_id}</p>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!isLoading && (
                    <div className="px-5 py-3 border-t border-border bg-accent/20 flex justify-between items-center">
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Auditoria Global Ativa</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{filtered.length} registros exibidos</p>
                    </div>
                )}
            </div>
        </div>
    );
}
