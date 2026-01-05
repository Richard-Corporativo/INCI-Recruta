import React, { useState } from 'react';
import CandidateProfileDrawer from '../components/CandidateProfileDrawer';
import InterviewFeedbackModal from '../components/InterviewFeedbackModal';
import ScheduleInterviewModal from '../components/ScheduleInterviewModal';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { useCandidates } from '../hooks/useCandidates';
import { useAuth } from '../hooks/useAuth';
import { Candidate, KanbanColumnId } from '../types';
import Toast from '../components/Toast';

import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import DroppableKanbanColumn from '../components/DroppableKanbanColumn';
import SortableCandidateCard from '../components/SortableCandidateCard';

import { COLUMNS_CONFIG } from '../constants';

const KanbanBoard: React.FC = () => {
  console.log("=== RENDER KANBAN BOARD === BUILD: 2026-01-03 12:20");
  console.log("Using @dnd-kit with MouseSensor and TouchSensor");
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs } = useJobs();
  const { candidates, refresh, moveCandidate } = useCandidates();
  const { user } = useAuth();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [feedbackCandidate, setFeedbackCandidate] = useState<Candidate | null>(null);
  const [movingSourceCol, setMovingSourceCol] = useState<KanbanColumnId | null>(null);
  const [targetStage, setTargetStage] = useState<KanbanColumnId | undefined>(undefined);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const job = jobs.find(j => j.id === id || j.id === Number(id));
  const jobTitle = job?.title || 'Vaga Selecionada';

  const filteredCandidates = candidates.filter(c => {
    if (id && String(c.jobId) !== String(id)) return false;
    return true;
  });

  const handleDragStart = (event: DragStartEvent) => {
    console.log("=== DRAG START ===", event.active.id);
    const { active } = event;
    const candidate = candidates.find(c => String(c.id) === String(active.id));
    if (candidate) {
      setActiveCandidate(candidate);
    }
  };

  const handleDragOver = (event: DragEndEvent) => {
    // optional: add logic for visual feedback here if needed
  };

  const handleDragCancel = (event: DragEndEvent) => {
    console.log("=== DRAG CANCELLED ===", event);
    setActiveCandidate(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log("=== HANDLE DRAG END TRIGGERED ===");
    console.log("Active Object:", active);
    console.log("Over Object:", over);

    setActiveCandidate(null);

    if (!over) {
      console.warn("Dropped over nothing (over is null)");
      return;
    }

    const candidateId = String(active.id);
    let targetColId = String(over.id);

    console.log(`Initial candidateId: ${candidateId}, Initial targetColId: ${targetColId}`);

    const overCandidate = candidates.find(c => String(c.id) === targetColId);
    if (overCandidate) {
      console.log(`Dropped over another candidate: ${overCandidate.name} (Column: ${overCandidate.columnId})`);
      targetColId = overCandidate.columnId;
    } else {
      console.log("Dropped over a column directly (or unknown ID).");
    }

    console.log(`Resolved Target Column ID: ${targetColId}`);

    const isValidColumn = COLUMNS_CONFIG.some(col => col.id === targetColId);
    if (!isValidColumn) {
      console.warn("Invalid Target Column ID. Valid Configs:", COLUMNS_CONFIG.map(c => c.id));
      return;
    }

    const candidate = candidates.find(c => String(c.id) === candidateId);
    console.log("Dragged Candidate Object:", candidate);

    if (candidate) {
      const isSameColumn = candidate.columnId === targetColId;
      console.log(`Is Same Column? ${isSameColumn} (${candidate.columnId} vs ${targetColId})`);

      if (!isSameColumn) {
        console.log("Setting State for Feedback Candidate...", candidate);
        setFeedbackCandidate(candidate);
        setMovingSourceCol(candidate.columnId as KanbanColumnId);
        setTargetStage(targetColId as KanbanColumnId);

        if (['hr_interview', 'manager_interview', 'technical'].includes(targetColId)) {
          console.log("Condition Met: Opening SCHEDULE MODAL");
          setIsScheduleModalOpen(true);
        } else {
          console.log("Condition Met: Opening FEEDBACK MODAL");
          setIsFeedbackModalOpen(true);
        }
      }
    } else {
      console.error("Candidate not found in state list! ID:", candidateId);
    }
  };

  const openProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDrawerOpen(true);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background font-sans">
        <header className="bg-card border-b border-border px-6 py-4 z-20 shrink-0">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                Candidatos — {jobTitle}
                <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-normal border border-border">ID: #{id || 'Admin'}</span>
              </h1>
              <p className="text-muted-foreground text-sm font-medium">Gerencie o fluxo de contratação com total precisão.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/audit')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground bg-background border border-border rounded-base hover:bg-accent transition-all shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">history</span>
                Auditoria
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/40 p-6 overflow-x-auto kanban-scroll animate-in fade-in duration-300">
            <div className="flex h-full gap-4 min-w-max items-start">
              {COLUMNS_CONFIG.map((col) => {
                const columnCandidates = filteredCandidates.filter(c => c.columnId === col.id);
                return (
                  <DroppableKanbanColumn
                    key={col.id}
                    id={col.id}
                    title={col.title}
                    dotColor={col.dotColor}
                    candidates={columnCandidates}
                    onCardClick={openProfile}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeCandidate ? (
            <div className="w-[280px] rotate-3 scale-105 shadow-2xl opacity-90 cursor-grabbing pointer-events-none">
              <SortableCandidateCard candidate={activeCandidate} onClick={() => { }} />
            </div>
          ) : null}
        </DragOverlay>

        <CandidateProfileDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          candidateId={selectedCandidate?.id}
          onCandidateUpdate={refresh}
        />

        <ScheduleInterviewModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          candidateId={feedbackCandidate?.id}
          candidateName={feedbackCandidate?.name || ''}
          onSuccess={() => {
            if (feedbackCandidate && targetStage) {
              moveCandidate(feedbackCandidate.id, targetStage);
            }
            refresh();
            setIsScheduleModalOpen(false);
          }}
        />

        <InterviewFeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          candidateId={feedbackCandidate?.id}
          candidateName={feedbackCandidate?.name || ''}
          candidateInitials={feedbackCandidate?.initials || ''}
          currentStage={movingSourceCol ? COLUMNS_CONFIG.find(c => c.id === movingSourceCol)?.title : undefined}
          targetStage={targetStage}
          role={feedbackCandidate?.role}
          onSuccess={() => {
            if (feedbackCandidate && targetStage) {
              moveCandidate(feedbackCandidate.id, targetStage);
            }
            refresh();
            setIsFeedbackModalOpen(false);
          }}
        />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
