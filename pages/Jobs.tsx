import React, { useState, DragEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import CandidateProfileDrawer from '../components/CandidateProfileDrawer';
import { useJobs } from '../hooks/useJobs';
import { useCandidates } from '../hooks/useCandidates';
import { useAuth } from '../hooks/useAuth';
import { Job, Candidate } from '../types';

// --- Constants ---
const KANBAN_COLUMNS = [
  { id: 'received', title: 'Recebido', color: 'bg-slate-400' },
  { id: 'screening', title: 'Em Triagem', color: 'bg-blue-400' },
  { id: 'technical', title: 'Avaliação Téc.', color: 'bg-purple-400' },
  { id: 'hr_interview', title: 'Entrevista RH', color: 'bg-indigo-400' },
  { id: 'manager_interview', title: 'Entrevista Gestor', color: 'bg-primary' },
  { id: 'finalist', title: 'Finalista', color: 'bg-yellow-400' },
  { id: 'hired', title: 'Contratado', color: 'bg-green-500' },
];

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const { jobs } = useJobs();
  const { candidates, moveCandidate } = useCandidates();
  const { user } = useAuth();

  // --- Estados do Hub ---
  const [selectedJobId, setSelectedJobId] = useState<string | number>('all');
  const [jobViewMode, setJobViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');

  // --- Estados do Drawer de Candidato ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Dados da vaga selecionada
  const selectedJob = jobs.find(j => j.id === Number(selectedJobId) || j.id === selectedJobId);

  // Filter candidates (ideally by jobId, but for now we show all mock ones)
  const filteredCandidates = candidates;

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

    if (searchTerm) {
      return list.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
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
    setSearchTerm('');
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
        return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/30';
      case 'Média':
        return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/30';
      case 'Baixa':
        return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/30';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getUrgencyDotColor = (urgency: string) => {
    switch (urgency) {
      case 'Alta': return 'bg-red-500';
      case 'Média': return 'bg-amber-500';
      case 'Baixa': return 'bg-blue-500';
      default: return 'bg-slate-400';
    }
  };

  // Helper para cores de status
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Ativa':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/30';
      case 'Pausada':
      case 'Rascunho':
      case 'Encerrada':
        return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'Ativa': return 'bg-emerald-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-200">

      {/* --- HEADER --- */}
      {selectedJobId === 'all' ? (
        <div className="flex flex-col bg-white dark:bg-[#1a202c] border-b border-slate-200 dark:border-slate-800 pt-8 pb-4 px-8 z-20 shadow-sm shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-slate-400 text-[20px]">home</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">Home</span>
            <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">Vagas</span>
          </div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Minhas Vagas</h1>
            <Link to="/jobs/new" className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Criar vaga</span>
            </Link>
          </div>

          {/* Filters Bar */}
          <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-700 rounded-lg p-2 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700 shadow-sm">
            <div className="flex-1 px-4 py-2">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                VAGA SELECIONADA
              </label>
              <div className="relative">
                <select
                  className="w-full bg-transparent border-none p-0 text-sm font-medium text-slate-900 dark:text-white focus:ring-0 cursor-pointer appearance-none pr-6"
                  value={selectedJobId}
                  onChange={(e) => handleSelectJob(e.target.value)}
                >
                  <option value="all">Todas as Vagas (Visão Geral)</option>
                  {jobs.map(job => <option key={job.id} value={job.id}>{job.title}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[20px] text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            <div className="w-full md:w-56 px-4 py-2">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">ÁREA/DEPTO</label>
              <div className="relative">
                <select className="w-full bg-transparent border-none p-0 text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer appearance-none pr-6">
                  <option>Todos</option>
                  <option>Tecnologia</option>
                  <option>Marketing</option>
                  <option>Produto</option>
                </select>
                <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[20px] text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            <div className="w-full md:w-64 px-4 py-2">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                GESTOR RESPONSÁVEL <span className="material-symbols-outlined text-[10px]" title="Permissão restrita">lock</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">person</span>
                <div className="relative w-full">
                  <select className="w-full bg-transparent border-none p-0 text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer appearance-none pr-6" disabled>
                    <option>{user?.name || 'Ana Silva'} (Eu)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[20px] text-slate-400 pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-48 px-4 py-2">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">STATUS</label>
              <div className="relative">
                <select className="w-full bg-transparent border-none p-0 text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer appearance-none pr-6">
                  <option>Todas</option>
                  <option>Ativas</option>
                  <option>Pausadas</option>
                  <option>Fechadas</option>
                </select>
                <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[20px] text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Header Contextual (Detalhe da Vaga) - NOVO DESIGN */
        <header className="bg-white dark:bg-[#1a202c] border-b border-slate-200 dark:border-slate-700 px-6 py-5 sticky top-0 z-20">
          <div className="flex flex-col gap-4">
            {/* Top Row: Breadcrumbs */}
            <div className="flex items-center justify-between">
              <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-[20px]">home</span>
                <span>Home</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span>Vagas</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedJob?.title}</span>
              </nav>
            </div>

            {/* Bottom Row: Title & Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{selectedJob?.title}</h1>
                <span className="text-lg text-slate-400 font-medium">#{selectedJob?.id}</span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToOverview}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white text-sm font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Voltar para Lista
                </button>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setJobViewMode('kanban')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${jobViewMode === 'kanban' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">view_kanban</span>
                    Kanban
                  </button>
                  <button
                    onClick={() => setJobViewMode('list')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${jobViewMode === 'list' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">list</span>
                    Lista
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <Link to={`/jobs/${selectedJobId}/edit`} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors" title="Editar Vaga">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </Link>
                  <Link to={`/jobs/${selectedJobId}`} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors" title="Ver Detalhes">
                    <span className="material-symbols-outlined text-[20px]">info</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-background-dark">

        {/* VIEW 1: OVERVIEW (JOB LIST) */}
        {selectedJobId === 'all' && (
          <div className="absolute inset-0 overflow-y-auto p-8 animate-fadeIn">
            <div className="max-w-[1920px] mx-auto">
              <div className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[25%]">Vaga / Contexto</th>
                      <th className="px-6 py-5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Área/Depto</th>
                      <th className="px-6 py-5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Local/Modelo</th>
                      <th className="px-6 py-5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contrato</th>
                      <th className="px-6 py-5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Urgência</th>
                      <th className="px-6 py-5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Candidatos</th>
                      <th className="px-6 py-5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {jobs.map((job) => (
                      <tr
                        key={job.id}
                        className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer bg-white dark:bg-[#1a202c]"
                        onClick={() => handleSelectJob(job.id)}
                      >
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span
                              className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors cursor-pointer"
                              title="Abrir Kanban"
                            >
                              {job.title}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{job.context}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">{job.department}</td>
                        <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">{job.location}</td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
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
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{job.candidates_count}</span>
                            <span className="text-xs text-slate-500">ativos</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleSelectJob(job.id); }}
                              className="p-2 text-slate-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
                              title="Ver Kanban"
                            >
                              <span className="material-symbols-outlined text-[20px]">view_kanban</span>
                            </button>
                            <Link
                              to={`/jobs/${job.id}/edit`}
                              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Editar"
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </Link>
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
          <div className="absolute inset-0 bg-slate-100 dark:bg-background-dark p-6 overflow-x-auto kanban-scroll animate-fadeIn">
            {jobViewMode === 'kanban' ? (
              <div className="flex h-full gap-4 min-w-max items-start">
                {KANBAN_COLUMNS.map((col) => {
                  const columnCandidates = filteredCandidates.filter(c => c.columnId === col.id);
                  return (
                    <div key={col.id} className="flex flex-col w-[280px] h-full bg-slate-200/60 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/50 shrink-0">
                      {/* Column Header */}
                      <div className="p-3 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/80 rounded-t-xl backdrop-blur-sm sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                          <span className={`size-2.5 rounded-full ${col.color}`}></span>
                          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">{col.title}</h3>
                          <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-0.5 rounded-full font-medium">
                            {columnCandidates.length}
                          </span>
                        </div>
                      </div>
                      {/* Cards Container */}
                      <div
                        className="p-2 flex-1 overflow-y-auto space-y-2 kanban-column-scroll"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, col.id)}
                      >
                        {columnCandidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            className="bg-white dark:bg-[#1a2632] p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                            draggable
                            onDragStart={(e) => handleDragStart(e, candidate.id, col.id)}
                            onClick={() => handleOpenProfile(candidate)}
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
                            {candidate.role && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] border border-slate-200 dark:border-slate-700">{candidate.role}</span>
                                {candidate.match && (
                                  <span className="px-1.5 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded text-[10px] border border-green-100 dark:border-green-800/50">{candidate.match} Match</span>
                                )}
                              </div>
                            )}
                            {candidate.actionRequired && (
                              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded border border-orange-100 dark:border-orange-800">
                                <span className="material-symbols-outlined text-[12px]">warning</span> Feedback Pendente
                              </div>
                            )}
                          </div>
                        ))}
                        {columnCandidates.length === 0 && (
                          <div className="h-20 flex items-center justify-center text-xs text-slate-400 italic">
                            Vazio
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // List View Mode Implementation
              <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full flex flex-col">
                <div className="overflow-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 backdrop-blur-sm">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Candidato</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Etapa Atual</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Match</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {candidateList.length > 0 ? (
                        candidateList.map(candidate => (
                          <tr key={candidate.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`size-9 rounded-full ${candidate.avatarColor} ${candidate.textColor} flex items-center justify-center text-xs font-bold shrink-0`}>
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
      />
    </div>
  );
};

export default Jobs;