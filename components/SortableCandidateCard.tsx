import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Candidate } from '../types';

interface SortableCandidateCardProps {
    candidate: Candidate;
    onClick: (candidate: Candidate) => void;
    onQuickView?: (candidate: Candidate) => void;
}

const SortableCandidateCard: React.FC<SortableCandidateCardProps> = ({ candidate, onClick, onQuickView }) => {
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={(e) => {
                // Prevent drag listeners from triggering on click if necessary, 
                // but dnd-kit usually handles this with sensors.
                onClick(candidate);
            }}
            className="bg-card p-3 rounded-lg border border-border shadow-sm hover:shadow-md hover:border-ring transition-all duration-200 ease-in-out cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-ring touch-none"
        >
            <div className="flex justify-between items-start mb-2 transition-all">
                <div className="flex items-center gap-2">
                    <div className={`size-8 rounded-full ${candidate.avatarColor || 'bg-primary'} ${candidate.textColor || 'text-white'} flex items-center justify-center text-xs font-semibold shrink-0 shadow-sm transition-colors`}>
                        {candidate.initials}
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="text-sm font-semibold text-foreground leading-tight transition-colors line-clamp-1 truncate block w-full">{candidate.name}</h4>
                        <span className="text-[10px] text-muted-foreground font-medium transition-colors block">
                            {candidate.nextInterview ? (
                                <span className="text-primary flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-[12px] filled">calendar_today</span>
                                    {new Date(candidate.nextInterview.date).toLocaleDateString('pt-BR')} {candidate.nextInterview.time}
                                </span>
                            ) : (candidate.time || 'Sem data')}
                        </span>
                    </div>
                </div>

                {candidate.has_resume && (
                    <div className="shrink-0" title="Currículo disponível">
                        <span className="material-symbols-outlined text-[16px] text-primary/70">description</span>
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
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                    </button>
                )}
                <div className="flex items-center gap-1 ml-auto">
                    <span className="text-[10px] font-bold text-primary">Ver Detalhes</span>
                    <span className="material-symbols-outlined text-muted-foreground text-[14px]">arrow_forward</span>
                </div>
            </div>
        </div >
    );
};

export default SortableCandidateCard;
