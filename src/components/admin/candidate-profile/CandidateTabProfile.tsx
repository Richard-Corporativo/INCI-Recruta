// @component CandidateTabProfile | @tipo componente | @versao 1.0.0
// > Tab de dados pessoais — skills, educação, experiência, idiomas

import React from 'react';
import { Icon } from "@iconify/react";
import { Candidate } from '@src/types';
import { formatDate } from '@src/lib/formatters';

interface CandidateTabProfileProps {
  candidate: Candidate;
}

const CandidateTabProfile: React.FC<CandidateTabProfileProps> = ({ candidate }) => {
  return (
    <div className="space-y-8">
      {/* Summary */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Icon icon="material-symbols:history-edu" className="text-primary h-5 w-5" aria-hidden="true" />
          Sobre
        </h4>
        <p className="text-sm text-foreground/80 leading-relaxed bg-muted/10 p-4 rounded-2xl border border-border">
          {candidate.summary || 'Nenhuma biografia informada.'}
        </p>
      </div>

      {/* Profissional Info Grid in Profile Tab */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Icon icon="material-symbols:payments" className="text-primary h-5 w-5" aria-hidden="true" />
            Condições Salariais
          </h4>
          <div className="bg-muted/10 p-4 rounded-2xl border border-border">
            <p className="text-sm font-semibold text-foreground">
              {candidate.pretension_min ? `R$ ${candidate.pretension_min.toLocaleString()}` : 'Não informada'}
              {candidate.pretension_max ? ` até R$ ${candidate.pretension_max.toLocaleString()}` : ''}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-1 tracking-wider">Pretensão Salarial</p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Icon icon="material-symbols:event-available" className="text-primary h-5 w-5" aria-hidden="true" />
            Disponibilidade
          </h4>
          <div className="bg-muted/10 p-4 rounded-2xl border border-border">
            <p className="text-sm font-semibold text-foreground">{candidate.availability || 'Não informada'}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-1 tracking-wider">Início imediato / Aviso</p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Icon icon="material-symbols:psychology" className="text-primary h-5 w-5" aria-hidden="true" />
          Habilidades
        </h4>
        <div className="flex flex-wrap gap-2">
          {candidate.skills && candidate.skills.length > 0 ? (
            candidate.skills.map(s => (
              <span key={s} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                {s}
              </span>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">Nenhuma habilidade registrada.</p>
          )}
        </div>
      </div>

      {/* Experience */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Icon icon="material-symbols:work-history" className="text-primary h-5 w-5" aria-hidden="true" />
          Experiência
        </h4>
        <div className="space-y-3">
          {candidate.experience && candidate.experience.length > 0 ? (
            candidate.experience.map(exp => (
              <div key={exp.id} className="relative pl-4 border-l-2 border-border pb-4 last:pb-0">
                <div className="absolute -left-[5px] top-1.5 size-2 rounded-full bg-primary"></div>
                <h5 className="text-sm font-semibold text-foreground">{exp.role}</h5>
                <span className="text-xs font-semibold text-muted-foreground">{exp.company}</span>
                <span className="text-[10px] text-muted-foreground ml-2">• {exp.startDate} - {exp.endDate || 'Atual'}</span>
                {exp.description && <p className="text-xs text-foreground/80 mt-1 line-clamp-2">{exp.description}</p>}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">Nenhuma experiência registrada.</p>
          )}
        </div>
      </div>

      {/* Education */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Icon icon="material-symbols:school" className="text-primary h-5 w-5" aria-hidden="true" />
          Formação
        </h4>
        <div className="space-y-3">
          {candidate.education && candidate.education.length > 0 ? (
            candidate.education.map(edu => (
              <div key={edu.id} className="relative pl-4 border-l-2 border-border pb-4 last:pb-0">
                <div className="absolute -left-[5px] top-1.5 size-2 rounded-full bg-primary/50"></div>
                <h5 className="text-sm font-semibold text-foreground">{edu.degree}</h5>
                <span className="text-xs font-semibold text-muted-foreground">{edu.institution}</span>
                <span className="text-[10px] text-muted-foreground ml-2">• {edu.startDate} - {edu.endDate || 'Atual'}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">Nenhuma formação registrada.</p>
          )}
        </div>
      </div>

      {/* Compliance / Legal */}
      <div className="pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Icon icon="material-symbols:gavel" className="text-primary h-5 w-5" aria-hidden="true" />
          Conformidade Legal
        </h4>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold uppercase tracking-widest ${candidate.terms_accepted ? 'text-foreground' : 'text-yellow-600 dark:text-yellow-400'}`}>
              Termos de Uso
            </span>
            {candidate.terms_accepted ? (
              <Icon icon="material-symbols:check" className="size-5 text-green-500" />
            ) : (
              <Icon icon="material-symbols:warning-rounded" className="size-5 text-yellow-500" />
            )}
          </div>
          {!candidate.terms_accepted && (
            <span className="text-[10px] font-bold bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded border border-yellow-500/20 uppercase tracking-widest">
              Aceite Pendente
            </span>
          )}
          {candidate.terms_accepted && candidate.terms_accepted_at && (
            <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
              Aceito em {formatDate(candidate.terms_accepted_at)}
            </span>
          )}
        </div>
      </div>

    </div>
  );
};

export default CandidateTabProfile;
