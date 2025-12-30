import React from 'react';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
}

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({ isOpen, onClose, candidateName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-lg transform rounded-xl bg-white dark:bg-[#1a2632] shadow-2xl transition-all flex flex-col max-h-[90vh] ring-1 ring-slate-900/5 dark:ring-white/10" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/50 px-6 py-4 shrink-0 bg-slate-50/50 dark:bg-slate-800/30 rounded-t-xl">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-none">Agendar Entrevista</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Candidato: {candidateName}</p>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">Tipo de Entrevista</label>
                <select className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white sm:text-sm focus:ring-primary focus:border-primary">
                  <option>Entrevista RH</option>
                  <option defaultValue="selected">Entrevista Gestor</option>
                  <option>Entrevista Técnica</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">Status</label>
                <select className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white sm:text-sm focus:ring-primary focus:border-primary">
                  <option defaultValue="selected">Agendada</option>
                  <option>Realizada</option>
                  <option>Remarcada</option>
                  <option>Cancelada</option>
                  <option>Faltou</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">Data</label>
                <input className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white sm:text-sm focus:ring-primary focus:border-primary" type="date" defaultValue="2023-10-27"/>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">Hora</label>
                <input className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white sm:text-sm focus:ring-primary focus:border-primary" type="time" defaultValue="14:30"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">Entrevistador</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </span>
                <input className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-2 pl-9 pr-3 text-slate-900 dark:text-white sm:text-sm focus:ring-primary focus:border-primary placeholder-slate-400" placeholder="Nome do entrevistador" type="text" defaultValue="Ana Silva"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">Local ou Link</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <span className="material-symbols-outlined text-[18px]">link</span>
                </span>
                <input className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-2 pl-9 pr-3 text-slate-900 dark:text-white sm:text-sm focus:ring-primary focus:border-primary placeholder-slate-400" placeholder="Cole o link da reunião ou sala..." type="text"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">Observações</label>
              <textarea className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-2 px-3 text-slate-900 dark:text-white sm:text-sm focus:ring-primary focus:border-primary placeholder-slate-400" placeholder="Instruções para o candidato ou notas internas..." rows={3}></textarea>
            </div>
          </form>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-700/50 px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-b-xl shrink-0">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-transparent border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm shadow-primary/20 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">event_available</span>
            Salvar Agendamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;