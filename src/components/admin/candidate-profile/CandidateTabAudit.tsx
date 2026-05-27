// @component CandidateTabAudit | @tipo componente | @versao 2.0.0
// > Tab de logs de auditoria do candidato — movimentações, ações

import React from 'react';
import { Icon } from "@iconify/react";
import { Candidate } from '@src/types';
import { formatDateTime } from '@src/lib/formatters';
import { auditService } from '@src/services/audit.service';

interface AuditLog {
    id: string;
    action: string;
    category?: string;
    entity_type?: string;
    entity_id: string;
    user_id: string;
    user_name: string;
    details: any;
    timestamp: string;
}

interface CandidateTabAuditProps {
  candidate: Candidate;
  logs: AuditLog[];
}

const entityLabel: Record<string, string> = {
    'CANDIDATE': 'Candidatos', 'JOB': 'Vagas',
    'USER': 'Usuários', 'ROLE': 'Cargos', 'SETTINGS': 'Configurações',
};

const CandidateTabAudit: React.FC<CandidateTabAuditProps> = ({ candidate, logs }) => {
  const candidateLogs = logs.filter(l => l.entity_id === candidate.id || l.entity_id === candidate.name);

  return (
    <div className="space-y-4">
      {candidateLogs.length > 0 ? (
        <div className="relative pl-8 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border transition-colors">
          {candidateLogs.map((l, idx) => {
            const parsedDetails = typeof l.details === 'string'
                ? (() => { try { return JSON.parse(l.details); } catch { return l.details; } })()
                : l.details;
            return (
              <div key={idx} className="relative">
                <span className="absolute -left-[27px] top-1 size-3.5 rounded-full bg-background border-2 border-primary z-10"></span>
                <div className="bg-card border border-border rounded-2xl p-4 transition-all duration-200">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-sm font-semibold text-foreground leading-snug">
                      {auditService.getFriendlyAction(l.action, l.category)}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium shrink-0">{formatDateTime(l.timestamp)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {auditService.formatDetails(parsedDetails)}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Icon icon="material-symbols:location-on" className="size-3.5 shrink-0" />
                      <span>{entityLabel[l.entity_type || ''] || 'Sistema'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[8px] font-semibold border border-primary/20">
                        {l.user_name?.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[10px] font-semibold text-muted-foreground">{l.user_name}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
