import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useJobs } from '../hooks/useJobs';

interface JobFormData {
  roleTitle: string;
  roleCode: string;
  department: string;
  location: string;
  model: string;
  contract: string;
  urgency: string;
  salaryMin: string;
  salaryMax: string;
  context: string;
  mission: string;
}

const CreateJob: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { addJob } = useJobs();

  const [formData, setFormData] = useState<JobFormData>({
    roleTitle: 'Analista de Marketing Sênior',
    roleCode: 'MKT-SR-004',
    department: 'Marketing / Growth',
    location: 'São Paulo',
    model: 'Híbrido',
    contract: 'CLT (Efetivo)',
    urgency: 'Alta',
    salaryMin: '12000',
    salaryMax: '15000',
    context: '',
    mission: 'Responsável por liderar estratégias de growth hacking, gerenciar campanhas de performance paga e orgânica, e otimizar a conversão em todos os canais digitais da empresa.'
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePublish = () => {
    const newJob = {
      title: formData.roleTitle,
      context: formData.context || 'Nova oportunidade',
      department: formData.department,
      location: formData.location,
      model: formData.model as any,
      contract: formData.contract as any,
      urgency: formData.urgency as any,
      status: 'Ativa' as const,
      salary_min: Number(formData.salaryMin),
      salary_max: Number(formData.salaryMax),
      mission: formData.mission,
      candidates_count: 0
    };

    addJob(newJob);
    navigate('/jobs');
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white dark:bg-[#1a202c] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <Breadcrumbs
            items={[
              { label: 'Vagas', to: '/jobs' },
              { label: 'Criar Nova Vaga' }
            ]}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Mariana Costa</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Gerente de RH</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-cover bg-center ring-2 ring-white dark:ring-slate-800 shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBPnhm69OkfJ6JYDAQVptxP6CaG5JqDjnlTHYSgUyLXCmc5KZUhy5KdpSNnchyXvmVKbiZnE6wyqJxvaGw1cdYwY8MwZDG2pVfNYIJiQZkM8IusjTwS9qspALvwr_4vrnpW6EGAmdaAkweNToggKCvUy0WBR-Rdb2H332jiKtUtFa6G76n1GOcXrAg2mkxYOu_u2WPDh3NSa4Fc7HR0KI1Rfmvng-KcsUmWZfk82pdr0LaZMp5iKAFOVHofveqlLIk4BvdS7FyTeiw")' }}></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1200px] mx-auto pb-24">

          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Criar Nova Vaga</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg mt-2">Defina os detalhes da nova oportunidade.</p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white dark:bg-[#1a202c] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-sm font-bold text-primary uppercase tracking-wider mb-0.5">
                  Passo {step} de 3
                </p>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  {step === 1 ? 'Selecionar Cargo' : step === 2 ? 'Contexto da Vaga' : 'Revisão'}
                </p>
              </div>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {step === 1 ? '33%' : step === 2 ? '66%' : '100%'}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
              ></div>
            </div>
          </div>

          {/* STEP 1: Select Role */}
          {step === 1 && (
            <div className="bg-white dark:bg-[#1a202c] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Qual cargo você deseja contratar?</h3>
                <div className="relative group">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Selecione um Cargo do Catálogo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400">search</span>
                    </div>
                    <input
                      className="block w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                      placeholder="Digite o nome do cargo ou código..."
                      type="text"
                      defaultValue={formData.roleTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, roleTitle: e.target.value }))}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                      <span className="material-symbols-outlined text-slate-400 hover:text-slate-600 text-[20px]">close</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/30 p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Preview do Cargo</p>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                    Ativo
                  </span>
                </div>
                <div className="bg-white dark:bg-[#161e26] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{formData.roleTitle}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Código: <span className="font-mono text-slate-700 dark:text-slate-300">{formData.roleCode}</span></p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md self-start">
                        <span className="material-symbols-outlined text-[18px]">domain</span>
                        {formData.department}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Senioridade / Família</span>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Especialista / Individual Contributor</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Reporta a</span>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Head de Marketing</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Missão do Cargo</span>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {formData.mission}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Competências (Resumo)</span>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Google Analytics 4</span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">SEO Technical</span>
                        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1"></div>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">Liderança Técnica</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Context */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-fit sticky top-0">
                  <div className="p-4 bg-slate-50 dark:bg-[#253240] border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-slate-500">lock</span>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">Conteúdo fixo do Cargo</h2>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3 flex gap-3 items-start">
                      <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm mt-0.5">info</span>
                      <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                        Essas informações vêm do <span className="font-semibold">Catálogo de Cargos</span> e não podem ser alteradas aqui.
                      </p>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    <details className="group open" open>
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span>Missão do Cargo</span>
                        <span className="transition group-open:rotate-180">
                          <span className="material-symbols-outlined text-slate-400">expand_more</span>
                        </span>
                      </summary>
                      <div className="text-sm text-slate-600 dark:text-slate-400 px-4 pb-4 animate-fadeIn leading-relaxed">
                        {formData.mission}
                      </div>
                    </details>
                    <details className="group">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span>Responsabilidades</span>
                        <span className="transition group-open:rotate-180">
                          <span className="material-symbols-outlined text-slate-400">expand_more</span>
                        </span>
                      </summary>
                      <div className="text-sm text-slate-600 dark:text-slate-400 px-4 pb-4 leading-relaxed">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Definir a visão de Growth.</li>
                          <li>Conduzir testes A/B.</li>
                        </ul>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary rounded-t-xl"></div>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Contexto da Vaga</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Personalize os detalhes desta abertura específica.</p>
                  </div>
                  <form className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Modelo de Trabalho <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <select name="model" value={formData.model} onChange={handleInputChange} className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white">
                            <option>Híbrido</option>
                            <option>Presencial</option>
                            <option>Remoto</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Tipo de Contrato <span className="text-red-500">*</span></label>
                        <select name="contract" value={formData.contract} onChange={handleInputChange} className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white">
                          <option>CLT (Efetivo)</option>
                          <option>Pessoa Jurídica (PJ)</option>
                          <option>Estágio</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Período de Inscrição</label>
                        <div className="relative">
                          <input className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white" type="date" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                          Localidade do Escritório
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <input name="location" value={formData.location} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white" placeholder="Cidade (ex: São Paulo)" type="text" />
                          </div>
                          <div>
                            <select className="w-full h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white">
                              <option>SP</option>
                              <option>RJ</option>
                              <option>MG</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Nível de Urgência</label>
                        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                          <button onClick={() => setFormData(prev => ({ ...prev, urgency: 'Baixa' }))} className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${formData.urgency === 'Baixa' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400'}`} type="button">Baixa</button>
                          <button onClick={() => setFormData(prev => ({ ...prev, urgency: 'Média' }))} className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${formData.urgency === 'Média' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400'}`} type="button">Média</button>
                          <button onClick={() => setFormData(prev => ({ ...prev, urgency: 'Alta' }))} className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${formData.urgency === 'Alta' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400'}`} type="button">Alta</button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white flex justify-between">
                          Faixa Salarial (Mensal)
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-2.5 text-slate-500 text-sm">R$</span>
                            <input name="salaryMin" value={formData.salaryMin} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 pl-9 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white" type="text" />
                          </div>
                          <span className="text-slate-400">-</span>
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-2.5 text-slate-500 text-sm">R$</span>
                            <input name="salaryMax" value={formData.salaryMax} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 pl-9 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white" type="text" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-900 dark:text-white">
                        Contexto do Projeto / Motivo da Vaga <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <textarea name="context" value={formData.context} onChange={handleInputChange} className="w-full min-h-[140px] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white resize-none" placeholder="Explique por que essa vaga existe agora..."></textarea>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <section className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cargo Selecionado</h2>
                <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12 text-primary">
                      <span className="material-symbols-outlined text-2xl">badge</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-slate-900 dark:text-white text-base font-semibold">{formData.roleTitle}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">ID: {formData.roleCode} • {formData.department}</p>
                    </div>
                  </div>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-lg">visibility</span>
                    Ver detalhes do cargo
                  </button>
                </div>
              </section>

              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 shrink-0 mt-0.5">warning</span>
                <div className="flex flex-col gap-1">
                  <p className="text-amber-900 dark:text-amber-100 font-medium text-sm">Atenção Importante</p>
                  <p className="text-amber-800 dark:text-amber-200/80 text-sm">
                    Após publicar, o conteúdo do Cargo permanece como referência padrão.
                  </p>
                </div>
              </div>

              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Contexto da Vaga</h2>
                  <button onClick={() => setStep(2)} className="text-sm font-medium text-primary hover:underline">Editar informações</button>
                </div>
                <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 p-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Título da Vaga</span>
                      <p className="text-slate-900 dark:text-white font-medium">{formData.roleTitle}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Localização</span>
                      <p className="text-slate-900 dark:text-white font-medium">{formData.location} ({formData.model})</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Faixa Salarial</span>
                      <p className="text-slate-900 dark:text-white font-medium">R$ {formData.salaryMin} - R$ {formData.salaryMax}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Urgência</span>
                      <p className="text-slate-900 dark:text-white font-medium">{formData.urgency}</p>
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Justificativa</span>
                      <p className="text-slate-900 dark:text-white font-medium leading-relaxed">
                        {formData.context || "Nenhuma justificativa inserida."}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

        </div>
      </main>

      {/* Footer Actions */}
      <footer className="bg-white dark:bg-[#1a202c] border-t border-slate-200 dark:border-slate-800 p-4 md:px-12 md:py-5 flex items-center justify-end gap-4 z-20 shrink-0">
        <button
          onClick={() => step === 1 ? navigate('/jobs') : setStep(step - 1)}
          className="flex items-center justify-center gap-2 px-5 h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-transparent text-slate-900 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          Voltar
        </button>
        <div className="flex items-center gap-3">
          {step === 3 ? (
            <>
              <button className="hidden sm:flex items-center justify-center gap-2 px-5 h-10 rounded-lg text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-xl">save</span>
                Salvar como rascunho
              </button>
              <button onClick={handlePublish} className="flex items-center justify-center gap-2 px-6 h-10 rounded-lg bg-primary text-white font-medium hover:bg-blue-600 shadow-md transition-colors">
                <span className="material-symbols-outlined text-xl">publish</span>
                Salvar vaga
              </button>
            </>
          ) : (
            <button onClick={() => setStep(step + 1)} className="flex items-center justify-center gap-2 px-6 h-10 rounded-lg bg-primary hover:bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20 transition-all">
              {step === 1 ? 'Continuar' : 'Revisar e publicar'}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default CreateJob;