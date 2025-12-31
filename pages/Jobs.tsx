import React, { useState, DragEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import CandidateProfileDrawer from '../components/CandidateProfileDrawer';
import KanbanColumn from '../components/KanbanColumn';
import ConfirmationModal from '../components/ConfirmationModal';
import Toast from '../components/Toast';
import { useJobs } from '../hooks/useJobs';
import { useCandidates } from '../hooks/useCandidates';
import { useAuth } from '../hooks/useAuth';
import useDebounce from '../hooks/useDebounce';
import { Job, Candidate } from '../types';

// --- Constants ---
export const KANBAN_COLUMNS = [
  { id: 'received', title: 'Recebido', color: 'bg-muted-foreground/40' },
  { id: 'screening', title: 'Em Triagem', color: 'bg-accent text-accent-foreground' },
  { id: 'technical', title: 'Avaliação Téc.', color: 'bg-primary/20 text-primary border-primary/20 border' },
  { id: 'hr_interview', title: 'Entrevista RH', color: 'bg-primary/10 text-primary border-primary/20 border' },
  { id: 'manager_interview', title: 'Entrevista Gestor', color: 'bg-primary text-primary-foreground' },
  { id: 'finalist', title: 'Finalista', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20 border' },
  { id: 'hired', title: 'Contratado', color: 'bg-emerald-500 text-white' },
];

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobs, deleteJob } = useJobs();
  const { candidates, moveCandidate, refresh: refreshCandidates } = useCandidates();
  const { user } = useAuth();

  const [jobToDelete, setJobToDelete] = useState<string | number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // --- Estados do Hub ---
  const [selectedJobId, setSelectedJobId] = useState<string | number>('all');
  const [jobViewMode, setJobViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchInputValue, setSearchInputValue] = useState('');

  // --> otimizado: debounce search para evitar travamento da main thread (Interaction & Feedback)
  const debouncedSearchTerm = useDebounce(searchInputValue, 300);

  const [isLoading, setIsLoading] = useState(false);

  // Handle navigation state from JobDetail
  React.useEffect(() => {
    const state = location.state as { selectedJobId?: string | number } | null;
    if (state?.selectedJobId) {
      setSelectedJobId(state.selectedJobId);
      // Clear the state to avoid re-triggering
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  // Efeito para simular carregamento ao trocar de vaga (UX Playbook: Feedback Imediato)
  React.useEffect(() => {
    if (selectedJobId !== 'all') {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [selectedJobId]);

  // --- Estados do Drawer de Candidato ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Dados da vaga selecionada
  const selectedJob = jobs.find(j => j.id === Number(selectedJobId) || j.id === selectedJobId);

  // Filter candidates (ideally by jobId, but for now we show all mock ones)
  // --> otimizado: uso do termo debounced para filtrar
  const filteredCandidates = candidates.filter(c => {
    if (!debouncedSearchTerm) return true;
    return c.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
  });

  // Helper para gerar lista plana de candidatos para a visualização em tabela
  const getAllCandidatesList = () => {
    const list = filteredCandidates.map(c => {
      const col = KANBAN_COLUMNS.find(k => k.id === c.columnId);
      return {
        ...c,
        statusLabel: col?.title || 'Desconhecido',
        statusColor: col?.color || 'bg-slate-400'
      };
    });
    return list;
  };

  const candidateList = getAllCandidatesList();

  // --- Handlers ---
  const handleSelectJob = (id: string | number) => {
    setSelectedJobId(id);
    setJobViewMode('kanban');
  };

  const handleBackToOverview = () => {
    setSelectedJobId('all');
    setSearchInputValue(''); // Limpa o input visual
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, candidateId: string, sourceColId: string) => {
    e.dataTransfer.setData('candidateId', candidateId);
    e.dataTransfer.setData('sourceColId', sourceColId);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetColId: string) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData('candidateId');
    moveCandidate(candidateId, targetColId);
  };

  const handleOpenProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDrawerOpen(true);
  };

  // Helper para cores de urgência
  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case 'Alta':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Média':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Baixa':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getUrgencyDotColor = (urgency: string) => {
    switch (urgency) {
      case 'Alta': return 'bg-destructive';
      case 'Média': return 'bg-primary';
      case 'Baixa': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  // Helper para cores de status
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Ativa':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Pausada':
      case 'Rascunho':
      case 'Encerrada':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'Ativa': return 'bg-emerald-500';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background transition-colors duration-200">
      {/* --- HEADER --- */}
      {selectedJobId === 'all' ? (
        <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20 shadow-sm shrink-0 sticky top-0">
          <div className="mb-3">
            <Breadcrumbs items={[{ label: 'Vagas' }]} />
          </div>
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Hub de Oportunidades</h1>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Gerencie suas vagas ativas e converta talentos em contratações.</p>
            </div>
            <Link to="/jobs/new" className="flex items-center justify-center gap-2.5 bg-primary text-primary-foreground border border-primary/40 px-6 py-3 rounded-base text-sm font-bold shadow-lg shadow-primary/20 transition-all active:translate-y-[1px] hover:scale-[1.02]">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>Publicar Nova Vaga</span>
            </Link>
          </div>

          {/* Filters Bar */}
          <div className="bg-background border border-border rounded-lg p-2 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border shadow-sm items-center">

            {/* Search Input - Otimizado com Debounce */}
            <div className="w-full md:w-64 px-4 py-2">
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1" htmlFor="search-jobs">
                BUSCAR VAGA
              </label>
              <div className="relative">
                <input
                  id="search-jobs"
                  type="text"
                  placeholder="Nome da vaga..."
                  className="w-full bg-transparent border-none p-0 text-sm font-bold text-foreground focus:ring-0 placeholder:text-muted-foreground/50"
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                />
                <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[20px] text-muted-foreground pointer-events-none">search</span>
              </div>
            </div>

            <div className="flex-1 px-4 py-2">
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">
                SELEÇÃO RÁPIDA
              </label>
              <div className="relative">
                <select
                  className="w-full bg-transparent border-none p-0 text-sm font-bold text-foreground focus:ring-0 cursor-pointer appearance-none pr-6"
                  value={selectedJobId}
                  onChange={(e) => handleSelectJob(e.target.value)}
                >
                  <option value="all">Ver Todas as Vagas</option>
                  {jobs.map(job => <option key={job.id} value={job.id}>{job.title}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[20px] text-muted-foreground pointer-events-none">expand_more</span>
              </div>
            </div>

            <div className="w-full md:w-48 px-4 py-2">
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
                GESTOR <span className="material-symbols-outlined text-[10px]" title="Permissão restrita">lock</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-muted-foreground text-[18px]">person</span>
                <div className="relative w-full">
                  <select className="w-full bg-transparent border-none p-0 text-sm font-medium text-foreground focus:ring-0 cursor-pointer appearance-none pr-6" disabled>
                    <option>{user?.name || 'Ana Silva'} (Eu)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="w-full md:w-40 px-4 py-2">
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">STATUS</label>
              <div className="relative">
                <select className="w-full bg-transparent border-none p-0 text-sm font-medium text-foreground focus:ring-0 cursor-pointer appearance-none pr-6">
                  <option>Todas</option>
                  <option>Ativas</option>
                  <option>Pausadas</option>
                </select>
                <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[20px] text-muted-foreground pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>
        </header>
      ) : (
        /* Header Contextual (Detalhe da Vaga) - NOVO DESIGN */
        <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20 shadow-sm shrink-0 sticky top-0">
          <div className="mb-3">
            <Breadcrumbs items={[
              { label: 'Vagas', to: '/jobs', onClick: handleBackToOverview },
              { label: selectedJob?.title || 'Detalhes' }
            ]} />
          </div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">{selectedJob?.title}</h1>
              <span className="text-xl text-muted-foreground font-medium">#{selectedJob?.id}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-48 mr-2">
                <input
                  type="text"
                  placeholder="Filtrar candidatos..."
                  className="w-full pl-8 pr-3 py-1.5 bg-muted rounded-full text-xs font-medium border-transparent focus:bg-background focus:border-primary focus:ring-0 transition-all"
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-muted-foreground">search</span>
              </div>

              <div className="h-6 w-px bg-border"></div>

              <button
                onClick={handleBackToOverview}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Voltar para Lista
              </button>

              <div className="h-6 w-px bg-border"></div>

              <div className="flex bg-muted p-1 rounded-base border border-border">
                <button
                  onClick={() => setJobViewMode('kanban')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-bold transition-all duration-200 ease-in-out ${jobViewMode === 'kanban' ? 'bg-background text-primary shadow-sm ring-1 ring-border/50' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">view_kanban</span>
                  Kanban
                </button>
                <button
                  onClick={() => setJobViewMode('list')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-bold transition-all duration-200 ease-in-out ${jobViewMode === 'list' ? 'bg-background text-primary shadow-sm ring-1 ring-border/50' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">list</span>
                  Lista
                </button>
              </div>

              <div className="flex items-center gap-1">
                <Link to={`/jobs/${selectedJobId}/edit`} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Editar Vaga">
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </Link>
                <button
                  onClick={() => setJobToDelete(selectedJobId)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  title="Excluir Vaga"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
                <Link to={`/jobs/${selectedJobId}`} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Ver Detalhes">
                  <span className="material-symbols-outlined text-[20px]">info</span>
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-hidden relative bg-muted/30">

        {/* VIEW 1: OVERVIEW (JOB LIST) */}
        {selectedJobId === 'all' && (
          <div className="absolute inset-0 overflow-y-auto p-8 animate-fadeIn">
            <div className="max-w-[1920px] mx-auto">
              <div className="bg-card border-border shadow-sm rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-muted/50 border-b border-border shadow-sm">
                    <tr>
                      <th className="px-6 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider w-[25%]">Vaga / Contexto</th>
                      <th className="px-6 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Área/Depto</th>
                      <th className="px-6 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Local/Modelo</th>
                      <th className="px-6 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Contrato</th>
                      <th className="px-6 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Urgência</th>
                      <th className="px-6 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-6 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Candidatos</th>
                      <th className="px-6 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {jobs.filter(job => !debouncedSearchTerm || job.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())).map((job) => (
                      <tr
                        key={job.id}
                        className="bg-card hover:bg-muted/40 transition-colors duration-200 ease-in-out cursor-pointer"
                        onClick={() => handleSelectJob(job.id)}
                      >
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span
                              className="text-sm text-foreground font-bold hover:text-primary transition-all duration-200 ease-in-out"
                              title="Abrir Kanban"
                            >
                              {job.title}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">{job.context}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-foreground">{job.department}</td>
                        <td className="px-6 py-5 text-sm text-foreground">{job.location}</td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                            {job.contract}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getUrgencyStyles(job.urgency)}`}>
                            <span className={`size-1.5 rounded-full ${getUrgencyDotColor(job.urgency)}`}></span> {job.urgency}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(job.status)}`}>
                            <span className={`size-1.5 rounded-full ${getStatusDotColor(job.status)}`}></span> {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-foreground">{job.candidates_count}</span>
                            <span className="text-xs text-muted-foreground">ativos</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleSelectJob(job.id); }}
                              className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
                              title="Ver Kanban"
                            >
                              <span className="material-symbols-outlined text-[20px]">view_kanban</span>
                            </button>
                            <Link
                              to={`/jobs/${job.id}/edit`}
                              className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                              title="Editar"
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </Link>
                            <button
                              onClick={(e) => { e.stopPropagation(); setJobToDelete(job.id); }}
                              className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                              title="Excluir"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: JOB VIEW (KANBAN/LIST) */}
        {selectedJobId !== 'all' && (
          <div className="absolute inset-0 bg-muted/40 p-6 overflow-x-auto kanban-scroll animate-fadeIn">
            {jobViewMode === 'kanban' ? (
              <div className="flex h-full gap-4 min-w-max items-start">
                {KANBAN_COLUMNS.map((col) => {
                  const columnCandidates = filteredCandidates.filter(c => c.columnId === col.id);
                  // --> otimizado: Uso de componente memoizado para performance em drag-and-drop
                  return (
                    <KanbanColumn
                      key={col.id}
                      col={col}
                      candidates={columnCandidates}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onCardClick={handleOpenProfile}
                      isLoading={isLoading}
                    />
                  );
                })}
              </div>
            ) : (
              // List View Mode Implementation
              <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden h-full flex flex-col">
                <div className="overflow-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-muted border-b border-border sticky top-0 z-10 backdrop-blur-sm">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Candidato</th>
                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Etapa Atual</th>
                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Compatibilidade</th>
                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Data</th>
                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {candidateList.length > 0 ? (
                        candidateList.map(candidate => (
                          <tr key={candidate.id} className="group hover:bg-muted/40 transition-all duration-200">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`size-9 rounded-full ${candidate.avatarColor} ${candidate.textColor} flex items-center justify-center text-xs font-bold shrink-0 shadow-inner border border-white/10`}>
                                  {candidate.initials}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-slate-900 dark:text-white">{candidate.name}</span>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">{candidate.role || 'Candidato'}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                <span className={`size-1.5 rounded-full ${candidate.statusColor}`}></span>
                                {candidate.statusLabel}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {candidate.match ? (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${candidate.match.includes('9') ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'}`}>
                                  {candidate.match}
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                              {candidate.time}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleOpenProfile(candidate)}
                                  className="p-1.5 text-slate-400 hover:text-primary transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                                  title="Ver Perfil"
                                >
                                  <span className="material-symbols-outlined text-[20px]">person</span>
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" title="Mover">
                                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                            Nenhum candidato encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <CandidateProfileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        candidateId={selectedCandidate?.id}
        onCandidateUpdate={() => {
          refreshCandidates();
          setToast({ message: 'Candidato movido com sucesso!', type: 'success' });
        }}
      />

      <ConfirmationModal
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={() => {
          if (jobToDelete) {
            deleteJob(jobToDelete);
            setJobToDelete(null);
            if (String(selectedJobId) === String(jobToDelete)) {
              handleBackToOverview();
            }
          }
        }}
        title="Excluir Vaga"
        message="Tem certeza que deseja excluir esta vaga? Todos os dados associados serão removidos permanentemente."
        confirmLabel="Excluir Vaga"
        type="danger"
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div >
  );
};

export default Jobs;