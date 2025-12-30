import React, { useState } from 'react';
import { KanbanColumnId } from '../types';
import { useCandidates } from '../hooks/useCandidates';
import BaseModal from './BaseModal';

interface MoveStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  currentStage: string;
  candidateInitials?: string;
  candidateId: string;
}

const STAGES: { id: KanbanColumnId, title: string }[] = [
  { id: 'received', title: 'Recebido' },
  { id: 'screening', title: 'Em Triagem' },
  { id: 'technical', title: 'Avaliação Téc.' },
  { id: 'hr_interview', title: 'Entrevista RH' },
  { id: 'manager_interview', title: 'Entrevista Gestor' },
  { id: 'finalist', title: 'Finalista' },
  { id: 'hired', title: 'Contratado' },
  { id: 'rejected', title: 'Não Selecionado' },
];

const MoveStageModal: React.FC<MoveStageModalProps> = ({ isOpen, onClose, candidateName, currentStage, candidateInitials, candidateId }) => {
  const [selectedStage, setSelectedStage] = useState<KanbanColumnId | ''>('');
  const { moveCandidate } = useCandidates();

  const initials = candidateInitials || candidateName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleConfirm = () => {
    if (selectedStage && candidateId) {
      moveCandidate(candidateId, selectedStage);
      onClose();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors z-10"
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
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value as KanbanColumnId)}
                className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-2.5 pl-3 pr-10 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm shadow-sm"
              >
                <option value="">Selecione...</option>
                {STAGES.map((stage) => (
                  <option key={stage.id} value={stage.id}>{stage.title}</option>
                ))}
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
            </label>
            <textarea className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-primary sm:text-sm shadow-sm resize-none" placeholder="Adicione uma nota interna sobre esta movimentação (opcional)..." rows={3}></textarea>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors" type="button">
            Cancelar
          </button>
          <button
            disabled={!selectedStage}
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark disabled:bg-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors flex items-center gap-2"
            type="button"
          >
            <span>Confirmar Mover</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default MoveStageModal;