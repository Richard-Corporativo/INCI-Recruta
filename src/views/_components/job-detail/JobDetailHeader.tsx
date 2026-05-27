'use client';

// @component JobDetailHeader | @tipo page-component | @versao 1.0.0
// > Header de detalhes da vaga — título, status, breadcrumbs, ações
// @api Job — dados da vaga, onEdit, onDelete

import React, { useState } from 'react';
import { Link, useNavigate } from '@src/lib/router-compat';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import { Job, User } from '@src/types';
import { Icon } from "@iconify/react";
import { formatDate } from "@src/lib/formatters";
import { useToast } from '@src/components/ui/Toast';

interface JobDetailHeaderProps {
    job: Job;
    user: User | null;
    transitionJobStatus: (id: string, status: Job['workflow_status'], user: User) => Promise<Job | null>;
    onArchiveClick: () => void;
}

const JobDetailHeader: React.FC<JobDetailHeaderProps> = ({ job, user, transitionJobStatus, onArchiveClick }) => {
    const navigate = useNavigate();
    const { success: toastSuccess, error: toastError } = useToast();
    const [isPublishing, setIsPublishing] = useState(false);
    const canApproveJob = user?.role === 'owner' || user?.role === 'admin' || user?.role === 'quality';

    const publishJob = async () => {
        if (!user) {
            toastError('Sessão não encontrada. Faça login novamente.');
            return;
        }

        setIsPublishing(true);
        try {
            const updatedJob = await transitionJobStatus(String(job.id), 'published', user);
            if (!updatedJob || updatedJob.workflow_status !== 'published' || updatedJob.status !== 'Ativa') {
                throw new Error('A vaga foi atualizada, mas não retornou como publicada.');
            }
            toastSuccess('Vaga aprovada e publicada.');
        } catch (error) {
            console.error(error);
            toastError(error instanceof Error ? error.message : 'Erro ao aprovar vaga. Tente novamente.');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <header className="bg-card -b - z-20 shrink-0 sticky top-0 p-6">
            <div className="mb-4">
                <Breadcrumbs items={[
                    { label: 'Oportunidades', to: '/admin/jobs' },
                    { label: 'Detalhamento Técnico' }
                ]} />
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-3xl font-semibold text-foreground tracking-tight leading-tight">{job.title}</h1>
                        <p className="text-[10px] text-muted-foreground/50 font-mono tracking-wider">
                            ID #{String(job.id).slice(-6).toUpperCase()} · Rev. {job.revision ?? 0}
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Icon icon="material-symbols:calendar-today" className="h-4 w-4" aria-hidden="true" />
                            <span className="text-xs font-medium italic">Publicada em {formatDate(job.created_at, { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
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
                    {(job.workflow_status === 'draft' || job.workflow_status === 'pending_approval' || job.workflow_status === 'approved') && canApproveJob && (
                        <button
                            onClick={publishJob}
                            disabled={isPublishing}
                            className="flex items-center justify-center rounded-xl h-11 px-6 bg-emerald-600 text-white hover:bg-emerald-700 transition-all gap-2.5 text-sm font-semibold active:translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                           <span>{isPublishing ? 'Aprovando...' : 'Aprovar vaga'}</span>
                        </button>
                    )}

                    {job.workflow_status === 'published' && (
                        <button
                            onClick={() => navigate('/admin/jobs', { state: { selectedJobId: job.id } })}
                            className="flex items-center justify-center rounded-xl h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2.5 text-sm font-semibold /20 active:translate-y-[1px]"
                        >
                            <Icon icon="material-symbols:group" className="filled h-5 w-5" aria-hidden="true" />
                            <span>Gerenciar Candidatos</span>
                        </button>
                    )}

                    <Link to={`/admin/jobs/${job.id}/edit`} className="flex items-center justify-center rounded-xl h-11 px-6 bg-background border border-border text-foreground hover:bg-accent transition-all gap-2.5 text-sm font-semibold active:translate-y-[1px]">
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

            <div className="flex gap-4 flex-wrap mt-4">
                <div className="flex h-8 items-center justify-center gap-x-2 transition-colors">
                    <Icon icon="material-symbols:location-on" className="text-muted-foreground h-4 w-4" aria-hidden="true" />
                    <p className="text-foreground text-[10px] font-semibold uppercase tracking-wider">{job.location} • {job.model}</p>
                </div>
                <div className="flex h-8 items-center justify-center gap-x-2 transition-colors">
                    <Icon icon="material-symbols:verified-user" className="text-muted-foreground h-4 w-4" aria-hidden="true" />
                    <p className="text-foreground text-[10px] font-semibold uppercase tracking-wider">{job.contract}</p>
                </div>
                <div className="flex h-8 items-center justify-center gap-x-2">
                    <Icon icon="material-symbols:priority-high" className="text-destructive h-4 w-4" aria-hidden="true" />
                    <p className="text-destructive text-[10px] font-semibold uppercase tracking-wider">Urgência {job.urgency}</p>
                </div>
                <div className={`flex h-8 items-center justify-center gap-x-2 ${
                    job.workflow_status === 'published' ? 'text-emerald-700' :
                    job.workflow_status === 'approved' ? 'text-chart-1' :
                    job.workflow_status === 'pending_approval' ? 'text-amber-700' :
                    job.workflow_status === 'archived' ? 'text-slate-700' :
                    'text-muted-foreground'
                    }`}>
                    <Icon icon={
                        job.workflow_status === 'published' ? 'material-symbols:check-circle' :
                            job.workflow_status === 'approved' ? 'material-symbols:verified' :
                                job.workflow_status === 'pending_approval' ? 'material-symbols:pending' :
                                    job.workflow_status === 'archived' ? 'material-symbols:archive' : 'material-symbols:draft'
                    } className="h-5 w-5 animate-pulse" />
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
