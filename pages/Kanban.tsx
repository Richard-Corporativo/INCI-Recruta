import React, { useState, DragEvent } from 'react';
import CandidateProfileDrawer from '../components/CandidateProfileDrawer';
import InterviewFeedbackModal from '../components/InterviewFeedbackModal';
import MoveStageModal from '../components/MoveStageModal';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { useCandidates } from '../hooks/useCandidates';
import { useAuth } from '../hooks/useAuth';
import { Candidate, KanbanColumnId } from '../types';
import Toast from '../components/Toast';

type Column = {
  id: KanbanColumnId;
  title: string;
  countColor: string; // Cor do badge de contagem
  dotColor: string; // Cor da bolinha
  convRate?: string;
  // Classes específicas do design HTML
  containerClass: string;
  headerClass: string;
  bodyClass?: string;
};

const COLUMNS_CONFIG: Column[] = [
  {
    id: 'received',
    title: 'Recebido',
    dotColor: 'bg-muted-foreground/40',
    countColor: 'bg-muted text-muted-foreground',
    convRate: '45% conv.',
    containerClass: 'bg-muted/30 border-border/50',
    headerClass: 'bg-background/50 border-border/50'
  },
  {
    id: 'screening',
    title: 'Em Triagem',
    dotColor: 'bg-blue-400',
    countColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    convRate: '60% conv.',
    containerClass: 'bg-muted/30 border-border/50',
    headerClass: 'bg-background/50 border-border/50'
  },
  {
    id: 'technical',
    title: 'Avaliação Téc.',
    dotColor: 'bg-purple-400',
    countColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    convRate: '33% conv.',
    containerClass: 'bg-muted/30 border-border/50',
    headerClass: 'bg-background/50 border-border/50'
  },
  {
    id: 'hr_interview',
    title: 'Entrevista RH',
    dotColor: 'bg-indigo-400',
    countColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    convRate: '50% conv.',
    containerClass: 'bg-muted/30 border-border/50',
    headerClass: 'bg-background/50 border-border/50'
  },
  {
    id: 'manager_interview',
    title: 'Entrevista Gestor',
    dotColor: 'bg-primary animate-pulse',
    countColor: 'bg-primary text-primary-foreground',
    convRate: 'Feedback Pendente',
    containerClass: 'bg-background border-primary/20 shadow-sm ring-1 ring-primary/10',
    headerClass: 'bg-primary/5 dark:bg-primary/10 border-primary/10',
    bodyClass: 'bg-accent/10'
  },
  {
    id: 'finalist',
    title: 'Finalista',
    dotColor: 'bg-yellow-400',
    countColor: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    convRate: '50% conv.',
    containerClass: 'bg-muted/30 border-border/50',
    headerClass: 'bg-background/50 border-border/50'
  },
  {
    id: 'hired',
    title: 'Contratado',
    dotColor: 'bg-emerald-500',
    countColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    containerClass: 'bg-emerald-50/20 dark:bg-emerald-900/10 border-emerald-200/50',
    headerClass: 'bg-emerald-50/30 dark:bg-emerald-900/20 border-emerald-200/50'
  },
  {
    id: 'rejected',
    title: 'Não Selecionado',
    dotColor: 'bg-muted-foreground/60',
    countColor: 'bg-muted text-muted-foreground',
    containerClass: 'bg-muted/30 border-border/50 opacity-75 hover:opacity-100 transition-opacity duration-200',
    headerClass: 'bg-background/50 border-border/50'
  },
];

const Kanban: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs } = useJobs();
  const { candidates, moveCandidate } = useCandidates();
  const { user } = useAuth();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [feedbackCandidate, setFeedbackCandidate] = useState<Candidate | null>(null);
  const [movingCandidate, setMovingCandidate] = useState<Candidate | null>(null);
  const [movingSourceCol, setMovingSourceCol] = useState<KanbanColumnId | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [kanbanFilters, setKanbanFilters] = useState({
    role: 'Todos',
    dept: 'Todos',
    period: 'Últimos 30 dias'
  });

  const job = jobs.find(j => j.id === id || j.id === Number(id));
  const jobTitle = job?.title || 'Vaga Selecionada';

  // Filter candidates based on job and header filters
  const filteredCandidatesByJob = candidates.filter(c => {
    if (id && c.jobId.toString() !== id.toString()) return false;

    if (kanbanFilters.role !== 'Todos' && c.role !== kanbanFilters.role) return false;

    // Dept filter would require finding the job for each candidate
    if (kanbanFilters.dept !== 'Todos') {
      const cJob = jobs.find(j => j.id === c.jobId);
      if (cJob?.department !== kanbanFilters.dept) return false;
    }

    return true;
  });

  const handleDragStart = (e: DragEvent<HTMLDivElement>, candidateId: string, sourceColId: KanbanColumnId) => {
    e.dataTransfer.setData('candidateId', candidateId);
    e.dataTransfer.setData('sourceColId', sourceColId);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetColId: KanbanColumnId) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData('candidateId');
    moveCandidate(candidateId, targetColId);
  };

  const openProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDrawerOpen(true);
  };

  const openFeedback = (e: React.MouseEvent, candidate: Candidate) => {
    e.stopPropagation();
    setFeedbackCandidate(candidate);
    setIsFeedbackModalOpen(true);
  }

  const openMoveModal = (e: React.MouseEvent, candidate: Candidate, colId: KanbanColumnId) => {
    e.stopPropagation();
    setMovingCandidate(candidate);
    setMovingSourceCol(colId);
    setIsMoveModalOpen(true);
  }

  const handleAction = (e: React.MouseEvent, candidateId: string, action: KanbanColumnId, message: string) => {
    e.stopPropagation();
    moveCandidate(candidateId, action);
    setToast({ message, type: 'success' });
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 transition-all duration-200 h-full overflow-hidden bg-background">

      {/* Header Avançado */}
      <header className="bg-card border-b border-border px-6 py-4 z-20 shrink-0">
        <div className="max-w-[1920px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                  Candidatos — {jobTitle}
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-normal border border-slate-200 dark:border-slate-600">ID: #{id || '4092'}</span>
                </h1>
              </div>
              <p className="text-muted-foreground text-sm font-medium">Acompanhe etapas e entrevistas com auditoria completa.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/audit')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-foreground bg-background border border-border rounded-base hover:bg-accent transition-all duration-200 ease-in-out shadow-sm active:translate-y-[1px]"
              >
                <span className="material-symbols-outlined text-[20px]">history</span>
                Log de Auditoria
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-end bg-muted/50 p-3 rounded-lg border border-border">
            <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[160px]">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Vaga</label>
              <select
                className="w-full pl-2 pr-8 py-1.5 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all duration-200 ease-in-out hover:border-ring"
                value={id}
                onChange={(e) => navigate(`/kanban/${e.target.value}`)}
              >
                {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[140px]">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Cargo</label>
              <select
                value={kanbanFilters.role}
                onChange={(e) => setKanbanFilters(prev => ({ ...prev, role: e.target.value }))}
                className="w-full pl-2 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="Todos">Todos</option>
                <option value="Frontend">Frontend</option>
                <option value="UX/UI">UX/UI</option>
                <option value="Backend">Backend</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[140px]">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Área/Depto</label>
              <select
                value={kanbanFilters.dept}
                onChange={(e) => setKanbanFilters(prev => ({ ...prev, dept: e.target.value }))}
                className="w-full pl-2 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="Todos">Todos</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[160px]">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                Gestor responsável
                <span className="material-symbols-outlined text-[12px] text-slate-400" title="Locked for Managers">lock</span>
              </label>
              <div className="relative">
                <select className="w-full pl-8 pr-8 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-500 dark:text-slate-400 focus:outline-none cursor-not-allowed" disabled>
                  <option defaultValue="selected">{user?.name || 'Ana Silva'} (Eu)</option>
                </select>
                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">person</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[140px]">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Período</label>
              <select
                value={kanbanFilters.period}
                onChange={(e) => setKanbanFilters(prev => ({ ...prev, period: e.target.value }))}
                className="w-full pl-2 pr-8 py-1.5 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all duration-200 ease-in-out hover:border-ring"
              >
                <option value="Últimos 30 dias">Últimos 30 dias</option>
                <option value="Este Trimestre">Este Trimestre</option>
                <option value="Este Ano">Este Ano</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden bg-muted/30 p-6 kanban-scroll">
        <div className="flex h-full gap-4 min-w-max items-start">

          {COLUMNS_CONFIG.map((col) => {
            const columnCandidates = filteredCandidatesByJob.filter(c => c.columnId === col.id);
            return (
              <div
                key={col.id}
                className={`flex flex-col w-[280px] h-full rounded-lg border shrink-0 ${col.containerClass}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div className={`p-3 border-b flex justify-between items-center rounded-t-xl backdrop-blur-sm sticky top-0 ${col.headerClass}`}>
                  <div className="flex items-center gap-2">
                    <span className={`size-2.5 rounded-full ${col.dotColor}`}></span>
                    <h3 className={`font-bold text-sm ${col.id === 'manager_interview' ? 'text-primary-dark dark:text-blue-400' : (col.id === 'hired' ? 'text-green-800 dark:text-green-300' : 'text-slate-700 dark:text-slate-200')}`}>
                      {col.title}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${col.countColor}`}>
                      {columnCandidates.length}
                    </span>
                  </div>
                  {col.convRate && (
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{col.convRate}</span>
                  )}
                </div>

                {/* Cards Container */}
                <div className={`p-2 flex-1 overflow-y-auto space-y-2 kanban-column-scroll ${col.bodyClass || ''}`}>

                  {/* Empty State for Hired Column */}
                  {col.id === 'hired' && columnCandidates.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center h-full pb-10">
                      <span className="material-symbols-outlined text-green-300 dark:text-green-800 text-4xl mb-2">celebration</span>
                      <p className="text-xs text-green-600/70 dark:text-green-400/70">Nenhum candidato contratado ainda.</p>
                    </div>
                  )}

                  {columnCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, candidate.id, col.id)}
                      onClick={() => openProfile(candidate)}
                      className={`bg-card p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer group relative border border-border hover:border-ring ${col.id === 'manager_interview' ? 'ring-1 ring-primary/20' : (col.id === 'rejected' ? 'grayscale opacity-70 hover:opacity-100 hover:grayscale-0' : '')}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`size-8 rounded-full ${candidate.avatarColor} ${candidate.textColor} flex items-center justify-center text-xs font-bold shrink-0`}>
                            {candidate.initials}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{candidate.name}</h4>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{candidate.time}</span>
                          </div>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                        </button>
                      </div>

                      {/* Specific Card Content based on Column */}
                      {col.id === 'received' && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] border border-slate-200 dark:border-slate-700">{candidate.role || 'Geral'}</span>
                          {candidate.match && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] border ${candidate.match.includes('9') ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800/50'}`}>
                              {candidate.match}
                            </span>
                          )}
                        </div>
                      )}

                      {col.id === 'screening' && candidate.status && (
                        <div className="mb-2">
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{candidate.status}</p>
                        </div>
                      )}

                      {col.id === 'technical' && candidate.actionRequired && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded border border-orange-100 dark:border-orange-800">
                            <span className="material-symbols-outlined text-[12px]">schedule</span> Aguardando
                          </span>
                        </div>
                      )}

                      {col.id === 'hr_interview' && (
                        <button className="w-full mb-2 flex items-center justify-center gap-1 bg-primary/10 hover:bg-primary/20 text-primary dark:text-blue-300 text-xs font-medium py-1.5 rounded transition-colors">
                          <span className="material-symbols-outlined text-[14px]">video_camera_front</span>
                          Iniciar Entrevista
                        </button>
                      )}

                      {col.id === 'manager_interview' && (
                        <div className="flex flex-col gap-2 mb-2">
                          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-[14px] text-green-600">check_circle</span>
                            Entrevista realizada
                          </div>
                          <button
                            onClick={(e) => openFeedback(e, candidate)}
                            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-base bg-primary text-primary-foreground border border-border/40 hover:bg-primary/90 text-xs font-bold transition-all duration-200 ease-in-out shadow-sm active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <span className="material-symbols-outlined text-[14px]">rate_review</span>
                            Registrar Feedback
                          </button>
                        </div>
                      )}

                      {col.id === 'finalist' && (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => handleAction(e, candidate.id, 'hired', 'Candidato formalmente contratado!')}
                            className="flex-1 py-1.5 rounded-base bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold border border-emerald-500/20 transition-all duration-200 shadow-sm active:translate-y-[1px]"
                          >
                            Contratar
                          </button>
                        </div>
                      )}

                      {/* Card Footer Actions */}
                      {col.id !== 'rejected' && (
                        <div className="border-t border-slate-100 dark:border-slate-700 pt-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-xs font-medium text-primary hover:text-primary-dark">Ver Perfil</button>
                          {col.id === 'manager_interview' ? (
                            <div className="flex gap-1">
                              <button
                                onClick={(e) => handleAction(e, candidate.id, 'rejected', 'Candidato movido para Não Selecionados')}
                                className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"
                                title="Rejeitar"
                              >
                                <span className="material-symbols-outlined text-[16px]">close</span>
                              </button>
                              <button
                                onClick={(e) => handleAction(e, candidate.id, 'finalist', 'Candidato aprovado para a fase final!')}
                                className="p-1 hover:bg-green-50 text-slate-400 hover:text-green-500 rounded"
                                title="Aprovar para Finalista"
                              >
                                <span className="material-symbols-outlined text-[16px]">check</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
                              title="Mover"
                              onClick={(e) => openMoveModal(e, candidate, col.id)}
                            >
                              {col.id === 'screening' ? <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">arrow_forward</span> Mover</span> : '→'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {columnCandidates.length === 0 && col.id !== 'hired' && (
                    <div className="h-20 flex items-center justify-center text-xs text-slate-400 italic">
                      Vazio
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CandidateProfileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        candidateId={selectedCandidate?.id}
      />

      <InterviewFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        candidateName={feedbackCandidate?.name || ''}
        candidateInitials={feedbackCandidate?.initials || ''}
      />

      <MoveStageModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        candidateName={movingCandidate?.name || ''}
        candidateInitials={movingCandidate?.initials}
        currentStage={movingSourceCol ? COLUMNS_CONFIG.find(c => c.id === movingSourceCol)?.title || '' : ''}
        candidateId={movingCandidate?.id || ''}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Kanban;