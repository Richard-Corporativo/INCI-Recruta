'use client';
import { Icon } from "@iconify/react";

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuickView } from '@src/context/QuickViewContext';
import CandidateProfileDrawer from '@src/components/admin/kanban/CandidateProfileDrawer';
import InterviewFeedbackModal from '@src/components/admin/kanban/InterviewFeedbackModal';
import ScheduleInterviewModal from '@src/components/admin/kanban/ScheduleInterviewModal';
import { useJobs } from '@src/hooks/useJobs';
import { useCandidates } from '@src/hooks/useCandidates';
import { useAuth } from '@src/hooks/useAuth';
import { useSettings } from '@src/hooks/useSettings';
import { useAudit } from '@src/hooks/useAudit';
import { Candidate, KanbanColumnId } from '@src/types';
import Toast from '@src/components/shared/Toast';

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
import DroppableKanbanColumn from '@src/components/admin/kanban/DroppableKanbanColumn';
import SortableCandidateCard from '@src/components/admin/kanban/SortableCandidateCard';

import { COLUMNS_CONFIG } from '@src/constants';
import { formatJobId } from '@src/lib/formatters';

export default function KanbanPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const { jobs } = useJobs();
  const { candidates, refresh, moveCandidate } = useCandidates(id);
  const { user } = useAuth();
  const { settings } = useSettings();
  const { logs, addLog } = useAudit();
  const { openQuickView } = useQuickView();

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

  const job = jobs.find(j => String(j.id) === String(id));
  const jobTitle = job?.title || 'Vaga Selecionada';

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const candidate = candidates.find(c => String(c.id) === String(active.id));
    if (candidate) {
      setActiveCandidate(candidate);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCandidate(null);

    if (!over) return;

    const candidateId = String(active.id);
    let targetColId = String(over.id);

    const overCandidate = candidates.find(c => String(c.id) === targetColId);
    if (overCandidate) {
      targetColId = overCandidate.columnId;
    }

    const isValidColumn = COLUMNS_CONFIG.some(col => col.id === targetColId);
    if (!isValidColumn) return;

    const candidate = candidates.find(c => String(c.id) === candidateId);

    if (candidate) {
      const isSameColumn = candidate.columnId === targetColId;

      if (!isSameColumn) {
        setFeedbackCandidate(candidate);
        setMovingSourceCol(candidate.columnId as KanbanColumnId);
        setTargetStage(targetColId as KanbanColumnId);

        if (['hr_interview', 'manager_interview', 'technical'].includes(targetColId)) {
          setIsScheduleModalOpen(true);
        } else {
          setIsFeedbackModalOpen(true);
        }
      }
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
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveCandidate(null)}
    >
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background font-sans">
        <header className="bg-card border-b border-border px-6 py-4 z-20 shrink-0">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                Candidatos — {jobTitle}
                {job?.job_number && (
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-normal border border-border">{formatJobId(job.job_number)}</span>
                )}
              </h1>
              <p className="text-muted-foreground text-sm font-medium">Gerencie o fluxo de contratação com total precisão.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/audit')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground bg-background border border-border rounded-2xl hover:bg-accent transition-all  active:scale-95"
              >
                <Icon icon="material-symbols:history" className="text-[20px]" width="20" height="20" />
                Auditoria
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/40 p-6 overflow-x-auto kanban-scroll animate-in fade-in duration-300">
            <div className="flex h-full gap-4 min-w-max items-start">
              {COLUMNS_CONFIG.map((col) => {
                const columnCandidates = candidates.filter(c => c.columnId === col.id);
                return (
                  <DroppableKanbanColumn
                    key={col.id}
                    id={col.id}
                    title={col.title}
                    dotColor={col.dotColor}
                    candidates={columnCandidates}
                    onCardClick={openProfile}
                    onQuickView={(candidate) => openQuickView('candidate', candidate)}
                    slaLimit={job?.sla_settings?.[col.id]?.days}
                    slaOwner={job?.sla_settings?.[col.id]?.owner}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeCandidate ? (
            <div className="w-[280px] rotate-3 scale-105  opacity-90 cursor-grabbing pointer-events-none">
              <SortableCandidateCard candidate={activeCandidate} onClick={() => { }} />
            </div>
          ) : null}
        </DragOverlay>

        <CandidateProfileDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          candidateId={selectedCandidate?.id}
          jobId={Array.isArray(id) ? id[0] : id as string}
          onCandidateUpdate={refresh}
          moveCandidate={moveCandidate}
        />

        <ScheduleInterviewModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          candidateId={feedbackCandidate?.id}
          candidateName={feedbackCandidate?.name || ''}
          jobId={Array.isArray(id) ? id[0] : id as string}
          targetStage={targetStage ?? undefined}
          onSuccess={async () => {
            if (feedbackCandidate && targetStage) {
              const sourceIndex = COLUMNS_CONFIG.findIndex(c => c.id === movingSourceCol);
              const targetIndex = COLUMNS_CONFIG.findIndex(c => c.id === targetStage);

              if (targetIndex < sourceIndex && user?.role === 'manager') {
                const isAllowed = user.custom_permissions?.return_candidate_stage ?? settings.manager_permissions.return_candidate_stage;
                if (!isAllowed) {
                  setToast({ message: 'Você não tem permissão para retornar candidatos de etapa.', type: 'error' });
                  setIsScheduleModalOpen(false);
                  return;
                }
              }

              await moveCandidate(feedbackCandidate.id, targetStage);
              await addLog({
                action: targetIndex < sourceIndex ? 'RETROCESSO_ETAPA' : 'AVANCO_ETAPA',
                resource_type: 'CANDIDATE',
                resource_id: feedbackCandidate.id,
                job_id: id,
                details: `Candidato ${feedbackCandidate.name} movido para ${COLUMNS_CONFIG.find(c => c.id === targetStage)?.title} (Entrevista agendada)`,
                category: 'candidate_movement',
              });
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
          onSuccess={async () => {
            if (feedbackCandidate && targetStage) {
              const sourceIndex = COLUMNS_CONFIG.findIndex(c => c.id === movingSourceCol);
              const targetIndex = COLUMNS_CONFIG.findIndex(c => c.id === targetStage);

              if (targetIndex < sourceIndex && user?.role === 'manager') {
                const isAllowed = user.custom_permissions?.return_candidate_stage ?? settings.manager_permissions.return_candidate_stage;

                if (!isAllowed) {
                  setToast({ message: 'Você não tem permissão para retornar candidatos de etapa.', type: 'error' });
                  setIsFeedbackModalOpen(false);
                  return;
                }
              }

              await moveCandidate(feedbackCandidate.id, targetStage);
              await addLog({
                action: 'MOVE',
                resource_type: 'CANDIDATE',
                resource_id: feedbackCandidate.id,
                job_id: id,
                details: `Candidato ${feedbackCandidate.name} movido de ${COLUMNS_CONFIG.find(c => c.id === movingSourceCol)?.title} para ${COLUMNS_CONFIG.find(c => c.id === targetStage)?.title}`,
                category: 'candidate_movement',
              });
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
}
