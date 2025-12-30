import React, { useState } from 'react';
import { useAudit } from '../hooks/useAudit';
import { useAuth } from '../hooks/useAuth';
import BaseModal from './BaseModal';

interface InterviewFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidateInitials?: string;
  role?: string;
}

const InterviewFeedbackModal: React.FC<InterviewFeedbackModalProps> = ({
  isOpen,
  onClose,
  candidateName,
  candidateInitials = "",
  role = ""
}) => {
  const { addLog } = useAudit();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [recommendation, setRecommendation] = useState<'approve' | 'hold' | 'reject'>('approve');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLog({
      action: 'Feedback de Entrevista',
      details: `Feedback registrado para ${candidateName}: Nota ${rating}/5, Recomendação: ${recommendation}`,
      user_name: user?.name || 'Sistema',
      entity_type: 'Candidato',
      entity_id: candidateName
    });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-[#1a2632] shrink-0">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Registrar Feedback de Entrevista</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar text-slate-900 dark:text-white">
          <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
            <div className="size-12 rounded-full bg-slate-800 text-white flex items-center justify-center text-lg font-bold shrink-0">
              {candidateInitials || candidateName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-base font-bold dark:text-white">{candidateName}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Candidato para <span className="font-medium text-slate-700 dark:text-slate-300">{role || 'Vaga não especificada'}</span></p>
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
                <label className="block text-sm font-semibold mb-2">Pontos Fortes</label>
                <textarea
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary placeholder:text-slate-400 resize-none shadow-sm p-3"
                  placeholder="O que se destacou no candidato?"
                  rows={4}
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Pontos de Atenção</label>
                <textarea
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary placeholder:text-slate-400 resize-none shadow-sm p-3"
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
                <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm group ${recommendation === 'approve' ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-green-300'}`}>
                  <input type="radio" className="sr-only" checked={recommendation === 'approve'} onChange={() => setRecommendation('approve')} />
                  <div className={`size-10 rounded-full flex items-center justify-center mb-2 ${recommendation === 'approve' ? 'bg-green-100 dark:bg-green-800' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <span className={`material-symbols-outlined text-2xl ${recommendation === 'approve' ? 'text-green-600 dark:text-green-300' : 'text-slate-400'}`}>thumb_up</span>
                  </div>
                  <span className={`font-bold text-sm ${recommendation === 'approve' ? 'text-green-700 dark:text-green-300' : 'text-slate-500'}`}>Avançar</span>
                </label>

                <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm group ${recommendation === 'hold' ? 'border-slate-400 bg-slate-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'}`}>
                  <input type="radio" className="sr-only" checked={recommendation === 'hold'} onChange={() => setRecommendation('hold')} />
                  <div className={`size-10 rounded-full flex items-center justify-center mb-2 ${recommendation === 'hold' ? 'bg-slate-200 dark:bg-slate-600' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <span className={`material-symbols-outlined text-2xl ${recommendation === 'hold' ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>pause</span>
                  </div>
                  <span className={`font-medium text-sm ${recommendation === 'hold' ? 'dark:text-white' : 'text-slate-500'}`}>Segurar</span>
                </label>

                <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm group ${recommendation === 'reject' ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-red-300'}`}>
                  <input type="radio" className="sr-only" checked={recommendation === 'reject'} onChange={() => setRecommendation('reject')} />
                  <div className={`size-10 rounded-full flex items-center justify-center mb-2 ${recommendation === 'reject' ? 'bg-red-100 dark:bg-red-800' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <span className={`material-symbols-outlined text-2xl ${recommendation === 'reject' ? 'text-red-600 dark:text-red-300' : 'text-slate-400'}`}>thumb_down</span>
                  </div>
                  <span className={`font-medium text-sm ${recommendation === 'reject' ? 'text-red-700 dark:text-red-300' : 'text-slate-500'}`}>Reprovar</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Log de auditoria será gerado ao salvar.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={onClose} className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-transparent">Cancelar</button>
            <button type="submit" form="feedback-form" className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">save</span> Salvar Feedback
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default InterviewFeedbackModal;
