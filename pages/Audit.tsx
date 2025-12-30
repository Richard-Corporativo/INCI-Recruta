import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAudit } from '../hooks/useAudit';

const Audit: React.FC = () => {
  const { logs } = useAudit();

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
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-background-dark p-6">
        <div className="max-w-[1920px] mx-auto w-full">
          <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden text-slate-900 dark:text-white">
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
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{new Date(log.timestamp).toLocaleDateString()}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                          {log.user_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="text-sm">{log.user_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{log.details}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">{log.entity_type}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">ID #{log.entity_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:text-primary-dark dark:hover:text-blue-300 text-xs font-medium border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded transition-all">Ver Detalhes</button>
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                      Nenhum registro de auditoria encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audit;