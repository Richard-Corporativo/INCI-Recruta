'use client';
import { Icon } from "@iconify/react";

import React, { useState } from 'react';
import { KanbanColumnId } from '@src/types';
import { useCandidates } from '@src/hooks/useCandidates';
import BaseModal from '@src/components/ui/BaseModal';
import { COLUMNS_CONFIG } from '@src/constants';

interface MoveStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  currentStage: string;
  candidateInitials?: string;
  candidateId: string;
  onSuccess?: () => void;
}

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
      <div className="p-6 bg-card transition-colors relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-all duration-200 ease-in-out z-10 p-2 rounded-full hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Icon icon="material-symbols:close" className="" width="20" height="20" />
        </button>
        <div className="mb-6 border-b border-border pb-4 transition-colors">
          <h3 className="text-lg font-semibold text-foreground leading-6">Mover Etapa</h3>
          <div className="mt-3 flex items-center gap-3 bg-muted/50 p-3 rounded-2xl border border-border transition-colors">
            <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold ">
              {initials}
            </div>
            <div className="flex flex-col transition-colors">
              <span className="text-sm font-semibold text-foreground">{candidateName}</span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Atual: <span className="text-primary">{currentStage}</span></span>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 transition-colors">
              Selecionar nova etapa
            </label>
            <div className="relative">
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value as KanbanColumnId)}
                className="block w-full h-11 px-3 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 ease-in-out  hover:border-ring"
              >
                <option value="">Selecione...</option>
                {COLUMNS_CONFIG.map((stage) => (
                  <option key={stage.id} value={stage.id} disabled={stage.title === currentStage}>{stage.title}</option>
                ))}
              </select>
            </div>
            <div className="mt-2 flex items-start gap-1.5 transition-colors">
              <Icon icon="material-symbols:lock-open" className="text-[14px] text-primary mt-0.5" width="14" height="14" />
              <p className="text-[11px] text-muted-foreground leading-tight font-semibold transition-colors">
                <span className="text-foreground">Acesso Admin:</span> Você pode mover este candidato para qualquer etapa do pipeline.
              </p>
            </div>
          </div>
          <div>
            <label className="flex justify-between items-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 transition-colors">
              <span>Nota / Motivo</span>
            </label>
            <textarea
              className="block w-full rounded-2xl border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 ease-in-out  resize-none hover:border-ring"
              placeholder="Adicione uma nota interna sobre esta movimentação (opcional)..."
              rows={3}
            ></textarea>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-border transition-colors">
          <button
            onClick={onClose}
            className="h-10 px-6 text-sm font-semibold text-foreground bg-background border border-border rounded-2xl hover:bg-accent transition-all duration-200 ease-in-out active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            type="button"
          >
            Cancelar
          </button>
          <button
            disabled={!selectedStage}
            onClick={handleConfirm}
            className="h-10 px-6 text-sm font-semibold text-primary-foreground bg-primary border border-border/40 hover:bg-primary/90 disabled:opacity-50 disabled:scale-100 rounded-2xl  transition-all duration-200 ease-in-out flex items-center gap-2 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            type="button"
          >
            <span>Confirmar Mover</span>
            <Icon icon="material-symbols:arrow-forward" className="text-[18px]" width="18" height="18" />
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default MoveStageModal;

