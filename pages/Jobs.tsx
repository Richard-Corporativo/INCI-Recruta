import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ConfirmationModal from '../components/ConfirmationModal';
import Toast from '../components/Toast';
import { useJobs } from '../hooks/useJobs';
import { useAuth } from '../hooks/useAuth';
import { useCandidates } from '../hooks/useCandidates';
import { useUsers } from '../hooks/useUsers';
import useDebounce from '../hooks/useDebounce';
import { useQuickView } from '../context/QuickViewContext';

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, deleteJob, isLoading } = useJobs();
  const { candidates } = useCandidates();
  const { users } = useUsers();
  const { user } = useAuth();
  const { openQuickView } = useQuickView();

  const [jobToDelete, setJobToDelete] = useState<string | number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todas');
  const [managerFilter, setManagerFilter] = useState('all');

  const debouncedSearchTerm = useDebounce(searchInputValue, 300);

  // Distinct colors for Urgency
  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case 'Alta': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'Média': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'Baixa': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getUrgencyDotColor = (urgency: string) => {
    switch (urgency) {
      case 'Alta': return 'bg-red-500';
      case 'Média': return 'bg-orange-500';
      case 'Baixa': return 'bg-slate-400';
      default: return 'bg-muted-foreground';
    }
  };

  // Distinct colors for Status
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Ativa': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'Pausada': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'Encerrada': return 'bg-slate-500/10 text-slate-600 border-slate-200';
      case 'Rascunho': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'Ativa': return 'bg-emerald-500';
      case 'Pausada': return 'bg-amber-500';
      case 'Encerrada': return 'bg-slate-500';
      case 'Rascunho': return 'bg-blue-500';
      default: return 'bg-muted-foreground';
    }
  };

  const filteredJobs = React.useMemo(() => {
    return jobs.filter(job => {
      // Search: Title, Dept, Location
      const matchesSearch = !debouncedSearchTerm ||
        job.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      // Status Filter
      const matchesStatus = statusFilter === 'Todas' || job.status === statusFilter;

      // Manager Filter
      let matchesManager = true;
      if (managerFilter !== 'all') {
        matchesManager = job.manager_id === managerFilter;
      }

      return matchesSearch && matchesStatus && matchesManager;
    });
  }, [jobs, debouncedSearchTerm, statusFilter, managerFilter]);

  const isAdmin = user?.role === 'admin' || user?.role === 'recruiter';

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-background transition-colors duration-200 ease-in-out">
      {/* HEADER */}
      <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20 shadow-sm shrink-0 transition-colors duration-200 ease-in-out">
        <div className="mb-3">
          <Breadcrumbs items={[{ label: 'Vagas' }]} />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold text-foreground transition-colors">Hub de oportunidades (Atualizado)</h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium transition-colors">Gerencie suas vagas ativas e converta talentos em contratações.</p>
          </div>
          <Link to="/jobs/new" className="flex items-center justify-center gap-2.5 bg-primary text-primary-foreground border border-border/40 px-6 h-12 rounded-base text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 ease-in-out active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Publicar nova vaga</span>
          </Link>
        </div>

        {/* Filters Bar */}
        <div className="bg-muted/30 border border-border rounded-lg p-2 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border shadow-sm items-center transition-colors">
          {/* Search Input */}
          <div className="w-full md:w-64 px-4 py-2 group">
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1 transition-colors" htmlFor="search-jobs">
              Buscar vaga
            </label>
            <div className="relative">
              <input
                id="search-jobs"
                type="text"
                placeholder="Nome da vaga..."
                className="w-full bg-transparent border-none p-0 text-sm font-semibold text-foreground focus:ring-0 placeholder:text-muted-foreground transition-all outline-none"
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
              />
              <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[20px] text-muted-foreground pointer-events-none transition-colors">search</span>
            </div>
          </div>

          <div className="w-full md:w-56 px-4 py-2">
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1 flex items-center gap-1 transition-colors">
              Gestor {!isAdmin && <span className="material-symbols-outlined text-[10px] text-muted-foreground" title="Permissão restrita">lock</span>}
            </label>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-muted-foreground text-[18px]">person</span>
              <div className="relative w-full">
                <select
                  className={`w-full bg-transparent border-none p-0 text-sm font-semibold text-foreground focus:ring-0 appearance-none pr-6 outline-none ${!isAdmin ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                  disabled={!isAdmin}
                  value={managerFilter}
                  onChange={(e) => setManagerFilter(e.target.value)}
                >
                  <option value="all">Todos os Gestores</option>
                  {users.filter(u => u.role === 'manager' || u.role === 'admin').map(u => (
                    <option key={u.id} value={u.id}>{u.name} {u.id === user?.id ? '(Eu)' : ''}</option>
                  ))}
                </select>
                {isAdmin && <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[18px] text-muted-foreground pointer-events-none transition-colors">expand_more</span>}
              </div>
            </div>
          </div>

          <div className="w-full md:w-40 px-4 py-2">
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1 transition-colors">Status</label>
            <div className="relative">
              <select
                className="w-full bg-transparent border-none p-0 text-sm font-semibold text-foreground focus:ring-0 cursor-pointer appearance-none pr-6 outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Todas">Todas</option>
                <option value="Ativa">Ativas</option>
                <option value="Pausada">Pausadas</option>
                <option value="Encerrada">Encerradas</option>
                <option value="Rascunho">Rascunhos</option>
              </select>
              <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[20px] text-muted-foreground pointer-events-none transition-colors">expand_more</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-hidden relative bg-muted/30 transition-colors">
        <div className="absolute inset-0 overflow-y-auto p-8 animate-in fade-in duration-300 custom-scrollbar">
          <div className="max-w-[1920px] mx-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden transition-all duration-200">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-muted/50 border-b border-border shadow-sm">
                    <tr>
                      <th className="px-6 py-5 text-[11px] font-semibold text-muted-foreground w-[25%] transition-colors">Vaga / Contexto</th>
                      <th className="px-6 py-5 text-[11px] font-semibold text-muted-foreground transition-colors">Área/Depto</th>
                      <th className="px-6 py-5 text-[11px] font-semibold text-muted-foreground transition-colors">Local/Modelo</th>
                      <th className="px-6 py-5 text-[11px] font-semibold text-muted-foreground transition-colors">Contrato</th>
                      <th className="px-6 py-5 text-[11px] font-semibold text-muted-foreground transition-colors">Urgência</th>
                      <th className="px-6 py-5 text-[11px] font-semibold text-muted-foreground transition-colors">Status</th>
                      <th className="px-6 py-5 text-[11px] font-semibold text-muted-foreground transition-colors">Prazo Inscrição</th>
                      <th className="px-6 py-5 text-[11px] font-semibold text-muted-foreground transition-colors">Candidatos</th>
                      <th className="px-6 py-5 text-[11px] font-semibold text-muted-foreground text-right transition-colors">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredJobs.map((job) => {
                      const jobCandidatesCount = candidates.filter(c => c.jobId?.toString() === job.id.toString()).length;
                      return (
                        <tr
                          key={job.id}
                          className="bg-card hover:bg-muted/50 transition-colors duration-200 ease-in-out cursor-pointer group"
                          onClick={() => navigate(`/jobs/${job.id}/kanban`)}
                        >
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="text-sm text-foreground font-semibold group-hover:text-primary transition-all duration-200 ease-in-out">
                                {job.title}
                              </span>
                              <span className="text-xs text-muted-foreground mt-1 transition-colors">{job.context}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-foreground transition-colors">{job.department}</td>
                          <td className="px-6 py-5 text-sm text-foreground transition-colors">{job.location}</td>
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border transition-colors">
                              {job.contract}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${getUrgencyStyles(job.urgency)}`}>
                              <span className={`size-1.5 rounded-full transition-colors ${getUrgencyDotColor(job.urgency)}`}></span> {job.urgency}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${getStatusStyles(job.status)}`}>
                              <span className={`size-1.5 rounded-full transition-colors ${getStatusDotColor(job.status)}`}></span> {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-sm text-foreground transition-colors">
                            {job.registration_deadline ? new Date(job.registration_deadline).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-baseline gap-1 transition-colors">
                              <span className="text-sm font-semibold text-foreground">{jobCandidatesCount}</span>
                              <span className="text-xs text-muted-foreground">inscritos</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                              <button
                                onClick={(e) => { e.stopPropagation(); openQuickView('job', job); }}
                                className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                title="Visualização Rápida"
                              >
                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job.id}/kanban`); }}
                                className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                title="Ver Kanban"
                              >
                                <span className="material-symbols-outlined text-[20px]">view_kanban</span>
                              </button>
                              <Link
                                to={`/jobs/${job.id}/edit`}
                                className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                title="Editar"
                              >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                              </Link>
                              <button
                                onClick={(e) => { e.stopPropagation(); setJobToDelete(job.id); }}
                                className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                                title="Excluir"
                              >
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={() => {
          if (jobToDelete) {
            deleteJob(jobToDelete);
            setJobToDelete(null);
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
    </div>
  );
};

export default Jobs;
