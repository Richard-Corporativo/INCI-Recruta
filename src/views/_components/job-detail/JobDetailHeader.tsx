'use client';

// @component JobDetailHeader | @tipo page-component | @versao 1.0.0
// > Header de detalhes da vaga — título, status, breadcrumbs, ações
// @api Job — dados da vaga, onEdit, onDelete

import React from 'react';
import { Link, useNavigate } from '@src/lib/router-compat';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import { Job, User } from '@src/types';
import { Icon } from "@iconify/react";

interface JobDetailHeaderProps {
    job: Job;
    user: User | null;
    transitionJobStatus: (id: string, status: string, user: User) => Promise<void>;
    onArchiveClick: () => void;
}

const JobDetailHeader: React.FC<JobDetailHeaderProps> = ({ job, user, transitionJobStatus, onArchiveClick }) => {
    const navigate = useNavigate();

    return (
        <header className="bg-card -b - z-20 shrink-0 sticky top-0 p-6">
            <div className="mb-4">
                <Breadcrumbs items={[
                    { label: 'Oportunidades', to: '/jobs' },
                    { label: 'Detalhamento Técnico' }
                ]} />
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-semibold text-foreground tracking-tight leading-tight">{job.title}</h1>
                        <span className="bg-primary/5 text-primary text-[10px] font-semibold px-2 py-0.5 rounded border border-primary/10 tracking-widest uppercase">#{String(job.id).slice(-6).toUpperCase()}</span>
                        <span className="bg-muted/60 text-muted-foreground text-[10px] font-semibold px-2 py-0.5 rounded border border-border/40 tracking-widest uppercase">Rev. {job.revision ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Icon icon="material-symbols:calendar-today" className="h-4 w-4" aria-hidden="true" />
                            <span className="text-xs font-medium italic">Publicada em {job.created_at}</span>
                        </div>
                        <div className="size-1 bg-border rounded-full"></div>
                        <div className="flex items-center gap-1.5">
                            <Icon icon="material-symbols:history" className="h-4 w-4" aria-hidden="true" />
                            <span className="text-xs font-medium">Última atualização: Hoje</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Primary Action - Contextual based on status */}
                    {job.workflow_status === 'draft' && (
                        <button
                            onClick={() => transitionJobStatus(String(job.id), 'pending_approval', user!)}
                            className="flex items-center justify-center rounded-xl h-11 px-6 bg-amber-500 text-white hover:bg-amber-600 transition-all gap-2.5 text-sm font-semibold active:translate-y-[1px]"
                        >
                            <Icon icon="material-symbols:send" className="h-5 w-5" aria-hidden="true" />
                            <span>Enviar para Aprovação</span>
                        </button>
                    )}

                    {job.workflow_status === 'pending_approval' && (user?.role === 'admin' || user?.role === 'quality') && (
                        <button
                            onClick={() => transitionJobStatus(String(job.id), 'approved', user!)}
                            className="flex items-center justify-center rounded-xl h-11 px-6 bg-emerald-600 text-white hover:bg-emerald-700 transition-all gap-2.5 text-sm font-semibold active:translate-y-[1px]"
                        >
                            <Icon icon="material-symbols:verified" className="h-5 w-5" aria-hidden="true" />
                            <span>Aprovar Vaga</span>
                        </button>
                    )}

                    {job.workflow_status === 'approved' && (
                        <button
                            onClick={() => transitionJobStatus(String(job.id), 'published', user!)}
                            className="flex items-center justify-center rounded-xl h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2.5 text-sm font-semibold /20 active:translate-y-[1px]"
                        >
                            <Icon icon="material-symbols:publish" className="h-5 w-5" aria-hidden="true" />
                            <span>Publicar Vaga</span>
                        </button>
                    )}

                    {job.workflow_status === 'published' && (
                        <button
                            onClick={() => navigate('/jobs', { state: { selectedJobId: job.id } })}
                            className="flex items-center justify-center rounded-xl h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2.5 text-sm font-semibold /20 active:translate-y-[1px]"
                        >
                            <Icon icon="material-symbols:group" className="filled h-5 w-5" aria-hidden="true" />
                            <span>Gerenciar Candidatos</span>
                        </button>
                    )}

                    <Link to={`/jobs/${job.id}/edit`} className="flex items-center justify-center rounded-xl h-11 px-6 bg-background border border-border text-foreground hover:bg-accent transition-all gap-2.5 text-sm font-semibold active:translate-y-[1px]">
                        <Icon icon="material-symbols:edit-note" className="h-5 w-5" aria-hidden="true" />
                        <span>Editar</span>
                    </Link>

                    {job.workflow_status !== 'archived' && (
                        <button
                            className="flex items-center justify-center rounded-xl h-11 w-11 bg-destructive/5 border border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all active:translate-y-[1px]"
                            onClick={onArchiveClick}
                            title="Arquivar Vaga"
                        >
                            <Icon icon="material-symbols:archive" className="h-5 w-5" aria-hidden="true" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex gap-3 flex-wrap mt-8">
                <div className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-muted/50 border border-border px-4 transition-colors hover:bg-muted">
                    <Icon icon="material-symbols:location-on" className="text-muted-foreground h-4 w-4" aria-hidden="true" />
                    <p className="text-foreground text-[10px] font-semibold uppercase tracking-wider">{job.location} • {job.model}</p>
                </div>
                <div className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-muted/50 border border-border px-4 transition-colors hover:bg-muted">
                    <Icon icon="material-symbols:verified-user" className="text-muted-foreground h-4 w-4" aria-hidden="true" />
                    <p className="text-foreground text-[10px] font-semibold uppercase tracking-wider">{job.contract}</p>
                </div>
                <div className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-destructive/10 border border-destructive/20 px-4">
                    <Icon icon="material-symbols:priority-high" className="text-destructive h-4 w-4" aria-hidden="true" />
                    <p className="text-destructive text-[10px] font-semibold uppercase tracking-wider">Urgência {job.urgency}</p>
                </div>
                <div className={`flex h-8 items-center justify-center gap-x-2 rounded-full px-4 border ${job.workflow_status === 'published' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' :
                    job.workflow_status === 'approved' ? 'bg-chart-1/100/10 border-blue-500/20 text-chart-1' :
                        job.workflow_status === 'pending_approval' ? 'bg-amber-500/10 border-amber-500/20 text-amber-700' :
                            job.workflow_status === 'archived' ? 'bg-slate-500/10 border-slate-500/20 text-slate-700' :
                                'bg-muted/50 border-border text-muted-foreground'
                    }`}>
                    <Icon icon={
                        job.workflow_status === 'published' ? 'material-symbols:check-circle' :
                            job.workflow_status === 'approved' ? 'material-symbols:verified' :
                                job.workflow_status === 'pending_approval' ? 'material-symbols:pending' :
                                    job.workflow_status === 'archived' ? 'material-symbols:archive' : 'material-symbols:draft'
                    } className="h-5 w-5" />
                    <p className="text-[10px] font-semibold uppercase tracking-wider">
                        Workflow: {
                            job.workflow_status === 'published' ? 'Publicada' :
                                job.workflow_status === 'approved' ? 'Aprovada' :
                                    job.workflow_status === 'pending_approval' ? 'Aguardando Aprovação' :
                                        job.workflow_status === 'archived' ? 'Arquivada' : 'Rascunho'
                        }
                    </p>
                </div>
            </div>
        </header>
    );
};

export default JobDetailHeader;
