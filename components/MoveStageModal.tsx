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
  onSuccess?: () => void;
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

const MoveStageModal: React.FC<MoveStageModalProps> = ({ isOpen, onClose, candidateName, currentStage, candidateInitials, candidateId, onSuccess }) => {
  const [selectedStage, setSelectedStage] = useState<KanbanColumnId | ''>('');
  const { moveCandidate } = useCandidates();

  const initials = candidateInitials || candidateName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleConfirm = () => {
    if (selectedStage && candidateId) {
      moveCandidate(candidateId, selectedStage);
      onSuccess?.();
      onClose();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="p-6 bg-card">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-all duration-200 z-10"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="mb-6 border-b border-border pb-4">
          <h3 className="text-lg font-bold text-foreground leading-6">Mover Etapa</h3>
          <div className="mt-3 flex items-center gap-3 bg-muted/50 p-3 rounded-lg border border-border">
            <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">{candidateName}</span>
              <span className="text-xs text-muted-foreground">Atual: <span className="font-bold text-primary">{currentStage}</span></span>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Selecionar nova etapa
            </label>
            <div className="relative">
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value as KanbanColumnId)}
                className="block w-full rounded-md border border-border bg-background py-2.5 pl-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200 shadow-sm"
              >
                <option value="">Selecione...</option>
                {STAGES.map((stage) => (
                  <option key={stage.id} value={stage.id} disabled={stage.title === currentStage}>{stage.title}</option>
                ))}
              </select>
            </div>
            <div className="mt-2 flex items-start gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-primary mt-0.5">lock_open</span>
              <p className="text-[11px] text-muted-foreground leading-tight font-bold">
                <span className="text-foreground">Acesso Admin:</span> Você pode mover este candidato para qualquer etapa do pipeline.
              </p>
            </div>
          </div>
          <div>
            <label className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              <span>Nota / Motivo</span>
            </label>
            <textarea
              className="block w-full rounded-md border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200 shadow-sm resize-none"
              placeholder="Adicione uma nota interna sobre esta movimentação (opcional)..."
              rows={3}
            ></textarea>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-foreground bg-background border border-border rounded-base hover:bg-muted transition-all duration-200 active:translate-y-[1px]"
            type="button"
          >
            Cancelar
          </button>
          <button
            disabled={!selectedStage}
            onClick={handleConfirm}
            className="px-6 py-2.5 text-sm font-bold text-primary-foreground bg-primary border border-border/40 hover:bg-primary/90 disabled:opacity-50 rounded-base shadow-sm transition-all duration-200 flex items-center gap-2 active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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