import React, { useState } from 'react';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import InterviewFeedbackModal from './InterviewFeedbackModal';
import ConfirmationModal from './ConfirmationModal';
import MoveStageModal from './MoveStageModal';
import { useCandidates } from '../hooks/useCandidates';
import { useAudit } from '../hooks/useAudit';
import { useJobs } from '../hooks/useJobs';
import { COLUMNS_CONFIG } from '../constants';
import { CandidateService } from '../src/services/CandidateService';

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
      <div className="fixed inset-0 z-50 flex justify-end bg-background/80 backdrop-blur-sm transition-opacity duration-200 ease-in-out" onClick={onClose}>
        <div
          className="w-full max-w-[1000px] bg-card shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300 ease-in-out border-l border-border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="flex items-start justify-between p-8 border-b border-border bg-card shrink-0 px-8 py-6 transition-colors">
            <div className="flex items-start gap-5">
              <div className={`size-20 rounded-full ${candidate.avatarColor} ${candidate.textColor} flex items-center justify-center text-3xl font-semibold shrink-0 shadow-lg border-2 border-background ring-2 ring-border/50 transition-colors`}>
                {candidate.initials}
              </div>
              <div className="pt-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-3xl font-semibold text-foreground tracking-tight transition-colors">{candidate.name}</h2>
                  {candidate.match && (
                    <div className="flex items-center gap-1 text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 shadow-sm transition-colors">
                      <span className="material-symbols-outlined filled text-[16px]">stars</span>
                      <span className="text-xs font-semibold tracking-wide">{candidate.match} Match</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground font-medium transition-colors">
                  <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                    <span className="material-symbols-outlined text-[18px]">mail</span> {candidate.email}
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                    <span className="material-symbols-outlined text-[18px]">call</span> {candidate.phone}
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                    <span className="material-symbols-outlined text-[18px]">location_on</span> {candidate.location}
                  </span>
                  <a href={candidate.linkedin || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors font-semibold outline-none focus-visible:underline">
                    <span className="material-symbols-outlined text-[18px]">link</span> LinkedIn
                  </a>
                  {candidate.has_resume && (
                    <button
                      onClick={handleDownloadResume}
                      className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors font-semibold outline-none focus-visible:underline"
                    >
                      <span className="material-symbols-outlined text-[18px]">description</span> Currículo
                    </button>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto bg-background/50 custom-scrollbar transition-colors">
            <div className="p-8 space-y-8 max-w-5xl mx-auto">

              {/* Status Timeline */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground tracking-wider mb-4 px-1 transition-colors">Status no processo</h3>
                <div className="relative flex items-center justify-between w-full px-4">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 rounded-full"></div>
                  {COLUMNS_CONFIG.map((col, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div key={col.id} className="group relative flex flex-col items-center gap-2">
                        <div className={`
                          size-8 rounded-full flex items-center justify-center border-4 transition-all duration-300 ease-in-out z-10
                          ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : ''}
                          ${isCurrent ? 'bg-background border-primary text-primary shadow-lg ring-4 ring-primary/20 scale-110' : ''}
                          ${!isCompleted && !isCurrent ? 'bg-background border-muted text-muted-foreground' : ''}
                        `}>
                          {isCompleted ? (
                            <span className="material-symbols-outlined text-[16px] font-semibold">check</span>
                          ) : (
                            <span className="text-[10px] font-semibold">{idx + 1}</span>
                          )}
                        </div>
                        <span className={`
                          absolute top-10 text-[10px] font-semibold whitespace-nowrap transition-colors duration-200
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
              <section className="bg-card rounded-lg border border-border shadow-sm overflow-hidden transition-all duration-200">
                <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-2 transition-colors">
                  <span className="material-symbols-outlined text-primary text-[20px]">work</span>
                  <h3 className="text-sm font-semibold text-foreground">Identificação da Vaga</h3>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground mb-1 transition-colors">Cargo</p>
                    <p className="text-sm font-semibold text-foreground transition-colors">{job?.title || 'Não vinculada'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground mb-1 transition-colors">Departamento</p>
                    <p className="text-sm font-semibold text-foreground transition-colors">{job?.department || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground mb-1 transition-colors">Gestor</p>
                    <div className="flex items-center gap-2 transition-colors">
                      <div className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[8px] font-semibold transition-colors">JD</div>
                      <p className="text-sm font-semibold text-foreground transition-colors">João Diretor</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground mb-1 transition-colors">Data aplicação</p>
                    <p className="text-sm font-semibold text-foreground transition-colors">{candidate.time}</p>
                  </div>
                </div>
              </section>

              {/* Tabs */}
              <section>
                <div className="border-b border-border flex items-center gap-6 mb-6 transition-colors">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeTab === 'profile'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <span className="material-symbols-outlined text-[18px] mr-2">person</span>
                    Perfil
                  </button>
                  <button
                    onClick={() => setActiveTab('interviews')}
                    className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeTab === 'interviews'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <span className="material-symbols-outlined text-[18px] mr-2">chat_bubble_outline</span>
                    Entrevistas & Feedback
                  </button>
                  <button
                    onClick={() => setActiveTab('audit')}
                    className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeTab === 'audit'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <span className="material-symbols-outlined text-[18px] mr-2">history</span>
                    Auditoria
                  </button>
                </div>

                <div className="animate-in fade-in duration-300">
                  {activeTab === 'profile' && (
                    <div className="space-y-8">
                      {/* Summary */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">history_edu</span>
                          Sobre
                        </h4>
                        <p className="text-sm text-foreground/80 leading-relaxed bg-muted/10 p-4 rounded-lg border border-border">
                          {candidate.summary || 'Nenhuma biografia informada.'}
                        </p>
                      </div>

                      {/* Skills */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">psychology</span>
                          Habilidades
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills && candidate.skills.length > 0 ? (
                            candidate.skills.map(s => (
                              <span key={s} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                                {s}
                              </span>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground italic">Nenhuma habilidade registrada.</p>
                          )}
                        </div>
                      </div>

                      {/* Experience */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">work_history</span>
                          Experiência
                        </h4>
                        <div className="space-y-3">
                          {candidate.experience && candidate.experience.length > 0 ? (
                            candidate.experience.map(exp => (
                              <div key={exp.id} className="relative pl-4 border-l-2 border-border pb-4 last:pb-0">
                                <div className="absolute -left-[5px] top-1.5 size-2 rounded-full bg-primary"></div>
                                <h5 className="text-sm font-bold text-foreground">{exp.role}</h5>
                                <span className="text-xs font-semibold text-muted-foreground">{exp.company}</span>
                                <span className="text-[10px] text-muted-foreground ml-2">• {exp.startDate} - {exp.endDate || 'Atual'}</span>
                                {exp.description && <p className="text-xs text-foreground/80 mt-1 line-clamp-2">{exp.description}</p>}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground italic">Nenhuma experiência registrada.</p>
                          )}
                        </div>
                      </div>

                      {/* Education */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">school</span>
                          Formação
                        </h4>
                        <div className="space-y-3">
                          {candidate.education && candidate.education.length > 0 ? (
                            candidate.education.map(edu => (
                              <div key={edu.id} className="relative pl-4 border-l-2 border-border pb-4 last:pb-0">
                                <div className="absolute -left-[5px] top-1.5 size-2 rounded-full bg-primary/50"></div>
                                <h5 className="text-sm font-bold text-foreground">{edu.degree}</h5>
                                <span className="text-xs font-semibold text-muted-foreground">{edu.institution}</span>
                                <span className="text-[10px] text-muted-foreground ml-2">• {edu.startDate} - {edu.endDate || 'Atual'}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground italic">Nenhuma formação registrada.</p>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                  {activeTab === 'interviews' ? (
                    <div className="space-y-4">
                      {candidate.feedbacks && candidate.feedbacks.length > 0 ? (
                        candidate.feedbacks.map((f, idx) => (
                          <div key={idx} className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 text-primary rounded-lg transition-colors">
                                  <span className="material-symbols-outlined">chat_bubble</span>
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-foreground transition-colors">{f.stage}</h4>
                                  <p className="text-xs text-muted-foreground transition-colors">Avaliado em {new Date(f.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <span key={star} className={`material-symbols-outlined text-sm ${f.rating >= star ? 'text-primary filled' : 'text-muted'}`}>star</span>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Pontos Fortes</h5>
                                <p className="text-xs text-foreground/80 leading-relaxed italic border-l-2 border-primary/20 pl-3 py-1">{f.strengths || '-'}</p>
                              </div>
                              <div>
                                <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Pontos de Atenção</h5>
                                <p className="text-xs text-foreground/80 leading-relaxed italic border-l-2 border-destructive/20 pl-3 py-1">{f.concerns || '-'}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                              <div className="flex items-center gap-2">
                                <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-semibold border border-primary/20">{f.createdBy?.substring(0, 2).toUpperCase()}</div>
                                <span className="text-xs font-semibold text-foreground">{f.createdBy}</span>
                              </div>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${f.recommendation === 'advance' ? 'bg-primary/10 text-primary border-primary/20' :
                                f.recommendation === 'hold' ? 'bg-foreground/5 text-foreground/70 border-foreground/10' :
                                  'bg-destructive/10 text-destructive border-destructive/20'
                                }`}>
                                {f.recommendation === 'advance' ? 'Aprovar' : f.recommendation === 'hold' ? 'Segurar' : 'Reprovar'}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-muted/30 rounded-lg p-12 text-center border-2 border-dashed border-border transition-colors">
                          <span className="material-symbols-outlined text-muted-foreground/40 text-4xl mb-3">chat_bubble_outline</span>
                          <p className="text-sm text-muted-foreground font-semibold italic transition-colors">Nenhum feedback de entrevista registrado ainda.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {logs.filter(l => l.entity_id === candidate.id || l.entity_id === candidate.name).length > 0 ? (
                        <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border transition-colors">
                          {logs
                            .filter(l => l.entity_id === candidate.id || l.entity_id === candidate.name)
                            .map((l, idx) => (
                              <div key={idx} className="relative">
                                <span className="absolute -left-[27px] top-1 size-3.5 rounded-full bg-background border-2 border-primary z-10"></span>
                                <div className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{l.action}</span>
                                    <span className="text-[10px] text-muted-foreground font-medium">{new Date(l.timestamp).toLocaleString()}</span>
                                  </div>
                                  <p className="text-sm text-foreground mb-3 leading-relaxed">{l.details}</p>
                                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                                    <div className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[8px] font-bold border border-primary/20">
                                      {l.user_name?.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-[10px] font-semibold text-muted-foreground transition-colors">Realizado por {l.user_name}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="bg-muted/30 rounded-lg p-12 text-center border-2 border-dashed border-border transition-colors">
                          <span className="material-symbols-outlined text-muted-foreground/40 text-4xl mb-3">history</span>
                          <p className="text-sm text-muted-foreground font-semibold italic transition-colors">Nenhum registro de auditoria disponível para este candidato.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>

            </div>
          </div>

          <footer className="p-6 border-t border-border bg-card shrink-0 z-20 text-foreground shadow-lg transition-all duration-200 ease-in-out">
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="h-10 px-6 rounded-base border border-destructive/30 text-destructive bg-background hover:bg-destructive/5 font-semibold text-sm transition-all duration-200 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-destructive"
              >
                Excluir
              </button>
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="h-10 px-6 rounded-base border border-border bg-background hover:bg-accent font-semibold text-sm transition-all duration-200 active:scale-95 flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Agendar
              </button>
              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="h-10 px-6 rounded-base border border-border bg-background hover:bg-accent font-semibold text-sm transition-all duration-200 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Mover Etapa
              </button>
              {currentStepIndex === COLUMNS_CONFIG.length - 2 && (
                <button
                  className="h-10 px-8 rounded-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
            // Only move if we found a mapping and the candidate is not already further ahead or in that stage
            // For simplicity, we just move them if the mapping exists. 
            // Ideally we check if targetStage is "after" current stage, but standard flow assumes forward movement.
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
