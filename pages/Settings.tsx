import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const tabs = [
    { id: 'users', label: 'Usuários' },
    { id: 'privileges', label: 'Privilégios' },
    { id: 'scope', label: 'Escopo do Gestor' },
    { id: 'audit', label: 'Auditoria de Configurações' },
  ];

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de envio
    setIsInviteModalOpen(false);
    alert("Convite enviado com sucesso!");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark relative">
      {/* Header */}
      <header className="bg-white dark:bg-[#1a2632] border-b border-slate-200 dark:border-slate-800 px-6 py-6 sticky top-0 z-20 shrink-0">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-4">
             <Breadcrumbs items={[{ label: 'Configurações' }]} />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Configurações</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gerencie usuários, permissões e regras de governança do sistema.</p>
            </div>
            <div className="flex gap-2">
              <button className="items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-all text-sm shadow-sm hidden sm:inline-flex">
                <span className="material-symbols-outlined text-[20px]">save</span>
                Salvar Alterações
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
          
          {/* Tab: Usuários */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                      <input className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Buscar por nome ou e-mail" type="text"/>
                    </div>
                    <div className="w-full md:w-48">
                      <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer">
                        <option value="">Todos os tipos</option>
                        <option value="admin">Admin / Qualidade</option>
                        <option value="manager">Gestor</option>
                      </select>
                    </div>
                    <div className="w-full md:w-48">
                      <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer">
                        <option value="">Status: Todos</option>
                        <option value="active">Ativo</option>
                        <option value="suspended">Suspenso</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsInviteModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm transition-all whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                    Adicionar usuário
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/3">Nome / E-mail</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Último Acesso</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                      <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">AS</div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900 dark:text-white">Ana Silva</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">ana.silva@company.com</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            <span className="material-symbols-outlined text-[14px]">shield</span> Admin / Qualidade
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            <span className="size-1.5 rounded-full bg-green-500"></span> Ativo
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Hoje, 09:42</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <Link to="/settings/users/1/edit" className="p-1.5 text-slate-400 hover:text-primary transition-colors" title="Editar"><span className="material-symbols-outlined text-[18px]">edit</span></Link>
                            <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors" title="Suspender"><span className="material-symbols-outlined text-[18px]">block</span></button>
                          </div>
                        </td>
                      </tr>
                      <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold shrink-0">CS</div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900 dark:text-white">Carlos Souza</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">carlos.souza@company.com</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center self-start gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30">
                              <span className="material-symbols-outlined text-[14px]">supervisor_account</span> Gestor
                            </span>
                            <span className="text-[10px] text-slate-400 ml-1">Escopo: Tecnologia, Produto</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            <span className="size-1.5 rounded-full bg-green-500"></span> Ativo
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Ontem, 18:20</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <Link to="/settings/users/2/edit" className="p-1.5 text-slate-400 hover:text-primary transition-colors" title="Editar"><span className="material-symbols-outlined text-[18px]">edit</span></Link>
                            <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors" title="Suspender"><span className="material-symbols-outlined text-[18px]">block</span></button>
                          </div>
                        </td>
                      </tr>
                      <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-red-50/30 dark:bg-red-900/5">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0 grayscale">MO</div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-500 dark:text-slate-400">Mariana Oliveira</span>
                              <span className="text-xs text-slate-400 dark:text-slate-500">mariana.oliveira@company.com</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 opacity-70">
                            <span className="material-symbols-outlined text-[14px]">supervisor_account</span> Gestor
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                            <span className="size-1.5 rounded-full bg-red-500"></span> Suspenso
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 dark:text-slate-500">Há 5 dias</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <Link to="/settings/users/3/edit" className="p-1.5 text-slate-400 hover:text-primary transition-colors" title="Editar"><span className="material-symbols-outlined text-[18px]">edit</span></Link>
                            <button className="p-1.5 text-slate-400 hover:text-green-600 transition-colors" title="Reativar acesso"><span className="material-symbols-outlined text-[18px]">check_circle</span></button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-xs text-slate-500">Mostrando 3 de 28 usuários</span>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-400 disabled:opacity-50 transition-colors" disabled><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                    <div className="flex items-center gap-1 px-2">
                      <button className="w-6 h-6 flex items-center justify-center rounded bg-primary text-white text-xs font-medium">1</button>
                      <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors">2</button>
                    </div>
                    <button className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Privilégios */}
          {activeTab === 'privileges' && (
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Resumo por Perfil</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-[#1a2632] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 shrink-0">
                      <span className="material-symbols-outlined">admin_panel_settings</span>
                    </div>
                    <div>
                      <h3 className="text-slate-900 dark:text-white font-bold text-sm mb-1">Administrador / Qualidade</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-2">
                        Possui acesso irrestrito a todas as vagas, candidatos e configurações do sistema. Pode auditar ações e reverter etapas.
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
                        Acesso Total
                      </span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#1a2632] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 shrink-0">
                      <span className="material-symbols-outlined">supervisor_account</span>
                    </div>
                    <div>
                      <h3 className="text-slate-900 dark:text-white font-bold text-sm mb-1">Gestor Contratante</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-2">
                        Acesso restrito apenas às vagas e departamentos sob sua responsabilidade direta. Ações críticas requerem validação ou configuração explícita.
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                        Escopo Restrito
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Chaves de Permissão para Gestores</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Defina quais ações sensíveis os gestores podem executar autonomamente em seus processos.</p>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  <div className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Mover candidato para "Finalista"</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Permite ao gestor avançar candidatos para a fase final sem validação prévia do RH.</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 w-fit px-2 py-0.5 rounded">
                        <span className="material-symbols-outlined text-[12px]">info</span> Impacta diretamente os KPIs de conversão do funil.
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked className="sr-only peer" type="checkbox"/>
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Marcar como "Não Selecionado / Banco"</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Habilita o gestor a desqualificar candidatos durante o processo de entrevista.</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 w-fit px-2 py-0.5 rounded">
                        <span className="material-symbols-outlined text-[12px]">fact_check</span> O sistema solicitará confirmação dupla e motivo obrigatório.
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked className="sr-only peer" type="checkbox"/>
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Retornar etapa do candidato</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Permite voltar um candidato para uma fase anterior (ex: de Entrevista para Triagem).</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 w-fit px-2 py-0.5 rounded">
                        <span className="material-symbols-outlined text-[12px]">warning</span> Ação limitada a 3 ocorrências/mês para evitar distorção de SLA.
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input className="sr-only peer" type="checkbox"/>
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Encerrar vaga</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Autoridade para fechar a vaga diretamente pelo painel do gestor.</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 w-fit px-2 py-0.5 rounded">
                        <span className="material-symbols-outlined text-[12px]">security</span> Recomendado apenas para gestores de nível sênior.
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input className="sr-only peer" type="checkbox"/>
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Matriz de Acesso Detalhada</h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Visualização somente leitura</span>
                </div>
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/3">Área / Funcionalidade</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center w-1/3">Admin / Qualidade</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center w-1/3">Gestor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-slate-400 text-[18px]">work</span> Gestão de Cargos
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                              <span className="material-symbols-outlined text-[14px]">check</span> Criar e Editar
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              <span className="material-symbols-outlined text-[14px]">visibility</span> Visualizar Apenas
                            </span>
                          </td>
                        </tr>
                        {/* ... more rows ... */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Tab: Escopo do Gestor */}
          {activeTab === 'scope' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-0.5">info</span>
                <div>
                  <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">Definição de Escopo</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300/80 mt-1">Configure o que cada gestor pode visualizar e operar dentro do sistema. As alterações aqui refletem imediatamente no acesso do usuário.</p>
                </div>
              </div>

              <section className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Selecione o Gestor para Configurar</label>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">person_search</span>
                    <input className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-900 dark:text-white" placeholder="Buscar por nome, cargo ou departamento..." type="text"/>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg">
                  <div className="size-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-bold shrink-0">AS</div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Ana Silva</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Gerente de Engenharia • Tecnologia</p>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                    Ativo
                  </span>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <section className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">visibility</span> Visibilidade de Vagas
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Gestor responsável por quais vagas?</label>
                        <div className="space-y-3">
                          <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-blue-50/50 dark:has-[:checked]:bg-blue-900/10">
                            <input defaultChecked className="mt-1 text-primary focus:ring-primary border-slate-300 dark:border-slate-600 bg-transparent" name="vacancy_scope" type="radio"/>
                            <div>
                              <span className="block text-sm font-medium text-slate-900 dark:text-white">Somente vagas onde ele é responsável direto</span>
                              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">O gestor verá apenas as vagas atribuídas diretamente ao seu perfil.</span>
                            </div>
                          </label>
                          <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-blue-50/50 dark:has-[:checked]:bg-blue-900/10">
                            <input className="mt-1 text-primary focus:ring-primary border-slate-300 dark:border-slate-600 bg-transparent" name="vacancy_scope" type="radio"/>
                            <div>
                              <span className="block text-sm font-medium text-slate-900 dark:text-white">Também pode ver vagas do seu departamento</span>
                              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">Permite visualizar todas as vagas dentro dos departamentos selecionados abaixo, mesmo sem ser o responsável direto.</span>
                            </div>
                          </label>
                        </div>
                      </div>
                      <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Áreas / Departamentos Permitidos</label>
                        <p className="text-xs text-slate-500 mb-3">Departamentos onde o gestor pode abrir vagas ou visualizar processos (dependendo da regra acima).</p>
                        <div className="relative">
                          <div className="flex flex-wrap gap-2 mb-2 p-2 min-h-[42px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-200">
                              Tecnologia <button className="hover:text-red-500 flex items-center"><span className="material-symbols-outlined text-[14px]">close</span></button>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-200">
                              Produto <button className="hover:text-red-500 flex items-center"><span className="material-symbols-outlined text-[14px]">close</span></button>
                            </span>
                            <input className="bg-transparent border-none text-sm focus:ring-0 p-0 placeholder:text-slate-400 min-w-[150px] text-slate-900 dark:text-white" placeholder="Adicionar departamento..." type="text"/>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Cargos do catálogo permitidos <span className="text-xs font-normal text-slate-400 ml-1">(Opcional)</span>
                        </label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" multiple>
                            <option value="dev">Desenvolvedor Frontend</option>
                            <option value="ux">UX Designer</option>
                            <option value="pm">Product Manager</option>
                            <option value="qa">QA Analyst</option>
                          </select>
                          <p className="text-xs text-slate-500 mt-1">Segure Ctrl (ou Cmd) para selecionar múltiplos.</p>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-xl p-4 flex gap-3">
                    <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 shrink-0">warning</span>
                    <div>
                      <h4 className="text-sm font-bold text-orange-800 dark:text-orange-200">Regra de Perda de Acesso</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300/80 mt-1">
                        Ao remover um gestor de uma vaga ativa, ele perderá imediatamente o acesso aos dados dos candidatos daquela vaga. Uma reatribuição manual de responsável será solicitada na tela de "Vagas".
                      </p>
                    </div>
                  </section>
                </div>
                <div className="lg:col-span-1">
                  <section className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sticky top-24">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">toggle_on</span> Ações Habilitadas
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Defina quais operações críticas este gestor pode realizar autonomamente.</p>
                    <div className="space-y-5">
                      <div className="flex items-center justify-between group">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Encerrar Vaga</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Permite fechar vagas abertas</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input className="sr-only peer" type="checkbox"/>
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
                      <div className="flex items-center justify-between group">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Aprovar para Finalista</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Mover para etapa final</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input defaultChecked className="sr-only peer" type="checkbox"/>
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
                      <div className="flex items-center justify-between group">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Registrar Feedback</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Inserir notas de entrevista</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input defaultChecked className="sr-only peer" type="checkbox"/>
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
                      <div className="flex items-center justify-between group opacity-50 cursor-not-allowed">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Visualizar Salários</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Restrito a Admin/RH</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-not-allowed">
                          <input className="sr-only peer" disabled type="checkbox"/>
                          <div className="w-11 h-6 bg-slate-200 rounded-full peer dark:bg-slate-700 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 dark:border-gray-600"></div>
                        </label>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Auditoria */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">filter_list</span>
                  Filtros de Auditoria
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Período</label>
                    <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                      <option value="30">Últimos 30 dias</option>
                      <option value="7">Últimos 7 dias</option>
                      <option value="today">Hoje</option>
                      <option value="custom">Personalizado</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Quem alterou</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-[18px]">person_search</span>
                      </span>
                      <input className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400" placeholder="Nome ou e-mail"/>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Tipo de Mudança</label>
                    <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                      <option value="">Todos os tipos</option>
                      <option value="profile">Perfil de Acesso</option>
                      <option value="scope">Escopo de Gestão</option>
                      <option value="privileges">Privilégios</option>
                      <option value="system">Sistema</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Usuário Afetado</label>
                    <input className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400" placeholder="Nome do usuário alvo"/>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    Limpar Filtros
                  </button>
                  <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-all text-sm shadow-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">search</span>
                    Buscar Logs
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Registro de Alterações</h3>
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-48">Quem / Quando</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-40">Tipo</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">O que mudou</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-48">Motivo</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                        <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <div className="size-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">AS</div>
                                <span className="font-medium text-slate-900 dark:text-white">Ana Silva</span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mt-1">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span> <span>Hoje, 10:42</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              Privilégios
                            </span>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-col gap-2">
                              <p className="text-slate-900 dark:text-white font-medium">Alteração de permissões para <span className="text-primary hover:underline cursor-pointer">Lucas Martins</span></p>
                              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700 text-xs">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <span className="block text-slate-400 mb-1 uppercase text-[10px] font-bold">Antes</span>
                                    <span className="text-red-500 line-through">Acesso: Leitura</span>
                                  </div>
                                  <div>
                                    <span className="block text-slate-400 mb-1 uppercase text-[10px] font-bold">Depois</span>
                                    <span className="text-green-600 font-semibold">Acesso: Leitura e Escrita</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <span className="text-slate-600 dark:text-slate-300 italic">"Promoção para Gerente Jr."</span>
                          </td>
                          <td className="px-6 py-4 align-top text-right">
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                              <span className="material-symbols-outlined text-[20px]">info</span>
                            </button>
                          </td>
                        </tr>
                        <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <div className="size-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">Admin</div>
                                <span className="font-medium text-slate-900 dark:text-white">Sistema</span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mt-1">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                <span>Ontem, 18:00</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                              Escopo
                            </span>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-col gap-2">
                              <p className="text-slate-900 dark:text-white font-medium">Atualização automática de Gestores</p>
                              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700 text-xs">
                                <div className="flex flex-col gap-1">
                                  <span className="text-slate-600 dark:text-slate-300">Sincronização com RH efetuada.</span>
                                  <span className="text-slate-500">+ 3 novos gestores adicionados ao escopo Tecnologia.</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <span className="text-slate-400 dark:text-slate-500 italic text-xs">Automático</span>
                          </td>
                          <td className="px-6 py-4 align-top text-right">
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                              <span className="material-symbols-outlined text-[20px]">info</span>
                            </button>
                          </td>
                        </tr>
                        <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <div className="size-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">CS</div>
                                <span className="font-medium text-slate-900 dark:text-white">Carlos Souza</span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mt-1">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                <span>12 Out, 14:20</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              Perfil
                            </span>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-col gap-2">
                              <p className="text-slate-900 dark:text-white font-medium">Alteração de perfil para <span className="text-primary hover:underline cursor-pointer">Mariana Oliveira</span></p>
                              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700 text-xs">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <span className="block text-slate-400 mb-1 uppercase text-[10px] font-bold">Antes</span>
                                    <span className="text-slate-600 line-through">Recrutador Jr</span>
                                  </div>
                                  <div>
                                    <span className="block text-slate-400 mb-1 uppercase text-[10px] font-bold">Depois</span>
                                    <span className="text-blue-600 font-semibold">Recrutador Pleno</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <span className="text-slate-600 dark:text-slate-300 italic">"Reestruturação do time de Vendas"</span>
                          </td>
                          <td className="px-6 py-4 align-top text-right">
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                              <span className="material-symbols-outlined text-[20px]">info</span>
                            </button>
                          </td>
                        </tr>
                        <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <div className="size-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">AS</div>
                                <span className="font-medium text-slate-900 dark:text-white">Ana Silva</span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mt-1">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                <span>10 Out, 09:15</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800">
                              Segurança
                            </span>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-col gap-2">
                              <p className="text-slate-900 dark:text-white font-medium">Bloqueio de acesso</p>
                              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700 text-xs">
                                <div className="flex flex-col gap-1">
                                  <span className="text-slate-600 dark:text-slate-300">Usuário: <span className="font-bold">roberto.vendas@empresa.com</span></span>
                                  <span className="text-red-500 font-semibold">Status alterado para: Inativo</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <span className="text-slate-600 dark:text-slate-300 italic">"Desligamento"</span>
                          </td>
                          <td className="px-6 py-4 align-top text-right">
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                              <span className="material-symbols-outlined text-[20px]">info</span>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-xs text-slate-500">Mostrando 4 de 256 registros</span>
                    <div className="flex gap-1">
                      <button className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-400 disabled:opacity-50" disabled><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                      <button className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsInviteModalOpen(false)}></div>
            <div className="relative w-full max-w-[420px] bg-white dark:bg-[#1a2632] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all animate-slide-in-right sm:animate-none">
                <div className="h-1.5 w-full bg-gradient-to-r from-primary to-blue-400 absolute top-0 left-0"></div>
                <div className="p-8 pb-6">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="size-14 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-primary mb-4 shadow-sm border border-blue-100 dark:border-blue-800/30">
                            <span className="material-symbols-outlined text-[32px]">person_add</span>
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Convidar Novo Gestor</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                            Envie um convite de acesso para o novo gestor.
                        </p>
                    </div>

                    <form onSubmit={handleSendInvite} className="flex flex-col gap-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="invite-email">E-mail corporativo</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none material-symbols-outlined text-[20px]">mail</span>
                                <input 
                                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                                    id="invite-email" 
                                    placeholder="nome@empresa.com" 
                                    required 
                                    type="email"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="invite-password">Senha Provisória</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none material-symbols-outlined text-[20px]">lock</span>
                                <input 
                                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                                    id="invite-password" 
                                    placeholder="••••••••" 
                                    required 
                                    type="password"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-3 mt-2">
                             <button 
                                type="button"
                                onClick={() => setIsInviteModalOpen(false)}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button className="flex-[2] bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.99] flex items-center justify-center gap-2" type="submit">
                                <span>Enviar Convite</span>
                                <span className="material-symbols-outlined text-[18px]">send</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Settings;