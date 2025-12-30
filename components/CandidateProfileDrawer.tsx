import React, { useState } from 'react';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import InterviewFeedbackModal from './InterviewFeedbackModal';
import { useCandidates } from '../hooks/useCandidates';
import { useJobs } from '../hooks/useJobs';

interface CandidateProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId?: string;
}

const CandidateProfileDrawer: React.FC<CandidateProfileDrawerProps> = ({
  isOpen,
  onClose,
  candidateId
}) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'interviews' | 'audit'>('interviews');

  const { candidates } = useCandidates();
  const { jobs } = useJobs();

  const candidate = candidates.find(c => c.id === candidateId);
  const job = jobs.find(j => j.id === candidate?.jobId);

  if (!isOpen || !candidate) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}>
        <div
          className="w-full max-w-[1000px] bg-white dark:bg-[#1a2632] shadow-2xl h-full flex flex-col animate-slide-in-right"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2632] shrink-0">
            <div className="flex items-start gap-4">
              <div className={`size-16 rounded-full ${candidate.avatarColor} text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-md`}>
                {candidate.initials}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{candidate.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-blue-300 text-xs font-semibold border border-primary/20">
                    {candidate.columnId}
                  </span>
                  {candidate.match && (
                    <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-800/50">
                      <span className="material-symbols-outlined filled text-[14px]">star</span>
                      <span className="text-xs font-bold">{candidate.match}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">mail</span> {candidate.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">call</span> {candidate.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">location_on</span> {candidate.location}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background-dark drawer-scroll">
            <div className="p-6 space-y-6">

              {/* Identificação da Vaga */}
              <section className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">work</span>
                  Identificação da Vaga
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Cargo</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{job?.title || 'Não vinculada'}</p>
                    <span className="text-xs text-slate-500">ID: #{job?.id}</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Departamento</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{job?.department}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Localização</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{job?.location}</p>
                    <span className="text-xs text-slate-500">{job?.model}</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Data Aplicação</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{candidate.time}</p>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full text-slate-900 dark:text-white">
                <div className="lg:col-span-12">
                  <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                    <p>Dados do perfil do candidato carregados do sistema.</p>
                    {candidate.status && (
                      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <h4 className="font-bold mb-2">Status / Observações:</h4>
                        <p>{candidate.status}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2632] shrink-0 z-20 text-slate-900 dark:text-white">
            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium">Fechar</button>
            </div>
          </footer>
        </div>
      </div>
      <ScheduleInterviewModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        candidateName={candidate.name}
      />
      <InterviewFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        candidateName={candidate.name}
        candidateInitials={candidate.initials}
      />
    </>
  );
};

export default CandidateProfileDrawer;