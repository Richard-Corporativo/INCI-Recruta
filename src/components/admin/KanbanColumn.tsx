// @component KanbanColumn | @tipo componente | @versao 1.0.0
// > Coluna base do Kanban — drag/drop, candidatos, ações
// @api columnId: KanbanColumnId, candidates: Candidate[], onMove: fn

import React, { DragEvent } from 'react';
import { Candidate } from '@src/types';
import CandidateCard from './CandidateCard';
import CandidateCardSkeleton from './CandidateCardSkeleton';

interface KanbanColumnProps {
    col: { id: string; title: string; color: string };
    candidates: Candidate[];
    onDragStart: (e: DragEvent<HTMLDivElement>, candidateId: string, sourceColId: string) => void;
    onDragOver: (e: DragEvent<HTMLDivElement>) => void;
    onDrop: (e: DragEvent<HTMLDivElement>, targetColId: string) => void;
    onCardClick: (candidate: Candidate) => void;
    isLoading: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = React.memo(({
    col,
    candidates,
    onDragStart,
    onDragOver,
    onDrop,
    onCardClick,
    isLoading
}) => {
    return (
        <div className="flex flex-col w-[300px] h-full bg-muted/30 rounded-2xl border border-border shrink-0 transition-all duration-200 ease-in-out">
            {/* Column Header */}
            <div className="p-6 -b - flex justify-between items-center bg-card rounded-t-lg sticky top-0 z-10 h-14 transition-colors">
                <div className="flex items-center gap-2.5">
                    <span className={`size-2.5 rounded-full ${col.color.split(' ')[0]} transition-colors`}></span>
                    <h3 className="font-semibold text-sm text-foreground tracking-tight transition-colors">{col.title}</h3>
                    <span className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wider border border-border transition-colors">
                        {candidates.length}
                    </span>
                </div>
            </div>

            {/* Cards Container */}
            <div
                className="p-2 flex-1 overflow-y-auto space-y-2 custom-scrollbar transition-colors"
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, col.id)}
            >
                {isLoading ? (
                    // Column Skeletons
                    [1, 2].map(i => (
                        <CandidateCardSkeleton key={i} />
                    ))
                ) : (
                    <>
                        {candidates.map((candidate) => (
                            <CandidateCard
                                key={candidate.id}
                                candidate={candidate}
                                onDragStart={(e, cid) => onDragStart(e, cid, col.id)}
                                onClick={onCardClick}
                            />
                        ))}
                        {candidates.length === 0 && (
                            <div className="h-20 flex items-center justify-center text-xs text-muted-foreground italic transition-colors">
                                Vazio
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
});

export default KanbanColumn;
