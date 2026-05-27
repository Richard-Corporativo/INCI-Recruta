'use client';
import { Icon } from "@iconify/react";

import React from 'react';
import Link from 'next/link';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import { useJobs } from '@src/hooks/useJobs';
import { useCandidates } from '@src/hooks/useCandidates';

import { useAuth } from '@src/context/AuthContext';
import { Skeleton } from '@src/components/atoms/Skeleton/Skeleton';
import { useCompanyJobAnalytics } from '@src/hooks/useAnalytics';

const DashboardPage: React.FC = () => {
  const { jobs, isLoading: jobsLoading } = useJobs();
  const { candidates, isLoading: candidatesLoading } = useCandidates();

  const { user } = useAuth();
  const [jobStatusSearch, setJobStatusSearch] = React.useState('');
  const { data: jobAnalytics, isLoading: jobAnalyticsLoading } = useCompanyJobAnalytics();

  const isLoading = jobsLoading || candidatesLoading;

  const [filters, setFilters] = React.useState({
    period: '30',
    area: '',
    manager: '',
    search: '',
    urgency: ''
  });

  const jobsMap = React.useMemo(() => {
    const map = new Map<string | number, any>();
    jobs.forEach(j => map.set(j.id, j));
    return map;
  }, [jobs]);

  const departments = React.useMemo(() => {
    const set = new Set<string>();
    jobs.forEach(j => { if (j.department) set.add(j.department); });
    return Array.from(set).sort();
  }, [jobs]);

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
    const hired = filteredCandidates.filter(c => c.columnId === 'hired' && c.applied_at && c.hired_at);
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
  }, [filteredJobs, filteredCandidates]);

  const priorities = React.useMemo(() => {
    return candidates
      .filter(c => {
        if (c.columnId === 'hired' || c.columnId === 'rejected' || !c.jobId) return false;
        const job = jobsMap.get(c.jobId);
        if (!job) return false;
        const slaLimit = job.sla_settings?.[c.columnId]?.days || 2;
        const entryDate = c.currentStageEntry ? new Date(c.currentStageEntry) : new Date(c.applied_at || Date.now());
        const daysInStage = Math.floor((Date.now() - new Date(entryDate).getTime()) / (1000 * 3600 * 24));
        return daysInStage >= slaLimit;
      })
      .sort((a, b) => {
        const entryA = a.currentStageEntry ? new Date(a.currentStageEntry) : new Date(a.applied_at || Date.now());
        const entryB = b.currentStageEntry ? new Date(b.currentStageEntry) : new Date(b.applied_at || Date.now());
        return new Date(entryA).getTime() - new Date(entryB).getTime();
      });
  }, [candidates, jobsMap]);

  const filteredJobAnalytics = React.useMemo(() => {
    const query = jobStatusSearch.trim().toLowerCase();
    if (!query) return jobAnalytics;

    return jobAnalytics.filter(job =>
      job.job_title.toLowerCase().includes(query) ||
      (job.department || '').toLowerCase().includes(query) ||
      (job.job_status || '').toLowerCase().includes(query)
    );
  }, [jobAnalytics, jobStatusSearch]);

  const jobAnalyticsTotals = React.useMemo(() => {
    return jobAnalytics.reduce(
      (acc, job) => ({
        clicks: acc.clicks + job.job_clicks,
        starts: acc.starts + job.application_starts,
        completed: acc.completed + job.application_completed
      }),
      { clicks: 0, starts: 0, completed: 0 }
    );
  }, [jobAnalytics]);

  const { activeJobs, totalCandidates, delayedJobs, avgTime } = stats;

  const handleFilterChange = React.useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = React.useCallback(() => {
    setFilters({ period: '30', area: '', manager: '', search: '', urgency: '' });
  }, []);

  const companyName = user?.company_name || 'sua empresa';

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Breadcrumbs + Header */}
      <div className="space-y-4">
        <Breadcrumbs items={[{ label: 'Dashboard' }]} />
        
        {/* Welcome Banner - Balha 10.0 Premium */}
        <div className="relative overflow-hidden bg-primary rounded-2xl p-8 md:p-10 text-primary-foreground animate-in fade-in slide-in-from-top-4 duration-500 border border-white/10">
            {/* Background Logo Decorative - PNG Version */}
            <div className="absolute -top-10 -right-20 opacity-[0.05] pointer-events-none rotate-12">
                <img 
                    src="/LOGO INCI.png" 
                    alt="" 
                    className="w-[500px] h-auto grayscale invert"
                />
            </div>

            <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        {/* Completude — compact, minimalist & centralized */}
                        {/* Removed Placeholder Block */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md border border-white/10">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                            </span>
                            INCI Recruta Ativo
                        </div>
                        
                        <div className="flex items-center justify-center transform hover:scale-105 transition-all duration-450">
                            <img 
                                src="/LOGO INCI.png" 
                                alt="INCI" 
                                className="h-13 w-auto object-contain"
                            />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                        Olá, {companyName} <br/>
                        <span className="opacity-70 text-2xl md:text-3xl font-medium">Bem-vindo ao Portal Administrativo</span>
                    </h1>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                    <Link href="/admin/jobs/new" className="h-12 px-6 bg-white text-primary rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-all flex items-center gap-2">
                        <Icon icon="material-symbols:add-circle-rounded" className="size-5" />
                        Publicar Nova Vaga
                    </Link>
                    <Link href="/admin/audit" className="h-12 px-6 bg-white/10 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-md border border-white/10 flex items-center gap-2">
                        <Icon icon="material-symbols:fact-check-rounded" className="size-5" />
                        Ver Auditoria
                    </Link>
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mt-6">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Visão Geral</h2>
            <p className="text-muted-foreground text-sm">Monitoramento em tempo real de vagas e talentos.</p>
          </div>
          <div className="flex items-center gap-3">
          </div>
        </div>
      </div>

      {/* KPI Metric Cards — grid 4-col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Vagas Abertas', value: activeJobs, icon: 'work', color: 'bg-primary/10 text-primary', onClick: () => setFilters(prev => ({ ...prev, urgency: '' })) },
          { label: 'Candidatos Ativos', value: totalCandidates, icon: 'group', color: 'bg-primary/10 text-primary' },
          { label: 'Tempo Médio', value: avgTime, icon: 'timer', color: 'bg-primary/10 text-primary', suffix: 'dias' },
          { label: 'Vagas em atraso', value: delayedJobs, icon: 'warning', color: 'bg-error/10 text-error', urgent: true, onClick: () => setFilters(prev => ({ ...prev, urgency: 'Alta' })) },
        ].map((stat, i) => (
          <div
            key={i}
            onClick={stat.onClick}
            className={`bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 ${stat.onClick ? 'cursor-pointer hover:bg-muted transition-colors' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className={`size-9 rounded-2xl flex items-center justify-center ${stat.color}`}>
                <Icon icon={`material-symbols:${stat.icon}`} className="size-5" />
              </div>
              {stat.urgent && delayedJobs > 0 && (
                <span className="flex size-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-error opacity-75" />
                  <span className="relative inline-flex rounded-full size-2 bg-error" />
                </span>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                {isLoading ? <Skeleton className="h-8 w-12" /> : (
                  <span className={`text-2xl font-semibold tabular-nums ${stat.urgent ? 'text-error' : 'text-foreground'}`}>
                    {stat.value}{stat.suffix ? '' : ''}
                  </span>
                )}
                {stat.suffix && <span className="text-xs text-muted-foreground">{stat.suffix}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prioridades SLA */}
      {priorities.length > 0 && (
        <div className="bg-error/5 border border-error/20 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Icon icon="material-symbols:priority-high" className="text-error size-5" />
            <h2 className="text-sm font-semibold text-error">SLA em atraso ({priorities.length})</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {priorities.slice(0, 4).map(c => {
              const job = jobsMap.get(c.jobId!);
              const entryDate = c.currentStageEntry ? new Date(c.currentStageEntry) : new Date(c.applied_at || Date.now());
              const daysInStage = Math.floor((Date.now() - new Date(entryDate).getTime()) / (1000 * 3600 * 24));
              return (
                <Link
                  href={`/admin/jobs/${c.jobId}/kanban`}
                  key={c.id}
                  className="bg-card border border-border rounded-2xl p-4 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`size-8 rounded-full flex items-center justify-center text-xs font-semibold ${c.avatarColor || 'bg-foreground text-background'} ${c.textColor || ''}`}>
                      {c.initials || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                      <p className="text-[10px] font-semibold text-muted-foreground truncate uppercase">{job?.title}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-error/10 px-3 py-2 rounded-2xl">
                    <span className="text-[10px] font-semibold text-error uppercase">Atraso</span>
                    <span className="text-xs font-semibold text-error tabular-nums">{daysInStage} dias</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Status por vaga */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground tracking-tight">Status</h2>
            <p className="text-muted-foreground text-xs font-medium">Métricas por vaga publicada da sua empresa.</p>
          </div>

          <div className="relative w-full md:w-[320px]">
            <Icon icon="material-symbols:search" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={jobStatusSearch}
              onChange={(event) => setJobStatusSearch(event.target.value)}
              placeholder="Pesquisar vaga"
              className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm font-semibold text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="hidden lg:grid grid-cols-[1fr_160px_160px_170px] gap-3 px-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Vaga</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Cliques</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Início</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Concluídas</span>
          </div>

          {jobAnalyticsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          ) : filteredJobAnalytics.length > 0 ? (
            filteredJobAnalytics.map(job => (
              <div key={job.job_id} className="grid grid-cols-1 lg:grid-cols-[1fr_160px_160px_170px] gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-bold text-foreground">{job.job_title}</h3>
                    {job.job_status && (
                      <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {job.job_status}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
                    {job.department || 'Sem departamento'}
                  </p>
                </div>

                {[
                  { label: 'Cliques em vagas', value: job.job_clicks, unique: job.job_clicks_unique },
                  { label: 'Início candidatura', value: job.application_starts, unique: job.application_starts_unique },
                  { label: 'Candidaturas concluídas', value: job.application_completed, unique: job.application_completed_unique },
                ].map(metric => (
                  <div key={metric.label} className="rounded-lg border border-border/70 bg-card px-3 py-2 lg:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground lg:hidden">{metric.label}</p>
                    <p className="text-xl font-bold text-foreground tabular-nums">{metric.value}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{metric.unique} únicos</p>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-background p-10 text-center">
              <div className="mx-auto mb-3 size-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
                <Icon icon="material-symbols:work-outline" className="size-5" />
              </div>
              <p className="text-sm font-bold text-foreground">
                {jobStatusSearch ? 'Nenhuma vaga encontrada' : 'Nenhuma vaga da empresa encontrada'}
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {jobStatusSearch
                  ? 'Ajuste a pesquisa para localizar uma vaga.'
                  : 'Quando a empresa publicar vagas, as métricas por vaga aparecerão aqui.'}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 border-t border-border pt-4">
            <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Início sobre cliques: {jobAnalyticsTotals.clicks > 0 ? Math.round((jobAnalyticsTotals.starts / jobAnalyticsTotals.clicks) * 100) : 0}%
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-green-500" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Conclusão sobre início: {jobAnalyticsTotals.starts > 0 ? Math.round((jobAnalyticsTotals.completed / jobAnalyticsTotals.starts) * 100) : 0}%
                </span>
            </div>
        </div>
      </div>

      {/* CTA Sticky */}
      <Link
        href="/admin/jobs/new"
        className="fixed bottom-8 right-8 z-30 h-14 px-8 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:bg-primary/90 transition-all flex items-center gap-3"
      >
        <Icon icon="material-symbols:add" className="size-6" />
        Criar Vaga
      </Link>
    </div>
  );
};

export default DashboardPage;
