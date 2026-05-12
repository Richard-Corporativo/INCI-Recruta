'use client';
import { Icon } from "@iconify/react";

import React, { useState } from 'react';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import { useAudit } from '@src/hooks/useAudit';
import { useCandidates } from '@src/hooks/useCandidates';
import LogDetailsModal from '@src/components/admin/LogDetailsModal';
import AuditResetModal from '@src/components/admin/AuditResetModal';
import { AuditLog } from '@src/types';
import { Skeleton } from '@src/components/atoms/Skeleton/Skeleton';
import { auditService } from '@src/services/audit.service';
import { useToast } from '@src/components/ui/Toast';

const AuditPage: React.FC = () => {
  const { logs, isLoading, refresh } = useAudit();
  const { success, error: showError } = useToast();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || 
      log.user_name.toLowerCase().includes(searchLower) || 
      log.details.toLowerCase().includes(searchLower) ||
      log.entity_type?.toLowerCase().includes(searchLower);
      
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const handleResetLogs = async () => {
    setIsResetting(true);
    try {
      const deletedCount = await auditService.cleanup(90);
      success(`${deletedCount} registros antigos foram removidos com sucesso.`);
      refresh();
      setShowResetModal(false);
    } catch (err) {
      showError('Falha ao realizar a limpeza dos logs.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleExportLogs = () => {
    const headers = ['Data', 'Hora', 'Usuário', 'Ação', 'Detalhes', 'Recurso', 'ID'];
    const csvContent = [headers.join(','),
      ...logs.map(log => {
        const date = new Date(log.timestamp);
        return [
          date.toLocaleDateString('pt-BR'), 
          date.toLocaleTimeString('pt-BR'),
          `"${log.user_name}"`, 
          `"${log.action}"`, 
          `"${log.details.replace(/"/g, '""')}"`,
          `"${log.entity_type || ''}"`, 
          `"${log.entity_id || ''}"`
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

  const uniqueActions = [...new Set(logs.map(l => l.action))];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Breadcrumbs items={[{ label: 'Auditoria' }]} />
          <h1 className="text-2xl font-semibold text-foreground mt-2">Auditoria</h1>
          <p className="text-sm text-muted-foreground">Histórico em tempo real de ações e registros de segurança.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowResetModal(true)}
            className="h-10 px-5 rounded-2xl border border-red-500/20 bg-red-500/5 text-xs font-semibold text-red-600 hover:bg-red-500/10 transition-all flex items-center gap-2">
            <Icon icon="material-symbols:delete-sweep-rounded" className="size-4" /> Limpar
          </button>
          <button onClick={handleExportLogs}
            className="h-10 px-5 rounded-2xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-all flex items-center gap-2">
            <Icon icon="material-symbols:download" className="size-4" /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 items-center flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Icon icon="material-symbols:search" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar por usuário, ação ou recurso..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="h-10 pl-10 pr-4 rounded-2xl bg-card border border-border text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/20 w-full" 
          />
        </div>
        <div className="w-px h-6 bg-border hidden md:block" />
        <div className="flex gap-2 items-center">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest shrink-0">Ação</span>
          <button onClick={() => setActionFilter('all')}
            className={`h-8 px-3 rounded-2xl text-xs font-semibold transition-all ${actionFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}>Todas</button>
          {uniqueActions.slice(0, 5).map(a => (
            <button key={a} onClick={() => setActionFilter(a)}
              className={`h-8 px-3 rounded-2xl text-xs font-semibold transition-all ${actionFilter === a ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}>{a}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden ">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Carimbo</th>
                <th className="px-5 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Usuário</th>
                <th className="px-5 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ação</th>
                <th className="px-5 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Descrição</th>
                <th className="px-5 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recurso</th>
                <th className="px-5 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-5 py-6"><Skeleton className="h-4 w-full" /></td></tr>
                ))
              ) : filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">{new Date(log.timestamp).toLocaleDateString('pt-BR')}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">{new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold border border-primary/20">
                        {log.user_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">{log.user_name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-tighter">{log.user?.role || 'Sistema'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-2xl text-[9px] font-bold uppercase tracking-wider border ${
                      log.action === 'CREATE' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                      log.action === 'DELETE' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                      log.action === 'UPDATE' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                      'bg-muted text-muted-foreground border-border'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-foreground/80 line-clamp-1 font-medium">{log.details}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground uppercase tracking-tight">{log.entity_type || 'Geral'}</span>
                      <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[120px]">
                        {log.entity_id ? `#${log.entity_id}` : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button 
                      onClick={() => setSelectedLog(log)}
                      className="h-8 px-3 rounded-2xl border border-border bg-background text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary transition-all active:scale-95"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredLogs.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-20 text-center text-muted-foreground text-sm italic">Nenhum registro encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-border bg-muted/10 flex justify-between items-center">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Fluxo de Auditoria Ativo</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase">{filteredLogs.length} registros exibidos</span>
        </div>
      </div>

      <LogDetailsModal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        log={selectedLog}
      />

      <AuditResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetLogs}
        isLoading={isResetting}
      />
    </div>
  );
};

export default AuditPage;
