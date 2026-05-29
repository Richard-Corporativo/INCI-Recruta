'use client';

// @page ApplicationDetail | @tipo page-component | @versao 4.0.0
// > Detalhes candidatura — Balha v10: stage cards horizontal, accordion ações
// @calls useCandidateData, useParams, CandidateService

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from '@src/lib/router-compat';
import { useCandidateData } from '@src/hooks/useCandidateData';
import { useInterviews } from '@src/hooks/useInterviews';
import { useToast } from '@src/components/ui/Toast';
import { CandidateService } from '@src/services/candidate.service';
import { Icon } from "@iconify/react";
import { formatDate } from '@src/lib/formatters';
import { useAuth } from '@src/hooks/useAuth';
import { useNotificationsContext } from '@src/context/NotificationsContext';
import { NotificationService } from '@src/services/notification.service';

const ApplicationDetail: React.FC = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { notifications } = useNotificationsContext();
    const navigate = useNavigate();
    const { myApplications, jobs, isLoading, refreshData } = useCandidateData();
    const { success: toastSuccess, error: toastError } = useToast();
    const [showActions, setShowActions] = useState(false);
    const [showDesistirModal, setShowDesistirModal] = useState(false);

    const app = useMemo(() =>
        myApplications.find(c => c.id === id),
        [myApplications, id]
    );

    const job = useMemo(() =>
        app ? jobs.find(j => j.id.toString() === app.jobId?.toString()) : null,
        [app, jobs]
    );

    const jobNotifications = useMemo(
        () => notifications.filter(n => n.job_id != null && n.job_id.toString() === app?.jobId?.toString()),
        [notifications, app?.jobId]
    );

    const { interviews } = useInterviews(app?.id);
    const scheduledInterviews = useMemo(
        () => interviews.filter(i => i.status === 'scheduled'),
        [interviews]
    );

    useEffect(() => {
        if (!user?.id || !app?.jobId) return;
        const hasUnread = notifications.some(n => n.job_id != null && n.job_id.toString() === app.jobId?.toString() && !n.read);
        if (!hasUnread) return;
        NotificationService.markReadByJob(user.id, app.jobId.toString());
    }, [user?.id, app?.jobId, notifications]);

    const stageFromInterviewType: Record<string, string> = {
        'Entrevista RH': 'hr_interview',
        'Entrevista Técnica': 'technical',
        'Apresentação de Case': 'technical',
        'Entrevista Gestor': 'manager_interview',
    };

    const effectiveColumnId = useMemo(() => {
        const col = app?.columnId || 'received';
        if (col !== 'received') return col;
        if (scheduledInterviews.length > 0) {
            const iv = scheduledInterviews[0];
            return iv.stage || stageFromInterviewType[iv.type ?? ''] || col;
        }
        return col;
    }, [app?.columnId, scheduledInterviews]);

    const statusConfig: Record<string, { label: string; index: number }> = {
        'received': { label: 'Recebido', index: 0 },
        'screening': { label: 'Triagem', index: 1 },
        'technical': { label: 'Avaliação Técnica', index: 2 },
        'hr_interview': { label: 'Entrevista RH', index: 3 },
        'manager_interview': { label: 'Entrevista Gestor', index: 4 },
        'finalist': { label: 'Finalista', index: 5 },
        'hired': { label: 'Contratado', index: 6 },
        'rejected': { label: 'Encerrado', index: -1 }
    };

    const isRejected = effectiveColumnId === 'rejected';
    const currentStatus = statusConfig[effectiveColumnId] || statusConfig['received'];

    const stages = [
        { id: 'received', label: 'Candidatura Recebida', desc: 'Sua candidatura foi registrada e está em processamento.' },
        { id: 'screening', label: 'Triagem', desc: 'Análise de aderência ao perfil da vaga.' },
        { id: 'interview', label: 'Entrevistas', desc: 'Avaliações técnicas e entrevistas com a equipe.' },
        { id: 'proposal', label: 'Proposta', desc: 'Negociação e formalização.' }
    ];

    const getStageStatus = (index: number) => {
        if (isRejected) return 'rejected';
        const ci = currentStatus.index;
        if (ci < 0) return 'rejected';
        if (index === 0) return ci > 0 ? 'completed' : 'current';
        if (index === 1) return ci > 1 ? 'completed' : ci === 1 ? 'current' : 'upcoming';
        if (index === 2) return ci > 4 ? 'completed' : ci >= 2 && ci <= 4 ? 'current' : 'upcoming';
        if (index === 3) return ci >= 6 ? 'completed' : ci === 5 ? 'current' : 'upcoming';
        return 'upcoming';
    };

    if (isLoading) return (
        <div className="w-full py-8 animate-pulse space-y-6">
            <div className="h-4 w-32 bg-muted rounded-lg" />
            <div className="h-10 w-64 bg-muted rounded-lg" />
            <div className="h-48 bg-muted rounded-2xl" />
        </div>
    );

    if (!app) return (
        <div className="w-full py-16 text-center space-y-4">
            <p className="text-sm text-muted-foreground">Candidatura não encontrada.</p>
            <button onClick={() => navigate('/candidate/applications')} className="text-sm font-semibold text-primary hover:underline underline-offset-4">
                Voltar às candidaturas
            </button>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-8">

            {/* Breadcrumb */}
            <button
                onClick={() => navigate('/candidate/applications')}
                className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
                <Icon icon="material-symbols:arrow-back" className="size-4" />
                Minhas Candidaturas
            </button>

            {/* Card: Job Header */}
            <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
                <div className="flex items-center gap-3">
                    <span className={`h-7 px-3 rounded-lg text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5 ${isRejected ? 'bg-error/10 text-error border border-error/20' : 'bg-foreground text-background'}`}>
                        {isRejected ? 'Encerrado' : currentStatus.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">ID: {app.jobId}</span>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    {job?.title || 'Vaga em processamento'}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
                    {job?.location && (
                        <span className="flex items-center gap-1.5">
                            <Icon icon="material-symbols:location-on" className="size-4" />
                            {job.location}
                        </span>
                    )}
                    {job?.model && (
                        <span className="flex items-center gap-1.5">
                            <Icon icon="material-symbols:work" className="size-4" />
                            {job.model}
                        </span>
                    )}
                    {app.applied_at && (
                        <span className="flex items-center gap-1.5">
                            <Icon icon="material-symbols:calendar-month" className="size-4" />
                            Candidatado em {formatDate(app.applied_at)}
                        </span>
                    )}
                </div>
            </div>

            {/* Rejection feedback */}
            {isRejected && (
                <div className="p-6 rounded-2xl bg-error/5 border border-error/20 flex items-start gap-4">
                    <Icon icon="material-symbols:info" className="text-error size-5 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-error">Processo encerrado</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Neste ciclo, optamos por avançar com outros perfis. Seus dados permanecem disponíveis para futuras oportunidades.
                        </p>
                    </div>
                </div>
            )}

            {/* Timeline vertical — Balha v10 */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-foreground">Progresso da Candidatura</h2>
                        <p className="text-sm text-muted-foreground">Acompanhe cada etapa do processo seletivo.</p>
                    </div>
                    <button
                        onClick={refreshData}
                        title="Atualizar status"
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 shrink-0"
                    >
                        <Icon icon="material-symbols:refresh" className="size-4" />
                    </button>
                </div>

                <div className="relative flex flex-col gap-6 ml-2">
                    <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-border" />

                    {stages.map((stage, idx) => {
                        const s = getStageStatus(idx);
                        return (
                            <div key={stage.id} className="relative pl-9">
                                <div className={`absolute left-0 top-1.5 size-3 rounded-full z-10 ring-4 ring-card ${
                                    s === 'rejected' ? 'bg-error' :
                                    s === 'completed' ? 'bg-success' :
                                    s === 'current' ? 'bg-primary' :
                                    'bg-border'
                                }`} />

                                {s === 'current' && (
                                    <div className="absolute left-[-3px] top-[3px] size-[18px] rounded-full bg-primary/30 animate-ping" />
                                )}

                                <div className="space-y-1">
                                    <div className="flex items-center justify-between gap-4">
                                        <h3 className={`text-sm font-semibold ${
                                            s === 'upcoming' ? 'text-muted-foreground' :
                                            s === 'rejected' ? 'text-muted-foreground line-through opacity-50' :
                                            'text-foreground'
                                        }`}>
                                            {stage.label}
                                        </h3>
                                        {s === 'completed' && <Icon icon="material-symbols:check-circle" className="size-5 text-success shrink-0" />}
                                        {s === 'current' && <span className="text-[10px] font-semibold text-primary border border-primary/20 bg-primary/5 px-2.5 py-1 rounded-lg">Em andamento</span>}
                                        {s === 'rejected' && <Icon icon="material-symbols:cancel" className="size-5 text-error shrink-0" />}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                        {stage.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Seção: Atualizações (notificações da vaga) */}
            {jobNotifications.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <Icon icon="material-symbols:notifications" className="size-5 text-primary" />
                            Atualizações
                        </h2>
                        <p className="text-sm text-muted-foreground">Novidades sobre esta candidatura.</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        {jobNotifications.map(notif => (
                            <div key={notif.id} className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
                                <Icon
                                    icon={
                                        notif.type === 'interview_scheduled' || notif.type === 'interview_rescheduled'
                                            ? 'material-symbols:calendar-today'
                                            : notif.type === 'interview_cancelled'
                                            ? 'material-symbols:event-busy'
                                            : 'material-symbols:swap-horiz'
                                    }
                                    className="size-5 text-primary shrink-0 mt-0.5"
                                />
                                <div className="flex-1 space-y-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground">{notif.title}</p>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">{notif.message}</p>
                                    <p className="text-[10px] text-muted-foreground/60">{formatDate(notif.created_at)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Card: Próximas Entrevistas */}
            {scheduledInterviews.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <Icon icon="material-symbols:calendar-today" className="size-5 text-primary" />
                            Próximas Entrevistas
                        </h2>
                        <p className="text-sm text-muted-foreground">Entrevistas agendadas para esta candidatura.</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        {scheduledInterviews.map(interview => (
                            <div key={interview.id} className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-semibold text-foreground">{interview.type || 'Entrevista'}</span>
                                    <span className="text-[10px] font-semibold text-primary border border-primary/20 bg-primary/5 px-2.5 py-1 rounded-lg">Agendada</span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <Icon icon="material-symbols:schedule" className="size-4" />
                                        {formatDate(interview.starts_at)}
                                        {interview.starts_at && ` às ${new Date(interview.starts_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                                    </span>
                                    {interview.location && (
                                        <span className="flex items-center gap-1.5">
                                            <Icon icon="material-symbols:videocam" className="size-4" />
                                            <span className="truncate max-w-[220px]">{interview.location}</span>
                                        </span>
                                    )}
                                    {interview.interviewer_names && (
                                        <span className="flex items-center gap-1.5">
                                            <Icon icon="material-symbols:group" className="size-4" />
                                            {interview.interviewer_names}
                                        </span>
                                    )}
                                </div>
                                {interview.address && (
                                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                        <Icon icon="material-symbols:location-on" className="size-4 shrink-0" />
                                        <span>{interview.address}</span>
                                    </div>
                                )}
                                {interview.notes && (
                                    <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-border pt-2 mt-1">
                                        {interview.notes}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Balha v10: Accordion de ações no rodapé */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <button
                    onClick={() => setShowActions(!showActions)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-muted transition-colors"
                >
                    <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Icon icon="material-symbols:more-horiz" className="size-5 text-muted-foreground" />
                        Ações
                    </span>
                    <Icon
                        icon="material-symbols:expand-more"
                        className={`size-5 text-muted-foreground transition-transform duration-200 ${showActions ? 'rotate-180' : ''}`}
                    />
                </button>
                {showActions && (
                    <div className="px-6 pb-6 border-t border-border pt-4 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/vagas')}
                            className="flex-1 h-12 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-all flex items-center justify-center gap-2"
                        >
                            <Icon icon="material-symbols:search" className="size-5" />
                            Explorar outras vagas
                        </button>
                        {!isRejected && (
                            <button
                                onClick={() => setShowDesistirModal(true)}
                                className="h-12 px-6 rounded-xl border border-error/30 text-sm font-semibold text-error hover:bg-error hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <Icon icon="material-symbols:cancel" className="size-5" />
                                Desistir da Vaga
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal desistência */}
            {showDesistirModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/90 animate-in fade-in duration-200">
                    <div className="bg-card border border-border w-full max-w-md rounded-2xl p-8 animate-in zoom-in-95 duration-200 space-y-6">
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="size-14 rounded-2xl bg-error/10 text-error flex items-center justify-center">
                                    <Icon icon="material-symbols:warning" className="size-7" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-foreground">Desistir da candidatura?</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Esta ação é irreversível e removerá sua candidatura desta vaga permanentemente.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowDesistirModal(false)}
                                className="h-12 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:border-foreground transition-all active:scale-[0.98]"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        if (app?.id) {
                                            const success = await CandidateService.deleteCandidate(app.id);
                                            if (success) {
                                                toastSuccess('Candidatura removida com sucesso.');
                                                setShowDesistirModal(false);
                                                navigate('/candidate/applications');
                                            }
                                        }
                                    } catch {
                                        toastError('Erro ao processar desistência.');
                                    }
                                }}
                                className="h-12 rounded-xl bg-error text-white text-sm font-semibold hover:bg-error/90 transition-all active:scale-[0.98]"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationDetail;
