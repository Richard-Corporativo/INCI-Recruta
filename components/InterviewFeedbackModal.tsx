import React, { useState, useEffect } from 'react';
import { useAudit } from '../hooks/useAudit';
import { useAuth } from '../hooks/useAuth';
import { useCandidates } from '../hooks/useCandidates';
import { KanbanColumnId } from '../types';
import { COLUMNS_CONFIG } from '../constants';
import BaseModal from './BaseModal';

interface InterviewFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidateInitials?: string;
  role?: string;
  candidateId?: string;
  currentStage?: string;
  targetStage?: KanbanColumnId;
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
  targetStage,
  onSuccess
}) => {
  const { addLog } = useAudit();
  const { user } = useAuth();
  const { addFeedback } = useCandidates();

  const [rating, setRating] = useState(0);
  const [recommendation, setRecommendation] = useState<'advance' | 'hold' | 'reject'>('advance');
  const [strengths, setStrengths] = useState('');
  const [concerns, setConcerns] = useState('');
  const [selectedStage, setSelectedStage] = useState<KanbanColumnId | ''>('');

  useEffect(() => {
    if (targetStage) {
      setSelectedStage(targetStage);
    } else {
      setSelectedStage('');
    }
    // Clean form on open
    if (isOpen) {
      setRating(0);
      setRecommendation('advance');
      setStrengths('');
      setConcerns('');
    }
  }, [targetStage, isOpen]);

  useEffect(() => {
    if (isOpen && !targetStage && recommendation === 'advance') {
      // Tentar inferir a próxima etapa se não houver alvo definido (abertura manual)
      if (currentStage) {
        const currentColumn = COLUMNS_CONFIG.find(c => c.title === currentStage);
        if (currentColumn) {
          const currentIndex = COLUMNS_CONFIG.findIndex(c => c.id === currentColumn.id);
          if (currentIndex !== -1 && currentIndex < COLUMNS_CONFIG.length - 1) {
            setSelectedStage(COLUMNS_CONFIG[currentIndex + 1].id);
          }
        }
      }
    } else if (isOpen && !targetStage && recommendation !== 'advance') {
      setSelectedStage(''); // Reset se não for avançar
    }
  }, [recommendation, currentStage, targetStage, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (candidateId) {
      addFeedback(candidateId, {
        rating,
        strengths,
        concerns,
        recommendation,
        stage: selectedStage || undefined, // Use hook's move logic
        createdBy: user?.name || 'Sistema'
      });

      addLog({
        action: 'Feedback de Entrevista',
        details: `Feedback registrado para ${candidateName}: Nota ${rating}/5, Recomendação: ${recommendation}. ${selectedStage ? `Movido para: ${selectedStage}` : ''}`,
        user_name: user?.name || 'Sistema',
        entity_type: 'Candidato',
        entity_id: candidateId
      });
    }

    onSuccess?.();
    onClose();
  };

  const initials = candidateInitials || candidateName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="relative w-full max-w-2xl bg-card rounded-lg shadow-2xl border border-border overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300 ease-in-out">
        <div className="h-1 w-full bg-primary absolute top-0 left-0 transition-all"></div>
        <div className="flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card shrink-0 transition-colors">
            <h2 className="text-lg font-semibold text-foreground">Registrar Feedback & Mover</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto custom-scrollbar text-foreground bg-card transition-colors">
            <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg border border-border transition-colors">
              <div className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold shrink-0 shadow-sm">
                {initials}
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground transition-colors">{candidateName}</h3>
                <p className="text-sm text-muted-foreground transition-colors">Candidato para <span className="font-semibold text-foreground">{role || 'Vaga não especificada'}</span></p>
              </div>
            </div>

            <form id="feedback-form" className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold mb-2 transition-colors">Nota Geral</label>
                <div className="flex gap-1 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`${rating >= star ? 'text-primary' : 'text-muted hover:text-primary/50'} transition-all duration-200 ease-in-out focus:outline-none active:scale-90`}
                    >
                      <span className={`material-symbols-outlined text-3xl ${rating >= star ? 'filled' : ''}`}>star</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 transition-colors">Pontos Fortes</label>
                  <textarea
                    className="w-full h-32 rounded-md border border-border bg-background text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 placeholder:text-muted-foreground resize-none shadow-sm p-3 transition-all duration-200 ease-in-out hover:border-ring"
                    placeholder="O que se destacou no candidato?"
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 transition-colors">Pontos de Atenção</label>
                  <textarea
                    className="w-full h-32 rounded-md border border-border bg-background text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 placeholder:text-muted-foreground resize-none shadow-sm p-3 transition-all duration-200 ease-in-out hover:border-ring"
                    placeholder="Onde o candidato precisa melhorar?"
                    value={concerns}
                    onChange={(e) => setConcerns(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 transition-colors">Recomendação</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ease-in-out shadow-sm group ${recommendation === 'advance' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/50'}`}>
                    <input className="sr-only" type="radio" checked={recommendation === 'advance'} onChange={() => setRecommendation('advance')} />
                    <div className={`size-10 rounded-full flex items-center justify-center mb-2 transition-colors ${recommendation === 'advance' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-foreground/10 group-hover:text-foreground'}`}>
                      <span className={`material-symbols-outlined text-2xl ${recommendation === 'advance' ? 'filled' : ''}`}>thumb_up</span>
                    </div>
                    <span className={`font-semibold text-xs uppercase tracking-wider transition-colors ${recommendation === 'advance' ? 'text-primary' : 'text-muted-foreground'}`}>Avançar</span>
                  </label>

                  <label className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ease-in-out shadow-sm group ${recommendation === 'hold' ? 'border-foreground/50 bg-foreground/5' : 'border-border bg-background hover:border-foreground/30'}`}>
                    <input className="sr-only" type="radio" checked={recommendation === 'hold'} onChange={() => setRecommendation('hold')} />
                    <div className={`size-10 rounded-full flex items-center justify-center mb-2 transition-colors ${recommendation === 'hold' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground group-hover:bg-foreground/10 group-hover:text-foreground'}`}>
                      <span className={`material-symbols-outlined text-2xl ${recommendation === 'hold' ? 'filled' : ''}`}>pause</span>
                    </div>
                    <span className={`font-semibold text-xs uppercase tracking-wider transition-colors ${recommendation === 'hold' ? 'text-foreground' : 'text-muted-foreground'}`}>Segurar</span>
                  </label>

                  <label className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ease-in-out shadow-sm group ${recommendation === 'reject' ? 'border-destructive bg-destructive/5' : 'border-border bg-background hover:border-destructive/30'}`}>
                    <input className="sr-only" type="radio" checked={recommendation === 'reject'} onChange={() => setRecommendation('reject')} />
                    <div className={`size-10 rounded-full flex items-center justify-center mb-2 transition-colors ${recommendation === 'reject' ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-muted-foreground group-hover:bg-destructive/10 group-hover:text-destructive'}`}>
                      <span className={`material-symbols-outlined text-2xl ${recommendation === 'reject' ? 'filled' : ''}`}>thumb_down</span>
                    </div>
                    <span className={`font-semibold text-xs uppercase tracking-wider transition-colors ${recommendation === 'reject' ? 'text-destructive' : 'text-muted-foreground'}`}>Reprovar</span>
                  </label>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border border-border transition-colors">
                <label className="block text-sm font-semibold mb-3 flex items-center gap-2 transition-colors">
                  <span className="material-symbols-outlined text-primary">move_to_inbox</span>
                  Mover para Etapa (Opcional)
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value as KanbanColumnId)}
                  className="block w-full h-11 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 ease-in-out shadow-sm hover:border-ring"
                >
                  <option value="">Manter na etapa atual ({currentStage || 'Atual'})</option>
                  <option value="received">Recebido</option>
                  <option value="screening">Em Triagem</option>
                  <option value="technical">Avaliação Téc.</option>
                  <option value="hr_interview">Entrevista RH</option>
                  <option value="manager_interview">Entrevista Gestor</option>
                  <option value="finalist">Finalista</option>
                  <option value="hired">Contratado</option>
                  <option value="rejected">Não Selecionado</option>
                </select>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-muted/30 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 transition-colors">
            <div className="flex flex-col gap-1 w-full sm:w-auto transition-colors">
              <p className="text-[10px] text-muted-foreground font-semibold italic tracking-wide">LOG DE AUDITORIA SERÁ GERADO AO SALVAR.</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none h-11 px-6 text-sm font-semibold text-foreground hover:bg-accent rounded-base border border-border bg-background transition-all duration-200 ease-in-out active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="feedback-form"
                className="flex-1 sm:flex-none h-11 px-8 text-sm font-semibold text-primary-foreground bg-primary border border-border/40 hover:bg-primary/90 rounded-base shadow-sm transition-all duration-200 ease-in-out flex items-center justify-center gap-2 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="material-symbols-outlined text-lg">save</span> Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default InterviewFeedbackModal;
