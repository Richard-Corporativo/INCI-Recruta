'use client';

// @component JobDetailSidebar | @tipo page-component | @versao 1.0.0
// > Sidebar de detalhes da vaga — info rápida, ações, recruiter
// @api Job, User — dados da vaga e recrutador

import React from 'react';
import { Link, useNavigate } from '@src/lib/router-compat';
import { Job, User } from '@src/types';
import { Icon } from "@iconify/react";
import { formatDate, formatSalaryRange } from '@src/lib/formatters';

interface JobDetailSidebarProps {
    job: Job;
    manager?: User;
    canViewSalaries: boolean;
    forecast: { estimatedClosingDate: string; averageTimeToCloseDays: number } | null;
}

const JobDetailSidebar: React.FC<JobDetailSidebarProps> = ({ job, manager, canViewSalaries, forecast }) => {
    const navigate = useNavigate();

    return (
        <aside className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <section className="bg-card rounded-2xl overflow-hidden p-6">
                <div className="bg-primary/5 px-6 py-4 border-b border-border">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-wider">
                        <Icon icon="material-symbols:analytics" className="text-primary h-5 w-5" aria-hidden="true" />
                        Dados
                    </h2>
                </div>
                <div className="p-8 space-y-8">
                    <div className="space-y-1">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">Departamento</p>
                        <div className="bg-muted/40 p-3 rounded-lg border border-border/60">
                            <p className="text-sm font-semibold text-foreground">{job.department}</p>
                        </div>
                    </div>

                    {canViewSalaries && (
                        <div className="space-y-1">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">Proposta Salarial</p>
                            <div className="bg-muted/40 p-3 rounded-lg border border-border/60 flex items-center gap-2">
                                <Icon icon="material-symbols:payments" className="text-emerald-600 h-4 w-4" aria-hidden="true" />
                                <p className="text-sm font-semibold text-foreground font-sans">{formatSalaryRange(job.salary_min, job.salary_max)}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">Quantidade de Vagas</p>
                        <div className="bg-muted/40 p-3 rounded-lg border border-border/60">
                            <p className="text-sm font-semibold text-foreground">{job.positions_count || 1}</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">Jornada / Carga Horária</p>
                        <div className="bg-muted/40 p-3 rounded-lg border border-border/60">
                            <p className="text-sm font-semibold text-foreground">{job.work_schedule || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">Experiência Mínima</p>
                        <div className="bg-muted/40 p-3 rounded-lg border border-border/60">
                            <p className="text-sm font-semibold text-foreground">{job.experience_min || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">Gestor(a)</p>
                        <div className="bg-muted/40 p-3 rounded-lg border border-border/60">
                            <p className="text-sm font-semibold text-foreground">{job.reports_to || 'Gestor da Área'}</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">Gestor Solicitante</p>
                        <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-lg border border-border/60">
                            <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold border border-primary/20">
                                {manager?.name ? manager.name.substring(0, 2).toUpperCase() : 'NA'}
                            </div>
                            <p className="text-sm font-semibold text-foreground truncate">{manager?.name || 'Não atribuído'}</p>
                        </div>
                    </div>

                    {job.registration_deadline && (
                        <div className="space-y-1">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">Prazo de Inscrição</p>
                            <div className="bg-muted/40 p-3 rounded-lg border border-border/60 flex items-center gap-2">
                                <Icon icon="material-symbols:event" className="text-primary h-4 w-4" aria-hidden="true" />
                                <p className="text-sm font-semibold text-foreground">{formatDate(job.registration_deadline)}</p>
                            </div>
                        </div>
                    )}

                    {forecast && (
                        <div className="space-y-1 pt-2">
                            <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest pl-0.5 flex items-center gap-1">
                                <Icon icon="material-symbols:auto-awesome" className="h-5 w-5" aria-hidden="true" />
                                Previsão de Fechamento
                            </p>
                            <div className="bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/20">
                                <p className="text-lg font-semibold text-emerald-700">{formatDate(forecast.estimatedClosingDate)}</p>
                                <p className="text-[10px] text-emerald-600/80 font-medium">~ {forecast.averageTimeToCloseDays} dias restantes</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-muted/20 border-t border-border mt-auto">
                    <Link to={`/jobs/${job.id}/edit`} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-background border border-border text-xs font-semibold text-muted-foreground hover:text-primary transition-all uppercase tracking-widest">
                        <Icon icon="material-symbols:edit" className="h-5 w-5" aria-hidden="true" />
                        Atualizar Dados
                    </Link>
                </div>
            </section>

            {/* Prova Social Interna / Trust Indicator */}
            <div className="p-6 bg-primary /20 rounded-lg text-primary-foreground relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                    <Icon icon="material-symbols:diversity-1" className="h-5 w-5" aria-hidden="true" />
                </div>
                <h4 className="text-lg font-semibold mb-1 relative z-10">Triagem</h4>
                <p className="text-primary-foreground/80 text-xs font-medium mb-4 relative z-10">Você possui {job.candidates_count} talentos aguardando avaliação nesta vaga.</p>
                <button
                    onClick={() => navigate('/jobs', { state: { selectedJobId: job.id } })}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 rounded border border-white/20 text-[10px] font-semibold tracking-widest uppercase transition-all relative z-10"
                >
                    Ver Candidatos
                </button>
            </div>
        </aside>
    );
};

export default JobDetailSidebar;
