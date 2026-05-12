// @component JobCardPublic | @tipo componente | @versao 1.0.0
// > Card de vaga para listagem pública — título, local, modelo, salário

import React from 'react';
import { Icon } from "@iconify/react";
import { formatDate } from '@src/lib/formatters';

export interface PublicJob {
    id: string;
    title: string;
    department: string;
    location: string;
    model: string;      // Modalidade (Presencial, Híbrido, Remoto)
    contract: string;   // Tipo de contrato (CLT, PJ, Estágio)
    seniority: string;  // Senioridade
    tags: string[];
    isNew?: boolean;
    isUrgent?: boolean;
    isPcd?: boolean;
    urgencyLevel?: 'Alta' | 'Média' | 'Baixa';
    createdAt?: string;
    deadline?: string;   // Prazo de inscrição
    status?: string;
    salaryMin?: number;  // Salário mínimo
    salaryMax?: number;  // Salário máximo
    positionsCount?: number;  // Quantidade de vagas abertas
    requirements?: string[];  // Requisitos
    experienceMin?: string;  // Experiência mínima
    reportsTo?: string;  // Gestor(a)
    rank?: number;  // Posição em recomendações personalizadas
}

interface JobCardPublicProps {
    job: PublicJob;
    onApply: (id: string) => void;
    onDetails: (id: string) => void;
}

const JobCardPublic: React.FC<JobCardPublicProps> = ({ job, onApply, onDetails }) => {
    const formattedDeadline = job.deadline 
        ? formatDate(job.deadline, { day: '2-digit', month: 'long' })
        : null;
    const departmentLabel = job.department?.trim();

    return (
        <article className="group relative bg-card/60 backdrop-blur-md border border-border/50 hover:border-primary/40 p-4 md:p-5 rounded-[18px] transition-all duration-500 flex flex-col md:flex-row gap-5 items-start md:items-center overflow-hidden">
            {/* Favorite Button */}
            <button 
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white border border-border text-muted hover:text-primary transition-all duration-300 group/fav shadow-sm"
                onClick={(e) => {
                    e.stopPropagation();
                    // Fav logic here
                }}
                title="Favoritar vaga"
            >
                <Icon icon="ph:star-fill" className="size-5 transition-transform group-hover/fav:scale-110" />
            </button>
            
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
            
            <div className="flex-1 space-y-3 relative z-10 w-full">
                <div className="flex flex-wrap items-center gap-2">
                    {departmentLabel && (
                        <span className="inline-flex items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/10">
                            <Icon icon="material-symbols:work-outline" className="size-3" />
                            {departmentLabel}
                        </span>
                    )}
                    
                    {job.isUrgent && (
                        <span className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary text-[8.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-secondary/20 animate-pulse">
                            <Icon icon="material-symbols:priority-high" className="size-3" />
                            Urgente
                        </span>
                    )}
                    
                    {job.isNew && (
                        <span className="inline-flex items-center gap-1.5 bg-success/10 text-success text-[8.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-success/20">
                            <Icon icon="material-symbols:fiber-new" className="size-3" />
                            Novo
                        </span>
                    )}

                    {formattedDeadline && (
                        <span className="inline-flex items-center gap-1.5 bg-muted/50 text-muted-foreground text-[8.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-border/50 ml-auto md:ml-0">
                            <Icon icon="material-symbols:calendar-today-outline" className="size-3" />
                            Até {formattedDeadline}
                        </span>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300 uppercase">
                        {job.title}
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-border/30">
                        <div className="space-y-0">
                            <p className="text-[8.5px] font-bold text-muted-foreground/60 uppercase tracking-widest">Localidade</p>
                            <div className="flex items-center gap-1 text-[12px] font-semibold text-foreground">
                                <Icon icon="material-symbols:location-on" className="size-3 text-primary/60" />
                                {job.location}
                            </div>
                        </div>
                        <div className="space-y-0">
                            <p className="text-[8.5px] font-bold text-muted-foreground/60 uppercase tracking-widest">Modalidade</p>
                            <div className="flex items-center gap-1 text-[12px] font-semibold text-foreground">
                                <Icon icon="material-symbols:home-work" className="size-3 text-primary/60" />
                                {job.model}
                            </div>
                        </div>
                        <div className="space-y-0">
                            <p className="text-[8.5px] font-bold text-muted-foreground/60 uppercase tracking-widest">Contrato</p>
                            <div className="flex items-center gap-1 text-[12px] font-semibold text-foreground">
                                <Icon icon="material-symbols:description" className="size-3 text-primary/60" />
                                {job.contract}
                            </div>
                        </div>
                        <div className="space-y-0">
                            <p className="text-[8.5px] font-bold text-muted-foreground/60 uppercase tracking-widest">Senioridade</p>
                            <div className="flex items-center gap-1 text-[12px] font-semibold text-foreground">
                                <Icon icon="material-symbols:trending-up" className="size-3 text-primary/60" />
                                {job.seniority}
                            </div>
                        </div>
                        {job.reportsTo && (
                            <div className="space-y-0">
                                <p className="text-[8.5px] font-bold text-muted-foreground/60 uppercase tracking-widest">Gestor(a)</p>
                                <div className="flex items-center gap-1 text-[12px] font-semibold text-foreground">
                                    <Icon icon="material-symbols:supervisor-account" className="size-3 text-primary/60" />
                                    {job.reportsTo}
                                </div>
                            </div>
                        )}
                        {job.positionsCount && job.positionsCount > 0 && (
                            <div className="space-y-0">
                                <p className="text-[8.5px] font-bold text-muted-foreground/60 uppercase tracking-widest">Vagas</p>
                                <div className="flex items-center gap-1 text-[12px] font-semibold text-foreground">
                                    <Icon icon="material-symbols:group" className="size-3 text-primary/60" />
                                    {job.positionsCount} {job.positionsCount === 1 ? 'vaga' : 'vagas'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full md:w-auto gap-2 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-border/30 md:pl-5 relative z-10 shrink-0">
                <button
                    onClick={() => onApply(job.id)}
                    className="group/btn w-full md:w-44 h-11 bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all hover:bg-primary/90 active:scale-95 flex items-center justify-center gap-2"
                >
                    Candidatar-se
                    <Icon icon="material-symbols:arrow-forward-rounded" className="size-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
                <button
                    onClick={() => onDetails(job.id)}
                    className="w-full md:w-44 h-11 bg-background/50 backdrop-blur-sm border border-border/60 text-foreground font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all hover:bg-muted/50 hover:border-primary/20 active:scale-95 flex items-center justify-center gap-2"
                >
                    Ver Detalhes
                    <Icon icon="material-symbols:visibility-outline" className="size-4" />
                </button>
            </div>
        </article>
    );
};

export default JobCardPublic;
