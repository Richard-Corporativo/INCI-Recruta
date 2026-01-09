import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useJobs } from '../hooks/useJobs';
import { useCandidates } from '../hooks/useCandidates';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import Toast from '../components/Toast';

import { Skeleton } from '../components/atoms/Skeleton/Skeleton';

const Dashboard: React.FC = () => {
  const { jobs, isLoading: jobsLoading } = useJobs();
  const { candidates, isLoading: candidatesLoading } = useCandidates();
  const { users } = useUsers();
  const { user } = useAuth();

  const isLoading = jobsLoading || candidatesLoading;

  const [filters, setFilters] = React.useState({
    period: '30',
    area: '',
    manager: '',
    search: '',
    urgency: ''
  });

  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const jobsMap = React.useMemo(() => {
    const map = new Map<string | number, any>();
    jobs.forEach(j => map.set(j.id, j));
    return map;
  }, [jobs]);

  // 1. Dynamic Departments derived from data
  const departments = React.useMemo(() => {
    const set = new Set<string>();
    jobs.forEach(j => { if (j.department) set.add(j.department); });
    return Array.from(set).sort();
  }, [jobs]);

  // 2. Helper for period filtering
  const isWithinPeriod = (dateStr?: string, days?: string) => {
    if (!dateStr || !days || days === '365' || days === 'custom') return true;
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
    return diff <= parseInt(days);
  };

  const filteredJobs = React.useMemo(() => {
    return jobs
      .filter(job => {
        if (!isWithinPeriod(job.created_at, filters.period)) return false;
        if (filters.area && job.department !== filters.area) return false;
        if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        if (filters.urgency && job.urgency !== filters.urgency) return false;

        if (filters.manager) {
          const targetManagerId = filters.manager === 'me' ? user?.id : filters.manager;
          if (job.manager_id !== targetManagerId) return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [jobs, filters, user?.id]);

  const filteredCandidates = React.useMemo(() => {
    return candidates
      .filter(c => {
        const job = jobsMap.get(c.jobId!);
        if (!job) return false;

        if (!isWithinPeriod(c.applied_at, filters.period)) return false;
        if (filters.area && job.department !== filters.area) return false;

        if (filters.manager) {
          const targetManagerId = filters.manager === 'me' ? user?.id : filters.manager;
          if (job.manager_id !== targetManagerId) return false;
        }

        if (filters.urgency && job.urgency !== filters.urgency) return false;

        return true;
      })
      .sort((a, b) => {
        const dateA = a.applied_at ? new Date(a.applied_at).getTime() : 0;
        const dateB = b.applied_at ? new Date(b.applied_at).getTime() : 0;
        return dateB - dateA;
      });
  }, [candidates, jobsMap, filters, user?.id]);

  const stats = React.useMemo(() => {
    const hired = candidates.filter(c => c.columnId === 'hired' && c.applied_at && c.hired_at);
    let avg = 0;
    if (hired.length > 0) {
      const totalDays = hired.reduce((acc, c) => {
        const start = new Date(c.applied_at!).getTime();
        const end = new Date(c.hired_at!).getTime();
        return acc + (end - start) / (1000 * 60 * 60 * 24);
      }, 0);
      avg = Math.round(totalDays / hired.length);
    }

    return {
      activeJobs: filteredJobs.filter(j => j.status === 'Ativa').length,
      totalCandidates: filteredCandidates.length,
      delayedJobs: filteredJobs.filter(j => j.urgency === 'Alta' && j.status === 'Ativa').length,
      avgTime: avg
    };
  }, [filteredJobs, filteredCandidates, candidates]);

  const { activeJobs, totalCandidates, delayedJobs, avgTime } = stats;

  const handleFilterChange = React.useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = React.useCallback(() => {
    setFilters({ period: '30', area: '', manager: '', search: '', urgency: '' });
  }, []);

  return (
    <>
      <header className="bg-card border-b border-border px-6 py-6 sticky top-0 z-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-4">
            <Breadcrumbs items={[{ label: 'Dashboard' }]} />
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-semibold text-foreground transition-colors">Dashboard</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 transition-all duration-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Atualizado agora
                </span>
              </div>
              <p className="text-muted-foreground text-sm transition-colors">Acompanhe vagas, candidatos e eficiência do processo por período e responsáveis.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setToast({ message: 'Visão personalizada salva com sucesso!', type: 'success' })}
                className="hidden sm:inline-flex items-center justify-center gap-2 bg-background hover:bg-accent border border-border text-foreground font-semibold py-2 px-4 rounded-base transition-all duration-200 ease-in-out text-sm shadow-sm active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
                Salvar visão
              </button>
            </div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg border border-border mb-2 transition-colors duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground tracking-wide transition-colors">Período</label>
                <select
                  value={filters.period}
                  onChange={(e) => handleFilterChange('period', e.target.value)}
                  className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out hover:border-ring outline-none"
                >
                  <option value="30">Últimos 30 dias</option>
                  <option value="90">Últimos 3 meses</option>
                  <option value="365">Este ano</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground transition-colors">Área / Depto</label>
                <div className="relative">
                  <input
                    className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out hover:border-ring placeholder:text-muted-foreground outline-none"
                    list="areas"
                    placeholder="Todas as áreas"
                    value={filters.area}
                    onChange={(e) => handleFilterChange('area', e.target.value)}
                  />
                  <datalist id="areas">
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </datalist>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground transition-colors">Gestor Responsável</label>
                <select
                  value={filters.manager}
                  onChange={(e) => handleFilterChange('manager', e.target.value)}
                  className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out hover:border-ring disabled:opacity-50 disabled:bg-muted outline-none"
                >
                  <option value="">Todos os Gestores</option>
                  <option value="me">Somente eu</option>
                  {users.filter(u => u.role === 'manager' || u.role === 'admin').map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground transition-colors">Cargo</label>
                <input
                  className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out hover:border-ring placeholder:text-muted-foreground outline-none"
                  placeholder="Buscar cargo..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setToast({ message: 'Filtros aplicados!', type: 'success' })}
                  className="flex-1 h-10 bg-primary text-primary-foreground border border-border/40 font-semibold px-4 rounded-base transition-all duration-200 ease-in-out text-sm shadow-sm hover:bg-primary/90 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none"
                >
                  Aplicar
                </button>
                <button
                  onClick={resetFilters}
                  className="h-10 px-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md active:scale-95"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar transition-colors duration-200">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
          <section>
            <h2 className="sr-only">KPIs Essenciais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setFilters(prev => ({ ...prev, urgency: '' }))}
                className={`bg-card p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group active:scale-95 ${!filters.urgency ? 'ring-2 ring-primary/50' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary transition-colors">
                    <span className="material-symbols-outlined">work</span>
                  </div>
                </div>
                <h3 className="text-muted-foreground text-sm font-medium mb-1 transition-colors">Vagas Abertas</h3>
                <div className="flex items-baseline gap-2">
                  {isLoading ? <Skeleton className="h-9 w-16" /> : <span className="text-3xl font-semibold text-foreground transition-colors">{activeJobs}</span>}
                  <span className="text-xs text-muted-foreground transition-colors">Total ativo</span>
                </div>
              </div>
              <div className="bg-card p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary transition-colors">
                    <span className="material-symbols-outlined">group</span>
                  </div>
                </div>
                <h3 className="text-muted-foreground text-sm font-medium mb-1 transition-colors">Candidatos Ativos</h3>
                <div className="flex items-baseline gap-2">
                  {isLoading ? <Skeleton className="h-9 w-16" /> : <span className="text-3xl font-semibold text-foreground transition-colors">{totalCandidates}</span>}
                  <span className="text-xs text-muted-foreground transition-colors">No período</span>
                </div>
              </div>
              <div className="bg-card p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary transition-colors">
                    <span className="material-symbols-outlined">timer</span>
                  </div>
                </div>
                <h3 className="text-muted-foreground text-sm font-medium mb-1 transition-colors">Tempo Médio (Hire)</h3>
                <div className="flex items-baseline gap-2">
                  {isLoading ? <Skeleton className="h-9 w-16" /> : <span className="text-3xl font-semibold text-foreground transition-colors">{avgTime}</span>}
                  <span className="text-xs text-muted-foreground transition-colors">Dias corridos</span>
                </div>
              </div>
              <div
                onClick={() => setFilters(prev => ({ ...prev, urgency: 'Alta' }))}
                className={`p-5 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden active:scale-95 ${delayedJobs > 0
                  ? 'bg-destructive/5 border-destructive/20 text-destructive'
                  : 'bg-card border-border'} ${filters.urgency === 'Alta' ? 'ring-2 ring-destructive/50' : ''}`}
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-destructive/10 rounded-bl-full -mr-8 -mt-8"></div>
                <div className="flex justify-between items-start mb-4 relative z-10 transition-colors">
                  <div className="p-2 bg-card rounded-lg text-destructive shadow-sm">
                    <span className="material-symbols-outlined">warning</span>
                  </div>
                </div>
                <h3 className="text-destructive font-semibold text-sm mb-1 relative z-10 transition-colors">Vagas em atraso</h3>
                <div className="flex items-baseline gap-2 relative z-10">
                  {isLoading ? <Skeleton className="h-9 w-16 bg-destructive/10" /> : <span className="text-3xl font-semibold text-destructive transition-colors">{delayedJobs}</span>}
                  <span className="text-xs text-destructive/70 transition-colors">Requer atenção</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-card rounded-lg border border-border shadow-sm p-6 transition-all duration-200">
            <h2 className="text-lg font-semibold text-foreground mb-6 transition-colors">Conversão por Etapa</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0"></div>

              <button className="relative z-10 flex flex-col items-center group text-center focus:outline-none outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg active:scale-95 transition-all duration-200">
                <div className="w-full bg-background group-hover:bg-primary/5 border-2 border-border group-hover:border-primary rounded-lg p-4 transition-all duration-200">
                  <span className="block text-xs font-semibold text-muted-foreground mb-1 transition-colors transition-colors">Triagem</span>
                  <span className="block text-2xl font-semibold text-foreground transition-colors">{candidates.filter(c => c.columnId === 'received').length}</span>
                  <span className="block text-xs text-muted-foreground mt-1 transition-colors">Candidatos</span>
                </div>
              </button>

              <button className="relative z-10 flex flex-col items-center group text-center focus:outline-none outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg active:scale-95 transition-all duration-200">
                <div className="w-full bg-background group-hover:bg-primary/5 border-2 border-border group-hover:border-primary rounded-lg p-4 transition-all duration-200">
                  <span className="block text-xs font-semibold text-muted-foreground mb-1 transition-colors">Entrevista</span>
                  <span className="block text-2xl font-semibold text-foreground transition-colors">{candidates.filter(c => c.columnId === 'hr_interview' || c.columnId === 'manager_interview').length}</span>
                  <span className="block text-xs text-muted-foreground mt-1 transition-colors">Candidatos</span>
                </div>
              </button>

              <button className="relative z-10 flex flex-col items-center group text-center focus:outline-none outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg active:scale-95 transition-all duration-200">
                <div className="w-full bg-background group-hover:bg-primary/5 border-2 border-border group-hover:border-primary rounded-lg p-4 transition-all duration-200">
                  <span className="block text-xs font-semibold text-muted-foreground mb-1 transition-colors">Finalistas</span>
                  <span className="block text-2xl font-semibold text-foreground transition-colors">{candidates.filter(c => c.columnId === 'finalist').length}</span>
                  <span className="block text-xs text-muted-foreground mt-1 transition-colors">Candidatos</span>
                </div>
              </button>

              <button className="relative z-10 flex flex-col items-center group text-center focus:outline-none outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg active:scale-95 transition-all duration-200">
                <div className="w-full bg-primary/10 group-hover:bg-primary/20 border-2 border-primary/20 group-hover:border-primary rounded-lg p-4 transition-all duration-200">
                  <span className="block text-xs font-semibold text-primary mb-1 transition-colors">Contratação</span>
                  <span className="block text-2xl font-semibold text-primary transition-colors">{candidates.filter(c => c.columnId === 'hired').length}</span>
                  <span className="block text-xs text-primary/70 mt-1 transition-colors">Candidatos</span>
                </div>
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <section className="xl:col-span-2 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-foreground transition-colors">Gerenciamento de Vagas</h2>
                <div className="flex gap-2">
                  <Link to="/jobs/new" className="inline-flex items-center gap-2 px-4 h-10 text-sm font-semibold text-primary-foreground bg-primary border border-border/40 hover:bg-primary/90 rounded-base shadow-sm transition-all duration-200 ease-in-out active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Criar nova vaga
                  </Link>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden transition-all duration-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground transition-colors">Vaga</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground transition-colors">Gestor</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground transition-colors">Status</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground transition-colors text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredJobs.slice(0, 5).map(job => (
                        <tr key={job.id} className="group hover:bg-muted/50 transition-colors duration-200">
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground transition-colors">{job.title}</span>
                              <span className="text-xs text-muted-foreground transition-colors">{job.department} / {job.location}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground transition-colors text-sm font-medium">
                            {users.find(u => u.id === job.manager_id)?.name || 'Sistema'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${job.status === 'Ativa'
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'bg-muted text-muted-foreground border border-border'}`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link to={`/jobs/${job.id}`} className="p-1.5 text-muted-foreground hover:text-primary transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="xl:col-span-1 flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-foreground transition-colors">Candidatos Recentes</h2>
              <div className="bg-card rounded-lg border border-border shadow-sm flex flex-col h-full transition-all duration-200">
                <div className="flex-1 overflow-y-auto max-h-[400px] p-2 space-y-2 custom-scrollbar">
                  {filteredCandidates.slice(0, 5).map(candidate => (
                    <div key={candidate.id} className="p-3 hover:bg-muted/50 rounded-lg border border-transparent hover:border-border transition-all duration-200 cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <div className={`size-8 rounded-full ${candidate.avatarColor} ${candidate.textColor} flex items-center justify-center text-xs font-semibold shrink-0 transition-colors`}>
                          {candidate.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-semibold text-foreground truncate transition-colors">{candidate.name}</h4>
                            {candidate.match && <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded transition-colors">{candidate.match}</span>}
                          </div>
                          <p className="text-xs text-muted-foreground truncate transition-colors">{candidate.role || 'Candidato'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default Dashboard;
