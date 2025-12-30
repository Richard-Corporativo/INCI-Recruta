import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

const Audit: React.FC = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <header className="bg-white dark:bg-[#1a2632] border-b border-slate-200 dark:border-slate-800 px-6 py-4 z-20 shrink-0">
        <div className="max-w-[1920px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  Log de Auditoria
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-normal border border-slate-200 dark:border-slate-600">Sistema Geral</span>
                </h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Registro cronológico de todas as alterações, etapas e feedbacks.</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Exportar CSV
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-end bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[160px]">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Vaga</label>
              <select className="w-full pl-2 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                <option defaultValue="selected">Todas as vagas</option>
                <option>Dev Frontend Senior</option>
                <option>UX Designer Pleno</option>
                <option>Product Manager</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[200px] flex-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Candidato</label>
              <div className="relative">
                <input className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-slate-400" placeholder="Buscar por nome ou ID..." type="text"/>
                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[160px]">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Tipo de Evento</label>
              <select className="w-full pl-2 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                <option defaultValue="selected">Todos os eventos</option>
                <option>Movimentação de Etapa</option>
                <option>Entrevista Agendada</option>
                <option>Feedback Registrado</option>
                <option>Decisão Final</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[160px]">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Usuário</label>
              <select className="w-full pl-2 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                <option defaultValue="selected">Qualquer usuário</option>
                <option>Ana Silva (Admin)</option>
                <option>Carla L. (Gestor)</option>
                <option>Bruno S. (RH)</option>
                <option>Sistema (Automático)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[140px]">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Período</label>
              <select className="w-full pl-2 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                <option defaultValue="selected">Últimos 30 dias</option>
                <option>Hoje</option>
                <option>Esta semana</option>
                <option>Este ano</option>
              </select>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-background-dark p-6">
        <div className="max-w-[1920px] mx-auto w-full">
          <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
                  <th className="px-6 py-4 whitespace-nowrap w-48">Data/Hora</th>
                  <th className="px-6 py-4 whitespace-nowrap w-48">Usuário</th>
                  <th className="px-6 py-4 whitespace-nowrap w-40">Evento</th>
                  <th className="px-6 py-4 w-1/3 min-w-[300px]">Descrição da Mudança</th>
                  <th className="px-6 py-4 whitespace-nowrap">Contexto</th>
                  <th className="px-6 py-4 text-right whitespace-nowrap">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Hoje</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">14:32</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">AS</div>
                      <div className="text-sm text-slate-700 dark:text-slate-200">Ana Silva</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      Etapa
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 dark:text-slate-200">
                      Moveu <span className="font-semibold text-slate-900 dark:text-white">João D.</span> de <span className="line-through text-slate-400">Recebido</span> para <span className="text-blue-600 dark:text-blue-400 font-medium">Triagem</span>.
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">Dev Frontend Senior</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">ID #4092</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary-dark dark:hover:text-blue-300 text-xs font-medium border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded transition-all">Ver Detalhes</button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Hoje</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">11:15</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xs font-bold text-purple-600 dark:text-purple-300">CL</div>
                      <div className="text-sm text-slate-700 dark:text-slate-200">Carla L.</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      <span className="material-symbols-outlined text-[14px]">rate_review</span>
                      Feedback
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 dark:text-slate-200">
                      Registrou feedback da <strong>Entrevista Gestor</strong> para <span className="font-semibold text-slate-900 dark:text-white">Rafael F.</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 italic">"Candidato demonstrou excelente domínio técnico..."</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">Product Manager</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">ID #4105</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary-dark dark:hover:text-blue-300 text-xs font-medium border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded transition-all">Ver Feedback</button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Ontem</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">16:45</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xs font-bold text-orange-600 dark:text-orange-300">BS</div>
                      <div className="text-sm text-slate-700 dark:text-slate-200">Bruno S.</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                      <span className="material-symbols-outlined text-[14px]">event</span>
                      Entrevista
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 dark:text-slate-200">
                      Agendou <strong>Entrevista RH</strong> com <span className="font-semibold text-slate-900 dark:text-white">Maria A.</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                      <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                      15/10/2023 às 14:00
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">UX Designer Pleno</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">ID #4088</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary-dark dark:hover:text-blue-300 text-xs font-medium border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded transition-all">Ver Detalhes</button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Ontem</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">09:10</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">AS</div>
                      <div className="text-sm text-slate-700 dark:text-slate-200">Ana Silva</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800">
                      <span className="material-symbols-outlined text-[14px]">gavel</span>
                      Decisão
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 dark:text-slate-200">
                      Marcou <span className="font-semibold text-slate-900 dark:text-white">Pedro L.</span> como <span className="text-green-600 font-bold">Contratado</span>.
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">Dev Frontend Senior</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">ID #4092</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary-dark dark:hover:text-blue-300 text-xs font-medium border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded transition-all">Ver Detalhes</button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">12 Out</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">18:30</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300">SYS</div>
                      <div className="text-sm text-slate-700 dark:text-slate-200">Sistema</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      <span className="material-symbols-outlined text-[14px]">person_add</span>
                      Candidatura
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 dark:text-slate-200">
                      Novo candidato <span className="font-semibold text-slate-900 dark:text-white">Luiza M.</span> importado via LinkedIn.
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">UX Designer Pleno</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">ID #4088</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary-dark dark:hover:text-blue-300 text-xs font-medium border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded transition-all">Ver Detalhes</button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">12 Out</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">10:05</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">AS</div>
                      <div className="text-sm text-slate-700 dark:text-slate-200">Ana Silva</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800">
                      <span className="material-symbols-outlined text-[14px]">cancel</span>
                      Rejeição
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 dark:text-slate-200">
                      Moveu <span className="font-semibold text-slate-900 dark:text-white">Felipe R.</span> para <span className="text-red-600 font-medium">Não Selecionado</span>.
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Motivo: Não atende aos requisitos técnicos.</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">Dev Frontend Senior</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">ID #4092</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary-dark dark:hover:text-blue-300 text-xs font-medium border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded transition-all">Ver Detalhes</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audit;