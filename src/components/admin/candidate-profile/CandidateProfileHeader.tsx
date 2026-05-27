// @component CandidateProfileHeader | @tipo componente | @versao 1.0.0
// > Header do perfil candidato — foto, nome, info básica
// @api candidate: Candidate, avatarUrl?: string

import React from 'react';
import { Icon } from "@iconify/react";
import { Candidate } from '@src/types';

interface CandidateProfileHeaderProps {
  candidate: Candidate;
  onClose: () => void;
  onDownloadResume: () => void;
}

const CandidateProfileHeader: React.FC<CandidateProfileHeaderProps> = ({
  candidate,
  onClose,
  onDownloadResume
}) => {
  return (
    <header className="flex items-start justify-between -b - bg-card shrink-0 transition-colors p-6">
      <div className="flex items-start gap-5">
        <div
          className={`size-20 rounded-full ${candidate.avatarColor} ${candidate.textColor} flex items-center justify-center text-3xl font-semibold shrink-0  border-2 border-background ring-2 ring-border/50 transition-colors bg-cover bg-center`}
          style={candidate.avatar ? { backgroundImage: `url("${candidate.avatar}")` } : {}}
        >
          {!candidate.avatar && candidate.initials}
        </div>
        <div className="pt-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2 className="text-3xl font-semibold text-foreground tracking-tight transition-colors">{candidate.name}</h2>
            {candidate.match && (
              <div className="flex items-center gap-1 text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 transition-colors">
                <i className="fa-duotone fa-solid fa-star text-[14px] text-primary mr-1"></i>
                <span className="text-xs font-semibold tracking-wide">{candidate.match} Match</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground font-medium transition-colors">
            <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
              <Icon icon="material-symbols:mail" className="h-4 w-4" aria-hidden="true" /> {candidate.email}
            </span>
            <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
              <Icon icon="material-symbols:call" className="h-4 w-4" aria-hidden="true" /> {candidate.phone}
            </span>
            <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
              <Icon icon="material-symbols:location-on" className="h-4 w-4" aria-hidden="true" /> {candidate.location}
            </span>
            {candidate.linkedin && (
              <a href={candidate.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[#0A66C2] hover:opacity-80 transition-all font-semibold">
                <Icon icon="mdi:linkedin" className="h-4 w-4" aria-hidden="true" /> LinkedIn
              </a>
            )}
            {candidate.github && (
              <a href={candidate.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-foreground hover:opacity-80 transition-all font-semibold">
                <Icon icon="mdi:github" className="h-4 w-4" aria-hidden="true" /> GitHub
              </a>
            )}
            {candidate.portfolio && (
              <a href={candidate.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:opacity-80 transition-all font-semibold">
                <Icon icon="material-symbols:link" className="h-4 w-4" aria-hidden="true" /> Portfólio
              </a>
            )}
            {candidate.pretension_min && (
              <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                <Icon icon="material-symbols:payments" className="h-4 w-4" aria-hidden="true" />
                R$ {candidate.pretension_min.toLocaleString()}
                {candidate.pretension_max ? ` - ${candidate.pretension_max.toLocaleString()}` : ''}
              </span>
            )}
            {candidate.availability && (
              <span className="flex items-center gap-1.5 text-amber-600 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">
                <Icon icon="material-symbols:schedule" className="h-4 w-4" aria-hidden="true" /> {candidate.availability}
              </span>
            )}
            {candidate.has_resume && (
              <button
                onClick={onDownloadResume}
                className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors font-semibold outline-none focus-visible:underline"
              >
                <Icon icon="material-symbols:description" className="h-4 w-4" aria-hidden="true" /> Currículo
              </button>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Icon icon="material-symbols:close" className="h-5 w-5" aria-hidden="true" />
      </button>
    </header>
  );
};

export default CandidateProfileHeader;
