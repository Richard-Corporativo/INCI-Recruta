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
    return (
        <section className="bg-card rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
            <div className="px-8 py-5 border-b border-border bg-muted/30 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
                    <Icon icon="material-symbols:description" className="text-primary h-5 w-5" aria-hidden="true" />
                    Especificações do Cargo
                </h2>
                <div className="flex items-center gap-2 bg-card rounded-full p-6">
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Visualização Interna</span>
                </div>
            </div>

            <div className="p-10 space-y-12">
                <article>
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="h-px w-6 bg-primary/30"></span>
                        Contexto e Desafios
                    </h3>
                    <div className="text-base text-foreground/80 leading-relaxed font-medium pl-8 border-l-2 border-primary/10 whitespace-pre-wrap">
                        {job.context}
                    </div>
                </article>

                <article>
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="h-px w-6 bg-primary/30"></span>
                        Missão da Posição
                    </h3>
                    <div className="text-base text-foreground/80 leading-relaxed font-medium pl-8 border-l-2 border-primary/10 whitespace-pre-wrap">
                        {job.mission}
                    </div>
                </article>

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
