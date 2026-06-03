'use client';
import { Icon } from "@iconify/react";
import React, { useState, useMemo, useEffect } from 'react';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import { useAudit } from '@src/hooks/useAudit';
import { useJobs } from '@src/hooks/useJobs';
import { useAuth } from '@src/context/AuthContext';
import { auditService } from '@src/services/audit.service';
import AuditJobTimelineModal from '@src/components/admin/AuditJobTimelineModal';
import { Skeleton } from '@src/components/atoms/Skeleton/Skeleton';
import { useToast } from '@src/components/ui/Toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
const AuditPage: React.FC = () => {
  const { logs, isLoading, refresh } = useAudit();
  const { jobs } = useJobs();
  const { company } = useAuth();
  const { error: showError } = useToast();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [candidateCounts, setCandidateCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!company?.id) return;
    auditService.getCandidateCountsByJob()
      .then(counts => setCandidateCounts(counts))
      .catch(() => showError('Erro ao carregar contagem de candidatos.'));
  }, [company?.id, showError]);

  // Agrupamento de logs por Vaga
  const groupedLogs = useMemo(() => {
    const groups: Record<string, any> = {
      'system': {
        id: 'system',
        title: 'Sistema & Geral',
        logs: [],
        lastActivity: null,
      }
    };

    logs.forEach(log => {
      const jobId = log.job_id || 'system';
      if (!groups[jobId]) {
        const job = jobs.find(j => j.id === jobId);
        groups[jobId] = {
          id: jobId,
          title: job?.title || 'Recurso Desconhecido',
          logs: [],
          lastActivity: null,
        };
      }

      groups[jobId].logs.push(log);

      if (!groups[jobId].lastActivity || new Date(log.timestamp) > new Date(groups[jobId].lastActivity)) {
        groups[jobId].lastActivity = log.timestamp;
      }
    });

    return Object.values(groups)
      .map(group => ({
        ...group,
        candidateCount: group.id === 'system' ? 0 : (candidateCounts[group.id] ?? 0),
      }))
      .filter(g => g.id !== 'system' || g.logs.length > 0)
      .sort((a, b) => {
        if (a.id === 'system') return -1;
        if (b.id === 'system') return 1;
        if (!a.lastActivity) return 1;
        if (!b.lastActivity) return -1;
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      });
  }, [logs, jobs, candidateCounts]);

  const filteredGroups = groupedLogs.filter(group =>
    group.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportLogs = () => {
    const headers = ['Data', 'Hora', 'Usuário', 'Ação', 'Detalhes', 'Vaga'];
    const csvContent = [headers.join(','),
      ...logs.map(log => {
        const date = new Date(log.timestamp);
        const job = jobs.find(j => j.id === log.job_id);
        return [
          date.toLocaleDateString('pt-BR'),
          date.toLocaleTimeString('pt-BR'),
          `"${log.user_name}"`,
          `"${log.action}"`,
          `"${log.details?.replace(/"/g, '""') || ''}"`,
          `"${job?.title || 'Geral'}"`
        ].join(',');
      })
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `auditoria-inci-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link); link.click();
    document.body.removeChild(link); URL.revokeObjectURL(url);
  };

  // Força re-render a cada minuto para atualizar os tempos relativos
  const [, setTick] = useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const selectedGroup = groupedLogs.find(g => g.id === selectedJobId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Breadcrumbs items={[{ label: 'Auditoria' }]} />
          <h1 className="text-2xl font-semibold text-foreground mt-2">Fluxo de Auditoria</h1>
          <p className="text-sm text-muted-foreground font-medium">Histórico inteligente agrupado por vagas e atividades.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportLogs}
            className="h-10 px-5 rounded-2xl border border-border bg-card text-xs font-bold uppercase tracking-widest text-foreground hover:bg-muted transition-all flex items-center gap-2">
            <Icon icon="material-symbols:download" className="size-4" /> Exportar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Icon icon="material-symbols:search" className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome da vaga ou recurso..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-12 pl-12 pr-4 rounded-2xl bg-card border border-border text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/20 w-full shadow-sm"
          />
        </div>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedJobId(group.id)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedJobId(group.id); }}
              className="group bg-card border border-border rounded-2xl relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 text-left p-6 cursor-pointer"
              aria-label={`Ver auditoria: ${group.title}`}
            >

              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Icon icon="material-symbols:history-rounded" className="size-20" />
              </div>

              <div className="flex flex-col h-full justify-between gap-4">
                <div className="pr-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {group.id === 'system' ? 'Geral' : 'Vaga'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {group.title}
                  </h3>
                </div>

                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-tighter">Última atividade</span>
                    <span className="text-xs font-bold text-foreground">
                      {group.lastActivity ? formatDistanceToNow(new Date(group.lastActivity), { addSuffix: true, locale: ptBR }) : '-'}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-tighter">Candidatos</span>
                    <span className="text-xs font-extrabold text-primary">{group.candidateCount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredGroups.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-card border border-dashed border-border rounded-2xl">
          <Icon icon="material-symbols:search-off-rounded" className="size-16 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground font-medium italic">Nenhum registro de auditoria encontrado para sua busca.</p>
        </div>
      )}

      <AuditJobTimelineModal
        isOpen={!!selectedJobId}
        onClose={() => setSelectedJobId(null)}
        jobTitle={selectedGroup?.title || ''}
        logs={selectedGroup?.logs || []}
      />
    </div>
  );
};

export default AuditPage;
