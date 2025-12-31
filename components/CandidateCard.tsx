import React, { DragEvent } from 'react';
import { Candidate } from '../types';

interface CandidateCardProps {
    candidate: Candidate;
    onDragStart: (e: DragEvent<HTMLDivElement>, candidateId: string) => void;
    onClick: (candidate: Candidate) => void;
}

// --> otimizado: React.memo para evitar re-render em todos os cards ao mover um único item (React & Bundle Optimization)
const CandidateCard: React.FC<CandidateCardProps> = React.memo(({ candidate, onDragStart, onClick }) => {
    return (
        <div
            className="bg-card p-3 rounded-lg border border-border shadow-sm hover:shadow-md hover:border-ring transition-all duration-200 ease-in-out cursor-pointer group"
            draggable
            onDragStart={(e) => onDragStart(e, candidate.id)}
            onClick={() => onClick(candidate)}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <div className={`size-8 rounded-full ${candidate.avatarColor} ${candidate.textColor} flex items-center justify-center text-xs font-bold shrink-0`}>
                        {candidate.initials}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-foreground leading-tight">{candidate.name}</h4>
                        <span className="text-[10px] text-muted-foreground font-medium">{candidate.time}</span>
                    </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                </button>
            </div>
            {candidate.role && (
                <div className="flex flex-wrap gap-1 mb-2">
                    <span className="px-1.5 py-0.5 bg-muted text-foreground rounded border border-border text-[10px] font-bold">{candidate.role}</span>
                    {candidate.match && (
                        <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 rounded border border-emerald-500/20 text-[10px] font-bold">{candidate.match}% Comp.</span>
                    )}
                </div>
            )}
            {candidate.actionRequired && (
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[12px]">warning</span> Feedback Pendente
                </div>
            )}
        </div>
    );
});

export default CandidateCard;
