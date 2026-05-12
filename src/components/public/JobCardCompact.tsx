'use client';
// @component JobCardCompact | @tipo componente | @versao 2.0.0
// > Card de vaga em formato compacto — listagem resumida

import React from 'react';
import { Icon } from "@iconify/react";
import { PublicJob } from './JobCardPublic';
import { useFavoriteJobs } from '@src/hooks/useFavoriteJobs';
import { formatDate } from '@src/lib/formatters';

const modelIcons: Record<string, string> = {
    'Remoto':     'material-symbols:home-work',
    'Híbrido':    'material-symbols:sync-alt',
    'Presencial': 'material-symbols:location-city',
};

const contractIcons: Record<string, string> = {
    'CLT':        'material-symbols:badge',
    'PJ':         'material-symbols:business-center',
    'Estágio':    'material-symbols:school',
    'Temporário': 'material-symbols:schedule',
};

interface JobCardCompactProps {
    job: PublicJob;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

const JobCardCompact: React.FC<JobCardCompactProps> = ({ job, isSelected, onSelect }) => {
    const { isFavorite, toggleFavorite } = useFavoriteJobs();
    const isFav = isFavorite(job.id);
    const departmentLabel = job.department?.trim();

    const tag = (icon: string, label: string) => (
        <span
            key={label}
            className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded shrink-0 ${
                isSelected ? 'bg-white/10 text-white' : 'bg-muted text-muted-foreground'
            }`}
        >
            <Icon icon={icon} className="size-3.5" />
            {label}
        </span>
    );

    return (
        <div
            onClick={() => onSelect(job.id)}
            className={`group cursor-pointer p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                isSelected
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-card border-border hover:border-primary/40 text-foreground hover:bg-muted/30'
            }`}
        >
            <div className="space-y-2.5 relative z-10">

                {/* Header: departamento + urgência + estrela */}
                <div className="flex items-center justify-between gap-2">
                    {departmentLabel ? (
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                            isSelected ? 'bg-white/10 border-white/20 text-white' : 'bg-primary/5 border-primary/10 text-primary'
                        }`}>
                            {departmentLabel}
                        </span>
                    ) : <span />}

                    <div className="flex items-center gap-1.5">
                        {job.isUrgent && (
                            <div className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 ${
                                isSelected ? 'bg-white text-red-600 border-white' : 'bg-red-50 text-red-600 border-red-100'
                            }`}>
                                <span className="text-[9px] font-bold uppercase">Urgente</span>
                                <span className="size-1.5 rounded-full animate-pulse bg-red-500" />
                            </div>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(job.id); }}
                            className={`transition-all hover:scale-125 ${
                                isFav ? 'text-secondary' : isSelected ? 'text-white/40' : 'text-muted-foreground/30'
                            }`}
                            title={isFav ? 'Remover dos favoritos' : 'Salvar vaga'}
                        >
                            <Icon icon={isFav ? 'ph:star-fill' : 'ph:star'} className="size-4" />
                        </button>
                    </div>
                </div>

                {/* Título */}
                <h3 className={`text-sm font-bold tracking-tight leading-tight uppercase ${
                    isSelected ? 'text-white' : 'text-foreground'
                }`}>
                    {job.title}
                </h3>

                {/* Localidade + Senioridade + Salário */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 opacity-80">
                    {job.location && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide">
                            <Icon icon="material-symbols:location-on" className="size-3.5" />
                            {job.location}
                        </div>
                    )}
                    {job.seniority && job.seniority !== 'Não definida' && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide">
                            <Icon icon="material-symbols:trending-up" className="size-3.5" />
                            {job.seniority}
                        </div>
                    )}
                    {(job.salaryMin || job.salaryMax) && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide">
                            <Icon icon="material-symbols:attach-money" className="size-3.5" />
                            {job.salaryMin && job.salaryMax
                                ? `R$ ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k`
                                : job.salaryMin
                                ? `R$ ${(job.salaryMin / 1000).toFixed(0)}k+`
                                : job.salaryMax
                                ? `R$ ${(job.salaryMax / 1000).toFixed(0)}k`
                                : null}
                        </div>
                    )}
                    {job.positionsCount && job.positionsCount > 0 && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide">
                            <Icon icon="material-symbols:group" className="size-3.5" />
                            {job.positionsCount} {job.positionsCount === 1 ? 'vaga' : 'vagas'}
                        </div>
                    )}
                    {job.reportsTo && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide">
                            <Icon icon="material-symbols:supervisor-account" className="size-3.5" />
                            {job.reportsTo}
                        </div>
                    )}
                </div>

                {/* Tags com ícones */}
                <div className={`flex items-center gap-1.5 pt-2 border-t overflow-hidden ${
                    isSelected ? 'border-white/10' : 'border-border/40'
                }`}>
                    {job.model    && tag(modelIcons[job.model]       ?? 'material-symbols:work',        job.model)}
                    {job.contract && tag(contractIcons[job.contract]  ?? 'material-symbols:description', job.contract)}
                    {job.isPcd    && tag('material-symbols:accessible', 'PCD')}
                    {job.deadline && tag(
                        'material-symbols:calendar-today-outline',
                        `Até ${formatDate(job.deadline, { day: '2-digit', month: '2-digit' })}`
                    )}
                </div>
            </div>

            {/* Seta de hover */}
            {!isSelected && (
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 p-3 opacity-0 group-hover:opacity-100 group-hover:right-1 transition-all duration-300">
                    <Icon icon="material-symbols:chevron-right-rounded" className="size-5 text-primary/60" />
                </div>
            )}
        </div>
    );
};

export default JobCardCompact;
