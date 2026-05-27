import React from 'react';
import { Icon } from "@iconify/react";
import { formatSalaryRange, formatDate, formatJobId } from "@src/lib/formatters";
import { getBenefitColorClass } from "@src/lib/job-helpers";

interface JobDetailViewProps {
    job: any;
    onApply: (jobId: string) => void;
    isAuthenticated: boolean;
    isFavorite: (jobId: string) => boolean;
    toggleFavorite: (jobId: string) => void;
}

const JobDetailView: React.FC<JobDetailViewProps> = ({ 
    job, 
    onApply, 
    isAuthenticated,
    isFavorite,
    toggleFavorite
}) => {
    // Defensive check
    if (!job) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-3xl bg-muted/5">
                <Icon icon="material-symbols:work-outline" className="size-16 text-muted-foreground/20 mb-4" />
                <h3 className="text-lg font-semibold text-foreground/60 tracking-tight">Selecione uma vaga</h3>
                <p className="text-sm text-muted-foreground max-w-xs mt-2">
                    Clique em uma das vagas da lista ao lado para ver os detalhes completos aqui.
                </p>
            </div>
        );
    }

    const isFav = isFavorite?.(job.id) || false;

    // Helper para garantir que campos que podem vir como string (newline separated) ou array sejam tratados corretamente
    const ensureArray = (val: any): string[] => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') return val.split('\n').filter(s => s.trim().length > 0);
        return [];
    };

    const techReqs = ensureArray(job.requirements_technical);
    const behavioralReqs = ensureArray(job.requirements_behavioral);
    const kpis = ensureArray(job.kpis);
    const competencies = ensureArray(job.competencies);
    const generalReqs = ensureArray(job.requirements);

    return (
        <div className="bg-card/30 backdrop-blur-xl rounded-3xl border border-border/40 p-6 md:p-10 space-y-12 transition-all hover:border-border/60">
            {/* Header / Intro */}
            <div className="space-y-3">
                    <div className="space-y-2">
                        <div className="flex items-baseline gap-3">
                            <h2 className="text-4xl font-bold text-foreground tracking-tighter">{job.title}</h2>
                            {(job.job_number || job.jobNumber) && (
                                <span className="text-[11px] font-semibold text-muted-foreground/50 tracking-widest shrink-0">
                                    {formatJobId(job.job_number ?? job.jobNumber)}
                                </span>
                            )}
                        </div>
                        
                        {/* Metadata Line - Group 1 (Main Info) */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
                            <span className="flex items-center gap-1.5 text-blue-600 font-extrabold">
                                {job.company_name || job.company?.name || 'INCICast'}
                            </span>
                            <span className="text-border/40">•</span>
                            <span className="flex items-center gap-1.5">
                                <Icon icon="ph:map-pin-bold" className="size-3.5" />
                                {job.location || 'Juazeiro do Norte - CE'}
                            </span>
                            <span className="text-border/40">•</span>
                            <span className="flex items-center gap-1.5">
                                <Icon icon="ph:house-bold" className="size-3.5" />
                                {job.model || 'Presencial'}
                            </span>
                            <span className="text-border/40">•</span>
                            <span className="flex items-center gap-1.5">
                                <Icon icon="ph:file-text-bold" className="size-3.5" />
                                {job.contract || 'CLT'}
                            </span>
                            <span className="text-border/40">•</span>
                            <span className="flex items-center gap-1.5">
                                <Icon icon="ph:briefcase-bold" className="size-3.5" />
                                {job.level || job.seniority || 'Não informada'}
                            </span>
                            <span className="text-border/40">•</span>
                            <span className="flex items-center gap-1.5">
                                <Icon icon="ph:clock-bold" className="size-3.5" />
                                {job.workSchedule || job.work_schedule || 'Não informada'}
                            </span>
                            {job.hiring_manager && (
                                <>
                                    <span className="text-border/40">•</span>
                                    <span className="flex items-center gap-1.5">
                                        <Icon icon="ph:user-focus-bold" className="size-3.5" />
                                        {job.hiring_manager}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Metadata Line - Group 2 (Secondary Info / Highlights) */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1.5 text-foreground/80">
                                <Icon icon="ph:medal-bold" className="size-3.5" />
                                {job.experienceMin || job.experience_min ? `Experiência Mínima de ${job.experienceMin || job.experience_min}` : 'Experiência não informada'}
                            </span>
                            <span className="flex items-center gap-4 text-foreground/80">
                                {formatSalaryRange(job.salary_min, job.salary_max)}
                            </span>
                        </div>
                    </div>


                </div>

            {/* Description Content */}
            <div className="space-y-10">
                {/* Context & Mission */}
                <div className="grid grid-cols-1 gap-12">
                    {job.mission && (
                        <section className="space-y-4">
                            <div className="flex items-center gap-4">
                                <h3 className="text-[13px] font-bold text-foreground uppercase tracking-widest">Missão da Vaga</h3>
                                <div className="h-px flex-1 bg-border/40" />
                            </div>
                            <div className="text-sm font-medium text-foreground/70 leading-relaxed break-words whitespace-pre-line">
                                {job.mission}
                            </div>
                        </section>
                    )}

                </div>

                    <div className="grid grid-cols-1 gap-6 pt-2">
                        {/* Bloco 1: Necessários */}
                        <div className="space-y-3">
                            <h4 className="text-[12px] font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2 pb-4 border-b border-border/60">
                                Requisitos Necessários
                            </h4>
                            <div className="grid grid-cols-1 gap-1.5">
                                {[...generalReqs, ...techReqs].length > 0 ? (
                                    [...generalReqs, ...techReqs].map((req, i) => (
                                        <div key={i} className="flex items-start gap-3 group">
                                            <div className="size-1.5 rounded-full bg-blue-600/40 mt-1.5 shrink-0 group-hover:bg-blue-600 transition-colors" />
                                            <span className="text-[13px] font-medium text-foreground/80 leading-relaxed">
                                                {req}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-[11px] text-muted-foreground italic">Informação não fornecida</span>
                                )}
                            </div>
                        </div>

                        {/* Bloco 2: Competências */}
                        <div className="space-y-3">
                            <h4 className="text-[12px] font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2 pb-4 border-b border-border/60">
                                Competências Comportamentais e Habilidades
                            </h4>
                            <div className="grid grid-cols-1 gap-1.5">
                                {competencies.length > 0 ? (
                                    competencies.map((c, i) => (
                                        <div key={i} className="flex items-start gap-3 group">
                                            <div className="size-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0 group-hover:bg-primary transition-colors" />
                                            <span className="text-[13px] font-medium text-foreground/80 leading-relaxed">
                                                {c}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-[11px] text-muted-foreground italic">Informação não fornecida</span>
                                )}
                            </div>
                        </div>

                        {/* Bloco 3: Desejáveis */}
                        <div className="space-y-3">
                            <h4 className="text-[12px] font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2 pb-4 border-b border-border/60">
                                Requisitos Desejáveis
                            </h4>
                            <div className="grid grid-cols-1 gap-1.5">
                                {behavioralReqs.length > 0 ? (
                                    behavioralReqs.map((req, i) => (
                                        <div key={i} className="flex items-start gap-3 group">
                                            <div className="size-1.5 rounded-full bg-blue-600/40 mt-1.5 shrink-0 group-hover:bg-blue-600 transition-colors" />
                                            <span className="text-[13px] font-medium text-foreground/80 leading-relaxed">
                                                {req}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-[11px] text-muted-foreground italic">Informação não fornecida</span>
                                )}
                            </div>
                        </div>

                        {/* Bloco 4: KPIs */}
                        <div className="space-y-3">
                            <h4 className="text-[12px] font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2 pb-4 border-b border-border/60">
                                Indicadores de Desempenho (KPIs)
                            </h4>
                            <div className="grid grid-cols-1 gap-1.5">
                                {kpis.length > 0 ? (
                                    kpis.map((kpi, i) => (
                                        <div key={i} className="flex items-start gap-3 group">
                                            <div className="size-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0 group-hover:bg-primary transition-colors" />
                                            <span className="text-[13px] font-medium text-foreground/80 leading-relaxed">
                                                {kpi}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-[11px] text-muted-foreground italic">Informação não fornecida</span>
                                )}

                            </div>
                        </div>
                    </div>





                {/* Responsibilities */}
                {ensureArray(job.responsibilities).length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-[13px] font-bold text-foreground uppercase tracking-widest">Atividades e Responsabilidades</h3>
                            <div className="h-px flex-1 bg-border/40" />
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {ensureArray(job.responsibilities).map((item: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-4 p-5 bg-card border border-border/60 rounded-2xl group hover:border-primary/40 transition-all">
                                    <Icon icon="material-symbols:check-circle-outline" className="size-5 text-primary mt-0.5 shrink-0" />
                                    <span className="text-[14px] font-medium text-foreground/80 leading-relaxed">{item}</span>
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
                        <div className="flex flex-wrap gap-3">
                            {job.benefits.map((benefit: any, i: number) => {
                                const colorClass = getBenefitColorClass(benefit.colorId);

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
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {isAuthenticated && (
                        <button
                            onClick={() => toggleFavorite(job.id)}
                            className={`size-12 flex items-center justify-center rounded-xl transition-all ${
                                isFav ? 'bg-secondary/10 text-secondary' : 'text-muted-foreground/40 hover:text-muted-foreground'
                            }`}
                            title={isFav ? "Remover dos favoritos" : "Salvar vaga"}
                        >
                            <Icon icon={isFav ? "ph:star-fill" : "ph:star-bold"} className="size-6" />
                        </button>
                    )}
                    <button
                        onClick={() => onApply(job.id)}
                        className="flex-1 md:flex-none md:w-auto h-12 px-8 bg-primary text-primary-foreground font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all hover:opacity-95 active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        Candidatar-se à vaga
                        <Icon icon="material-symbols:arrow-right-alt" className="size-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobDetailView;
