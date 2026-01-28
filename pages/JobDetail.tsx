import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useJobs } from '../hooks/useJobs';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../hooks/useSettings';
import { AuditService } from '../src/services/AuditService';
import { formatSalaryRange } from '../src/utils/formatters';
import { useAudit } from '../hooks/useAudit';
import { AuditLog } from '../types';
import LogDetailsModal from '../components/LogDetailsModal';
import { useEffect } from 'react';
import { CandidateService } from '../src/services/CandidateService';

const JobDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState('spec');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobLogs, setJobLogs] = useState<any[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJob, transitionJobStatus, isLoading } = useJobs();
  const { users } = useUsers();
  const { user } = useAuth();
  const { settings } = useSettings();

  const canViewSalaries = user?.role === 'admin' || user?.custom_permissions?.view_salaries || settings.manager_permissions.view_salaries;

  const job = jobs.find(j => j.id.toString() === id);
  const manager = users.find(u => u.id === job?.manager_id);

  const { getLogsByEntity } = useAudit();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const [forecast, setForecast] = useState<{ estimatedClosingDate: string; averageTimeToCloseDays: number } | null>(null);

  useEffect(() => {
    if (id) {
      getLogsByEntity('job', id).then(setJobLogs);
      CandidateService.getJobForecast(id).then(setForecast);
    }
  }, [id, getLogsByEntity]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8 text-center">
        <div className="size-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">error</span>
        </div>
        <h2 className="text-2xl font-semibold text-foreground">Vaga não encontrada</h2>
        <p className="text-muted-foreground mt-2 mb-6">Não foi possível localizar as informações para esta vaga.</p>
        <Link to="/jobs" className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-base font-semibold shadow-sm hover:bg-primary/90 transition-all">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Voltar para Vagas
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background transition-colors duration-200">
      {/* Header - Optimized for Scanning (Pattern F) */}
      <header className="bg-card border-b border-border pt-8 pb-6 px-8 z-20 shadow-sm shrink-0 sticky top-0">
        <div className="mb-4">
          <Breadcrumbs items={[
            { label: 'Oportunidades', to: '/jobs' },
            { label: 'Detalhamento Técnico' }
          ]} />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-foreground tracking-tight leading-tight">{job.title}</h1>
              <span className="bg-primary/5 text-primary text-[10px] font-semibold px-2 py-0.5 rounded border border-primary/10 tracking-widest uppercase">#{job.id}</span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                <span className="text-xs font-medium italic">Publicada em {job.created_at}</span>
              </div>
              <div className="size-1 bg-border rounded-full"></div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">history</span>
                <span className="text-xs font-medium">Última atualização: Hoje</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Primary Action - Contextual based on status */}
            {job.workflow_status === 'draft' && (
              <button
                onClick={() => id && transitionJobStatus(id, 'pending_approval', user!)}
                className="flex items-center justify-center rounded-base h-11 px-6 bg-amber-500 text-white hover:bg-amber-600 transition-all gap-2.5 text-sm font-semibold shadow-lg shadow-amber-200 active:translate-y-[1px]"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
                <span>Enviar para Aprovação</span>
              </button>
            )}

            {job.workflow_status === 'pending_approval' && (user?.role === 'admin' || user?.role === 'quality') && (
              <button
                onClick={() => id && transitionJobStatus(id, 'approved', user!)}
                className="flex items-center justify-center rounded-base h-11 px-6 bg-emerald-600 text-white hover:bg-emerald-700 transition-all gap-2.5 text-sm font-semibold shadow-lg shadow-emerald-200 active:translate-y-[1px]"
              >
                <span className="material-symbols-outlined text-[20px]">verified</span>
                <span>Aprovar Vaga</span>
              </button>
            )}

            {job.workflow_status === 'approved' && (
              <button
                onClick={() => id && transitionJobStatus(id, 'published', user!)}
                className="flex items-center justify-center rounded-base h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2.5 text-sm font-semibold shadow-lg shadow-primary/20 active:translate-y-[1px]"
              >
                <span className="material-symbols-outlined text-[20px]">publish</span>
                <span>Publicar Vaga</span>
              </button>
            )}

            {job.workflow_status === 'published' && (
              <button
                onClick={() => navigate('/jobs', { state: { selectedJobId: job.id } })}
                className="flex items-center justify-center rounded-base h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2.5 text-sm font-semibold shadow-lg shadow-primary/20 active:translate-y-[1px]"
              >
                <span className="material-symbols-outlined text-[20px] filled">group</span>
                <span>Gerenciar Candidatos</span>
              </button>
            )}

            <Link to={`/jobs/${id}/edit`} className="flex items-center justify-center rounded-base h-11 px-6 bg-background border border-border text-foreground hover:bg-accent transition-all gap-2.5 text-sm font-semibold shadow-sm active:translate-y-[1px]">
              <span className="material-symbols-outlined text-[20px]">edit_note</span>
              <span>Editar</span>
            </Link>

            {job.workflow_status !== 'archived' && (
              <button
                className="flex items-center justify-center rounded-base h-11 w-11 bg-destructive/5 border border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm active:translate-y-[1px]"
                onClick={() => setIsModalOpen(true)}
                title="Arquivar Vaga"
              >
                <span className="material-symbols-outlined text-[22px]">archive</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap mt-8">
          <div className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-muted/50 border border-border px-4 transition-colors hover:bg-muted">
            <span className="material-symbols-outlined text-[18px] text-muted-foreground">location_on</span>
            <p className="text-foreground text-[10px] font-semibold uppercase tracking-wider">{job.location} • {job.model}</p>
          </div>
          <div className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-muted/50 border border-border px-4 transition-colors hover:bg-muted">
            <span className="material-symbols-outlined text-[18px] text-muted-foreground">verified_user</span>
            <p className="text-foreground text-[10px] font-semibold uppercase tracking-wider">{job.contract}</p>
          </div>
          <div className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-destructive/10 border border-destructive/20 px-4">
            <span className="material-symbols-outlined text-[18px] text-destructive">priority_high</span>
            <p className="text-destructive text-[10px] font-semibold uppercase tracking-wider">Urgência {job.urgency}</p>
          </div>
          <div className={`flex h-8 items-center justify-center gap-x-2 rounded-full px-4 border ${job.workflow_status === 'published' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' :
            job.workflow_status === 'approved' ? 'bg-blue-500/10 border-blue-500/20 text-blue-700' :
              job.workflow_status === 'pending_approval' ? 'bg-amber-500/10 border-amber-500/20 text-amber-700' :
                job.workflow_status === 'archived' ? 'bg-slate-500/10 border-slate-500/20 text-slate-700' :
                  'bg-muted/50 border-border text-muted-foreground'
            }`}>
            <span className="material-symbols-outlined text-[18px]">{
              job.workflow_status === 'published' ? 'check_circle' :
                job.workflow_status === 'approved' ? 'verified' :
                  job.workflow_status === 'pending_approval' ? 'pending' :
                    job.workflow_status === 'archived' ? 'archive' : 'draft'
            }</span>
            <p className="text-[10px] font-semibold uppercase tracking-wider">
              Workflow: {
                job.workflow_status === 'published' ? 'Publicada' :
                  job.workflow_status === 'approved' ? 'Aprovada' :
                    job.workflow_status === 'pending_approval' ? 'Aguardando Aprovação' :
                      job.workflow_status === 'archived' ? 'Arquivada' : 'Rascunho'
              }
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-muted/20 p-8 space-y-8">
        <div className="max-w-7xl mx-auto flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('spec')}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${activeTab === 'spec' ? 'border-primary text-primary bg-background shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Especificações
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${activeTab === 'history' ? 'border-primary text-primary bg-background shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Histórico de Alterações
          </button>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 pb-12">
          {/* Coluna Principal - Conteúdo (Pattern F) */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            {activeTab === 'spec' ? (
              <section className="bg-card rounded-lg shadow-sm border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="px-8 py-5 border-b border-border bg-muted/30 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[24px]">description</span>
                    Especificações do Cargo
                  </h2>
                  <div className="flex items-center gap-2 px-3 py-1 bg-card rounded-full border border-border">
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Visualização Interna</span>
                  </div>
                </div>

                <div className="p-10 space-y-12">
                  <article>
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="h-px w-6 bg-primary/30"></span>
                      Contexto e Desafios
                    </h3>
                    <div className="text-base text-foreground/80 leading-relaxed font-medium pl-8 border-l-2 border-primary/10 whitespace-pre-wrap">
                      {job.context}
                    </div>
                  </article>

                  <article>
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="h-px w-6 bg-primary/30"></span>
                      Missão da Posição
                    </h3>
                    <div className="text-base text-foreground/80 leading-relaxed font-medium pl-8 border-l-2 border-primary/10 whitespace-pre-wrap">
                      {job.mission}
                    </div>
                  </article>

                  <div className="flex justify-center pt-8 opacity-20">
                    <div className="size-1.5 rounded-full bg-muted-foreground"></div>
                    <div className="size-1.5 rounded-full bg-muted-foreground mx-4"></div>
                    <div className="size-1.5 rounded-full bg-muted-foreground"></div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="bg-card rounded-lg shadow-sm border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="px-8 py-5 border-b border-border bg-muted/30">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[24px]">history</span>
                    Linha do Tempo de Governança
                  </h2>
                </div>
                <div className="p-0">
                  <div className="divide-y divide-border">
                    {jobLogs.length === 0 ? (
                      <div className="p-12 text-center text-muted-foreground italic font-medium">
                        Nenhuma alteração registrada para esta vaga.
                      </div>
                    ) : (
                      jobLogs.map((log) => (
                        <div
                          key={log.id}
                          className="px-8 py-6 hover:bg-muted/30 transition-colors cursor-pointer group"
                          onClick={() => setSelectedLog(log)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                              <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold border border-primary/20">
                                {log.user_name ? log.user_name.split(' ').map((n: string) => n[0]).join('') : 'SY'}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">{log.action}</p>
                                <p className="text-[10px] font-medium text-muted-foreground italic">por {log.user_name || 'Sistema'} em {new Date(log.timestamp).toLocaleString('pt-BR')}</p>
                              </div>
                            </div>
                            <span className="text-[10px] px-2 py-1 bg-muted rounded border border-border font-semibold text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors uppercase">Detalhes</span>
                          </div>
                          <p className="text-xs text-foreground/80 leading-relaxed font-medium pl-11">{log.details}</p>

                          {(log.old_value || log.new_value) && (
                            <div className="mt-4 pl-11">
                              <div className="bg-muted/50 p-3 rounded border border-border/60 flex items-center gap-2 group-hover:border-primary/20 transition-colors">
                                <span className="material-symbols-outlined text-[16px] text-primary">analytics</span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Snapshot de Mudança Detectado</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Contexto Rápido (60-30-10 Rule) */}
          <aside className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <section className="border border-border bg-card shadow-lg rounded-lg overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
                  Dados Vitais
                </h2>
              </div>
              <div className="p-8 space-y-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">Departamento</p>
                  <div className="bg-muted/40 p-3 rounded-base border border-border/60">
                    <p className="text-sm font-semibold text-foreground">{job.department}</p>
                  </div>
                </div>

                {canViewSalaries && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">Proposta Salarial</p>
                    <div className="bg-muted/40 p-3 rounded-base border border-border/60 flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px]">payments</span>
                      <p className="text-sm font-semibold text-foreground font-mono">{formatSalaryRange(job.salary_min, job.salary_max)}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">Quantidade de Vagas</p>
                  <div className="bg-muted/40 p-3 rounded-base border border-border/60">
                    <p className="text-sm font-semibold text-foreground">{job.positions_count || 1}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">Jornada / Carga Horária</p>
                  <div className="bg-muted/40 p-3 rounded-base border border-border/60">
                    <p className="text-sm font-semibold text-foreground">{job.work_schedule || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">Experiência Mínima</p>
                  <div className="bg-muted/40 p-3 rounded-base border border-border/60">
                    <p className="text-sm font-semibold text-foreground">{job.experience_min || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">Reporta a</p>
                  <div className="bg-muted/40 p-3 rounded-base border border-border/60">
                    <p className="text-sm font-semibold text-foreground">{job.reports_to || 'Gestor da Área'}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">Gestor Solicitante</p>
                  <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-base border border-border/60">
                    <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold border border-primary/20">
                      {manager?.name ? manager.name.substring(0, 2).toUpperCase() : 'NA'}
                    </div>
                    <p className="text-sm font-semibold text-foreground truncate">{manager?.name || 'Não atribuído'}</p>
                  </div>
                </div>

                {job.registration_deadline && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">Prazo de Inscrição</p>
                    <div className="bg-muted/40 p-3 rounded-base border border-border/60 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">event</span>
                      <p className="text-sm font-semibold text-foreground">{new Date(job.registration_deadline).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                )}

                {forecast && (
                  <div className="space-y-1 pt-2">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest pl-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      Previsão de Fechamento
                    </p>
                    <div className="bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/20">
                      <p className="text-lg font-bold text-emerald-700">{new Date(forecast.estimatedClosingDate).toLocaleDateString('pt-BR')}</p>
                      <p className="text-[10px] text-emerald-600/80 font-medium">~ {forecast.averageTimeToCloseDays} dias restantes</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-muted/20 border-t border-border mt-auto">
                <Link to={`/jobs/${id}/edit`} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-base bg-background border border-border text-xs font-semibold text-muted-foreground hover:text-primary transition-all uppercase tracking-widest">
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  Atualizar Dados
                </Link>
              </div>
            </section>

            {/* Prova Social Interna / Trust Indicator */}
            <div className="p-6 bg-primary shadow-2xl shadow-primary/20 rounded-lg text-primary-foreground relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[64px]">diversity_1</span>
              </div>
              <h4 className="text-lg font-semibold mb-1 relative z-10">Fila de Triagem</h4>
              <p className="text-primary-foreground/80 text-xs font-medium mb-4 relative z-10">Você possui {job.candidates_count} talentos aguardando avaliação nesta vaga.</p>
              <button
                onClick={() => navigate('/jobs', { state: { selectedJobId: job.id } })}
                className="w-full py-2 bg-white/10 hover:bg-white/20 rounded border border-white/20 text-[10px] font-semibold tracking-widest uppercase transition-all relative z-10"
              >
                Ver Candidatos
              </button>
            </div>
          </aside>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative transform overflow-hidden rounded-xl bg-card border-border shadow-2xl">
              <div className="bg-card p-6 border-b border-border">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-400">warning</span>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg font-semibold leading-6 text-foreground">Encerrar Vaga?</h3>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Encerrar remove a vaga das abertas, mantendo histórico e auditoria. Esta ação não pode ser desfeita facilmente.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 p-4 border-t border-border flex justify-end gap-3">
                <button className="inline-flex w-full justify-center rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={() => id && transitionJobStatus(id, 'archived', user!)} type="button">Arquivar Vaga</button>
                <button className="mt-3 inline-flex w-full justify-center rounded-lg bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-accent sm:mt-0 sm:w-auto" onClick={() => setIsModalOpen(false)} type="button">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <LogDetailsModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};

export default JobDetail;
