import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const Dashboard: React.FC = () => {
  return (
    <>
      <header className="bg-card border-b border-border px-6 py-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-4">
             <Breadcrumbs items={[{ label: 'Dashboard' }]} />
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Atualizado há 5 min
                </span>
              </div>
              <p className="text-muted-foreground text-sm">Acompanhe vagas, candidatos e eficiência do processo por período e responsáveis.</p>
            </div>
            <div className="flex gap-2">
              <button className="hidden sm:inline-flex items-center justify-center gap-2 bg-card hover:bg-accent border border-border text-foreground font-medium py-2 px-4 rounded-lg transition-all text-sm">
                <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
                Salvar visão
              </button>
            </div>
          </div>
          <div className="bg-accent/50 p-4 rounded-xl border border-border mb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Período</label>
                <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                  <option value="30">Últimos 30 dias</option>
                  <option value="90">Últimos 3 meses</option>
                  <option value="365">Este ano</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Área / Depto</label>
                <div className="relative">
                  <input className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground" list="areas" placeholder="Todas as áreas" />
                  <datalist id="areas">
                    <option value="Tecnologia"></option>
                    <option value="Recursos Humanos"></option>
                    <option value="Vendas"></option>
                    <option value="Marketing"></option>
                  </datalist>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Gestor Responsável</label>
                <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:bg-muted">
                  <option value="">Todos os Gestores</option>
                  <option value="me">Somente eu</option>
                  <option value="1">Ana Silva</option>
                  <option value="2">Carlos Souza</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Cargo</label>
                <input className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground" placeholder="Buscar cargo..." />
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-all text-sm shadow-sm">
                  Aplicar
                </button>
                <button className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Limpar
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-secondary/10 text-foreground border border-border">
              Últimos 30 dias
              <button className="hover:text-destructive"><span className="material-symbols-outlined text-[14px]">close</span></button>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-secondary/10 text-foreground border border-border">
              Tecnologia
              <button className="hover:text-destructive"><span className="material-symbols-outlined text-[14px]">close</span></button>
            </span>
          </div>
        </div>
      </header>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
          <section>
            <h2 className="sr-only">KPIs Essenciais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card p-5 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                    <span className="material-symbols-outlined">work</span>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full">+12%</span>
                </div>
                <h3 className="text-muted-foreground text-sm font-medium mb-1">Vagas Abertas</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">24</span>
                  <span className="text-xs text-muted-foreground">Total ativo</span>
                </div>
              </div>
              <div className="bg-card p-5 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                    <span className="material-symbols-outlined">group</span>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full">+5%</span>
                </div>
                <h3 className="text-muted-foreground text-sm font-medium mb-1">Candidatos Ativos</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">187</span>
                  <span className="text-xs text-muted-foreground">Em processo</span>
                </div>
              </div>
              <div className="bg-card p-5 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                    <span className="material-symbols-outlined">timer</span>
                  </div>
                  <span className="text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded-full">+2 dias</span>
                </div>
                <h3 className="text-muted-foreground text-sm font-medium mb-1">Tempo Médio (Hire)</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">42</span>
                  <span className="text-xs text-muted-foreground">Dias corridos</span>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-xl border border-red-200 dark:border-red-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 dark:bg-red-800/30 rounded-bl-full -mr-8 -mt-8"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-2 bg-card rounded-lg text-red-600 dark:text-red-400 shadow-sm">
                    <span className="material-symbols-outlined">warning</span>
                  </div>
                </div>
                <h3 className="text-red-800 dark:text-red-200 text-sm font-bold mb-1 relative z-10">Vagas em Atraso</h3>
                <div className="flex items-baseline gap-2 relative z-10">
                  <span className="text-3xl font-bold text-red-700 dark:text-red-100">3</span>
                  <span className="text-xs text-red-600/70 dark:text-red-300/70">Requer atenção</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground mb-6">Conversão por Etapa</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-accent -translate-y-1/2 z-0"></div>
              
              <button className="relative z-10 flex flex-col items-center group text-center focus:outline-none">
                <div className="w-full bg-background group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 border-2 border-border group-hover:border-blue-500 dark:group-hover:border-blue-500 rounded-lg p-4 transition-all">
                  <span className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Triagem</span>
                  <span className="block text-2xl font-bold text-foreground">142</span>
                  <span className="block text-xs text-muted-foreground mt-1">Candidatos</span>
                </div>
                <div className="mt-3 text-xs font-medium text-muted-foreground">
                  100% Conversão
                </div>
              </button>

              <button className="relative z-10 flex flex-col items-center group text-center focus:outline-none">
                <div className="w-full bg-background group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 border-2 border-border group-hover:border-blue-500 dark:group-hover:border-blue-500 rounded-lg p-4 transition-all">
                  <span className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Entrevista</span>
                  <span className="block text-2xl font-bold text-foreground">45</span>
                  <span className="block text-xs text-muted-foreground mt-1">Candidatos</span>
                </div>
                <div className="mt-3 flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">31% Conversão</span>
                  <span className="text-[10px] font-medium text-red-500">69% Drop-off</span>
                </div>
              </button>

              <button className="relative z-10 flex flex-col items-center group text-center focus:outline-none">
                <div className="w-full bg-background group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 border-2 border-border group-hover:border-blue-500 dark:group-hover:border-blue-500 rounded-lg p-4 transition-all">
                  <span className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Finalistas</span>
                  <span className="block text-2xl font-bold text-foreground">12</span>
                  <span className="block text-xs text-muted-foreground mt-1">Candidatos</span>
                </div>
                <div className="mt-3 flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">26% Conversão</span>
                  <span className="text-[10px] font-medium text-red-500">74% Drop-off</span>
                </div>
              </button>

              <button className="relative z-10 flex flex-col items-center group text-center focus:outline-none">
                <div className="w-full bg-green-50 dark:bg-green-900/10 group-hover:bg-green-100 dark:group-hover:bg-green-900/20 border-2 border-green-200 dark:border-green-800 group-hover:border-green-500 rounded-lg p-4 transition-all">
                  <span className="block text-xs font-semibold uppercase text-green-700 dark:text-green-300 mb-1">Contratação</span>
                  <span className="block text-2xl font-bold text-green-800 dark:text-green-100">4</span>
                  <span className="block text-xs text-green-600/70 dark:text-green-400/70 mt-1">Candidatos</span>
                </div>
                <div className="mt-3 flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">33% Conversão</span>
                </div>
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <section className="xl:col-span-2 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-foreground">Gerenciamento de Vagas</h2>
                <div className="flex gap-2">
                  <button className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-accent transition-colors">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Exportar
                  </button>
                  <Link to="/jobs/new" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-all">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Criar nova vaga
                  </Link>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-accent/50 border-b border-border">
                        <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Vaga</th>
                        <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Gestor</th>
                        <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">SLA</th>
                        <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="group hover:bg-accent/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">Dev Frontend Senior</span>
                            <span className="text-xs text-muted-foreground">Tecnologia / Produto</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          Ana Silva
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            Em andamento
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="size-2.5 rounded-full bg-green-500 mb-1" title="Dentro do prazo"></span>
                            <span className="text-[10px] text-muted-foreground">12 dias</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors" title="Editar Contexto">
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors" title="Encerrar Vaga">
                              <span className="material-symbols-outlined text-[18px]">cancel</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* ... other rows similarly updated ... */}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-border flex justify-between items-center bg-accent/30">
                  <span className="text-xs text-muted-foreground">Mostrando 3 de 12 vagas</span>
                  <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-card text-muted-foreground disabled:opacity-50" disabled><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                    <button className="p-1 rounded hover:bg-card text-muted-foreground"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                  </div>
                </div>
              </div>
            </section>

            <section className="xl:col-span-1 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-foreground">Filtros Inteligentes de Candidatos</h2>
              <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col h-full">
                <div className="p-4 border-b border-border space-y-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground material-symbols-outlined text-[18px]">search</span>
                    <input className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary" placeholder="Cargo pretendido / Palavra-chave" type="text" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select className="w-full px-2 py-2 bg-background border border-border rounded-lg text-xs text-muted-foreground">
                      <option>Experiência</option>
                      <option>Junior</option>
                      <option>Pleno</option>
                      <option>Senior</option>
                    </select>
                    <select className="w-full px-2 py-2 bg-background border border-border rounded-lg text-xs text-muted-foreground">
                      <option>Status</option>
                      <option>Novo</option>
                      <option>Entrevistado</option>
                      <option>Finalista</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold py-2 rounded-lg transition-colors">Buscar</button>
                    <button className="flex-1 bg-card hover:bg-accent border border-border text-muted-foreground text-xs font-semibold py-2 rounded-lg transition-colors">Limpar</button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[400px] p-2 space-y-2">
                  <div className="p-3 hover:bg-accent/50 rounded-lg border border-transparent hover:border-border transition-all cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className="size-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                        JD
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-semibold text-foreground truncate">João D.</h4>
                          <span className="text-[10px] font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">98% Match</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">Senior Frontend Developer</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-[10px] text-muted-foreground">Fase: Entrevista Técnica</span>
                          <button className="opacity-0 group-hover:opacity-100 text-primary text-xs font-medium hover:underline transition-opacity">Ver perfil</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ... other items ... */}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;