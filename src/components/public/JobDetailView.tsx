'use client';
// @component JobDetailView | @tipo componente | @versao 1.0.0
// > Visualização detalhada de vaga — missão, responsabilidades, requisitos, benefícios
// @api job: JobDetail


import React from 'react';
import { Icon } from "@iconify/react";
import { PublicJob } from './JobCardPublic';
import { useAuth } from '@src/context/AuthContext';
import { useFavoriteJobs } from '@src/hooks/useFavoriteJobs';

interface JobDetailViewProps {
    job: any; // Using any for now to match the complex mapping in JobDetailPublic
    onApply: (id: string) => void;
}

const JobDetailView: React.FC<JobDetailViewProps> = ({ job, onApply }) => {
    const { isAuthenticated } = useAuth();
    const { isFavorite, toggleFavorite } = useFavoriteJobs();
    
    const isFav = job ? isFavorite(job.id) : false;
    if (!job) return (
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center border-2 border-border border-dashed bg-muted/10 rounded-3xl h-full min-h-[600px]">
            <div className="size-20 bg-background border border-border flex items-center justify-center mb-8 rounded-2xl">
                <Icon icon="material-symbols:info" className="text-muted-foreground/20 size-10" />
            </div>
                <h3 className="text-2xl font-semibold tracking-tight mb-2">Selecione uma Oportunidade.</h3>
                        <p className="text-muted-foreground text-[11px] max-w-xs font-semibold tracking-wide leading-relaxed">
                Escolha uma vaga na lateral para visualizar os detalhes completos e requisitos da posição.
            </p>
        </div>
    );

    return (
        <div className="space-y-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-150">
            {/* Header / Summary */}
            <div className="space-y-6">
                <div className="space-y-1">
                    <span className="inline-flex items-center text-[10px] font-semibold text-primary tracking-widest bg-primary/5 px-2.5 py-1 rounded-lg">
                        {job.area}
                    </span>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1">
                            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight">
                                {job.title}
                            </h1>
                            <p className="text-[10px] text-muted-foreground/50 font-mono tracking-wider mt-1">
                                ID #{String(job.id).slice(-6).toUpperCase()} · Rev. {job.revision ?? 0}
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

                <div className="bg-card border border-border rounded-xl p-4 md:p-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-5">
                        {([
                            { label: 'Departamento',       val: job.area,          icon: 'material-symbols:corporate-fare' },
                            { label: 'Localização',        val: job.location,      icon: 'material-symbols:location-on' },
                            { label: 'Modelo',             val: job.model,         icon: 'material-symbols:home-work' },
                            { label: 'Contrato',           val: job.contract,      icon: 'material-symbols:description' },
                            { label: 'Nível',              val: job.level,         icon: 'material-symbols:trending-up' },
                            { label: 'Urgência',           val: job.urgency,       icon: 'material-symbols:priority-high' },
                            { label: 'Exp. Mínima',        val: job.experienceMin, icon: 'material-symbols:work-history' },
                            {
                                label: 'Faixa Salarial',
                                val: job.salary?.min || job.salary?.max
                                    ? [job.salary.min && `R$ ${Number(job.salary.min).toLocaleString('pt-BR')}`, job.salary.max && `R$ ${Number(job.salary.max).toLocaleString('pt-BR')}`].filter(Boolean).join(' – ')
                                    : 'A combinar',
                                icon: 'material-symbols:payments'
                            },
                            {
                                label: 'Inscrições até',
                                val: job.registrationDeadline
                                    ? new Date(job.registrationDeadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
                                    : 'Tempo limitado',
                                icon: 'material-symbols:calendar-today'
                            },
                        ] as { label: string; val?: string; icon: string }[])
                            .filter(item => item.val)
                            .map((item, i) => (
                            <div key={i} className="flex flex-col gap-1 min-w-0">
                                <div className="flex items-center gap-1.5 text-[9px] font-semibold text-muted-foreground uppercase tracking-widest leading-none">
                                    <Icon icon={item.icon} className="size-3 text-primary/50 shrink-0" />
                                    <span className="truncate">{item.label}</span>
                                </div>
                                <p className="text-[13px] font-semibold text-foreground tracking-tight leading-tight">
                                    {item.val}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {job.requirements.map((req: string, i: number) => (
                                <div key={i} className="flex items-start gap-3 p-3 border border-border rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                                    <Icon icon="material-symbols:check-circle" className="text-primary size-4 mt-0.5 shrink-0" />
                                    <span className="text-[12px] font-semibold text-foreground/80 leading-tight break-words">{req}</span>
                                </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {job.requirementsTechnical.map((req: string, i: number) => (
                                <div key={i} className="flex items-start gap-3 p-3 border border-border rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                                    <Icon icon="material-symbols:code" className="text-primary size-4 mt-0.5 shrink-0" />
                                    <span className="text-[12px] font-semibold text-foreground/80 leading-tight break-words">{req}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Requisitos Comportamentais */}
                {job.requirementsBehavioral?.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-[15px] font-semibold text-foreground tracking-tight">Requisitos Comportamentais</h3>
                            <div className="h-px flex-1 bg-border/60" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {job.requirementsBehavioral.map((req: string, i: number) => (
                                <div key={i} className="flex items-start gap-3 p-3 border border-border rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                                    <Icon icon="material-symbols:psychology" className="text-primary size-4 mt-0.5 shrink-0" />
                                    <span className="text-[12px] font-semibold text-foreground/80 leading-tight break-words">{req}</span>
                                </div>
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
                                <span key={i} className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5 text-primary">
                                    <Icon icon="material-symbols:star-outline" className="size-3.5 shrink-0" />
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {job.kpis.map((kpi: string, i: number) => (
                                <div key={i} className="flex items-start gap-3 p-3 border border-border rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                                    <Icon icon="material-symbols:bar-chart" className="text-primary size-4 mt-0.5 shrink-0" />
                                    <span className="text-[12px] font-semibold text-foreground/80 leading-tight break-words">{kpi}</span>
                                </div>
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
                                <div key={idx} className="flex items-start justify-between p-4 bg-card border border-border rounded-xl group hover:border-primary/40 transition-all gap-4">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {job.benefits.map((benefit: any, i: number) => {
                                const colorMap: Record<string, string> = {
                                    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                                    sky: 'bg-sky-50 text-sky-700 border-sky-100',
                                    violet: 'bg-violet-50 text-violet-700 border-violet-100',
                                    rose: 'bg-rose-50 text-rose-700 border-rose-100',
                                    amber: 'bg-amber-50 text-amber-700 border-amber-100',
                                    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100',
                                    lime: 'bg-lime-50 text-lime-700 border-lime-100',
                                    fuchsia: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
                                    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
                                    teal: 'bg-teal-50 text-teal-700 border-teal-100',
                                };
                                const colorClass = colorMap[benefit.colorId] || colorMap.sky;

                                return (
                                    <div key={i} className={`flex items-center gap-2 p-2.5 border rounded-xl transition-all hover:shadow-sm ${colorClass}`}>
                                        <div className="size-7 bg-white/60 flex items-center justify-center rounded-lg shrink-0">
                                            <Icon icon={benefit.icon.includes(':') ? benefit.icon : `material-symbols:${benefit.icon}`} className="size-3.5" />
                                        </div>
                                        <span className="text-[10px] font-bold tracking-tight leading-snug">
                                            {benefit.title}
                                        </span>
                                    </div>
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
                        Inscrições {job.registrationDeadline ? `até ${new Date(job.registrationDeadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}` : 'abertas por tempo limitado'}
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
                                style={{ fontSize: '28px', color: isFav ? 'var(--secondary)' : 'rgba(var(--muted-foreground), 0.4)' }} 
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
