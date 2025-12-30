import React, { useState } from 'react';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import InterviewFeedbackModal from './InterviewFeedbackModal';

interface CandidateProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName?: string;
  candidateInitials?: string;
  candidateColor?: string;
}

const CandidateProfileDrawer: React.FC<CandidateProfileDrawerProps> = ({ 
  isOpen, 
  onClose,
  candidateName = "Carla L.",
  candidateInitials = "CL",
  candidateColor = "bg-slate-800"
}) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'interviews' | 'audit'>('interviews');

  if (!isOpen) return null;

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
              <div className={`size-16 rounded-full ${candidateColor} text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-md`}>
                {candidateInitials}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{candidateName}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-blue-300 text-xs font-semibold border border-primary/20">
                    Entrevista Gestor
                  </span>
                  <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-800/50">
                    <span className="material-symbols-outlined filled text-[14px]">star</span>
                    <span className="text-xs font-bold">Top Candidate</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">mail</span> {candidateName.toLowerCase().replace(' ', '.').replace('.', '')}@email.com
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">call</span> (11) 99999-8888
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">location_on</span> São Paulo, SP
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
                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">Dev Frontend Senior</p>
                    <span className="text-xs text-slate-500">Cod: #4092</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">INCI Brasil</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">Tecnologia / Produto</p>
                    <span className="text-xs text-slate-500">Squad Alpha</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Localização</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">São Paulo - SP</p>
                    <span className="text-xs text-slate-500">Modelo Híbrido</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Gestor Responsável</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="size-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] flex items-center justify-center font-bold">AS</div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Ana Silva</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Data Aplicação</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">12 Out, 2023</p>
                    <span className="text-xs text-slate-500">Há 5 dias</span>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                
                {/* Timeline / Status */}
                <div className="lg:col-span-4">
                  <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 h-full">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">timeline</span>
                      Status no Processo
                    </h3>
                    <div className="relative pl-2">
                      <div className="absolute left-[15px] top-2 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                      
                      {/* Timeline Item: Recebido */}
                      <div className="relative flex gap-4 mb-8">
                        <div className="relative z-10 size-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-2 border-green-500 dark:border-green-600 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                        </div>
                        <div className="pt-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Recebido</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">12 Out, 10:30 • Candidatura via Site</p>
                        </div>
                      </div>

                      {/* Timeline Item: Em Triagem */}
                      <div className="relative flex gap-4 mb-8">
                        <div className="relative z-10 size-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-2 border-green-500 dark:border-green-600 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                        </div>
                        <div className="pt-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Em Triagem</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">13 Out, 09:15 • Aprovado por <strong>Recrutador IA</strong></p>
                          <div className="mt-2 bg-slate-50 dark:bg-slate-800 p-2 rounded text-[11px] text-slate-600 dark:text-slate-300 italic border border-slate-200 dark:border-slate-700">
                            "Match alto com requisitos de React."
                          </div>
                        </div>
                      </div>

                      {/* Timeline Item: Avaliação Técnica */}
                      <div className="relative flex gap-4 mb-8">
                        <div className="relative z-10 size-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-2 border-green-500 dark:border-green-600 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                        </div>
                        <div className="pt-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Avaliação Técnica</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">15 Out, 14:20 • Tech Lead</p>
                        </div>
                      </div>

                      {/* Timeline Item: Entrevista RH */}
                      <div className="relative flex gap-4 mb-8">
                        <div className="relative z-10 size-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-2 border-green-500 dark:border-green-600 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                        </div>
                        <div className="pt-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Entrevista RH</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">16 Out, 11:00 • Maria RH</p>
                        </div>
                      </div>

                      {/* Timeline Item: Entrevista Gestor (Active) */}
                      <div className="relative flex gap-4 mb-8">
                        <div className="relative z-10 size-8 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center shrink-0 ring-4 ring-primary/10">
                          <span className="material-symbols-outlined text-[18px] animate-pulse">radio_button_checked</span>
                        </div>
                        <div className="pt-1">
                          <h4 className="text-sm font-bold text-primary dark:text-blue-400">Entrevista Gestor</h4>
                          <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Aguardando Feedback
                          </span>
                        </div>
                      </div>

                      {/* Timeline Item: Finalista (Future) */}
                      <div className="relative flex gap-4 mb-8 opacity-50">
                        <div className="relative z-10 size-8 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0">
                          <span className="size-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                        </div>
                        <div className="pt-1">
                          <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">Finalista</h4>
                        </div>
                      </div>

                      {/* Timeline Item: Contratado (Future) */}
                      <div className="relative flex gap-4 opacity-50">
                        <div className="relative z-10 size-8 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0">
                          <span className="size-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                        </div>
                        <div className="pt-1">
                          <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">Contratado</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  {/* Tabs */}
                  <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
                    <button 
                      onClick={() => setActiveTab('interviews')}
                      className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors focus:outline-none flex items-center gap-2 ${activeTab === 'interviews' ? 'text-primary border-primary' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border-transparent'}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">forum</span>
                      Entrevistas
                    </button>
                    <button 
                      onClick={() => setActiveTab('audit')}
                      className={`px-6 py-3 text-sm font-medium transition-colors focus:outline-none flex items-center gap-2 ${activeTab === 'audit' ? 'text-primary border-primary border-b-2' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border-transparent'}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">history_edu</span>
                      Auditoria
                    </button>
                  </div>

                  <div className="space-y-4">
                    
                    {/* Active Interview Card */}
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-primary/30 dark:border-primary/50 shadow-sm p-0 overflow-hidden relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                      <div className="p-5 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className="size-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[24px]">groups</span>
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">Entrevista com Gestor</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Fase Técnica / Cultural</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="px-2 py-1 rounded-md bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase tracking-wide border border-green-100 dark:border-green-800">
                            Realizada
                          </span>
                          <span className="text-xs text-slate-400">Hoje, 14:00</span>
                        </div>
                      </div>
                      <div className="p-5 bg-slate-50/50 dark:bg-slate-800/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Entrevistador</label>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="size-6 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">AS</div>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">Ana Silva (Você)</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Local / Link</label>
                          <a className="flex items-center gap-1 mt-1 text-sm text-primary hover:underline" href="#">
                            <span className="material-symbols-outlined text-[16px]">video_camera_front</span>
                            Google Meet Link
                          </a>
                        </div>
                      </div>
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border-t border-yellow-100 dark:border-yellow-800/30 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-500">warning</span>
                          <div>
                            <p className="text-sm font-bold text-yellow-800 dark:text-yellow-200">Feedback Pendente</p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300/70">Registre sua avaliação para avançar o candidato.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsFeedbackModalOpen(true)}
                          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors whitespace-nowrap"
                        >
                          Registrar Feedback
                        </button>
                      </div>
                    </div>

                    {/* Past Interview Card */}
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-0 opacity-75 hover:opacity-100 transition-opacity">
                      <div className="p-5 flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[24px]">badge</span>
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">Entrevista RH</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-slate-500 dark:text-slate-400">16 Out, 11:00</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-sm text-slate-500 dark:text-slate-400">Maria RH</span>
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-bold uppercase tracking-wide">
                          Concluída
                        </span>
                      </div>
                      <div className="px-5 pb-5">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700/50">
                          <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                            "Candidata excelente, comunicativa e com fit cultural muito forte. Recomendo para fase técnica."
                          </p>
                          <div className="mt-2 flex gap-1">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Comunicação 5/5</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Inglês 4/5</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Technical Assessment Card */}
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-0 opacity-75 hover:opacity-100 transition-opacity">
                      <div className="p-5 flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[24px]">terminal</span>
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">Avaliação Técnica (Code Challenge)</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-slate-500 dark:text-slate-400">15 Out</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-sm text-slate-500 dark:text-slate-400">Tech Lead</span>
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-bold uppercase tracking-wide">
                          Aprovada
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2632] shrink-0 z-20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-sm transition-colors w-full sm:w-auto">
                  <span className="material-symbols-outlined text-[18px]">block</span>
                  Reprovar
                </button>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                <button 
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition-colors w-full sm:w-auto"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_clock</span>
                  Agendar Entrevista
                </button>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-sm transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  Mover Etapa
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors shadow-md shadow-green-600/20">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Aprovar para Finalista
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
      <ScheduleInterviewModal 
        isOpen={isScheduleModalOpen} 
        onClose={() => setIsScheduleModalOpen(false)}
        candidateName={candidateName}
      />
      <InterviewFeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        candidateName={candidateName}
        candidateInitials={candidateInitials}
      />
    </>
  );
};

export default CandidateProfileDrawer;