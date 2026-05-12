// @component CandidateTabInterviews | @tipo componente | @versao 1.0.0
// > Tab de entrevistas agendadas — tipo, data, feedback

import React from 'react';
import { Icon } from "@iconify/react";
import { Candidate } from '@src/types';
import { formatDate } from '@src/lib/formatters';

interface CandidateTabInterviewsProps {
  candidate: Candidate;
}

const CandidateTabInterviews: React.FC<CandidateTabInterviewsProps> = ({ candidate }) => {
  return (
    <div className="space-y-4">
      {candidate.feedbacks && candidate.feedbacks.length > 0 ? (
        candidate.feedbacks.map((f, idx) => (
          <div key={idx} className="bg-card border-2 border-border rounded-2xl p-6 transition-all duration-200 ease-in-out">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-2xl transition-colors">
                  <Icon icon="material-symbols:chat-bubble" className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground transition-colors">{f.stage}</h4>
                  <p className="text-xs text-muted-foreground transition-colors">Avaliado em {formatDate(f.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <i key={star} className={`fa-duotone fa-solid fa-star text-sm ${f.rating >= star ? 'text-primary' : 'text-muted-foreground/30'}`} aria-hidden="true"></i>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h5 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Pontos Fortes</h5>
                <p className="text-xs text-foreground/80 leading-relaxed italic border-l-2 border-primary/20 pl-3 py-1">{f.strengths || '-'}</p>
              </div>
              <div>
                <h5 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Pontos de Atenção</h5>
                <p className="text-xs text-foreground/80 leading-relaxed italic border-l-2 border-destructive/20 pl-3 py-1">{f.concerns || '-'}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-semibold border border-primary/20">{f.createdBy?.substring(0, 2).toUpperCase()}</div>
                <span className="text-xs font-semibold text-foreground">{f.createdBy}</span>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${f.recommendation === 'advance' ? 'bg-primary/10 text-primary border-primary/20' :
                f.recommendation === 'hold' ? 'bg-foreground/5 text-foreground/70 border-foreground/10' :
                  'bg-destructive/10 text-destructive border-destructive/20'
                }`}>
                {f.recommendation === 'advance' ? 'Aprovar' : f.recommendation === 'hold' ? 'Segurar' : 'Reprovar'}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-muted/30 rounded-2xl p-12 text-center border-2 border-dashed border-border transition-colors">
          <Icon icon="material-symbols:chat-bubble-outline" className="text-muted-foreground/40 mb-3 h-5 w-5 mx-auto" aria-hidden="true" />
          <p className="text-sm text-muted-foreground font-semibold italic transition-colors">Nenhum feedback de entrevista registrado ainda.</p>
        </div>
      )}
    </div>
  );
};

export default CandidateTabInterviews;
