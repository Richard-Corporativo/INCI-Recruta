'use client';

// @component SettingsAuditTab | @tipo page-component | @versao 1.0.0
// > Tab de auditoria nas configurações — logs, retenção, export
// @api SettingsAuditTabProps — logs, retention, onExport

import React from 'react';
import { Icon } from '@iconify/react';
import type { SettingsAuditTabProps } from './types';
import { formatDateTime } from '@src/lib/formatters';

export default function SettingsAuditTab({
    logs, filteredLogs,
    auditStartDate, setAuditStartDate,
    auditEndDate, setAuditEndDate,
    auditAuthor, setAuditAuthor,
    auditCategory, setAuditCategory,
    auditTarget, setAuditTarget,
}: SettingsAuditTabProps) {
    return (
        <div className="space-y-6">
            {/* Search and Filters Integrated */}
            <div className="bg-card border-2 border-border rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-secondary" />


                <div className="flex items-center gap-2 mb-6">
                    <Icon icon="material-symbols:filter-list-rounded" className="text-secondary size-5" />
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">
                        Filtros de Auditoria
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Início</label>
                        <input

                            type="date"

                            value={auditStartDate}

                            onChange={(e) => setAuditStartDate(e.target.value)}
                            className="w-full h-11 px-4 bg-background border-2 border-border rounded-xl text-sm font-semibold text-foreground focus:border-secondary outline-none transition-all"

                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Fim</label>
                        <input

                            type="date"

                            value={auditEndDate}

                            onChange={(e) => setAuditEndDate(e.target.value)}
                            className="w-full h-11 px-4 bg-background border-2 border-border rounded-xl text-sm font-semibold text-foreground focus:border-secondary outline-none transition-all"

                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Autor</label>
                        <div className="relative">
                            <Icon icon="material-symbols:person-search-rounded" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 size-5" />
                            <input

                                value={auditAuthor}

                                onChange={(e) => setAuditAuthor(e.target.value)}
                                className="w-full h-11 pl-11 pr-4 bg-background border-2 border-border rounded-xl text-sm font-semibold text-foreground focus:border-secondary outline-none transition-all placeholder:text-muted-foreground/30"
                                placeholder="Nome ou e-mail"

                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Categoria</label>
                        <select

                            value={auditCategory}

                            onChange={(e) => setAuditCategory(e.target.value)}
                            className="w-full h-11 px-4 bg-background border-2 border-border rounded-xl text-sm font-semibold text-foreground focus:border-secondary outline-none transition-all cursor-pointer"
                        >
                            <option value="">Todas</option>
                            <option value="privileges">Privilégios</option>
                            <option value="scope">Escopo</option>
                            <option value="user_management">Usuários</option>
                            <option value="candidate_movement">Candidatos</option>
                            <option value="job_management">Vagas</option>
                            <option value="system">Sistema</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Alvo</label>
                        <input

                            value={auditTarget}

                            onChange={(e) => setAuditTarget(e.target.value)}
                            className="w-full h-11 px-4 bg-background border-2 border-border rounded-xl text-sm font-semibold text-foreground focus:border-secondary outline-none transition-all placeholder:text-muted-foreground/30"
                            placeholder="Usuário afetado"

                        />
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={() => { setAuditAuthor(''); setAuditCategory(''); setAuditTarget(''); setAuditStartDate(''); setAuditEndDate(''); }}
                        className="text-xs font-bold text-muted-foreground hover:text-secondary transition-colors flex items-center gap-2 group"
                    >
                        <Icon icon="material-symbols:restart-alt-rounded" className="size-4 transition-transform group-hover:rotate-180 duration-500" />
                        Limpar todos os filtros
                    </button>
                </div>
            </div>

            {/* Audit List */}
            <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b-2 border-border">
                                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-48">Autor / Data</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-32">Categoria</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ocorrência</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-40">Destino</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-border/50 text-sm">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                            <Icon icon="material-symbols:database-off-outline-rounded" className="size-12" />
                                            <span className="text-sm font-semibold">Nenhum registro encontrado</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map(log => (
                                    <tr key={log.id} className="group hover:bg-muted/20 transition-all duration-200">
                                        <td className="px-6 py-5 align-top">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold border-2 border-primary/20 transition-transform group-hover:scale-110">
                                                        {log.user_name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="text-foreground font-semibold tracking-tight">{log.user_name}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60">
                                                    <Icon icon="material-symbols:schedule-rounded" className="size-3.5" />
                                                    <span>{formatDateTime(log.timestamp)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border-2 ${
                                                log.category === 'privileges' ? 'bg-purple-500/5 text-purple-600 border-purple-500/10' :
                                                log.category === 'scope' ? 'bg-primary/5 text-primary border-primary/10' :
                                                log.category === 'user_management' ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10' :
                                                log.category === 'candidate_movement' ? 'bg-secondary/5 text-secondary border-secondary/10' :
                                                log.category === 'job_management' ? 'bg-cyan-500/5 text-cyan-600 border-cyan-500/10' :
                                                'bg-muted/10 text-muted-foreground border-border/50'
                                            }`}>
                                                {log.category === 'privileges' ? 'Privilégios' :
                                                log.category === 'scope' ? 'Escopo' :
                                                log.category === 'user_management' ? 'Usuários' :
                                                log.category === 'candidate_movement' ? 'Candidatos' :
                                                log.category === 'job_management' ? 'Vagas' :
                                                log.category || 'Sistema'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            <div className="space-y-1">
                                                <p className="text-foreground font-semibold leading-relaxed tracking-tight">
                                                    {log.action}
                                                </p>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    {log.details}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            {log.affected_user_name ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="size-6 rounded-full bg-muted border-2 border-border flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                                                        {log.affected_user_name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="text-xs font-semibold text-foreground/80">{log.affected_user_name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t-2 border-border flex justify-between items-center bg-muted/5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                        Total de {filteredLogs.length} eventos registrados
                    </span>
                </div>
            </div>
        </div>
    );
}
