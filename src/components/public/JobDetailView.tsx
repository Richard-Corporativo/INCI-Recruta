'use client';
// @component JobDetailView | @tipo componente | @versao 1.0.0
// > Visualização detalhada de vaga — missão, responsabilidades, requisitos, benefícios
// @api job: JobDetail


import React from 'react';
import { Icon } from "@iconify/react";
import { PublicJob } from './JobCardPublic';
import { useAuth } from '@src/context/AuthContext';
import { useFavoriteJobs } from '@src/hooks/useFavoriteJobs';
import { formatDate } from '@src/lib/formatters';

interface JobDetailViewProps {
    job: any; // Using any for now to match the complex mapping in JobDetailPublic
    onApply: (id: string) => void;
}

const JobDetailView: React.FC<JobDetailViewProps> = ({ job, onApply }) => {
    const { isAuthenticated } = useAuth();
    const { isFavorite, toggleFavorite } = useFavoriteJobs();


    const isFav = job ? isFavorite(job.id) : false;
    const areaLabel = job?.area?.trim();
    if (!job) return (
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center border-2 border-border border-dashed bg-muted/10 rounded-3xl h-full min-h-[600px]">
            <div className="size-20 bg-background border border-border flex items-center justify-center mb-8 rounded-2xl">
                <Icon icon="material-symbols:info" className="text-muted-foreground/20 size-10" />
            </div>
                <h3 className="text-2xl font-semibold tracking-tight mb-2">Selecione uma Oportunidade.</h3>
                        <p className="text-muted-foreground text-xs max-w-xs font-semibold tracking-wide leading-relaxed">
                Escolha uma vaga na lateral para visualizar os detalhes completos e requisitos da posição.
            </p>
        </div>
    );

    return (
        <div className="space-y-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-150">
            {/* Header / Summary */}
            <div className="space-y-6">
                <div className="space-y-1">

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1">
                            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight">
                                {job.title}
                            </h1>
                            <p className="text-[10px] text-muted-foreground/50 font-mono tracking-wider mt-1">
                                ID #{String(job.id).slice(-6).toUpperCase()}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            {isAuthenticated && (
                                <button
                                    onClick={() => toggleFavorite(job.id)}
                                    className={`size-9 flex items-center justify-center transition-all hover:scale-110 ${
                                        isFav ? 'text-secondary' : 'text-muted-foreground/40 hover:text-muted-foreground'
                                    }`}
                                    title={isFav ? "Remover dos favoritos" : "Salvar vaga"}
                                >
                                    <Icon icon={isFav ? 'ph:star-fill' : 'ph:star'} className="size-5" />
                                </button>
                            )}
                            <button
                                onClick={() => onApply(job.id)}
                                className="h-9 px-6 bg-primary text-primary-foreground font-semibold text-[10px] tracking-widest rounded-lg transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                            >
                                Candidatar-se
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-4 md:p-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-5">
                        {([
                            { label: 'Departamento/Setor',       val: (job.area && job.area !== 'Geral') ? job.area : 'Área não informada', icon: 'material-symbols:corporate-fare' },
                            { label: 'Localização',        val: job.location,      icon: 'material-symbols:location-on' },
                            { label: 'Modelo',             val: job.model,         icon: 'material-symbols:home-work' },
                            { label: 'Contrato',           val: job.contract,      icon: 'material-symbols:description' },
                            { label: 'Nível',              val: job.level,         icon: 'material-symbols:trending-up' },
                             { label: 'Urgência',           val: job.urgency,       icon: 'material-symbols:priority-high' },
                             { label: 'Exp. Mínima',        val: job.experienceMin || 'Não informada', icon: 'material-symbols:work-history' },
                             {
                                 label: 'Faixa Salarial',
                                 val: job.salary?.min || job.salary?.max
                                     ? [job.salary.min && `R$ ${Number(job.salary.min).toLocaleString('pt-BR')}`, job.salary.max && `R$ ${Number(job.salary.max).toLocaleString('pt-BR')}`].filter(Boolean).join(' – ')
                                     : 'A combinar',
                                 icon: 'material-symbols:payments'
                             },
                             { label: 'Gestor(a)',         val: (job.reportsTo && job.reportsTo !== 'Gestor da Área') ? job.reportsTo : 'Não informado', icon: 'material-symbols:supervisor-account' },
                             {
                                 label: 'Inscrições até',
                                 val: job.registrationDeadline
                                     ? formatDate(job.registrationDeadline, { day: '2-digit', month: 'long', year: 'numeric' })
                                     : 'Tempo limitado',
                                 icon: 'material-symbols:calendar-today'
                             },
                             { label: 'Jornada',           val: job.workSchedule,   icon: 'material-symbols:schedule' },
                         ] as { label: string; val?: string; icon: string }[])
                            .map((item, i) => (
                            <div key={i} className="flex flex-col gap-1.5 min-w-0">
                                <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest leading-none">
                                    <Icon icon={item.icon} className="size-3.5 text-primary/50 shrink-0" />
                                    <span className="truncate">{item.label}</span>
                                </div>
                                <p className="text-sm font-semibold text-foreground tracking-tight leading-tight">
                                    {item.val || 'Não informado'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Description Content */}
            <div className="space-y-6">
                {/* Mission/Context */}
                {job.mission && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-[15px] font-semibold text-foreground tracking-tight">Contexto e Missão</h3>
                            <div className="h-px flex-1 bg-border/60" />
                        </div>
                        <p className="text-base font-medium text-foreground/80 leading-relaxed max-w-4xl break-words">
                            {job.mission}
                        </p>
                    </section>
                )}

                {/* Requisitos e Qualificações */}
                {job.requirements?.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-[15px] font-semibold text-foreground tracking-tight">Requisitos e Qualificações</h3>
                            <div className="h-px flex-1 bg-border/60" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {job.requirements.map((req: string, i: number) => (
                                <span key={i} className="inline-flex items-center gap-2.5 px-4 py-2 border border-border/50 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                    <Icon icon="material-symbols:check-circle" className="text-primary size-4 shrink-0" />
                                    <span className="text-xs font-semibold text-foreground/80">{req}</span>
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Requisitos Técnicos */}
                {job.requirementsTechnical?.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-[15px] font-semibold text-foreground tracking-tight">Requisitos Técnicos</h3>
                            <div className="h-px flex-1 bg-border/60" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {job.requirementsTechnical.map((req: string, i: number) => (
                                <span key={i} className="inline-flex items-center gap-2.5 px-4 py-2 border border-border/50 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                    <Icon icon="material-symbols:code" className="text-primary size-4 shrink-0" />
                                    <span className="text-xs font-semibold text-foreground/80">{req}</span>
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Competências Comportamentais e Habilidades */}
                {job.requirementsBehavioral?.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-[15px] font-semibold text-foreground tracking-tight">Competências Comportamentais e Habilidades</h3>
                            <div className="h-px flex-1 bg-border/60" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {job.requirementsBehavioral.map((req: string, i: number) => (
                                <span key={i} className="inline-flex items-center gap-2.5 px-4 py-2 border border-border/50 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                    <Icon icon="material-symbols:psychology" className="text-primary size-4 shrink-0" />
                                    <span className="text-xs font-semibold text-foreground/80">{req}</span>
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Competências Obrigatórias */}
                {job.competencies?.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-[15px] font-semibold text-foreground tracking-tight">Competências Obrigatórias</h3>
                            <div className="h-px flex-1 bg-border/60" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {job.competencies.map((c: string, i: number) => (
                                <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
                                    <Icon icon="material-symbols:star-outline" className="size-4 shrink-0" />
                                    {c}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* KPIs */}
                {job.kpis?.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-[15px] font-semibold text-foreground tracking-tight">KPIs</h3>
                            <div className="h-px flex-1 bg-border/60" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {job.kpis.map((kpi: string, i: number) => (
                                <span key={i} className="inline-flex items-center gap-2.5 px-4 py-2 border border-border/50 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                    <Icon icon="material-symbols:bar-chart" className="text-primary size-4 shrink-0" />
                                    <span className="text-xs font-semibold text-foreground/80">{kpi}</span>
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Responsibilities */}
                {job.responsibilities?.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-[15px] font-semibold text-foreground tracking-tight">Atividades</h3>
                            <div className="h-px flex-1 bg-border/60" />
                        </div>
                        <div className="space-y-2">
                            {job.responsibilities.map((item: string, idx: number) => (
                                <div key={idx} className="flex items-start justify-between p-4 bg-card border border-border rounded-2xl group hover:border-primary/40 transition-all gap-4">
                                    <span className="text-[13px] font-semibold text-foreground/90 tracking-tight break-words">{item}</span>
                                    <Icon icon="material-symbols:arrow-forward" className="size-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors mt-1 shrink-0" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-[15px] font-semibold text-foreground tracking-tight">Benefícios</h3>
                            <div className="h-px flex-1 bg-border/60" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {job.benefits.map((benefit: any, i: number) => {
                                const colorMap: Record<string, string> = {
                                    emerald: 'bg-emerald-100/70 text-emerald-700 border-emerald-200/80',
                                    sky: 'bg-sky-100/70 text-sky-700 border-sky-200/80',
                                    violet: 'bg-violet-100/70 text-violet-700 border-violet-200/80',
                                    rose: 'bg-rose-100/70 text-rose-700 border-rose-200/80',
                                    amber: 'bg-amber-100/70 text-amber-700 border-amber-200/80',
                                    cyan: 'bg-cyan-100/70 text-cyan-700 border-cyan-200/80',
                                    lime: 'bg-lime-100/70 text-lime-700 border-lime-200/80',
                                    fuchsia: 'bg-fuchsia-100/70 text-fuchsia-700 border-fuchsia-200/80',
                                    indigo: 'bg-indigo-100/70 text-indigo-700 border-indigo-200/80',
                                    teal: 'bg-teal-100/70 text-teal-700 border-teal-200/80',
                                };
                                const colorClass = colorMap[benefit.colorId] || colorMap.sky;

                                return (
                                    <span key={i} className={`inline-flex items-center gap-2.5 px-4 py-2 border rounded-lg transition-colors ${colorClass}`}>
                                        <Icon icon={benefit.icon.includes(':') ? benefit.icon : `material-symbols:${benefit.icon}`} className="size-4" />
                                        <span className="text-xs font-semibold tracking-tight">
                                            {benefit.title}
                                        </span>
                                    </span>
                                );
                            })}
                        </div>
                    </section>
                )}

            </div>

            {/* Footer Action */}
            <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 pb-6">
                <div className="text-center md:text-left space-y-1">
                    <h4 className="text-lg font-semibold tracking-tight">Pronto para o próximo passo?</h4>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start">
                        <Icon icon="material-symbols:calendar-today" className="size-3.5 text-primary/60" />
                        Inscrições {job.registrationDeadline ? `até ${formatDate(job.registrationDeadline, { day: '2-digit', month: 'long' })}` : 'abertas por tempo limitado'}
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    {isAuthenticated && (
                        <button
                            onClick={() => toggleFavorite(job.id)}
                            className={`size-10 flex items-center justify-center transition-all hover:scale-110 ${
                                isFav ? 'text-secondary' : 'text-muted-foreground/40 hover:text-muted-foreground'
                            }`}
                            title={isFav ? "Remover dos favoritos" : "Salvar vaga"}
                        >
                            <Icon
                                icon="fa6-duotone:star"
                                className="text-[28px]"
                            />
                        </button>

                    )}
                    <button
                        onClick={() => onApply(job.id)}
                        className="flex-1 md:flex-none md:w-auto h-9 px-6 bg-primary text-primary-foreground font-semibold text-[10px] tracking-widest rounded-lg transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                    >
                        Candidatar-se
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobDetailView;
