// @component DroppableKanbanColumn | @tipo componente | @versao 1.0.0
// > Coluna Kanban com drop zone — integração @dnd-kit
// @api id: string, title: string, children: node, onDrop?: fn

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Candidate, KanbanColumnId } from '@src/types';
import SortableCandidateCard from './SortableCandidateCard';

interface DroppableKanbanColumnProps {
    id: KanbanColumnId;
    title: string;
    dotColor: string;
    candidates: Candidate[];
    onCardClick: (candidate: Candidate) => void;
    onQuickView?: (candidate: Candidate) => void;
    slaLimit?: number;
    slaOwner?: string;
}

const DroppableKanbanColumn: React.FC<DroppableKanbanColumnProps> = ({ id, title, dotColor, candidates, onCardClick, onQuickView, slaLimit, slaOwner }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            className={`flex flex-col w-[300px] h-full rounded-2xl border shrink-0 transition-all duration-200 ease-in-out ${isOver ? 'bg-primary/5 border-primary/30 ring-2 ring-primary/5' : 'bg-secondary border-border'
                }`}
        >
            <div className="p-5 flex justify-between items-center bg-white rounded-t-2xl sticky top-0 z-10 h-14 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${dotColor}`}></span>
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-[11px] text-[var(--foreground)] uppercase tracking-widest">{title}</h3>
                        {(slaLimit || slaOwner) && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                                {slaLimit && <span className="text-[8px] font-semibold text-muted-foreground bg-muted/30 px-1 rounded border border-border/30">META: {slaLimit}D</span>}
                                {slaOwner && <span className={`text-[8px] font-semibold px-1 rounded border uppercase tracking-tighter ${slaOwner === 'Qualidade' ? 'text-primary border-primary/20 bg-primary/5' : 'text-warning border-warning/20 bg-warning/5'}`}>{slaOwner}</span>}
                            </div>
                        )}
                    </div>
                </div>
                <span className="bg-muted/50 text-[var(--foreground)] text-[9px] px-2 py-0.5 rounded-full font-semibold border border-border">
                    {candidates.length}
                </span>
            </div>

            <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar min-h-[150px]">
                <SortableContext items={candidates.map(c => String(c.id))} strategy={verticalListSortingStrategy}>
                    {candidates.map((candidate) => (
                        <SortableCandidateCard
                            key={candidate.id}
                            candidate={candidate}
                            onClick={onCardClick}
                            onQuickView={onQuickView}
                            slaLimit={slaLimit}
                        />
                    ))}
                </SortableContext>

                {candidates.length === 0 && !isOver && (
                    <div className="h-20 flex items-center justify-center text-[10px] text-muted-foreground uppercase tracking-widest italic">
                        Vazio
                    </div>
                )}

                {isOver && candidates.length === 0 && (
                    <div className="h-20 border-2 border-dashed border-primary/20 rounded-2xl flex items-center justify-center text-[10px] text-primary font-semibold uppercase tracking-widest animate-pulse">
                        Mover para cá
                    </div>
                )}
            </div>
        </div >
    );
};

export default DroppableKanbanColumn;
