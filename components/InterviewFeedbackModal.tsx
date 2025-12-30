import React, { useState } from 'react';

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
  candidateInitials = "CL",
  role = "Dev Frontend Senior" 
}) => {
  const [rating, setRating] = useState(4);
  const [recommendation, setRecommendation] = useState<'approve' | 'hold' | 'reject'>('approve');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-[#1a2632] shadow-2xl transition-all flex flex-col max-h-[90vh] animate-slide-in-right sm:animate-none">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-[#1a2632] shrink-0">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Registrar Feedback de Entrevista</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
            <div className="size-12 rounded-full bg-slate-800 text-white flex items-center justify-center text-lg font-bold shrink-0">
              {candidateInitials}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{candidateName}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Candidata para <span className="font-medium text-slate-700 dark:text-slate-300">{role}</span></p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <span className="material-symbols-outlined text-sm">event</span>
              Entrevista Gestor (Hoje, 10:00)
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Nota Geral</label>
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
                <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                  {rating === 5 ? 'Excelente' : rating === 4 ? 'Muito Bom' : rating === 3 ? 'Bom' : rating === 2 ? 'Regular' : 'Ruim'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Pontos Fortes</label>
                <textarea 
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-primary focus:border-primary placeholder:text-slate-400 resize-none shadow-sm" 
                  placeholder="O que se destacou no candidato?" 
                  rows={4}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Pontos de Atenção</label>
                <textarea 
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-primary focus:border-primary placeholder:text-slate-400 resize-none shadow-sm" 
                  placeholder="Onde o candidato precisa melhorar?" 
                  rows={4}
                ></textarea>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Recomendação</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm group ${recommendation === 'approve' ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-green-300'}`}>
                  <input 
                    type="radio" 
                    name="recommendation" 
                    className="sr-only" 
                    checked={recommendation === 'approve'} 
                    onChange={() => setRecommendation('approve')} 
                  />
                  <div className={`size-10 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${recommendation === 'approve' ? 'bg-green-100 dark:bg-green-800' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <span className={`material-symbols-outlined text-2xl ${recommendation === 'approve' ? 'text-green-600 dark:text-green-300' : 'text-slate-400'}`}>thumb_up</span>
                  </div>
                  <span className={`font-bold text-sm ${recommendation === 'approve' ? 'text-green-700 dark:text-green-300' : 'text-slate-500 dark:text-slate-400'}`}>Avançar</span>
                  {recommendation === 'approve' && (
                    <div className="absolute top-2 right-2 size-5 rounded-full bg-green-500 text-white flex items-center justify-center shadow">
                      <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                    </div>
                  )}
                </label>

                <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm group ${recommendation === 'hold' ? 'border-slate-400 bg-slate-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'}`}>
                  <input 
                    type="radio" 
                    name="recommendation" 
                    className="sr-only" 
                    checked={recommendation === 'hold'} 
                    onChange={() => setRecommendation('hold')} 
                  />
                  <div className={`size-10 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${recommendation === 'hold' ? 'bg-slate-200 dark:bg-slate-600' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <span className={`material-symbols-outlined text-2xl ${recommendation === 'hold' ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>pause</span>
                  </div>
                  <span className={`font-medium text-sm ${recommendation === 'hold' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Segurar</span>
                </label>

                <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm group ${recommendation === 'reject' ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-red-300'}`}>
                  <input 
                    type="radio" 
                    name="recommendation" 
                    className="sr-only" 
                    checked={recommendation === 'reject'} 
                    onChange={() => setRecommendation('reject')} 
                  />
                  <div className={`size-10 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${recommendation === 'reject' ? 'bg-red-100 dark:bg-red-800' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <span className={`material-symbols-outlined text-2xl ${recommendation === 'reject' ? 'text-red-600 dark:text-red-300' : 'text-slate-400'}`}>thumb_down</span>
                  </div>
                  <span className={`font-medium text-sm ${recommendation === 'reject' ? 'text-red-700 dark:text-red-300' : 'text-slate-500 dark:text-slate-400'}`}>Reprovar</span>
                </label>
              </div>
            </div>
          </form>
        </div>
        
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-sm text-blue-500">alt_route</span>
              <span>Próxima etapa sugerida: <strong className="text-slate-700 dark:text-slate-300">Finalista</strong></span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 pl-6">Log de auditoria será gerado ao salvar.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent"
            >
              Cancelar
            </button>
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">save</span>
              Salvar Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedbackModal;