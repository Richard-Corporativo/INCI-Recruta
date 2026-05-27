// @component JobDetailSpec | @tipo page-component | @versao 1.0.0
// > Especificações da vaga — requisitos, benefícios, responsabilidades
// @api Job — dados da vaga

import React from 'react';
import { Icon } from "@iconify/react";
import { Job } from '@src/types';

interface JobDetailSpecProps {
    job: Job;
}

const JobDetailSpec: React.FC<JobDetailSpecProps> = ({ job }) => {
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
        <section className="bg-card rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
            <div className="px-8 py-5 border-b border-border bg-muted/30 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
                    <Icon icon="material-symbols:description" className="text-primary h-5 w-5" aria-hidden="true" />
                    Especificações do Cargo
                </h2>
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Visualização Interna</span>
                </div>
            </div>

            <div className="p-10 space-y-12">
                <article>
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="h-px w-6 bg-primary/30"></span>
                        Missão da Vaga
                    </h3>
                    <div className="text-base text-foreground/80 leading-relaxed font-medium pl-8 border-l-2 border-primary/10 whitespace-pre-wrap">
                        {job.mission}
                    </div>
                </article>

                <div className="grid grid-cols-1 gap-8 pt-4">
                    {/* Requisitos Necessários */}
                    <div className="space-y-4">
                        <h4 className="text-[12px] font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2 pb-3 border-b border-border/60">
                            Requisitos Necessários
                        </h4>
                        <div className="grid grid-cols-1 gap-2 pl-2">
                            {[...generalReqs, ...techReqs].length > 0 ? (
                                [...generalReqs, ...techReqs].map((req, i) => (
                                    <div key={i} className="flex items-start gap-3 group">
                                        <div className="size-1.5 rounded-full bg-blue-600/40 mt-1.5 shrink-0" />
                                        <span className="text-[13px] font-medium text-foreground/80 leading-relaxed">{req}</span>
                                    </div>
                                ))
                            ) : (
                                <span className="text-[11px] text-muted-foreground italic">Informação não fornecida</span>
                            )}
                        </div>
                    </div>

                    {/* Competências */}
                    <div className="space-y-4">
                        <h4 className="text-[12px] font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2 pb-3 border-b border-border/60">
                            Competências Comportamentais e Habilidades
                        </h4>
                        <div className="grid grid-cols-1 gap-2 pl-2">
                            {competencies.length > 0 ? (
                                competencies.map((c, i) => (
                                    <div key={i} className="flex items-start gap-3 group">
                                        <div className="size-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                                        <span className="text-[13px] font-medium text-foreground/80 leading-relaxed">{c}</span>
                                    </div>
                                ))
                            ) : (
                                <span className="text-[11px] text-muted-foreground italic">Informação não fornecida</span>
                            )}
                        </div>
                    </div>

                    {/* Requisitos Desejáveis */}
                    <div className="space-y-4">
                        <h4 className="text-[12px] font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2 pb-3 border-b border-border/60">
                            Requisitos Desejáveis
                        </h4>
                        <div className="grid grid-cols-1 gap-2 pl-2">
                            {behavioralReqs.length > 0 ? (
                                behavioralReqs.map((req, i) => (
                                    <div key={i} className="flex items-start gap-3 group">
                                        <div className="size-1.5 rounded-full bg-blue-600/40 mt-1.5 shrink-0" />
                                        <span className="text-[13px] font-medium text-foreground/80 leading-relaxed">{req}</span>
                                    </div>
                                ))
                            ) : (
                                <span className="text-[11px] text-muted-foreground italic">Informação não fornecida</span>
                            )}
                        </div>
                    </div>

                    {/* KPIs */}
                    <div className="space-y-4">
                        <h4 className="text-[12px] font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2 pb-3 border-b border-border/60">
                            Indicadores de Desempenho (KPIs)
                        </h4>
                        <div className="grid grid-cols-1 gap-2 pl-2">
                            {kpis.length > 0 ? (
                                kpis.map((kpi, i) => (
                                    <div key={i} className="flex items-start gap-3 group">
                                        <div className="size-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                                        <span className="text-[13px] font-medium text-foreground/80 leading-relaxed">{kpi}</span>
                                    </div>
                                ))
                            ) : (
                                <span className="text-[11px] text-muted-foreground italic">Informação não fornecida</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-8 opacity-20">
                    <div className="size-1.5 rounded-full bg-muted-foreground"></div>
                    <div className="size-1.5 rounded-full bg-muted-foreground mx-4"></div>
                    <div className="size-1.5 rounded-full bg-muted-foreground"></div>
                </div>
            </div>
        </section>
    );
};

export default JobDetailSpec;
