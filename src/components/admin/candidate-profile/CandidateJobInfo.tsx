// @component CandidateJobInfo | @tipo componente | @versao 1.0.0
// > Info da vaga vinculada ao candidato — título, departamento, status

import React from 'react';
import { Icon } from "@iconify/react";
import { Candidate, Job } from '@src/types';

interface CandidateJobInfoProps {
  candidate: Candidate;
  job?: Job;
}

const CandidateJobInfo: React.FC<CandidateJobInfoProps> = ({ candidate, job }) => {
  return (
    <section className="bg-card rounded-2xl overflow-hidden transition-all duration-200 p-6 border-2 border-border">
      <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-2 transition-colors">
        <Icon icon="material-symbols:work" className="text-primary h-5 w-5" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-foreground">Identificação da Vaga</h3>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground mb-1 transition-colors">Cargo</p>
          <p className="text-sm font-semibold text-foreground transition-colors">{job?.title || 'Não vinculada'}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground mb-1 transition-colors">Departamento</p>
          <p className="text-sm font-semibold text-foreground transition-colors">{job?.department || '-'}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground mb-1 transition-colors">Gestor</p>
          <div className="flex items-center gap-2 transition-colors">
            <div className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[8px] font-semibold transition-colors">JD</div>
            <p className="text-sm font-semibold text-foreground transition-colors">João Diretor</p>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground mb-1 transition-colors">Data aplicação</p>
          <p className="text-sm font-semibold text-foreground transition-colors">{candidate.time}</p>
        </div>
      </div>
    </section>
  );
};

export default CandidateJobInfo;
