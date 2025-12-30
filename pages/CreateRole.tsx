import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const CreateRole: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark transition-colors duration-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-6 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span className="material-symbols-outlined">work</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">RecruitSys</h2>
        </div>
        {/* Navigation links removed as they are handled by Sidebar in main layout */}
        <div className="flex items-center gap-4">
          <button className="relative rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 border-2 border-surface-light dark:border-surface-dark"></span>
          </button>
          <div className="h-8 w-8 rounded-full bg-cover bg-center ring-2 ring-white dark:ring-gray-700 cursor-pointer" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCHemBeAS1_woVCKvfyKNKA11T3w8U0CycW6Q1l1BlAO4jNXRFGf5eQP4nmZ7S1MoyeuX9ZWyxzFFqw0S_UsP9zAAzGh5dxm1UbkzgvMQP20SGfidUXiGnSZ94W80J_FONVj5_bcp0Ixm-loNeztsCdVjRoaA2vKk8YA70ZItypQrskPJq1JfyT_MqGx9JFga1eRVTLjorPgIa2hixvmj_PuIOUixw2HBnDDffG-WBQs6h5-wPnWj0PeRmydacURPbc9bai4jzqONc")'}}></div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[1200px] mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={[
            { label: 'Cargos', to: '/roles' },
            { label: 'Criar Cargo' }
          ]} />
        </div>

        {/* Page Heading & Actions */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-main-light dark:text-text-main-dark">Criar Novo Cargo</h1>
            <p className="mt-2 text-text-sec-light dark:text-text-sec-dark">Preencha os detalhes abaixo para cadastrar uma nova função no sistema.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/roles')} className="px-4 py-2 text-sm font-medium text-text-main-light dark:text-text-main-dark bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
              Cancelar
            </button>
            <button className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
              Salvar Rascunho
            </button>
            <button onClick={() => navigate('/roles')} className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-dark shadow-sm shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">save</span>
              Criar Cargo
            </button>
          </div>
        </div>

        {/* Error Summary (Simulation) */}
        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 p-4" role="alert">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-800 dark:text-red-200">Não foi possível salvar o cargo</h3>
              <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                <ul className="list-disc pl-5 space-y-1">
                  <li>O campo "Código do Cargo" já existe no sistema.</li>
                  <li>Preencha todos os campos obrigatórios marcados com *.</li>
                </ul>
              </div>
            </div>
            <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm">
          <form className="divide-y divide-border-light dark:divide-border-dark">
            {/* Section 1: Dados Cadastrais */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="flex size-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary">
                  <span className="material-symbols-outlined text-sm">badge</span>
                </span>
                <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">Dados Cadastrais</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field with Error State */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark" htmlFor="codigo">
                    Código do Cargo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input aria-describedby="codigo-error" aria-invalid="true" className="block w-full rounded-lg border-red-500 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-200 placeholder-red-300 focus:border-red-500 focus:ring-red-500 sm:text-sm h-11 px-3" id="codigo" name="codigo" type="text" defaultValue="ENG-001"/>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400" id="codigo-error">Este código já está em uso.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark" htmlFor="area">
                    Área <span className="text-red-500">*</span>
                  </label>
                  <select className="block w-full rounded-lg border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-main-light dark:text-text-main-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11 px-3" id="area" name="area">
                    <option>Selecione uma área...</option>
                    <option defaultValue="selected">Tecnologia &amp; Engenharia</option>
                    <option>Recursos Humanos</option>
                    <option>Vendas</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark" htmlFor="departamento">
                    Departamento <span className="text-red-500">*</span>
                  </label>
                  <select className="block w-full rounded-lg border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-main-light dark:text-text-main-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11 px-3" id="departamento" name="departamento">
                    <option>Selecione...</option>
                    <option>Engenharia de Software</option>
                    <option defaultValue="selected">Infraestrutura</option>
                    <option>QA</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark" htmlFor="report">
                    A quem responde <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input className="block w-full rounded-lg border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-main-light dark:text-text-main-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11 px-3 pl-10" id="report" placeholder="Buscar gestor..." type="text"/>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-text-sec-light dark:text-text-sec-dark text-lg">search</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Classificação */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="flex size-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <span className="material-symbols-outlined text-sm">category</span>
                </span>
                <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">Classificação</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark">
                    Senioridade Padrão <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="cursor-pointer">
                      <input className="peer sr-only" name="seniority" type="radio" value="jr"/>
                      <div className="flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all">
                        Júnior
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input defaultChecked className="peer sr-only" name="seniority" type="radio" value="pl"/>
                      <div className="flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all">
                        Pleno
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input className="peer sr-only" name="seniority" type="radio" value="sr"/>
                      <div className="flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all">
                        Sênior
                      </div>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark" htmlFor="familia">
                    Família <span className="text-red-500">*</span>
                  </label>
                  <select className="block w-full rounded-lg border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-main-light dark:text-text-main-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11 px-3" id="familia">
                    <option>Operações</option>
                    <option>Vendas</option>
                    <option defaultValue="selected">Técnica / Engenharia</option>
                    <option>Administrativo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Descrição do Cargo */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="flex size-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <span className="material-symbols-outlined text-sm">description</span>
                </span>
                <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">Descrição do Cargo</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark" htmlFor="missao">
                    Missão <span className="text-red-500">*</span>
                  </label>
                  <textarea className="block w-full rounded-lg border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-main-light dark:text-text-main-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3" id="missao" placeholder="Descreva o propósito principal deste cargo..." rows={3}></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark">
                    Responsabilidades <span className="text-red-500">*</span>
                  </label>
                  {/* Simulated Rich Text Editor */}
                  <div className="rounded-lg border border-border-light dark:border-border-dark overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                    <div className="flex items-center gap-1 border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800 p-2">
                      <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-text-sec-light dark:text-text-sec-dark" type="button">
                        <span className="material-symbols-outlined text-[18px]">format_bold</span>
                      </button>
                      <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-text-sec-light dark:text-text-sec-dark" type="button">
                        <span className="material-symbols-outlined text-[18px]">format_italic</span>
                      </button>
                      <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                      <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-text-sec-light dark:text-text-sec-dark" type="button">
                        <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                      </button>
                      <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-text-sec-light dark:text-text-sec-dark" type="button">
                        <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
                      </button>
                    </div>
                    <textarea className="block w-full border-0 bg-white dark:bg-surface-dark text-text-main-light dark:text-text-main-dark focus:ring-0 sm:text-sm p-3 resize-none" placeholder="Liste as principais atividades..." rows={6}></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Requisitos e Competências */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="flex size-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                  <span className="material-symbols-outlined text-sm">school</span>
                </span>
                <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">Requisitos e Competências</h3>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {/* Tag Input Simulation */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark">
                    Hard Skills <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark px-3 py-2 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                    <span className="inline-flex items-center rounded bg-blue-50 dark:bg-blue-900/40 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                      Java
                      <button className="ml-1 inline-flex size-3 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none" type="button">
                        <span className="sr-only">Remove Java</span>
                        <svg className="h-2 w-2" fill="none" stroke="currentColor" viewBox="0 0 8 8">
                          <path d="M1 1l6 6m0-6L1 7" strokeLinecap="round" strokeWidth="1.5"></path>
                        </svg>
                      </button>
                    </span>
                    <span className="inline-flex items-center rounded bg-blue-50 dark:bg-blue-900/40 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                      Spring Boot
                      <button className="ml-1 inline-flex size-3 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none" type="button">
                        <span className="sr-only">Remove Spring Boot</span>
                        <svg className="h-2 w-2" fill="none" stroke="currentColor" viewBox="0 0 8 8">
                          <path d="M1 1l6 6m0-6L1 7" strokeLinecap="round" strokeWidth="1.5"></path>
                        </svg>
                      </button>
                    </span>
                    <input className="h-8 flex-1 border-0 bg-transparent p-0 text-sm placeholder-gray-400 focus:ring-0 focus:outline-none" placeholder="Adicione uma skill e pressione Enter..." type="text"/>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark">
                    Soft Skills <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark px-3 py-2 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                    <span className="inline-flex items-center rounded bg-purple-50 dark:bg-purple-900/40 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300">
                      Comunicação
                      <button className="ml-1 inline-flex size-3 items-center justify-center rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500 focus:outline-none" type="button">
                        <span className="sr-only">Remove Comunicação</span>
                        <svg className="h-2 w-2" fill="none" stroke="currentColor" viewBox="0 0 8 8">
                          <path d="M1 1l6 6m0-6L1 7" strokeLinecap="round" strokeWidth="1.5"></path>
                        </svg>
                      </button>
                    </span>
                    <input className="h-8 flex-1 border-0 bg-transparent p-0 text-sm placeholder-gray-400 focus:ring-0 focus:outline-none" placeholder="Adicione uma soft skill..." type="text"/>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark" htmlFor="kpi">
                    Competências-chave / KPIs <span className="text-red-500">*</span>
                  </label>
                  <textarea className="block w-full rounded-lg border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-main-light dark:text-text-main-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3" id="kpi" placeholder="- Entregar projetos no prazo&#10;- Manter cobertura de testes acima de 80%" rows={3}></textarea>
                  <p className="text-xs text-text-sec-light dark:text-text-sec-dark">Insira um item por linha.</p>
                </div>
              </div>
            </div>

            {/* Section 5: Controle Interno (Restricted) */}
            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 md:p-8 rounded-b-xl border-l-4 border-l-amber-400">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600 dark:text-amber-500">lock</span>
                  <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">Controle Interno</h3>
                </div>
                <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/40 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-200">
                  Visível apenas para Qualidade
                </span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark" htmlFor="obs">
                  Observações internas (Opcional)
                </label>
                <textarea className="block w-full rounded-lg border-amber-200 dark:border-amber-800/50 bg-white dark:bg-surface-dark text-text-main-light dark:text-text-main-dark shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-3" id="obs" placeholder="Anotações confidenciais sobre a criação deste cargo..." rows={3}></textarea>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-8 flex justify-end gap-4 pb-10">
          <p className="text-sm text-text-sec-light dark:text-text-sec-dark self-center mr-auto">
            Última alteração salva automaticamente às 14:30
          </p>
        </div>
      </main>
    </div>
  );
};

export default CreateRole;