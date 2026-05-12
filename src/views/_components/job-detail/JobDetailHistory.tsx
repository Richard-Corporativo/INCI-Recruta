'use client';

// @component JobDetailHistory | @tipo page-component | @versao 1.0.0
// > Histórico de alterações da vaga — timeline, logs
// @api AuditLog[] — lista de logs

import React from 'react';
import { Icon } from "@iconify/react";
import { AuditLog } from '@src/types';
import { formatDateTime } from '@src/lib/formatters';

interface JobDetailHistoryProps {
  jobLogs: any[];
  onSelectLog: (log: AuditLog) => void;
}

const JobDetailHistory: React.FC<JobDetailHistoryProps> = ({ jobLogs, onSelectLog }) => {
  return (
    <section className="bg-card rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
      <div className="px-8 py-5 border-b border-border bg-muted/30">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
          <Icon icon="material-symbols:history" className="text-primary h-5 w-5" aria-hidden="true" />
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
                onClick={() => onSelectLog(log)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold border border-primary/20">
                      {log.user_name ? log.user_name.split(' ').map((n: string) => n[0]).join('') : 'SY'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{log.action}</p>
                      <p className="text-[10px] font-medium text-muted-foreground italic">por {log.user_name || 'Sistema'} em {formatDateTime(log.timestamp)}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-1 bg-muted rounded border border-border font-semibold text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors uppercase">Detalhes</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed font-medium pl-11">{log.details}</p>

                {(log.old_value || log.new_value) && (
                  <div className="mt-4 pl-11">
                    <div className="bg-muted/50 p-3 rounded border border-border/60 flex items-center gap-2 group-hover:border-primary/20 transition-colors">
                      <Icon icon="material-symbols:analytics" className="text-primary h-5 w-5" aria-hidden="true" />
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Snapshot de Mudança Detectado</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetailHistory;
