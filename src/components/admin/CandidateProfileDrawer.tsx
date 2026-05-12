// @component CandidateProfileDrawer | @tipo componente | @versao 1.0.0
// > Drawer com perfil completo — tabs: perfil, entrevistas, audit
// @api candidate: Candidate, isOpen: bool, onClose: fn
// @state activeTab — perfil | entrevistas | audit

import React, { useState } from 'react';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import InterviewFeedbackModal from './InterviewFeedbackModal';
import ConfirmationModal from '@src/components/shared/ConfirmationModal';
import MoveStageModal from './MoveStageModal';
import { useCandidates } from '@src/hooks/useCandidates';
import { useAudit } from '@src/hooks/useAudit';
import { useJobs } from '@src/hooks/useJobs';
import { COLUMNS_CONFIG } from '@src/constants';
import { CandidateService } from '@src/services/candidate.service';
import { Candidate, AuditLog, KanbanColumnId } from '@src/types';
import { Icon } from "@iconify/react";

import {
  CandidateProfileHeader,
  CandidateProfileTimeline,
  CandidateJobInfo,
  CandidateTabProfile,
  CandidateTabInterviews,
  CandidateTabAudit
} from './candidate-profile';

interface CandidateProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId?: string;
  onCandidateUpdate?: () => void;
}

const CandidateProfileDrawer: React.FC<CandidateProfileDrawerProps> = ({
  isOpen,
  onClose,
  candidateId,
  onCandidateUpdate
}) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'interviews' | 'audit'>('profile');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  const { addLog, logs } = useAudit();
  const { candidates, deleteCandidate, moveCandidate, refresh } = useCandidates();
  const { jobs } = useJobs();

  const candidate = candidates.find(c => c.id === candidateId);
  const job = jobs.find(j => j.id === candidate?.jobId);

  if (!isOpen || !candidate) return null;

  const currentStepIndex = COLUMNS_CONFIG.findIndex(c => c.id === candidate.columnId);

  const handleDelete = () => {
    if (candidateId) {
      deleteCandidate(candidateId);
      setIsDeleteModalOpen(false);
      onClose();
    }
  };

  const handleDownloadResume = async () => {
    if (!candidateId) return;
    try {
      const result = await CandidateService.downloadResume(candidateId);
      if (result) {
        const url = URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert('Currículo não encontrado.');
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao baixar currículo.');
    }
  };


  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-background/80 transition-opacity duration-200 ease-in-out" onClick={onClose}>
        <div
          className="w-full max-w-[1000px] bg-card h-full flex flex-col animate-in slide-in-from-right duration-300 ease-in-out -l - p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <CandidateProfileHeader
            candidate={candidate}
            onClose={onClose}
            onDownloadResume={handleDownloadResume}
          />

          <div className="flex-1 overflow-y-auto bg-background/50 custom-scrollbar transition-colors border-y border-border">
            <div className="p-8 space-y-8 max-w-5xl mx-auto">
              <CandidateProfileTimeline currentStepIndex={currentStepIndex} />
              
              <CandidateJobInfo candidate={candidate} job={job} />

              <section>
                <div className="border-b border-border flex items-center gap-6 mb-6 transition-colors">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeTab === 'profile'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <Icon icon="material-symbols:person" className="mr-2 h-4 w-4" aria-hidden="true" />
                    Perfil
                  </button>
                  <button
                    onClick={() => setActiveTab('interviews')}
                    className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeTab === 'interviews'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <Icon icon="material-symbols:chat-bubble-outline" className="mr-2 h-4 w-4" aria-hidden="true" />
                    Entrevistas & Feedback
                  </button>
                  <button
                    onClick={() => setActiveTab('audit')}
                    className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeTab === 'audit'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <Icon icon="material-symbols:history" className="mr-2 h-4 w-4" aria-hidden="true" />
                    Auditoria
                  </button>
                </div>

                <div className="animate-in fade-in duration-300">
                  {activeTab === 'profile' && <CandidateTabProfile candidate={candidate} />}
                  {activeTab === 'interviews' && <CandidateTabInterviews candidate={candidate} />}
                  {activeTab === 'audit' && <CandidateTabAudit candidate={candidate} logs={logs as any} />}
                </div>
              </section>

            </div>
          </div>

          <footer className="p-6 -t - bg-card shrink-0 z-20 text-foreground transition-all duration-200 ease-in-out">
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="h-10 px-6 rounded-2xl border border-destructive/30 text-destructive bg-background hover:bg-destructive/5 font-semibold text-sm transition-all duration-200 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-destructive"
              >
                Excluir
              </button>
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="h-10 px-6 rounded-2xl border border-border bg-background hover:bg-accent font-semibold text-sm transition-all duration-200 active:scale-95 flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon icon="material-symbols:calendar-today" className="h-4 w-4" aria-hidden="true" />
                Agendar
              </button>
              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="h-10 px-6 rounded-2xl border border-border bg-background hover:bg-accent font-semibold text-sm transition-all duration-200 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Mover Etapa
              </button>
              {currentStepIndex === COLUMNS_CONFIG.length - 2 && (
                <button
                  className="h-10 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all duration-200 hover: active:scale-95 flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onClick={() => setIsFeedbackModalOpen(true)}
                >
                  <Icon icon="material-symbols:check" className="h-4 w-4" aria-hidden="true" />
                  Aprovar
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Candidato"
        message={`Tem certeza que deseja excluir ${candidate.name}? Todo o histórico de entrevistas e dados serão perdidos permanentemente.`}
        confirmLabel="Excluir Definitivamente"
        type="danger"
      />

      <ScheduleInterviewModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        candidateId={candidate.id}
        candidateName={candidate.name}
        onSuccess={(data) => {
          if (data && data.type && candidateId) {
            const stageMap: Record<string, string> = {
              'Entrevista RH': 'hr_interview',
              'Entrevista Técnica': 'technical',
              'Entrevista Gestor': 'manager_interview',
              'Apresentação de Case': 'technical'
            };
            const targetStage = stageMap[data.type];
            if (targetStage && targetStage !== candidate.columnId) {
              moveCandidate(candidateId, targetStage as any);
            }
          }
          refresh();
          onCandidateUpdate?.();
        }}
      />
      <InterviewFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        candidateName={candidate.name}
        candidateInitials={candidate.initials}
        candidateId={candidate.id}
        currentStage={COLUMNS_CONFIG.find(c => c.id === candidate.columnId)?.title}
        onSuccess={() => {
          refresh();
          onCandidateUpdate?.();
        }}
        role={job?.title}
      />
      <MoveStageModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        candidateId={candidate.id}
        candidateName={candidate.name}
        candidateInitials={candidate.initials}
        currentStage={COLUMNS_CONFIG.find(c => c.id === candidate.columnId)?.title || candidate.columnId}
        onSuccess={() => {
          onCandidateUpdate?.();
        }}
      />
    </>
  );
};

export default CandidateProfileDrawer;
