'use client';

// @component SettingsScopeTab | @tipo page-component | @versao 1.0.0
// > Tab de escopo nas configurações — departamentos, unidades, áreas
// @api SettingsScopeTabProps — scopes, onChange

import React from 'react';
import { Icon } from '@iconify/react';
import type { SettingsScopeTabProps } from './types';

export default function SettingsScopeTab({
    users,
    selectedManagerId,
    setSelectedManagerId,
    selectedManager,
    departments,
    roles,
    handleUpdateScope,
    currentSettings,
    pendingUserPermissions,
    handleUpdateUserPermission
}: SettingsScopeTabProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Info Banner */}
            <div className="bg-primary/5 border-2 border-primary/20 rounded-3xl p-6 flex items-start gap-4">
                <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 border-2 border-primary/20">
                    <Icon icon="material-symbols:info-outline-rounded" className="size-6" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest">Protocolo de Delimitação</h3>
                    <p className="text-sm text-foreground/80 mt-1 font-bold leading-relaxed max-w-2xl">
                        Ajuste o perímetro operacional para cada operador. Estas definições controlam a visibilidade de dados sensíveis e o poder de decisão em cada etapa do funil.
                    </p>
                </div>
            </div>

            {/* Manager Selector */}
            <div className="bg-card border-2 border-border rounded-3xl p-8 shadow-2xl shadow-primary/5">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 mb-3">Operador em Configuração</label>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative flex-1 group">
                        <Icon icon="material-symbols:person-search-rounded" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-secondary size-6 transition-colors" />
                        <select
                            value={selectedManagerId || ''}
                            onChange={(e) => setSelectedManagerId(e.target.value)}
                            className="w-full h-14 pl-12 pr-12 bg-background border-2 border-border rounded-2xl text-sm text-foreground font-black uppercase tracking-widest focus:border-secondary outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="" disabled>Selecione um operador...</option>
                            {users.filter(u => u.role === 'manager' || u.role === 'admin').map(u => (
                                <option key={u.id} value={u.id}>{u.name} — {u.role.toUpperCase()}</option>
                            ))}
                        </select>
                        <Icon icon="material-symbols:unfold-more-rounded" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none size-6" />
                    </div>
                </div>

                {selectedManager && (
                    <div className="mt-8 flex items-center gap-5 p-6 border-2 border-border bg-muted/20 rounded-2xl animate-in zoom-in-95 duration-300">
                        <div className="size-16 rounded-2xl bg-secondary text-white flex items-center justify-center text-xl font-black border-2 border-secondary/20 shadow-lg shadow-secondary/10">
                            {selectedManager.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-foreground uppercase tracking-widest leading-none mb-2">{selectedManager.name}</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{selectedManager.role === 'admin' ? 'Administrador' : 'Gestor'}</span>
                                <div className="size-1 rounded-full bg-border" />
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{selectedManager.department || 'Acesso Geral'}</span>
                            </div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${selectedManager.status === 'active'
                            ? 'bg-secondary/10 text-secondary border-secondary/20'
                            : 'bg-primary/10 text-primary border-primary/20'
                            }`}>
                            {selectedManager.status === 'active' ? 'Status: Ativo' : 'Status: Suspenso'}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Scope */}
                <div className="lg:col-span-8 space-y-8">
                    <section className="bg-card border-2 border-border rounded-3xl p-8 relative">
                        <div className="flex items-center gap-3 mb-8">
                            <Icon icon="material-symbols:visibility-rounded" className="text-secondary size-6" />
                            <h2 className="text-xl font-black tracking-tight text-foreground uppercase tracking-widest">Perímetro de Visão</h2>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 mb-5">Nível de Acesso às Vagas</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${(!selectedManager?.scope?.vacancy_view_type || selectedManager?.scope?.vacancy_view_type === 'direct') ? 'border-secondary bg-secondary/5 ring-4 ring-secondary/5' : 'border-border bg-background hover:border-border/60 hover:bg-muted/20'}`}>
                                        <input
                                            checked={!selectedManager?.scope?.vacancy_view_type || selectedManager?.scope?.vacancy_view_type === 'direct'}
                                            onChange={() => handleUpdateScope({ vacancy_view_type: 'direct' })}
                                            className="sr-only peer"
                                            name="vacancy_scope"
                                            type="radio"
                                        />
                                        <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${(!selectedManager?.scope?.vacancy_view_type || selectedManager?.scope?.vacancy_view_type === 'direct') ? 'border-secondary' : 'border-border'}`}>
                                            <div className={`size-2.5 rounded-full bg-secondary transition-transform ${(!selectedManager?.scope?.vacancy_view_type || selectedManager?.scope?.vacancy_view_type === 'direct') ? 'scale-100' : 'scale-0'}`} />
                                        </div>
                                        <div>
                                            <span className="block text-sm font-black text-foreground uppercase tracking-widest mb-1">Responsabilidade Direta</span>
                                            <span className="block text-[11px] text-muted-foreground font-bold leading-relaxed">Visualiza apenas as vagas onde é o ponto focal designado.</span>
                                        </div>
                                    </label>

                                    <label className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedManager?.scope?.vacancy_view_type === 'department' ? 'border-secondary bg-secondary/5 ring-4 ring-secondary/5' : 'border-border bg-background hover:border-border/60 hover:bg-muted/20'}`}>
                                        <input
                                            checked={selectedManager?.scope?.vacancy_view_type === 'department'}
                                            onChange={() => handleUpdateScope({ vacancy_view_type: 'department' })}
                                            className="sr-only peer"
                                            name="vacancy_scope"
                                            type="radio"
                                        />
                                        <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${selectedManager?.scope?.vacancy_view_type === 'department' ? 'border-secondary' : 'border-border'}`}>
                                            <div className={`size-2.5 rounded-full bg-secondary transition-transform ${selectedManager?.scope?.vacancy_view_type === 'department' ? 'scale-100' : 'scale-0'}`} />
                                        </div>
                                        <div>
                                            <span className="block text-sm font-black text-foreground uppercase tracking-widest mb-1">Amplituda Departamental</span>
                                            <span className="block text-[11px] text-muted-foreground font-bold leading-relaxed">Pode auditar todas as vagas da área, independente da atribuição.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="h-px bg-border"></div>

                            <div>
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 mb-5">Unidades de Negócio Habilitadas</label>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2 p-3 min-h-[56px] bg-background border-2 border-border rounded-2xl">
                                        {(selectedManager?.scope?.allowed_departments || []).length === 0 && (
                                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center px-2 opacity-40 italic">Nenhuma área selecionada</span>
                                        )}
                                        {(selectedManager?.scope?.allowed_departments || []).map(dept => (
                                            <span key={dept} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/10 border-2 border-secondary/20 text-[10px] font-black text-secondary uppercase tracking-widest transition-all hover:scale-[1.02]">
                                                {dept} 
                                                <button 
                                                    onClick={() => handleUpdateScope({ allowed_departments: (selectedManager?.scope?.allowed_departments || []).filter(d => d !== dept) })} 
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    <Icon icon="material-symbols:close-rounded" className="size-4" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>

                                    <div className="relative group">
                                        <Icon icon="material-symbols:add-circle-outline-rounded" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary size-5 transition-colors" />
                                        <select
                                            value=""
                                            onChange={(e) => {
                                                if (!e.target.value) return;
                                                const current = selectedManager?.scope?.allowed_departments || [];
                                                if (!current.includes(e.target.value)) {
                                                    handleUpdateScope({ allowed_departments: [...current, e.target.value] });
                                                }
                                            }}
                                            className="w-full h-12 pl-12 pr-10 bg-background border-2 border-border rounded-xl text-xs text-foreground font-black uppercase tracking-widest focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Adicionar Área / Departamento/Setor...</option>
                                            {departments.filter(d => !(selectedManager?.scope?.allowed_departments || []).includes(d)).map(dept => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                        <Icon icon="material-symbols:expand-more-rounded" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none size-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-border"></div>

                            <div>
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 mb-5">
                                    Catálogo de Cargos Autorizados <span className="text-[9px] opacity-40 ml-1">(Opcional)</span>
                                </label>
                                <div className="bg-background border-2 border-border rounded-3xl p-6 space-y-4 max-h-[350px] overflow-y-auto kanban-scroll scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {roles.map(role => {
                                            const isChecked = (selectedManager?.scope?.allowed_role_codes || []).includes(role.code);
                                            return (
                                                <label key={role.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer group ${isChecked ? 'bg-primary/5 border-primary shadow-sm shadow-primary/5' : 'bg-muted/10 border-border hover:bg-muted/20'}`}>
                                                    <div className={`size-5 rounded-lg border-2 flex items-center justify-center transition-colors ${isChecked ? 'bg-primary border-primary' : 'border-border group-hover:border-primary/40'}`}>
                                                        {isChecked && <Icon icon="material-symbols:check-rounded" className="text-white size-4" />}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={(e) => {
                                                            const current = selectedManager?.scope?.allowed_role_codes || [];
                                                            const updated = e.target.checked
                                                                ? [...current, role.code]
                                                                : current.filter(c => c !== role.code);
                                                            handleUpdateScope({ allowed_role_codes: updated });
                                                        }}
                                                        className="sr-only"
                                                    />
                                                    <div className="flex flex-col flex-1">
                                                        <span className={`text-xs font-black uppercase tracking-widest leading-none mb-1.5 transition-colors ${isChecked ? 'text-primary' : 'text-foreground'}`}>{role.title}</span>
                                                        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.1em] opacity-60">{role.code} • {role.department}</span>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-4 font-bold uppercase tracking-widest opacity-40 text-center">A ausência de seleção implica em acesso total às funções da área.</p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-primary/5 border-2 border-primary/20 rounded-3xl p-8 flex gap-5 relative overflow-hidden">
                        <Icon icon="material-symbols:gpp-maybe-rounded" className="text-primary size-8 shrink-0" />
                        <div className="relative z-10">
                            <h4 className="text-sm font-black text-primary uppercase tracking-widest">Aviso de Compliance</h4>
                            <p className="text-sm text-foreground/80 mt-1 font-bold leading-relaxed">
                                A remoção de privilégios de um gestor em vagas ativas revogará imediatamente o acesso aos dados sensíveis dos candidatos. Históricos de auditoria serão preservados sob o ID do operador original.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Right Column: Custom Permissions */}
                <div className="lg:col-span-4">
                    <section className="bg-card border-2 border-border rounded-3xl p-8 sticky top-24 shadow-2xl shadow-primary/5">
                        <div className="flex items-center gap-3 mb-4">
                            <Icon icon="material-symbols:rule-rounded" className="text-secondary size-6" />
                            <h2 className="text-xl font-black tracking-tight text-foreground uppercase tracking-widest">Controle Fino</h2>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-bold leading-relaxed mb-10 opacity-70">Atribua exceções às regras globais para este operador específico.</p>
                        
                        <div className="space-y-8">
                            {[
                                { key: 'close_job', label: 'Encerrar Vagas', desc: 'Permissão para fechar requisições', icon: 'material-symbols:cancel-schedule-send-rounded' },
                                { key: 'approve_finalist', label: 'Mover Finalista', desc: 'Avançar talentos para fase final', icon: 'material-symbols:bolt-rounded' },
                                { key: 'register_feedback', label: 'Anotar Feedback', desc: 'Inserção de notas de avaliação', icon: 'material-symbols:rate-review-rounded' },
                                { key: 'return_candidate_stage', label: 'Retrocesso Etapa', desc: 'Voltar candidatos (Max 3/mês)', icon: 'material-symbols:settings-backup-restore-rounded' },
                                { key: 'view_salaries', label: 'Ver Orçamentos', desc: 'Visualização de faixas salariais', icon: 'material-symbols:monetization-on-rounded' },
                            ].map((perm, i) => {
                                const isCustom = pendingUserPermissions[selectedManagerId!]?.custom_permissions?.[perm.key] !== undefined;
                                const isChecked = isCustom
                                    ? !!pendingUserPermissions[selectedManagerId!]?.custom_permissions?.[perm.key]
                                    : !!selectedManager?.custom_permissions?.[perm.key] || (perm.key === 'register_feedback' ? true : currentSettings.manager_permissions[perm.key === 'approve_finalist' ? 'move_to_finalist' : perm.key]);

                                return (
                                    <div key={perm.key} className="space-y-4">
                                        <div className="flex items-center justify-between group">
                                            <div className="flex flex-col gap-1.5 flex-1 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-black text-foreground uppercase tracking-widest">{perm.label}</span>
                                                    {isCustom && (
                                                        <span className="text-[8px] font-black bg-primary/10 text-primary border-2 border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-widest">Manual</span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground font-bold opacity-60">{perm.desc}</span>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer scale-110">
                                                <input
                                                    checked={isChecked}
                                                    onChange={(e) => handleUpdateUserPermission(perm.key as keyof NonNullable<import('@src/types').User['custom_permissions']>, e.target.checked)}
                                                    className="sr-only peer"
                                                    type="checkbox"
                                                />
                                                <div className="w-11 h-6 bg-muted border-2 border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary peer-checked:border-secondary"></div>
                                            </label>
                                        </div>
                                        {i < 4 && <div className="h-px bg-border opacity-50"></div>}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-12 p-5 bg-background border-2 border-border rounded-2xl">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-relaxed text-center opacity-40">
                                As configurações são salvas automaticamente em cache e sincronizadas ao finalizar a sessão.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
