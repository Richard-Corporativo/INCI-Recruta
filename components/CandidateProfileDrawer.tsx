import React, { useState } from 'react';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import InterviewFeedbackModal from './InterviewFeedbackModal';
import ConfirmationModal from './ConfirmationModal';
import MoveStageModal from './MoveStageModal';
import { useCandidates } from '../hooks/useCandidates';
import { useJobs } from '../hooks/useJobs';
import { KANBAN_COLUMNS } from '../pages/Jobs';

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
  const [activeTab, setActiveTab] = useState<'interviews' | 'audit'>('interviews');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  const { candidates, deleteCandidate } = useCandidates();
  const { jobs } = useJobs();

  const candidate = candidates.find(c => c.id === candidateId);
  const job = jobs.find(j => j.id === candidate?.jobId);

  if (!isOpen || !candidate) return null;

  const currentStepIndex = KANBAN_COLUMNS.findIndex(c => c.id === candidate.columnId);

  const handleDelete = () => {
    if (candidateId) {
      deleteCandidate(candidateId);
      setIsDeleteModalOpen(false);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-background/80 backdrop-blur-sm transition-opacity duration-200" onClick={onClose}>
        <div
          className="w-full max-w-[1000px] bg-card shadow-2xl h-full flex flex-col animate-slide-in-right border-l border-border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="flex items-start justify-between p-8 border-b border-border bg-card shrink-0 px-8 py-6">
            <div className="flex items-start gap-5">
              <div className={`size-20 rounded-full ${candidate.avatarColor} text-white flex items-center justify-center text-3xl font-bold shrink-0 shadow-lg border-2 border-background ring-2 ring-border/50`}>
                {candidate.initials}
              </div>
              <div className="pt-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-foreground tracking-tight">{candidate.name}</h2>
                  {candidate.match && (
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-sm">
                      <span className="material-symbols-outlined filled text-[16px]">stars</span>
                      <span className="text-xs font-bold uppercase tracking-wide">{candidate.match} Match</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                    <span className="material-symbols-outlined text-[18px]">mail</span> {candidate.email}
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                    <span className="material-symbols-outlined text-[18px]">call</span> {candidate.phone}
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                    <span className="material-symbols-outlined text-[18px]">location_on</span> {candidate.location}
                  </span>
                  <a href="#" className="flex items-center gap-1.5 text-primary hover:underline hover:text-primary/80 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">link</span> LinkedIn
                  </a>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto bg-background/50 drawer-scroll">
            <div className="p-8 space-y-8 max-w-5xl mx-auto">

              {/* Status Timeline */}
              <section>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-1">Status no Processo</h3>
                <div className="relative flex items-center justify-between w-full px-4">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-border -z-10 rounded-full"></div>
                  {KANBAN_COLUMNS.map((col, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div key={col.id} className="group relative flex flex-col items-center gap-2">
                        <div className={`
                          size-8 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10
                          ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : ''}
                          ${isCurrent ? 'bg-background border-primary text-primary shadow-[0_0_0_4px_rgba(var(--primary),0.2)] scale-110' : ''}
                          ${!isCompleted && !isCurrent ? 'bg-background border-muted text-muted-foreground' : ''}
                        `}>
                          {isCompleted ? (
                            <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                          ) : (
                            <span className="text-[10px] font-bold">{idx + 1}</span>
                          )}
                        </div>
                        <span className={`
                          absolute top-10 text-[10px] font-bold whitespace-nowrap transition-colors duration-200
                          ${isCurrent ? 'text-primary' : 'text-muted-foreground'}
                        `}>
                          {col.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Job Info Grid */}
              <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">work</span>
                  <h3 className="text-sm font-bold text-foreground">Identificação da Vaga</h3>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase mb-1">Cargo</p>
                    <p className="text-sm font-bold text-foreground">{job?.title || 'Não vinculada'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase mb-1">Departamento</p>
                    <p className="text-sm font-bold text-foreground">{job?.department || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase mb-1">Gestor</p>
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[8px] font-bold">JD</div>
                      <p className="text-sm font-bold text-foreground">João Diretor</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase mb-1">Data Aplicação</p>
                    <p className="text-sm font-bold text-foreground">{candidate.time}</p>
                  </div>
                </div>
              </section>

              {/* Tabs */}
              <section>
                <div className="border-b border-border flex items-center gap-6 mb-6">
                  <button
                    onClick={() => setActiveTab('interviews')}
                    className={`pb-3 px-1 text-sm font-bold border-b-2 transition-all duration-200 flex items-center gap-2 ${activeTab === 'interviews'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
                    Entrevistas & Feedback
                  </button>
                  <button
                    onClick={() => setActiveTab('audit')}
                    className={`pb-3 px-1 text-sm font-bold border-b-2 transition-all duration-200 flex items-center gap-2 ${activeTab === 'audit'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">history</span>
                    Auditoria
                  </button>
                </div>

                <div className="animate-fadeIn">
                  {activeTab === 'interviews' ? (
                    <div className="space-y-4">
                      {/* Mock Interview Item */}
                      <div className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                              <span className="material-symbols-outlined">video_camera_front</span>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-foreground">Entrevista Técnica</h4>
                              <p className="text-xs text-muted-foreground">Realizada em 20/05/2024 via Google Meet</p>
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-wide">
                            Aprovado
                          </span>
                        </div>
                        <div className="pl-[52px]">
                          <p className="text-sm text-foreground/80 leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">
                            "Candidato demonstrou excelente domínio em React e Node.js. Boa comunicação e fit cultural alinhado com a equipe."
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            <div className="size-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[9px] font-bold border border-purple-200">TL</div>
                            <span className="text-xs font-bold text-foreground">Tech Lead</span>
                          </div>
                        </div>
                      </div>

                      {/* Mock Interview Item 2 */}
                      <div className="bg-card border border-border rounded-lg p-5 shadow-sm opacity-60">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted text-muted-foreground rounded-lg">
                              <span className="material-symbols-outlined">group</span>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-foreground">Entrevista Cultural</h4>
                              <p className="text-xs text-muted-foreground">Agendada para 25/05/2024</p>
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-muted text-muted-foreground border border-border uppercase tracking-wide">
                            Pendente
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted/30 rounded-lg p-8 text-center border dashed border-border">
                      <p className="text-sm text-muted-foreground font-bold italic">Nenhum registro de auditoria disponível para este candidato.</p>
                    </div>
                  )}
                </div>
              </section>

            </div>
          </div>

          <footer className="p-6 border-t border-border bg-card shrink-0 z-20 text-foreground shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-6 py-2.5 rounded-base border border-destructive/30 text-destructive bg-background hover:bg-destructive/5 font-bold text-sm transition-all duration-200 active:translate-y-[1px]"
              >
                Excluir
              </button>
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="px-6 py-2.5 rounded-base border border-border bg-background hover:bg-muted font-bold text-sm transition-all duration-200 active:translate-y-[1px] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Agendar
              </button>
              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="px-6 py-2.5 rounded-base border border-border bg-background hover:bg-muted font-bold text-sm transition-all duration-200 active:translate-y-[1px]"
              >
                Mover Etapa
              </button>
              {currentStepIndex === KANBAN_COLUMNS.length - 2 && (
                <button
                  className="px-8 py-2.5 rounded-base bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg active:translate-y-[1px] flex items-center gap-2"
                  onClick={() => setIsFeedbackModalOpen(true)}
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
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
        candidateName={candidate.name}
      />
      <InterviewFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        candidateName={candidate.name}
        candidateInitials={candidate.initials}
        candidateId={candidate.id}
        currentStage={KANBAN_COLUMNS.find(c => c.id === candidate.columnId)?.title}
        onSuccess={() => {
          onCandidateUpdate?.();
        }}
      />
      <MoveStageModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        candidateId={candidate.id}
        candidateName={candidate.name}
        candidateInitials={candidate.initials}
        currentStage={KANBAN_COLUMNS.find(c => c.id === candidate.columnId)?.title || candidate.columnId}
        onSuccess={() => {
          onCandidateUpdate?.();
        }}
      />
    </>
  );
};

export default CandidateProfileDrawer;