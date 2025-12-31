import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useJobs } from '../hooks/useJobs';
import { useCandidates } from '../hooks/useCandidates';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import Toast from '../components/Toast';

const Dashboard: React.FC = () => {
  const { jobs } = useJobs();
  const { candidates } = useCandidates();
  const { users } = useUsers();
  const { user } = useAuth();

  const [filters, setFilters] = React.useState({
    period: '30',
    area: '',
    manager: '',
    search: '',
    urgency: ''
  });

  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredJobs = jobs.filter(job => {
    if (filters.area && job.department !== filters.area) return false;
    if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.urgency && job.urgency !== filters.urgency) return false;

    if (filters.manager) {
      const targetManagerId = filters.manager === 'me' ? user?.id : filters.manager;
      if (job.manager_id !== targetManagerId) return false;
    }

    return true;
  });

  const filteredCandidates = candidates.filter(c => {
    const job = jobs.find(j => j.id === c.jobId);
    if (!job) return false;

    if (filters.area && job.department !== filters.area) return false;

    if (filters.manager) {
      const targetManagerId = filters.manager === 'me' ? user?.id : filters.manager;
      if (job.manager_id !== targetManagerId) return false;
    }

    if (filters.urgency && job.urgency !== filters.urgency) return false;

    return true;
  });

  const activeJobs = filteredJobs.filter(j => j.status === 'Ativa').length;
  const totalCandidates = filteredCandidates.length;
  const delayedJobs = filteredJobs.filter(j => j.urgency === 'Alta' && j.status === 'Ativa').length;

  const calculateAvgTime = () => {
    const hired = candidates.filter(c => c.columnId === 'hired' && c.applied_at && c.hired_at);
    if (hired.length === 0) return 0;

    const totalDays = hired.reduce((acc, c) => {
      const start = new Date(c.applied_at!).getTime();
      const end = new Date(c.hired_at!).getTime();
      return acc + (end - start) / (1000 * 60 * 60 * 24);
    }, 0);

    return Math.round(totalDays / hired.length);
  };

  const avgTime = calculateAvgTime();

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ period: '30', area: '', manager: '', search: '', urgency: '' });
  };

  return (
    <>
      <header className="bg-card border-b border-border px-6 py-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-4">
            <Breadcrumbs items={[{ label: 'Dashboard' }]} />
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Atualizado agora
                </span>
              </div>
              <p className="text-muted-foreground text-sm">Acompanhe vagas, candidatos e eficiência do processo por período e responsáveis.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setToast({ message: 'Visão personalizada salva com sucesso!', type: 'success' })}
                className="hidden sm:inline-flex items-center justify-center gap-2 bg-card hover:bg-accent border border-border text-foreground font-bold py-2 px-4 rounded-base transition-all duration-200 ease-in-out text-sm shadow-sm active:translate-y-[1px]"
              >
                <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
                Salvar visão
              </button>
            </div>
          </div>
          <div className="bg-accent/50 p-4 rounded-lg border border-border mb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Período</label>
                <select
                  value={filters.period}
                  onChange={(e) => handleFilterChange('period', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200 ease-in-out hover:border-ring"
                >
                  <option value="30">Últimos 30 dias</option>
                  <option value="90">Últimos 3 meses</option>
                  <option value="365">Este ano</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Área / Depto</label>
                <div className="relative">
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200 ease-in-out hover:border-ring placeholder:text-muted-foreground"
                    list="areas"
                    placeholder="Todas as áreas"
                    value={filters.area}
                    onChange={(e) => handleFilterChange('area', e.target.value)}
                  />
                  <datalist id="areas">
                    <option value="Tecnologia"></option>
                    <option value="Recursos Humanos"></option>
                    <option value="Vendas"></option>
                    <option value="Marketing"></option>
                  </datalist>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Gestor Responsável</label>
                <select
                  value={filters.manager}
                  onChange={(e) => handleFilterChange('manager', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200 ease-in-out hover:border-ring disabled:opacity-50 disabled:bg-muted"
                >
                  <option value="">Todos os Gestores</option>
                  <option value="me">Somente eu</option>
                  {users.filter(u => u.role === 'manager' || u.role === 'admin').map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Cargo</label>
                <input
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200 ease-in-out hover:border-ring placeholder:text-muted-foreground"
                  placeholder="Buscar cargo..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setToast({ message: 'Filtros aplicados!', type: 'success' })}
                  className="flex-1 bg-primary text-primary-foreground border border-border/40 font-bold py-2 px-4 rounded-base transition-all duration-200 ease-in-out text-sm shadow-sm hover:bg-primary/90 active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Aplicar
                </button>
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
          <section>
            <h2 className="sr-only">KPIs Essenciais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setFilters(prev => ({ ...prev, urgency: '' }))}
                className={`bg-card p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group ${!filters.urgency ? 'ring-2 ring-primary/50' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                    <span className="material-symbols-outlined">work</span>
                  </div>
                </div>
                <h3 className="text-muted-foreground text-sm font-medium mb-1">Vagas Abertas</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{activeJobs}</span>
                  <span className="text-xs text-muted-foreground">Total ativo</span>
                </div>
              </div>
              <div className="bg-card p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                    <span className="material-symbols-outlined">group</span>
                  </div>
                </div>
                <h3 className="text-muted-foreground text-sm font-medium mb-1">Candidatos Ativos</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{totalCandidates}</span>
                  <span className="text-xs text-muted-foreground">Em processo</span>
                </div>
              </div>
              <div className="bg-card p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                    <span className="material-symbols-outlined">timer</span>
                  </div>
                </div>
                <h3 className="text-muted-foreground text-sm font-medium mb-1">Tempo Médio (Hire)</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{avgTime}</span>
                  <span className="text-xs text-muted-foreground">Dias corridos</span>
                </div>
              </div>
              <div
                onClick={() => setFilters(prev => ({ ...prev, urgency: 'Alta' }))}
                className={`${delayedJobs > 0 ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' : 'bg-card border-border'} p-5 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden ${filters.urgency === 'Alta' ? 'ring-2 ring-red-500/50' : ''}`}
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 dark:bg-red-800/30 rounded-bl-full -mr-8 -mt-8"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-2 bg-card rounded-lg text-red-600 dark:text-red-400 shadow-sm">
                    <span className="material-symbols-outlined">warning</span>
                  </div>
                </div>
                <h3 className="text-red-800 dark:text-red-200 text-sm font-bold mb-1 relative z-10">Vagas em Atraso</h3>
                <div className="flex items-baseline gap-2 relative z-10">
                  <span className="text-3xl font-bold text-red-700 dark:text-red-100">{delayedJobs}</span>
                  <span className="text-xs text-red-600/70 dark:text-red-300/70">Requer atenção</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-card rounded-lg border border-border shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground mb-6">Conversão por Etapa</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-accent -translate-y-1/2 z-0"></div>

              <button className="relative z-10 flex flex-col items-center group text-center focus:outline-none">
                <div className="w-full bg-background group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 border-2 border-border group-hover:border-blue-500 dark:group-hover:border-blue-500 rounded-lg p-4 transition-all">
                  <span className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Triagem</span>
                  <span className="block text-2xl font-bold text-foreground">{candidates.filter(c => c.columnId === 'received').length}</span>
                  <span className="block text-xs text-muted-foreground mt-1">Candidatos</span>
                </div>
              </button>

              <button className="relative z-10 flex flex-col items-center group text-center focus:outline-none">
                <div className="w-full bg-background group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 border-2 border-border group-hover:border-blue-500 dark:group-hover:border-blue-500 rounded-lg p-4 transition-all">
                  <span className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Entrevista</span>
                  <span className="block text-2xl font-bold text-foreground">{candidates.filter(c => c.columnId === 'hr_interview' || c.columnId === 'manager_interview').length}</span>
                  <span className="block text-xs text-muted-foreground mt-1">Candidatos</span>
                </div>
              </button>

              <button className="relative z-10 flex flex-col items-center group text-center focus:outline-none">
                <div className="w-full bg-background group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 border-2 border-border group-hover:border-blue-500 dark:group-hover:border-blue-500 rounded-lg p-4 transition-all">
                  <span className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Finalistas</span>
                  <span className="block text-2xl font-bold text-foreground">{candidates.filter(c => c.columnId === 'finalist').length}</span>
                  <span className="block text-xs text-muted-foreground mt-1">Candidatos</span>
                </div>
              </button>

              <button className="relative z-10 flex flex-col items-center group text-center focus:outline-none">
                <div className="w-full bg-green-50 dark:bg-green-900/10 group-hover:bg-green-100 dark:group-hover:bg-green-900/20 border-2 border-green-200 dark:border-green-800 group-hover:border-green-500 rounded-lg p-4 transition-all">
                  <span className="block text-xs font-semibold uppercase text-green-700 dark:text-green-300 mb-1">Contratação</span>
                  <span className="block text-2xl font-bold text-green-800 dark:text-green-100">{candidates.filter(c => c.columnId === 'hired').length}</span>
                  <span className="block text-xs text-green-600/70 dark:text-green-400/70 mt-1">Candidatos</span>
                </div>
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <section className="xl:col-span-2 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-foreground">Gerenciamento de Vagas</h2>
                <div className="flex gap-2">
                  <Link to="/jobs/new" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary-foreground bg-primary border border-border/40 hover:bg-primary/90 rounded-base shadow-sm transition-all duration-200 ease-in-out active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Criar nova vaga
                  </Link>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-accent/50 border-b border-border">
                        <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Vaga</th>
                        <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Gestor</th>
                        <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {jobs.slice(0, 5).map(job => (
                        <tr key={job.id} className="group hover:bg-accent/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">{job.title}</span>
                              <span className="text-xs text-muted-foreground">{job.department} / {job.location}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            Sistema
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${job.status === 'Ativa' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' : 'bg-slate-100 text-slate-600'}`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link to={`/jobs/${job.id}`} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
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
              <h2 className="text-lg font-bold text-foreground">Candidatos Recentes</h2>
              <div className="bg-card rounded-lg border border-border shadow-sm flex flex-col h-full">
                <div className="flex-1 overflow-y-auto max-h-[400px] p-2 space-y-2">
                  {candidates.slice(0, 5).map(candidate => (
                    <div key={candidate.id} className="p-3 hover:bg-accent/50 rounded-lg border border-transparent hover:border-border transition-all cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <div className={`size-8 rounded-full ${candidate.avatarColor} ${candidate.textColor} flex items-center justify-center text-xs font-bold shrink-0`}>
                          {candidate.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-semibold text-foreground truncate">{candidate.name}</h4>
                            {candidate.match && <span className="text-[10px] font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">{candidate.match}</span>}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{candidate.role || 'Candidato'}</p>
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