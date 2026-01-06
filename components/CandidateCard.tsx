import React, { DragEvent } from 'react';
import { Candidate } from '../types';

interface CandidateCardProps {
    candidate: Candidate;
    onDragStart: (e: DragEvent<HTMLDivElement>, candidateId: string) => void;
    onClick: (candidate: Candidate) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = React.memo(({ candidate, onDragStart, onClick }) => {
    return (
        <div
            className="bg-card p-3 rounded-lg border border-border shadow-sm hover:shadow-md hover:border-ring transition-all duration-200 ease-in-out cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-ring"
            draggable
            onDragStart={(e) => onDragStart(e, candidate.id)}
            onClick={() => onClick(candidate)}
        >
            <div className="flex justify-between items-start mb-2 transition-all">
                <div className="flex items-center gap-2">
                    <div className={`size-8 rounded-full ${candidate.avatarColor} ${candidate.textColor} flex items-center justify-center text-xs font-semibold shrink-0 shadow-sm transition-colors`}>
                        {candidate.initials}
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-foreground leading-tight transition-colors">{candidate.name}</h4>
                        <span className="text-[10px] text-muted-foreground font-medium transition-colors">{candidate.time}</span>
                    </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 outline-none focus-visible:opacity-100" aria-label={`Mais opções para ${candidate.name}`}>
                    <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                </button>
            </div>
            {candidate.role && (
                <div className="flex flex-wrap gap-1 mb-2 transition-all">
                    <span className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded border border-border text-[10px] font-semibold transition-colors">{candidate.role}</span>
                    {candidate.match && (
                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/20 text-[10px] font-semibold transition-colors">{candidate.match}% Comp.</span>
                    )}
                </div>
            )}
            {candidate.actionRequired && (
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20 font-semibold tracking-wider transition-colors animate-pulse">
                    <span className="material-symbols-outlined text-[12px]">warning</span> Feedback pendente
                </div>
            )}
        </div>
    );
});

export default CandidateCard;
