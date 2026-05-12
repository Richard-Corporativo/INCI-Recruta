'use client';
import { Icon } from "@iconify/react";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Candidate } from '@src/types';
import { formatDate, parseDate } from '@src/lib/formatters';

interface SortableCandidateCardProps {
    candidate: Candidate;
    onClick: (candidate: Candidate) => void;
    onQuickView?: (candidate: Candidate) => void;
    slaLimit?: number;
}

const SortableCandidateCard: React.FC<SortableCandidateCardProps> = ({ candidate, onClick, onQuickView, slaLimit = 2 }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: String(candidate.id) });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1,
    };

    // SLA Calculation
    const entryDate = parseDate(candidate.currentStageEntry || candidate.applied_at);
    const daysInStage = entryDate ? Math.max(0, Math.floor((Date.now() - entryDate.getTime()) / (1000 * 3600 * 24))) : 0;
    const isOverSla = daysInStage >= slaLimit;
    const isNearSla = daysInStage >= slaLimit * 0.7;

    const slaColor = isOverSla ? 'text-red-600' : isNearSla ? 'text-amber-600' : 'text-emerald-600';
    const slaBadgeColor = isOverSla ? 'bg-red-500/10 border-red-200' : isNearSla ? 'bg-amber-500/10 border-amber-200' : 'bg-emerald-500/10 border-emerald-200';

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={(e) => {
                onClick(candidate);
            }}
            className="bg-card p-3 rounded-2xl border border-border  hover: hover:border-ring transition-all duration-200 ease-in-out cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-ring touch-none"
        >
            <div className="flex justify-between items-start mb-2 transition-all">
                <div className="flex items-center gap-2">
                    <div
                        className={`size-8 rounded-full ${candidate.avatarColor || 'bg-primary'} ${candidate.textColor || 'text-white'} flex items-center justify-center text-xs font-semibold shrink-0  transition-colors bg-cover bg-center`}
                        style={candidate.avatar ? { backgroundImage: `url("${candidate.avatar}")` } : {}}
                    >
                        {!candidate.avatar && candidate.initials}
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="text-sm font-semibold text-foreground leading-tight transition-colors line-clamp-1 truncate block w-full">{candidate.name}</h4>
                        <span className="text-[10px] text-muted-foreground font-medium transition-colors block">
                            {candidate.nextInterview ? (
                                <span className="text-primary flex items-center gap-0.5">
                                    <Icon icon="material-symbols:calendar-today" className="text-[12px] filled" width="12" height="12" />
                                    {formatDate(candidate.nextInterview.date)} {candidate.nextInterview.time}
                                </span>
                            ) : (candidate.role || 'Candidato')}
                        </span>
                    </div>
                </div>

                {candidate.has_resume && (
                    <div className="shrink-0" title="Currículo disponível">
                        <Icon icon="material-symbols:description" className="text-[16px] text-primary/70" width="16" height="16" />
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-1 mb-2 transition-all">
                <span className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded border border-border text-[10px] font-semibold transition-colors">
                    {candidate.nextInterview ? candidate.nextInterview.type : (candidate.role || 'Candidato')}
                </span>
                {candidate.match && (
                    <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded border border-primary/20 text-[10px] font-bold">
                        {candidate.match} Match
                    </span>
                )}
                <div className={`px-1.5 py-0.5 rounded border text-[10px] font-bold flex items-center gap-1 ${slaBadgeColor} ${slaColor}`}>
                    <Icon icon="material-symbols:schedule" className="text-[12px]" width="12" height="12" />
                    {daysInStage}d
                </div>
            </div>

            <div className="pt-2 border-t border-border/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                {onQuickView && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onQuickView(candidate);
                        }}
                        className="p-1 text-muted-foreground hover:text-primary rounded-full hover:bg-primary/10 transition-colors"
                        title="Visualização Rápida"
                    >
                        <Icon icon="material-symbols:visibility" className="text-[16px]" width="16" height="16" />
                    </button>
                )}
                <div className="flex items-center gap-1 ml-auto">
                    <span className="text-[10px] font-bold text-primary">Ver Detalhes</span>
                    <Icon icon="material-symbols:arrow-forward" className="text-muted-foreground text-[14px]" width="14" height="14" />
                </div>
            </div>
        </div >
    );
};

export default SortableCandidateCard;

