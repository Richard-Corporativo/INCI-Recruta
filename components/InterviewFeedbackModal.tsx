import React, { useState, useEffect } from 'react';
import { useAudit } from '../hooks/useAudit';
import { useAuth } from '../hooks/useAuth';
import { useCandidates } from '../hooks/useCandidates';
import { KANBAN_COLUMNS } from '../pages/Jobs';
import { KanbanColumnId } from '../types';
import BaseModal from './BaseModal';

interface InterviewFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidateInitials?: string;
  role?: string;
  candidateId?: string;
  currentStage?: string;
  onSuccess?: () => void;
}

const InterviewFeedbackModal: React.FC<InterviewFeedbackModalProps> = ({
  isOpen,
  onClose,
  candidateName,
  candidateInitials = "",
  role = "",
  candidateId,
  currentStage,
  onSuccess
}) => {
  const { addLog } = useAudit();
  const { user } = useAuth();
  const { moveCandidate } = useCandidates();

  const [rating, setRating] = useState(0);
  const [recommendation, setRecommendation] = useState<'approve' | 'hold' | 'reject'>('approve');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [selectedStage, setSelectedStage] = useState<KanbanColumnId | ''>('');

  // Pre-fill selected stage based on recommendation or current stage logic could go here
  // For now, we leave it empty or user selects.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Log the feedback
    addLog({
      action: 'Feedback de Entrevista',
      details: `Feedback registrado para ${candidateName}: Nota ${rating}/5, Recomendação: ${recommendation}. ${selectedStage ? `Movido para: ${selectedStage}` : ''}`,
      user_name: user?.name || 'Sistema',
      entity_type: 'Candidato',
      entity_id: candidateName
    });

    // Execute Move if stage selected
    if (selectedStage && candidateId) {
      moveCandidate(candidateId, selectedStage);
    }

    onSuccess?.();
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card shrink-0">
          <h2 className="text-lg font-bold text-foreground">Registrar Feedback & Mover</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-all duration-200">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar text-foreground bg-card">
          <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="size-12 rounded-full bg-slate-800 text-white flex items-center justify-center text-lg font-bold shrink-0">
              {candidateInitials || candidateName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">{candidateName}</h3>
              <p className="text-sm text-muted-foreground">Candidato para <span className="font-bold text-foreground">{role || 'Vaga não especificada'}</span></p>
            </div>
          </div>

          <form id="feedback-form" className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-2">Nota Geral</label>
              <div className="flex gap-1 items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`${rating >= star ? 'text-yellow-400 hover:text-yellow-500' : 'text-slate-300 dark:text-slate-600 hover:text-yellow-400'} transition-colors focus:outline-none`}
                  >
                    <span className={`material-symbols-outlined text-3xl ${rating >= star ? 'filled' : ''}`}>star</span>
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                    {rating === 5 ? 'Excelente' : rating === 4 ? 'Muito Bom' : rating === 3 ? 'Bom' : rating === 2 ? 'Regular' : 'Ruim'}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Pontos Fortes</label>
                <textarea
                  className="w-full rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 placeholder:text-muted-foreground resize-none shadow-sm p-3 transition-all duration-200"
                  placeholder="O que se destacou no candidato?"
                  rows={4}
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Pontos de Atenção</label>
                <textarea
                  className="w-full rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 placeholder:text-muted-foreground resize-none shadow-sm p-3 transition-all duration-200"
                  placeholder="Onde o candidato precisa melhorar?"
                  rows={4}
                  value={weaknesses}
                  onChange={(e) => setWeaknesses(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Recomendação</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all shadow-sm group ${recommendation === 'approve' ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-green-300'}`}>
                  <input type="radio" className="sr-only" checked={recommendation === 'approve'} onChange={() => setRecommendation('approve')} />
                  <div className={`size-10 rounded-full flex items-center justify-center mb-2 ${recommendation === 'approve' ? 'bg-green-100 dark:bg-green-800' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <span className={`material-symbols-outlined text-2xl ${recommendation === 'approve' ? 'text-green-600 dark:text-green-300' : 'text-slate-400'}`}>thumb_up</span>
                  </div>
                  <span className={`font-bold text-sm ${recommendation === 'approve' ? 'text-green-700 dark:text-green-300' : 'text-slate-500'}`}>Avançar</span>
                </label>

                <label className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all shadow-sm group ${recommendation === 'hold' ? 'border-slate-400 bg-slate-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'}`}>
                  <input type="radio" className="sr-only" checked={recommendation === 'hold'} onChange={() => setRecommendation('hold')} />
                  <div className={`size-10 rounded-full flex items-center justify-center mb-2 ${recommendation === 'hold' ? 'bg-slate-200 dark:bg-slate-600' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <span className={`material-symbols-outlined text-2xl ${recommendation === 'hold' ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>pause</span>
                  </div>
                  <span className={`font-medium text-sm ${recommendation === 'hold' ? 'dark:text-white' : 'text-slate-500'}`}>Segurar</span>
                </label>

                <label className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all shadow-sm group ${recommendation === 'reject' ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-red-300'}`}>
                  <input type="radio" className="sr-only" checked={recommendation === 'reject'} onChange={() => setRecommendation('reject')} />
                  <div className={`size-10 rounded-full flex items-center justify-center mb-2 ${recommendation === 'reject' ? 'bg-red-100 dark:bg-red-800' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <span className={`material-symbols-outlined text-2xl ${recommendation === 'reject' ? 'text-red-600 dark:text-red-300' : 'text-slate-400'}`}>thumb_down</span>
                  </div>
                  <span className={`font-medium text-sm ${recommendation === 'reject' ? 'text-red-700 dark:text-red-300' : 'text-slate-500'}`}>Reprovar</span>
                </label>
              </div>
            </div>

            {/* Stage Selector */}
            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">move_to_inbox</span>
                Mover para Etapa (Opcional)
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value as KanbanColumnId)}
                className="block w-full rounded-md border border-border bg-background py-2.5 pl-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200 shadow-sm"
              >
                <option value="">Manter na etapa atual ({currentStage || 'Atual'})</option>
                {KANBAN_COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 bg-muted/30 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <p className="text-[10px] text-muted-foreground font-bold italic">Log de auditoria será gerado ao salvar.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-foreground hover:bg-muted rounded-base border border-border bg-background transition-all duration-200 active:translate-y-[1px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="feedback-form"
              className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-primary-foreground bg-primary border border-border/40 hover:bg-primary/90 rounded-base shadow-sm transition-all duration-200 flex items-center justify-center gap-2 active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="material-symbols-outlined text-lg">save</span> Confirmar
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default InterviewFeedbackModal;
