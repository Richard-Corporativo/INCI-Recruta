import React, { useState, DragEvent } from 'react';
import CandidateProfileDrawer from '../components/CandidateProfileDrawer';
import InterviewFeedbackModal from '../components/InterviewFeedbackModal';
import MoveStageModal from '../components/MoveStageModal';
import { useParams } from 'react-router-dom';

// Tipos para os dados
type Candidate = {
  id: string;
  initials: string;
  name: string;
  time: string;
  role?: string;
  match?: string;
  avatarColor: string; // Tailwind class
  textColor: string;   // Tailwind class
  status?: string;     // Descrição extra
  actionRequired?: boolean;
};

type ColumnId = 'received' | 'screening' | 'technical' | 'hr_interview' | 'manager_interview' | 'finalist' | 'hired' | 'rejected';

type Column = {
  id: ColumnId;
  title: string;
  countColor: string; // Cor do badge de contagem
  dotColor: string; // Cor da bolinha
  convRate?: string;
  // Classes específicas do design HTML
  containerClass: string;
  headerClass: string;
  bodyClass?: string;
};

const COLUMNS_CONFIG: Column[] = [
  { 
    id: 'received', 
    title: 'Recebido', 
    dotColor: 'bg-slate-400', 
    countColor: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300', 
    convRate: '45% conv.',
    containerClass: 'bg-slate-200/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50',
    headerClass: 'bg-slate-50/50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/50'
  },
  { 
    id: 'screening', 
    title: 'Em Triagem', 
    dotColor: 'bg-blue-400', 
    countColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300', 
    convRate: '60% conv.',
    containerClass: 'bg-slate-200/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50',
    headerClass: 'bg-slate-50/50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/50'
  },
  { 
    id: 'technical', 
    title: 'Avaliação Téc.', 
    dotColor: 'bg-purple-400', 
    countColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300', 
    convRate: '33% conv.',
    containerClass: 'bg-slate-200/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50',
    headerClass: 'bg-slate-50/50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/50'
  },
  { 
    id: 'hr_interview', 
    title: 'Entrevista RH', 
    dotColor: 'bg-indigo-400', 
    countColor: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300', 
    convRate: '50% conv.',
    containerClass: 'bg-slate-200/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50',
    headerClass: 'bg-slate-50/50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/50'
  },
  { 
    id: 'manager_interview', 
    title: 'Entrevista Gestor', 
    dotColor: 'bg-primary animate-pulse', 
    countColor: 'bg-primary text-white', 
    convRate: 'Action Required',
    // Estilo especial com sombra azul e borda
    containerClass: 'bg-white dark:bg-[#1a2632] border-primary/20 dark:border-primary/40 shadow-[0_0_15px_-3px_rgba(25,127,230,0.1)]',
    headerClass: 'bg-primary/5 dark:bg-primary/10 border-primary/10 dark:border-primary/30',
    bodyClass: 'bg-slate-50/50 dark:bg-slate-900/20'
  },
  { 
    id: 'finalist', 
    title: 'Finalista', 
    dotColor: 'bg-yellow-400', 
    countColor: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300', 
    convRate: '50% conv.',
    containerClass: 'bg-slate-200/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50',
    headerClass: 'bg-slate-50/50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/50'
  },
  { 
    id: 'hired', 
    title: 'Contratado', 
    dotColor: 'bg-green-500', 
    countColor: 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200', 
    // Estilo verde especial
    containerClass: 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50',
    headerClass: 'bg-green-50/80 dark:bg-green-900/30 border-green-200 dark:border-green-800/50'
  },
  { 
    id: 'rejected', 
    title: 'Não Selecionado', 
    dotColor: 'bg-slate-500', 
    countColor: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300', 
    // Opacidade reduzida
    containerClass: 'bg-slate-200/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 opacity-75 hover:opacity-100 transition-opacity',
    headerClass: 'bg-slate-50/50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/50'
  },
];

// Dados Iniciais
const INITIAL_DATA: Record<ColumnId, Candidate[]> = {
  received: [
    { id: 'c1', initials: 'JD', name: 'João D.', time: 'Há 2 dias', role: 'Frontend', match: '92% Match', avatarColor: 'bg-indigo-100 dark:bg-indigo-900/30', textColor: 'text-indigo-600 dark:text-indigo-400' },
    { id: 'c2', initials: 'LM', name: 'Luiza M.', time: 'Há 5 horas', role: 'UX/UI', match: '70% Match', avatarColor: 'bg-pink-100 dark:bg-pink-900/30', textColor: 'text-pink-600 dark:text-pink-400' },
  ],
  screening: [
    { id: 'c3', initials: 'RF', name: 'Rafael F.', time: 'Há 1 dia', avatarColor: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-600 dark:text-blue-400', status: 'Experiência sólida em React e Node.js. Portfólio interessante.' },
  ],
  technical: [
    { id: 'c4', initials: 'MA', name: 'Maria A.', time: 'Teste enviado há 2d', avatarColor: 'bg-slate-100 dark:bg-slate-800', textColor: 'text-slate-600 dark:text-slate-400', actionRequired: true },
  ],
  hr_interview: [
    { id: 'c5', initials: 'BS', name: 'Bruno S.', time: 'Hoje às 14:00', avatarColor: 'bg-slate-100 dark:bg-slate-800', textColor: 'text-slate-600 dark:text-slate-400' },
  ],
  manager_interview: [
    { id: 'c6', initials: 'CL', name: 'Carla L.', time: 'Feedback Pendente', avatarColor: 'bg-slate-800', textColor: 'text-white' },
  ],
  finalist: [
    { id: 'c7', initials: 'PL', name: 'Pedro L.', time: 'Aprovado pelo Gestor', avatarColor: 'bg-yellow-50 dark:bg-yellow-900/20', textColor: 'text-yellow-700 dark:text-yellow-400' },
  ],
  hired: [],
  rejected: [
    { id: 'c8', initials: 'AN', name: 'Ana N.', time: 'Banco de Talentos', avatarColor: 'bg-slate-200 dark:bg-slate-700', textColor: 'text-slate-500' },
    { id: 'c9', initials: 'FR', name: 'Felipe R.', time: 'Reprovado - Téc.', avatarColor: 'bg-slate-200 dark:bg-slate-700', textColor: 'text-slate-500' },
  ],
};

const Kanban: React.FC = () => {
  const { id } = useParams();
  const [columns, setColumns] = useState(INITIAL_DATA);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [feedbackCandidate, setFeedbackCandidate] = useState<Candidate | null>(null);
  const [movingCandidate, setMovingCandidate] = useState<Candidate | null>(null);
  const [movingSourceCol, setMovingSourceCol] = useState<ColumnId | null>(null);

  const jobTitle = id === '4092' ? 'Dev Frontend Senior' : 'Senior Product Designer';

  const handleDragStart = (e: DragEvent<HTMLDivElement>, candidateId: string, sourceColId: ColumnId) => {
    e.dataTransfer.setData('candidateId', candidateId);
    e.dataTransfer.setData('sourceColId', sourceColId);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetColId: ColumnId) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData('candidateId');
    const sourceColId = e.dataTransfer.getData('sourceColId') as ColumnId;

    if (sourceColId === targetColId) return;

    const sourceColumn = [...columns[sourceColId]];
    const targetColumn = [...columns[targetColId]];

    const candidateIndex = sourceColumn.findIndex(c => c.id === candidateId);
    if (candidateIndex === -1) return;

    const [candidate] = sourceColumn.splice(candidateIndex, 1);
    targetColumn.push(candidate);

    setColumns({
      ...columns,
      [sourceColId]: sourceColumn,
      [targetColId]: targetColumn,
    });
  };

  const openProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDrawerOpen(true);
  };

  const openFeedback = (e: React.MouseEvent, candidate: Candidate) => {
    e.stopPropagation();
    setFeedbackCandidate(candidate);
    setIsFeedbackModalOpen(true);
  }

  const openMoveModal = (e: React.MouseEvent, candidate: Candidate, colId: ColumnId) => {
    e.stopPropagation();
    setMovingCandidate(candidate);
    setMovingSourceCol(colId);
    setIsMoveModalOpen(true);
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 transition-all duration-200 h-full overflow-hidden bg-background-light dark:bg-background-dark">
      
      {/* Header Avançado */}
      <header className="bg-white dark:bg-[#1a2632] border-b border-slate-200 dark:border-slate-800 px-6 py-4 z-20 shrink-0">
        <div className="max-w-[1920px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                   Candidatos — {jobTitle}
                   <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-normal border border-slate-200 dark:border-slate-600">ID: #{id || '4092'}</span>
                </h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Acompanhe etapas e entrevistas com auditoria completa.</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                 <span className="material-symbols-outlined text-[18px]">history</span>
                 Log de Auditoria
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 items-end bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
             <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[160px]">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Vaga</label>
                <select className="w-full pl-2 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                   <option defaultValue="selected">Dev Frontend Senior</option>
                   <option>UX Designer Pleno</option>
                   <option>Product Manager</option>
                </select>
             </div>
             <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[140px]">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Cargo</label>
                <select className="w-full pl-2 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                   <option defaultValue="selected">Todos</option>
                   <option>Desenvolvedor</option>
                   <option>Designer</option>
                </select>
             </div>
             <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[140px]">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Área/Depto</label>
                <select className="w-full pl-2 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                   <option defaultValue="selected">Tecnologia</option>
                   <option>Produto</option>
                   <option>Marketing</option>
                </select>
             </div>
             <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[160px]">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                   Gestor responsável
                   <span className="material-symbols-outlined text-[12px] text-slate-400" title="Locked for Managers">lock</span>
                </label>
                <div className="relative">
                   <select className="w-full pl-8 pr-8 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-500 dark:text-slate-400 focus:outline-none cursor-not-allowed" disabled>
                      <option defaultValue="selected">Ana Silva (Eu)</option>
                   </select>
                   <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">person</span>
                </div>
             </div>
             <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[140px]">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Período</label>
                <select className="w-full pl-2 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                   <option defaultValue="selected">Últimos 30 dias</option>
                   <option>Este Trimestre</option>
                   <option>Este Ano</option>
                </select>
             </div>
          </div>
        </div>
      </header>

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden bg-slate-100 dark:bg-background-dark p-6 kanban-scroll">
        <div className="flex h-full gap-4 min-w-max items-start">
          
          {COLUMNS_CONFIG.map((col) => (
            <div 
              key={col.id} 
              className={`flex flex-col w-[280px] h-full rounded-xl border shrink-0 ${col.containerClass}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Column Header */}
              <div className={`p-3 border-b flex justify-between items-center rounded-t-xl backdrop-blur-sm sticky top-0 ${col.headerClass}`}>
                <div className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${col.dotColor}`}></span>
                  <h3 className={`font-bold text-sm ${col.id === 'manager_interview' ? 'text-primary-dark dark:text-blue-400' : (col.id === 'hired' ? 'text-green-800 dark:text-green-300' : 'text-slate-700 dark:text-slate-200')}`}>
                    {col.title}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${col.countColor}`}>
                    {columns[col.id].length}
                  </span>
                </div>
                {col.convRate && (
                   <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{col.convRate}</span>
                )}
              </div>

              {/* Cards Container */}
              <div className={`p-2 flex-1 overflow-y-auto space-y-2 kanban-column-scroll ${col.bodyClass || ''}`}>
                
                {/* Empty State for Hired Column */}
                {col.id === 'hired' && columns[col.id].length === 0 && (
                   <div className="flex flex-col items-center justify-center text-center h-full pb-10">
                      <span className="material-symbols-outlined text-green-300 dark:text-green-800 text-4xl mb-2">celebration</span>
                      <p className="text-xs text-green-600/70 dark:text-green-400/70">Nenhum candidato contratado ainda.</p>
                   </div>
                )}

                {columns[col.id].map((candidate) => (
                  <div 
                    key={candidate.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate.id, col.id)}
                    onClick={() => openProfile(candidate)}
                    className={`bg-white dark:bg-[#1a2632] p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative ${col.id === 'manager_interview' ? 'border border-primary/30 dark:border-primary/50' : (col.id === 'screening' ? 'border-l-4 border-l-blue-500 border-y border-r border-slate-200 dark:border-slate-700' : (col.id === 'finalist' ? 'border-l-4 border-l-yellow-500 border-y border-r border-slate-200 dark:border-slate-700' : (col.id === 'rejected' ? 'bg-white/50 dark:bg-slate-800/50 grayscale hover:grayscale-0 transition-all border border-slate-200 dark:border-slate-700' : 'border border-slate-200 dark:border-slate-700')))}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`size-8 rounded-full ${candidate.avatarColor} ${candidate.textColor} flex items-center justify-center text-xs font-bold shrink-0`}>
                           {candidate.initials}
                        </div>
                        <div>
                           <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{candidate.name}</h4>
                           <span className="text-[10px] text-slate-500 dark:text-slate-400">{candidate.time}</span>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                      </button>
                    </div>

                    {/* Specific Card Content based on Column */}
                    {col.id === 'received' && (
                        <div className="flex flex-wrap gap-1 mb-3">
                           <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] border border-slate-200 dark:border-slate-700">{candidate.role || 'Geral'}</span>
                           {candidate.match && (
                               <span className={`px-1.5 py-0.5 rounded text-[10px] border ${candidate.match.includes('9') ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800/50'}`}>
                                   {candidate.match}
                               </span>
                           )}
                        </div>
                    )}

                    {col.id === 'screening' && candidate.status && (
                        <div className="mb-2">
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{candidate.status}</p>
                        </div>
                    )}

                    {col.id === 'technical' && candidate.actionRequired && (
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded border border-orange-100 dark:border-orange-800">
                                <span className="material-symbols-outlined text-[12px]">schedule</span> Aguardando
                            </span>
                        </div>
                    )}
                    
                    {col.id === 'hr_interview' && (
                         <button className="w-full mb-2 flex items-center justify-center gap-1 bg-primary/10 hover:bg-primary/20 text-primary dark:text-blue-300 text-xs font-medium py-1.5 rounded transition-colors">
                            <span className="material-symbols-outlined text-[14px]">video_camera_front</span>
                            Iniciar Entrevista
                         </button>
                    )}

                    {col.id === 'manager_interview' && (
                        <div className="flex flex-col gap-2 mb-2">
                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                <span className="material-symbols-outlined text-[14px] text-green-600">check_circle</span>
                                Entrevista realizada
                            </div>
                            <button 
                                onClick={(e) => openFeedback(e, candidate)}
                                className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded bg-primary text-white hover:bg-primary-dark text-xs font-semibold transition-colors shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[14px]">rate_review</span>
                                Registrar Feedback
                            </button>
                        </div>
                    )}
                    
                    {col.id === 'finalist' && (
                        <div className="flex gap-2">
                            <button className="flex-1 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors">Contratar</button>
                        </div>
                    )}

                    {/* Card Footer Actions */}
                    {col.id !== 'rejected' && (
                        <div className="border-t border-slate-100 dark:border-slate-700 pt-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-xs font-medium text-primary hover:text-primary-dark">Ver Perfil</button>
                            {col.id === 'manager_interview' ? (
                                <div className="flex gap-1">
                                    <button className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded" title="Rejeitar"><span className="material-symbols-outlined text-[16px]">close</span></button>
                                    <button className="p-1 hover:bg-green-50 text-slate-400 hover:text-green-500 rounded" title="Aprovar para Finalista"><span className="material-symbols-outlined text-[16px]">check</span></button>
                                </div>
                            ) : (
                                <button 
                                    className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300" 
                                    title="Mover"
                                    onClick={(e) => openMoveModal(e, candidate, col.id)}
                                >
                                    {col.id === 'screening' ? <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">arrow_forward</span> Mover</span> : '→'}
                                </button>
                            )}
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <CandidateProfileDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        candidateName={selectedCandidate?.name}
        candidateInitials={selectedCandidate?.initials}
        candidateColor={selectedCandidate?.avatarColor}
      />

      <InterviewFeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        candidateName={feedbackCandidate?.name || ''}
        candidateInitials={feedbackCandidate?.initials || ''}
      />

      <MoveStageModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        candidateName={movingCandidate?.name || ''}
        candidateInitials={movingCandidate?.initials}
        currentStage={movingSourceCol ? COLUMNS_CONFIG.find(c => c.id === movingSourceCol)?.title || '' : ''}
      />
    </div>
  );
};

export default Kanban;