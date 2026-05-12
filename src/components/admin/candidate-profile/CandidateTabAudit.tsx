// @component CandidateTabAudit | @tipo componente | @versao 1.0.0
// > Tab de logs de auditoria do candidato — movimentações, ações

import React from 'react';
import { Icon } from "@iconify/react";
import { Candidate } from '@src/types';
import { formatDateTime } from '@src/lib/formatters';

interface AuditLog {
    id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    user_id: string;
    user_name: string;
    details: string;
    timestamp: string;
}

interface CandidateTabAuditProps {
  candidate: Candidate;
  logs: AuditLog[];
}

const CandidateTabAudit: React.FC<CandidateTabAuditProps> = ({ candidate, logs }) => {
  return (
    <div className="space-y-4">
      {logs.filter(l => l.entity_id === candidate.id || l.entity_id === candidate.name).length > 0 ? (
        <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border transition-colors">
          {logs
            .filter(l => l.entity_id === candidate.id || l.entity_id === candidate.name)
            .map((l, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[27px] top-1 size-3.5 rounded-full bg-background border-2 border-primary z-10"></span>
                <div className="bg-card border-2 border-border rounded-2xl p-6 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">{l.action}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">{formatDateTime(l.timestamp)}</span>
                  </div>
                  <p className="text-sm text-foreground mb-3 leading-relaxed">{l.details}</p>
                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <div className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[8px] font-semibold border border-primary/20">
                      {l.user_name?.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground transition-colors">Realizado por {l.user_name}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-muted/30 rounded-2xl p-12 text-center border-2 border-dashed border-border transition-colors">
          <Icon icon="material-symbols:history" className="text-muted-foreground/40 mb-3 h-5 w-5 mx-auto" aria-hidden="true" />
          <p className="text-sm text-muted-foreground font-semibold italic transition-colors">Nenhum registro de auditoria disponível para este candidato.</p>
        </div>
      )}
    </div>
  );
};

export default CandidateTabAudit;
