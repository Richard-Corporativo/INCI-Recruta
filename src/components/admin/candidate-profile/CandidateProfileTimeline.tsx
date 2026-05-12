// @component CandidateProfileTimeline | @tipo componente | @versao 1.0.0
// > Timeline de atividades do candidato — etapas percorridas

import React from 'react';
import { Icon } from "@iconify/react";
import { COLUMNS_CONFIG } from '@src/constants';

interface CandidateProfileTimelineProps {
  currentStepIndex: number;
}

const CandidateProfileTimeline: React.FC<CandidateProfileTimelineProps> = ({ currentStepIndex }) => {
  return (
    <section>
      <h3 className="text-xs font-semibold text-muted-foreground tracking-wider mb-4 px-1 transition-colors">Status no processo</h3>
      <div className="relative flex items-center justify-between w-full px-4">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 rounded-full"></div>
        {COLUMNS_CONFIG.map((col, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={col.id} className="group relative flex flex-col items-center gap-2">
              <div className={`
                size-8 rounded-full flex items-center justify-center border-4 transition-all duration-300 ease-in-out z-10
                ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : ''}
                ${isCurrent ? 'bg-background border-primary text-primary  ring-4 ring-primary/20 scale-110' : ''}
                ${!isCompleted && !isCurrent ? 'bg-background border-muted text-muted-foreground' : ''}
              `}>
                {isCompleted ? (
                  <Icon icon="material-symbols:check" className="font-semibold h-5 w-5" aria-hidden="true" />
                ) : (
                  <span className="text-[10px] font-semibold">{idx + 1}</span>
                )}
              </div>
              <span className={`
                absolute top-10 text-[10px] font-semibold whitespace-nowrap transition-colors duration-200
                ${isCurrent ? 'text-primary' : 'text-muted-foreground'}
              `}>
                {col.title}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CandidateProfileTimeline;
