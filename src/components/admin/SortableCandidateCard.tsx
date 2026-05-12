// @component SortableCandidateCard | @tipo componente | @versao 1.0.0
// > Card de candidato draggable no Kanban — @dnd-kit sortable
// @api candidate: Candidate, onClick?: fn

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Candidate } from '@src/types';
import { Icon } from "@iconify/react";
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
            className="bg-white p-5 rounded-2xl border border-border/60 hover:border-primary/30 transition-all duration-200 ease-in-out cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-primary/20 touch-none"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div
                        className={`size-9 rounded-2xl ${candidate.avatarColor || 'bg-primary'} ${candidate.textColor || 'text-white'} flex items-center justify-center text-[10px] font-semibold shrink-0 bg-cover bg-center`}
                        style={candidate.avatar ? { backgroundImage: `url("${candidate.avatar}")` } : {}}
                    >
                        {!candidate.avatar && candidate.initials}
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="text-sm font-semibold text-[var(--foreground)] leading-tight line-clamp-1 truncate block w-full uppercase tracking-tight">{candidate.name}</h4>
                        <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest block mt-0.5">
                            {candidate.nextInterview ? (
                                <span className="text-primary flex items-center gap-1">
                                    <Icon icon="material-symbols:calendar-today" className="size-3.5" />
                                    {formatDate(candidate.nextInterview.date)} {candidate.nextInterview.time}
                                </span>
                            ) : (candidate.time || 'Sem agenda')}
                        </span>
                    </div>
                </div>

                {candidate.has_resume && (
                    <div className="shrink-0" title="Currículo disponível">
                        <Icon icon="material-symbols:description" className="text-primary/40 size-4" />
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="px-1.5 py-0.5 bg-muted/30 text-muted-foreground rounded border border-border/50 text-[8px] font-semibold uppercase tracking-widest">
                    {candidate.nextInterview ? candidate.nextInterview.type : (candidate.role || 'Candidato')}
                </span>
                {candidate.match && (
                    <span className="px-1.5 py-0.5 bg-success/5 text-success rounded border border-success/20 text-[8px] font-semibold uppercase tracking-widest">
                        {candidate.match} Match
                    </span>
                )}
                <div className={`px-1.5 py-0.5 rounded border text-[8px] font-semibold uppercase tracking-widest flex items-center gap-1 ${slaBadgeColor} ${slaColor}`}>
                    <Icon icon="material-symbols:schedule" className="size-3.5" />
                    {daysInStage}d
                </div>
            </div>

            <div className="pt-3 border-t border-border/40 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                {onQuickView && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onQuickView(candidate);
                        }}
                        className="p-1.5 text-muted-foreground hover:text-primary rounded-2xl hover:bg-primary/5 transition-colors"
                        title="Visualização Rápida"
                    >
                        <Icon icon="material-symbols:visibility" className="size-4" />
                    </button>
                )}
                <div className="flex items-center gap-1 ml-auto">
                    <span className="text-[9px] font-semibold text-primary uppercase tracking-widest">Detalhes</span>
                    <Icon icon="material-symbols:chevron_right" className="text-primary/60 size-4" />
                </div>
            </div>
        </div >
    );
};

export default SortableCandidateCard;
