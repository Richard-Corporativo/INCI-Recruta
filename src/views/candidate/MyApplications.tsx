'use client';

// @page MyApplications | @tipo page-component | @versao 5.0.0
// > Minhas candidaturas — Abas por status: Todas, Inscritas, Entrevistas, Finalizadas, Arquivadas
// @calls useCandidateData, useNavigate

import React, { useMemo, useState } from 'react';
import { useNavigate } from '@src/lib/router-compat';
import { useCandidateData } from '@src/hooks/useCandidateData';
import { Icon } from "@iconify/react";
import { formatDate } from '@src/lib/formatters';

// Mapeamento interno do kanban → etiqueta amigável para o candidato
// SEM expor lógica interna (nomes de colunas do admin)
const STATUS_CONFIG: Record<string, {
    label: string;
    nextStep: string;
    color: string;
    tab: 'inscrita' | 'entrevista' | 'finalizada' | 'arquivada';
    pulse?: boolean;
}> = {
    received:     { label: 'Em análise',    nextStep: 'Aguarde o contato do recrutador.',           color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',     tab: 'inscrita',    pulse: true },
    screening:    { label: 'Triagem',       nextStep: 'Seu currículo está sendo avaliado.',           color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',     tab: 'inscrita',    pulse: true },
    technical:    { label: 'Avaliação',     nextStep: 'Prepare-se para um teste técnico.',            color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',  tab: 'entrevista' },
    hr_interview:      { label: 'Entrevista RH',      nextStep: 'Agende ou confirme a entrevista.',                    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',  tab: 'entrevista' },
    manager_interview: { label: 'Entrevista Gestor', nextStep: 'Você foi para entrevista com o gestor da área.',        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',  tab: 'entrevista' },
    finalist:          { label: 'Finalista',         nextStep: 'Você está entre os finalistas. Aguarde!',               color: 'bg-primary/10 text-primary',                          tab: 'finalizada' },
    hired:        { label: 'Contratado',    nextStep: 'Parabéns! Entre em contato com o RH.',        color: 'bg-green-500/10 text-green-600 dark:text-green-400',  tab: 'finalizada' },
    rejected:     { label: 'Encerrado',     nextStep: 'Processo concluído. Continue explorando!',    color: 'bg-muted text-muted-foreground',                      tab: 'arquivada' },
};

type Tab = 'todas' | 'inscrita' | 'entrevista' | 'finalizada' | 'arquivada';

const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'todas',      label: 'Todas',        icon: 'material-symbols:inventory-2' },
    { id: 'inscrita',   label: 'Inscritas',    icon: 'material-symbols:send' },
    { id: 'entrevista', label: 'Entrevistas',  icon: 'material-symbols:groups' },
    { id: 'finalizada', label: 'Finalizadas',  icon: 'material-symbols:check-circle' },
    { id: 'arquivada',  label: 'Arquivadas',   icon: 'material-symbols:archive' },
];

const MyApplications: React.FC = () => {
    const navigate = useNavigate();
    const { myApplications, jobs, isLoading } = useCandidateData();
    const [activeTab, setActiveTab] = useState<Tab>('todas');

    const counts = useMemo(() => {
        const c: Record<Tab, number> = { todas: 0, inscrita: 0, entrevista: 0, finalizada: 0, arquivada: 0 };
        myApplications.forEach(a => {
            c.todas++;
            const tab = STATUS_CONFIG[a.columnId]?.tab;
            if (tab) c[tab]++;
        });
        return c;
    }, [myApplications]);

    const filtered = useMemo(() => {
        if (activeTab === 'todas') return myApplications;
        return myApplications.filter(a => STATUS_CONFIG[a.columnId]?.tab === activeTab);
    }, [myApplications, activeTab]);

    if (isLoading) return (
        <div className="w-full py-8 animate-pulse space-y-6">
            <div className="h-4 w-32 bg-muted rounded-lg" />
            <div className="h-10 w-64 bg-muted rounded-lg" />
            <div className="flex gap-3">
                {[1,2,3,4,5].map(i => <div key={i} className="h-9 w-24 bg-muted rounded-full" />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3].map(i => <div key={i} className="h-40 bg-muted rounded-lg" />)}
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
                <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Portal de Vagas
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                        Minhas Candidaturas
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Acompanhe o status de todos os seus processos seletivos.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/vagas')}
                    className="h-12 px-8 bg-primary text-primary-foreground text-sm font-semibold rounded-md transition-all hover:bg-primary/90 active:scale-[0.98] flex items-center gap-3 shrink-0"
                >
                    Explorar Vagas
                    <Icon icon="material-symbols:east" className="size-5" />
                </button>
            </div>

            {/* Abas de filtro por status */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-2 h-9 px-4 rounded-full text-[11px] font-semibold
                            whitespace-nowrap transition-all shrink-0
                            ${activeTab === tab.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }
                        `}
                    >
                        <Icon icon={tab.icon} className="size-3.5" />
                        {tab.label}
                        {counts[tab.id] > 0 && (
                            <span className={`
                                ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold
                                flex items-center justify-center
                                ${activeTab === tab.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-background text-foreground'}
                            `}>
                                {counts[tab.id]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Grid de cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
                {filtered.map((app) => {
                    const job = jobs.find(j => j.id.toString() === app.jobId?.toString());
                    const config = STATUS_CONFIG[app.columnId] || STATUS_CONFIG.received;
                    const isTalentPool = !app.jobId;

                    return (
                        <div
                            key={app.id}
                            role="listitem"
                            onClick={() => navigate(`/candidate/applications/${app.id}`)}
                            className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all cursor-pointer flex flex-col gap-4 group"
                        >
                            {/* Título + badge de status na mesma linha */}
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight leading-tight">
                                    {job?.title || (isTalentPool ? 'Banco de Talentos' : 'Vaga em processamento')}
                                </h3>
                                <span className={`inline-flex h-6 items-center gap-1.5 px-3 rounded-full text-[10px] font-semibold uppercase tracking-wide shrink-0 ${config.color}`}>
                                    {config.pulse && (
                                        <span className="relative flex size-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current" />
                                            <span className="relative inline-flex rounded-full size-1.5 bg-current" />
                                        </span>
                                    )}
                                    {config.label}
                                </span>
                            </div>

                            {/* Tags */}
                            <div className="flex-1 space-y-3">
                                
                                <div className="flex flex-wrap items-center gap-1.5">
                                    {isTalentPool && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/5 text-primary text-[10px] font-bold uppercase rounded border border-primary/10">
                                            <Icon icon="material-symbols:account-circle" className="size-3.5" />
                                            Candidatura Espontânea
                                        </span>
                                    )}
                                    {job?.location && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-muted text-muted-foreground text-[10px] font-bold uppercase rounded">
                                            <Icon icon="material-symbols:location-on" className="size-3.5" />
                                            {job.location}
                                        </span>
                                    )}
                                    {job?.model && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/5 text-primary text-[10px] font-bold uppercase rounded border border-primary/10">
                                            <Icon icon={
                                                job.model.toLowerCase().includes('remoto') ? 'material-symbols:home-work' :
                                                job.model.toLowerCase().includes('híbrido') ? 'material-symbols:sync-alt' :
                                                'material-symbols:location-city'
                                            } className="size-3.5" />
                                            {job.model}
                                        </span>
                                    )}
                                    {job?.contract && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-muted text-muted-foreground text-[10px] font-bold uppercase rounded">
                                            <Icon icon={
                                                job.contract.toLowerCase().includes('clt') ? 'material-symbols:badge' :
                                                job.contract.toLowerCase().includes('pj') ? 'material-symbols:business-center' :
                                                'material-symbols:description'
                                            } className="size-3.5" />
                                            {job.contract}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Próximo passo — dica amigável para o candidato */}
                            <div className="flex items-start gap-2 pt-3 border-t border-border">
                                <Icon icon="material-symbols:info" className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                    {config.nextStep}
                                </p>
                            </div>

                            {app.nextInterview && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                                    <Icon icon="material-symbols:calendar-today" className="size-3.5 text-blue-600" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tight">Próxima Entrevista</span>
                                        <span className="text-[10px] font-semibold text-foreground">
                                            {formatDate(app.nextInterview.date)} às {app.nextInterview.time}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {app.applied_at && (
                                <p className="text-[10px] text-muted-foreground/60 -mt-2">
                                    Candidatado em {formatDate(app.applied_at)}
                                </p>
                            )}
                        </div>
                    );
                })}

                {/* Empty state */}
                {filtered.length === 0 && (
                    <div className="col-span-full border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center text-center space-y-6">
                        <div className="size-16 rounded-xl bg-muted flex items-center justify-center">
                            <Icon icon="material-symbols:inbox" className="size-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2 max-w-sm">
                            <h3 className="text-xl font-semibold text-foreground">
                                {activeTab === 'todas' ? 'Nenhuma candidatura' : `Nenhuma candidatura ${TABS.find(t => t.id === activeTab)?.label.toLowerCase()}`}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {activeTab === 'todas'
                                    ? 'Explore as vagas abertas e candidate-se para iniciar seu processo seletivo.'
                                    : 'Nenhuma candidatura nesta etapa ainda.'}
                            </p>
                        </div>
                        {activeTab === 'todas' && (
                            <button
                                onClick={() => navigate('/vagas')}
                                className="h-12 px-8 rounded-md bg-primary text-primary-foreground text-sm font-semibold transition-all hover:bg-primary/90 active:scale-[0.98] flex items-center gap-3"
                            >
                                Explorar Vagas
                                <Icon icon="material-symbols:east" className="size-5" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
