import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAudit } from '../hooks/useAudit';

const Audit: React.FC = () => {
  const { logs } = useAudit();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background transition-colors duration-200">
      {/* Header */}
      <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20 shadow-sm shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-muted-foreground text-[20px]">home</span>
          <span className="text-sm text-muted-foreground">Home</span>
          <span className="material-symbols-outlined text-muted-foreground text-[16px]">chevron_right</span>
          <span className="text-sm font-bold text-foreground">Auditoria</span>
        </div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
              Log de Auditoria
              <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold border border-border uppercase tracking-wider">Sistema</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Histórico completo de ações, mudanças de status e registros de segurança.</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-foreground bg-background border border-border rounded-base hover:bg-accent transition-all duration-200 ease-in-out shadow-sm active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <span className="material-symbols-outlined text-[20px]">download</span>
              Exportar Log
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-muted/30 p-8">
        <div className="max-w-[1920px] mx-auto">
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/50 border-b border-border">
                <tr className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-5">Data / Hora</th>
                  <th className="px-6 py-5">Usuário Responsável</th>
                  <th className="px-6 py-5">Ação / Evento</th>
                  <th className="px-6 py-5 w-[40%]">Detalhes da Transação</th>
                  <th className="px-6 py-5">Contexto</th>
                  <th className="px-6 py-5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/40 transition-all duration-200 ease-in-out group bg-card">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground leading-tight">
                          {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5">
                          {new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold border border-primary/20">
                          {log.user_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="text-sm font-bold text-foreground">{log.user_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-tight">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">{log.details}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">{log.entity_type}</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5 italic">ID #{log.entity_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-xs font-bold text-primary hover:text-primary/80 px-3 py-1.5 rounded-base hover:bg-primary/5 transition-all duration-200 ease-in-out opacity-0 group-hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1">
                        DETALHES
                      </button>
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-muted-foreground text-sm italic">
                      Nenhum registro de auditoria encontrado na base de dados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="px-6 py-4 border-t border-border bg-muted/20">
              <div className="text-xs text-muted-foreground font-bold">
                Sincronizado via LocalStorage • {logs.length} entradas registradas
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Audit;