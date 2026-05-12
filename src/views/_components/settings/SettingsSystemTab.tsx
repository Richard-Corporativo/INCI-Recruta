'use client';

// @component SettingsSystemTab | @tipo page-component | @versao 1.0.0
// > Tab de sistema nas configurações — SLA, pipeline, integrações
// @api SettingsSystemTabProps — systemConfig, onChange

import React from 'react';
import { Icon } from '@iconify/react';
import type { SettingsSystemTabProps } from './types';

export default function SettingsSystemTab({
    handleExport, handleImportClick, handleFileChange, fileInputRef, setIsResetConfirmOpen,
}: SettingsSystemTabProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Supabase Integration Card */}
            <div className="bg-card border-2 border-border rounded-3xl p-8 relative overflow-hidden">
                <div className="flex items-start gap-5 mb-10">
                    <div className="p-4 bg-secondary/10 rounded-2xl text-secondary shrink-0 border-2 border-secondary/20">
                        <Icon icon="material-symbols:cloud-sync-rounded" className="size-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-foreground uppercase tracking-widest">Infraestrutura Cloud</h2>
                        <p className="text-muted-foreground text-sm font-semibold mt-1 leading-relaxed max-w-xl">
                            O console está sincronizado com a infraestrutura principal (Supabase). 
                            Utilize as ferramentas abaixo para redundância de dados ou migração de parâmetros.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 border-2 border-border rounded-2xl hover:border-secondary/30 transition-all group bg-background/50">
                        <div className="size-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Icon icon="material-symbols:ios-share-rounded" className="text-secondary size-6" />
                        </div>
                        <h3 className="font-black text-foreground mb-2 flex items-center gap-2 uppercase tracking-widest text-xs">
                            Backup Estrutural
                        </h3>
                        <p className="text-xs text-muted-foreground font-semibold mb-6 leading-relaxed">
                            Gera um manifesto JSON contendo configurações de pipeline, vagas ativas e indexação de candidatos.
                        </p>
                        <button
                            onClick={handleExport}
                            className="w-full h-12 bg-secondary text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-secondary/10"
                        >
                            Exportar Instância
                        </button>
                    </div>

                    <div className="p-8 border-2 border-border rounded-2xl hover:border-primary/30 transition-all group bg-background/50">
                        <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Icon icon="material-symbols:file-open-rounded" className="text-primary size-6" />
                        </div>
                        <h3 className="font-black text-foreground mb-2 flex items-center gap-2 uppercase tracking-widest text-xs">
                            Restauração de Contexto
                        </h3>
                        <p className="text-xs text-muted-foreground font-semibold mb-6 leading-relaxed">
                            Importa parâmetros de um backup anterior. <span className="text-primary underline decoration-primary/20">Nota: Esta ação é restrita ao cache da sua sessão.</span>
                        </p>
                        <button
                            onClick={handleImportClick}
                            className="w-full h-12 border-2 border-border bg-background text-foreground font-black rounded-xl text-xs uppercase tracking-widest transition-all hover:bg-muted active:scale-[0.98]"
                        >
                            Importar Manifesto
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

            {/* Danger Zone */}
            <div className="bg-primary/5 border-2 border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Icon icon="material-symbols:warning-rounded" className="size-32 text-primary" />
                </div>
                
                <div className="p-4 bg-primary/10 rounded-2xl text-primary shrink-0 border-2 border-primary/20">
                    <Icon icon="material-symbols:gpp-maybe-rounded" className="size-8" />
                </div>
                <div className="flex-1 space-y-4">
                    <div>
                        <h4 className="text-sm font-black text-primary uppercase tracking-widest">Protocolo de Reset</h4>
                        <p className="text-sm text-foreground/80 mt-1 font-bold leading-relaxed max-w-2xl">
                            A limpeza de cache restaurará o console administrativo ao estado padrão de fábrica. 
                            Nenhuma alteração será feita nos registros persistentes do banco de dados (Supabase), apenas nas preferências locais.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsResetConfirmOpen(true)}
                        className="px-8 h-12 bg-primary text-white text-xs font-black rounded-xl uppercase tracking-widest transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/20"
                    >
                        Executar Reset do Sistema
                    </button>
                </div>
            </div>
        </div>
    );
}
