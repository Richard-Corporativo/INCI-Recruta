import React from 'react';

interface MoveStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  currentStage: string;
  candidateInitials?: string;
}

const MoveStageModal: React.FC<MoveStageModalProps> = ({ isOpen, onClose, candidateName, currentStage, candidateInitials }) => {
  if (!isOpen) return null;

  const initials = candidateInitials || candidateName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 sm:px-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-md transform rounded-xl bg-white dark:bg-[#1a2632] p-6 text-left shadow-2xl transition-all border border-slate-200 dark:border-slate-700">
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-6">Mover Etapa</h3>
          <div className="mt-3 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
            <div className="size-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-100 dark:border-blue-800/30">
                {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{candidateName}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Atual: <span className="font-medium text-blue-600 dark:text-blue-400">{currentStage}</span></span>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Selecionar nova etapa
            </label>
            <div className="relative">
              <select className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-2.5 pl-3 pr-10 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm shadow-sm">
                <option disabled value="">Selecione...</option>
                <option disabled value="triagem">Em Triagem (Atual)</option>
                <option selected value="avaliacao">Em Avaliação Técnica</option>
                <option value="entrevista_rh">Entrevista RH</option>
                <option value="entrevista_gestor">Entrevista Gestor</option>
                <option value="finalista">Finalista</option>
                <option value="contratado">Contratado</option>
                <option className="text-slate-500" value="banco">Não Selecionado / Banco</option>
              </select>
            </div>
            <div className="mt-2 flex items-start gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-slate-400 mt-0.5">lock_open</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                <span className="font-medium text-slate-700 dark:text-slate-300">Acesso Admin:</span> Você pode mover este candidato para qualquer etapa do pipeline.
              </p>
            </div>
          </div>
          <div>
            <label className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              <span>Nota / Motivo</span>
              <span className="normal-case font-normal text-[10px] text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded border border-orange-100 dark:border-orange-800 hidden" id="mandatory-badge">Obrigatório</span>
            </label>
            <textarea className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-primary sm:text-sm shadow-sm resize-none" placeholder="Adicione uma nota interna sobre esta movimentação (opcional)..." rows={3}></textarea>
            <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500 italic">
              * Obrigatório se movido para 'Não Selecionado / Banco'
            </p>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors" type="button">
            Cancelar
          </button>
          <button className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors flex items-center gap-2" type="button">
            <span>Confirmar Mover</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveStageModal;