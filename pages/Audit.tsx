import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAudit } from '../hooks/useAudit';
import { useCandidates } from '../hooks/useCandidates';
import LogDetailsModal from '../components/LogDetailsModal';
import { AuditLog } from '../types';
import { useVirtualizer } from '@tanstack/react-virtual';

const Audit: React.FC = () => {
  const { logs, fetchNextPage, hasNextPage, isFetchingNextPage } = useAudit();
  const { candidates } = useCandidates();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? logs.length + 1 : logs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 73, // Aproximadamente a altura de uma linha
    overscan: 5,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    if (!lastItem) return;

    if (
      lastItem.index >= logs.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    logs.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  const getEntityName = useCallback((type?: string, id?: string) => {
    if (type?.toLowerCase() === 'candidato' && id) {
      const candidate = candidates.find(c => String(c.id) === String(id));
      return candidate ? candidate.name : `ID #${id}`;
    }
    return id ? `ID #${id}` : '-';
  }, [candidates]);

  const handleExportLogs = () => {
    const headers = ['Data', 'Hora', 'Usuário', 'Ação', 'Detalhes', 'Entidade', 'ID'];
    const csvContent = [
      headers.join(','),
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
    link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background transition-colors duration-200">
      {/* Header */}
      <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20 shadow-sm shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-muted-foreground text-[20px]">home</span>
          <span className="text-sm text-muted-foreground">Home</span>
          <span className="material-symbols-outlined text-muted-foreground text-[16px]">chevron_right</span>
          <span className="text-sm font-semibold text-foreground">Auditoria</span>
        </div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
              Log de auditoria
              <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-semibold border border-border">Sistema</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Histórico completo de ações, mudanças de status e registros de segurança.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportLogs}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground bg-background border border-border rounded-base hover:bg-accent transition-all duration-200 ease-in-out shadow-sm active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              Exportar log
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden bg-muted/30 p-8 flex flex-col">
        <div className="bg-card border border-border rounded-lg shadow-sm flex flex-col h-full overflow-hidden">
          <div className="border-b border-border bg-muted/50">
            <div className="flex text-[11px] font-semibold text-muted-foreground">
              <div className="px-6 py-5 w-[150px]">Data / Hora</div>
              <div className="px-6 py-5 w-[200px]">Usuário responsável</div>
              <div className="px-6 py-5 w-[150px]">Ação / Evento</div>
              <div className="px-6 py-5 flex-1">Detalhes da transação</div>
              <div className="px-6 py-5 w-[150px]">Contexto</div>
              <div className="px-6 py-5 w-[120px] text-right">Ação</div>
            </div>
          </div>

          <div
            ref={parentRef}
            className="flex-1 overflow-auto"
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const isLoaderRow = virtualRow.index > logs.length - 1;
                const log = logs[virtualRow.index];

                return (
                  <div
                    key={virtualRow.index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className={`flex border-b border-border items-center hover:bg-muted/40 transition-all duration-200 ease-in-out group bg-card ${isLoaderRow ? 'justify-center' : ''}`}
                  >
                    {isLoaderRow ? (
                      <span className="text-sm text-muted-foreground py-4">Carregando mais...</span>
                    ) : (
                      <>
                        <div className="px-6 w-[150px]">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground leading-tight">
                              {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                            </span>
                            <span className="text-xs text-muted-foreground mt-0.5">
                              {new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <div className="px-6 w-[200px]">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold border border-primary/20 shrink-0">
                              {log.user_name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="text-sm font-semibold text-foreground truncate">{log.user_name}</div>
                          </div>
                        </div>
                        <div className="px-6 w-[150px]">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            {log.action}
                          </span>
                        </div>
                        <div className="px-6 flex-1">
                          <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">{log.details}</p>
                        </div>
                        <div className="px-6 w-[150px]">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-foreground">{log.entity_type}</span>
                            <span className="text-[10px] text-muted-foreground mt-0.5 italic truncate">{getEntityName(log.entity_type, log.entity_id)}</span>
                          </div>
                        </div>
                        <div className="px-6 w-[120px] text-right">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="text-xs font-semibold text-primary hover:text-primary/80 px-3 py-1.5 rounded-base hover:bg-primary/5 transition-all duration-200 ease-in-out opacity-0 group-hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                          >
                            Ver detalhes
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border bg-muted/20 shrink-0">
            <div className="text-xs text-muted-foreground font-semibold">
              Sincronizado via LocalStorage • {logs.length} entradas registradas
            </div>
          </div>
        </div>
      </main>

      <LogDetailsModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};

export default Audit;
