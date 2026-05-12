'use client';

// @component SettingsPrivilegesTab | @tipo page-component | @versao 1.0.0
// > Tab de privilégios nas configurações — permissões, roles, access control
// @api SettingsPrivilegesTabProps — privileges, onChange

import React from 'react';
import { Icon } from '@iconify/react';
import type { SettingsPrivilegesTabProps } from './types';

export default function SettingsPrivilegesTab({
    currentSettings,
    updateManagerPermission
}: SettingsPrivilegesTabProps) {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Profile Overview */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <Icon icon="material-symbols:shield-person-rounded" className="text-secondary size-6" />
                    <h2 className="text-xl font-black tracking-tight text-foreground uppercase tracking-widest">Níveis de Autoridade</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card border-2 border-border p-8 rounded-3xl flex items-start gap-5 hover:border-secondary/30 transition-all group">
                        <div className="size-14 bg-secondary/10 rounded-2xl text-secondary shrink-0 flex items-center justify-center border-2 border-secondary/20 group-hover:scale-110 transition-transform">
                            <Icon icon="material-symbols:admin-panel-settings-rounded" className="size-7" />
                        </div>
                        <div>
                            <h3 className="text-foreground font-black text-xs uppercase tracking-widest mb-2">Comando Administrativo</h3>
                            <p className="text-muted-foreground text-xs leading-relaxed mb-4 font-semibold">
                                Controle total sobre o ecossistema. Permite auditoria completa, gestão de operadores e modificação de parâmetros estruturais.
                            </p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-secondary/10 text-secondary border-2 border-secondary/20 uppercase tracking-widest">
                                Acesso Irrestrito
                            </span>
                        </div>
                    </div>

                    <div className="bg-card border-2 border-border p-8 rounded-3xl flex items-start gap-5 hover:border-primary/30 transition-all group">
                        <div className="size-14 bg-primary/10 rounded-2xl text-primary shrink-0 flex items-center justify-center border-2 border-primary/20 group-hover:scale-110 transition-transform">
                            <Icon icon="material-symbols:account-tree-rounded" className="size-7" />
                        </div>
                        <div>
                            <h3 className="text-foreground font-black text-xs uppercase tracking-widest mb-2">Gestão Operacional</h3>
                            <p className="text-muted-foreground text-xs leading-relaxed mb-4 font-semibold">
                                Autoridade limitada ao escopo de departamento ou vaga. Requer validação do RH para ações que impactam o compliance do processo.
                            </p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-muted text-muted-foreground border-2 border-border uppercase tracking-widest">
                                Escopo Controlado
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Manager Switches */}
            <div className="bg-card border-2 border-border rounded-3xl overflow-hidden relative shadow-2xl shadow-primary/5">
                <div className="p-8 border-b-2 border-border bg-muted/30">
                    <h2 className="text-lg font-black text-foreground uppercase tracking-widest">Parâmetros de Autonomia</h2>
                    <p className="text-muted-foreground text-xs font-bold mt-1">Habilite ou restrinja ações críticas para perfis de Gestão Operacional.</p>
                </div>
                <div className="divide-y-2 divide-border">
                    <div className="p-8 flex items-center justify-between gap-6 transition-colors hover:bg-muted/30">
                        <div className="flex-1">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-1">Mover Candidato: "Finalista"</h3>
                            <p className="text-xs text-muted-foreground font-bold leading-relaxed max-w-xl">
                                Permite avançar talentos para a fase decisória sem aprovação prévia do setor de Qualidade/RH.
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-[10px] font-black text-secondary bg-secondary/10 w-fit px-3 py-1 rounded-full border-2 border-secondary/20 uppercase tracking-widest">
                                <Icon icon="material-symbols:analytics-rounded" className="size-4" /> Impacto Alto em KPIs
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer scale-110">
                            <input
                                checked={currentSettings.manager_permissions.move_to_finalist}
                                onChange={(e) => updateManagerPermission('move_to_finalist', e.target.checked)}
                                className="sr-only peer"
                                type="checkbox"
                            />
                            <div className="w-12 h-7 bg-muted border-2 border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary peer-checked:border-secondary"></div>
                        </label>
                    </div>

                    <div className="p-8 flex items-center justify-between gap-6 transition-colors hover:bg-muted/30">
                        <div className="flex-1">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-1">Retrocesso de Etapa</h3>
                            <p className="text-xs text-muted-foreground font-bold leading-relaxed max-w-xl">
                                Autoriza a reversão de status para fases anteriores. Limitado por cotas mensais para manter a integridade do pipeline.
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer scale-110">
                            <input
                                checked={currentSettings.manager_permissions.return_candidate_stage}
                                onChange={(e) => updateManagerPermission('return_candidate_stage', e.target.checked)}
                                className="sr-only peer"
                                type="checkbox"
                            />
                            <div className="w-12 h-7 bg-muted border-2 border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary peer-checked:border-secondary"></div>
                        </label>
                    </div>

                    <div className="p-8 flex items-center justify-between gap-6 transition-colors hover:bg-muted/30">
                        <div className="flex-1">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-1">Encerramento de Requisição</h3>
                            <p className="text-xs text-muted-foreground font-bold leading-relaxed max-w-xl">
                                Permite o arquivamento autônomo de vagas e candidatos remanescentes sem auditoria final.
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer scale-110">
                            <input
                                checked={currentSettings.manager_permissions.close_job}
                                onChange={(e) => updateManagerPermission('close_job', e.target.checked)}
                                className="sr-only peer"
                                type="checkbox"
                            />
                            <div className="w-12 h-7 bg-muted border-2 border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary peer-checked:border-secondary"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Matrix Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Icon icon="material-symbols:grid-view-rounded" className="text-primary size-6" />
                        <h2 className="text-xl font-black tracking-tight text-foreground uppercase tracking-widest">Matriz de Auditoria</h2>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full border-2 border-secondary/20 bg-secondary/10">
                            <div className="size-2 rounded-full bg-secondary" />
                            <span className="text-[9px] font-black text-secondary uppercase tracking-widest">Ativo Global</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full border-2 border-border bg-muted">
                            <div className="size-2 rounded-full bg-muted-foreground" />
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Restrito</span>
                        </div>
                    </div>
                </div>

                <div className="bg-card border-2 border-border rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b-2 border-border">
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-2/5">Operação / Funcionalidade</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Administrativo</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Gestor Operacional</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-border">
                                <tr className="hover:bg-muted/20 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center border-2 border-primary/20 text-primary group-hover:scale-110 transition-transform">
                                                <Icon icon="material-symbols:bolt-rounded" className="size-5" />
                                            </div>
                                            <span className="text-sm font-black text-foreground uppercase tracking-widest">Mover para Finalista</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black bg-secondary/10 text-secondary border-2 border-secondary/20 uppercase tracking-widest">
                                            <Icon icon="material-symbols:check-circle-rounded" className="size-4" /> Autorizado
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-colors ${currentSettings.manager_permissions.move_to_finalist ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-muted text-muted-foreground border-border'}`}>
                                            <Icon icon={currentSettings.manager_permissions.move_to_finalist ? 'material-symbols:check-circle-rounded' : 'material-symbols:lock-rounded'} className="size-4" />
                                            {currentSettings.manager_permissions.move_to_finalist ? 'Habilitado' : 'Bloqueado'}
                                        </div>
                                    </td>
                                </tr>

                                <tr className="hover:bg-muted/20 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center border-2 border-primary/20 text-primary group-hover:scale-110 transition-transform">
                                                <Icon icon="material-symbols:settings-backup-restore-rounded" className="size-5" />
                                            </div>
                                            <span className="text-sm font-black text-foreground uppercase tracking-widest">Retrocesso de Status</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black bg-secondary/10 text-secondary border-2 border-secondary/20 uppercase tracking-widest">
                                            <Icon icon="material-symbols:check-circle-rounded" className="size-4" /> Autorizado
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-colors ${currentSettings.manager_permissions.return_candidate_stage ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-muted text-muted-foreground border-border'}`}>
                                            <Icon icon={currentSettings.manager_permissions.return_candidate_stage ? 'material-symbols:check-circle-rounded' : 'material-symbols:lock-rounded'} className="size-4" />
                                            {currentSettings.manager_permissions.return_candidate_stage ? 'Até 3/Mês' : 'Bloqueado'}
                                        </div>
                                    </td>
                                </tr>

                                <tr className="hover:bg-muted/20 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center border-2 border-primary/20 text-primary group-hover:scale-110 transition-transform">
                                                <Icon icon="material-symbols:cancel-schedule-send-rounded" className="size-5" />
                                            </div>
                                            <span className="text-sm font-black text-foreground uppercase tracking-widest">Encerrar Requisição</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black bg-secondary/10 text-secondary border-2 border-secondary/20 uppercase tracking-widest">
                                            <Icon icon="material-symbols:check-circle-rounded" className="size-4" /> Autorizado
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-colors ${currentSettings.manager_permissions.close_job ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-muted text-muted-foreground border-border'}`}>
                                            <Icon icon={currentSettings.manager_permissions.close_job ? 'material-symbols:check-circle-rounded' : 'material-symbols:lock-rounded'} className="size-4" />
                                            {currentSettings.manager_permissions.close_job ? 'Habilitado' : 'Bloqueado'}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}
