import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Candidate, KanbanColumnId } from '../types';
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
            className={`flex flex-col w-[300px] h-full rounded-lg border shrink-0 shadow-sm transition-all duration-200 ease-in-out ${isOver ? 'bg-primary/5 border-primary ring-2 ring-primary/20' : 'bg-muted/30 border-border'
                }`}
        >
            <div className="p-4 border-b border-border flex justify-between items-center bg-card rounded-t-lg backdrop-blur-sm sticky top-0 z-10 h-14 transition-colors">
                <div className="flex items-center gap-2.5">
                    <span className={`size-2.5 rounded-full ${dotColor} transition-colors`}></span>
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-sm text-foreground tracking-tight transition-colors">{title}</h3>
                        {(slaLimit || slaOwner) && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                                {slaLimit && <span className="text-[9px] font-semibold text-muted-foreground bg-muted/50 px-1 rounded border border-border/50">Meta: {slaLimit}d</span>}
                                {slaOwner && <span className={`text-[9px] font-bold px-1 rounded border ${slaOwner === 'Qualidade' ? 'text-purple-600 border-purple-200' : 'text-orange-600 border-orange-200'}`}>{slaOwner}</span>}
                            </div>
                        )}
                    </div>
                </div>
                <span className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wider border border-border transition-colors self-start mt-0.5">
                    {candidates.length}
                </span>
            </div>

            <div className="p-2 flex-1 overflow-y-auto space-y-2 custom-scrollbar transition-colors min-h-[150px]">
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
                    <div className="h-20 flex items-center justify-center text-xs text-muted-foreground italic transition-colors">
                        Vazio
                    </div>
                )}

                {isOver && candidates.length === 0 && (
                    <div className="h-20 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center text-xs text-primary font-medium animate-pulse">
                        Solte aqui
                    </div>
                )}
            </div>
        </div >
    );
};

export default DroppableKanbanColumn;
